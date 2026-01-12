import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import { BlogPost, BlogFrontmatter, BlogCategory, BlogTag, BlogMetadata } from './blog-types';

// Directory where blog posts are stored
const BLOG_DIRECTORY = path.join(process.cwd(), 'content/blogs');

/**
 * Get all blog post slugs for static generation
 */
export function getBlogSlugs(): string[] {
    if (!fs.existsSync(BLOG_DIRECTORY)) {
        return [];
    }

    const files = fs.readdirSync(BLOG_DIRECTORY);
    return files
        .filter((file) => file.endsWith('.md'))
        .map((file) => file.replace(/\.md$/, ''));
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const filePath = path.join(BLOG_DIRECTORY, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    // Process markdown to HTML
    const processedContent = await remark()
        .use(remarkGfm)
        .use(remarkHtml, { sanitize: false })
        .process(content);

    const frontmatter: BlogFrontmatter = {
        title: data.title || slug.replace(/-/g, ' '),
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        categories: Array.isArray(data.categories) ? data.categories : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
        cover: data.cover || undefined,
        excerpt: data.excerpt || content.slice(0, 160).replace(/[#*_`]/g, '') + '...',
        author: data.author || 'Anonymous',
        readTime: data.readTime || calculateReadTime(content),
        featured: Boolean(data.featured),
    };

    return {
        slug,
        frontmatter,
        content,
        htmlContent: processedContent.toString(),
    };
}

/**
 * Get all blog posts sorted by date (newest first)
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
    const slugs = getBlogSlugs();
    const posts = await Promise.all(slugs.map((slug) => getBlogPostBySlug(slug)));

    return posts
        .filter((post): post is BlogPost => post !== null)
        .sort((a, b) => {
            const dateA = new Date(a.frontmatter.date).getTime();
            const dateB = new Date(b.frontmatter.date).getTime();
            return dateB - dateA;
        });
}

/**
 * Get featured blog posts
 */
export async function getFeaturedPosts(): Promise<BlogPost[]> {
    const posts = await getAllBlogPosts();
    return posts.filter((post) => post.frontmatter.featured);
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
    const posts = await getAllBlogPosts();
    return posts.filter((post) =>
        post.frontmatter.categories.some(
            (cat) => cat.toLowerCase() === category.toLowerCase()
        )
    );
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
    const posts = await getAllBlogPosts();
    return posts.filter((post) =>
        post.frontmatter.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
}

/**
 * Get all categories with counts
 */
export async function getAllCategories(): Promise<BlogCategory[]> {
    const posts = await getAllBlogPosts();
    const categoryMap = new Map<string, number>();

    posts.forEach((post) => {
        post.frontmatter.categories.forEach((category) => {
            const current = categoryMap.get(category) || 0;
            categoryMap.set(category, current + 1);
        });
    });

    return Array.from(categoryMap.entries())
        .map(([name, count]) => ({
            name,
            count,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
        }))
        .sort((a, b) => b.count - a.count);
}

/**
 * Get all tags with counts
 */
export async function getAllTags(): Promise<BlogTag[]> {
    const posts = await getAllBlogPosts();
    const tagMap = new Map<string, number>();

    posts.forEach((post) => {
        post.frontmatter.tags.forEach((tag) => {
            const current = tagMap.get(tag) || 0;
            tagMap.set(tag, current + 1);
        });
    });

    return Array.from(tagMap.entries())
        .map(([name, count]) => ({
            name,
            count,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
        }))
        .sort((a, b) => b.count - a.count);
}

/**
 * Get blog metadata (stats)
 */
export async function getBlogMetadata(): Promise<BlogMetadata> {
    const posts = await getAllBlogPosts();
    const categories = await getAllCategories();
    const tags = await getAllTags();

    const authors = [...new Set(posts.map((post) => post.frontmatter.author || 'Anonymous'))];

    return {
        totalPosts: posts.length,
        categories,
        tags,
        authors,
    };
}

/**
 * Calculate read time based on content length
 */
function calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
}



/**
 * Get related posts based on categories and tags
 */
export async function getRelatedPosts(
    currentSlug: string,
    limit: number = 3
): Promise<BlogPost[]> {
    const currentPost = await getBlogPostBySlug(currentSlug);
    if (!currentPost) return [];

    const allPosts = await getAllBlogPosts();
    const otherPosts = allPosts.filter((post) => post.slug !== currentSlug);

    // Score posts based on shared categories and tags
    const scoredPosts = otherPosts.map((post) => {
        let score = 0;

        // Category matches are weighted more heavily
        currentPost.frontmatter.categories.forEach((category) => {
            if (post.frontmatter.categories.includes(category)) {
                score += 3;
            }
        });

        // Tag matches
        currentPost.frontmatter.tags.forEach((tag) => {
            if (post.frontmatter.tags.includes(tag)) {
                score += 1;
            }
        });

        return { post, score };
    });

    return scoredPosts
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ post }) => post);
}

/**
 * Search posts by query
 */
export async function searchPosts(query: string): Promise<BlogPost[]> {
    const posts = await getAllBlogPosts();
    const lowerQuery = query.toLowerCase();

    return posts.filter((post) => {
        const titleMatch = post.frontmatter.title.toLowerCase().includes(lowerQuery);
        const excerptMatch = post.frontmatter.excerpt?.toLowerCase().includes(lowerQuery);
        const contentMatch = post.content.toLowerCase().includes(lowerQuery);
        const tagMatch = post.frontmatter.tags.some((tag) =>
            tag.toLowerCase().includes(lowerQuery)
        );
        const categoryMatch = post.frontmatter.categories.some((cat) =>
            cat.toLowerCase().includes(lowerQuery)
        );

        return titleMatch || excerptMatch || contentMatch || tagMatch || categoryMatch;
    });
}
