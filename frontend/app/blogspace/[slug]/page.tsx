import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getBlogSlugs, getRelatedPosts } from '@/src/lib/blog';
import { BlogHeader, PostRenderer } from '@/src/components/blogspace';
import { Metadata } from 'next';

// Generate static params for all blog posts
export async function generateStaticParams() {
    const slugs = getBlogSlugs();
    return slugs.map((slug) => ({ slug }));
}

// Generate metadata for each blog post
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found - Blogspace',
        };
    }

    return {
        title: `${post.frontmatter.title} - Blogspace | MugShot Studio`,
        description: post.frontmatter.excerpt || post.content.slice(0, 160),
        authors: post.frontmatter.author ? [{ name: post.frontmatter.author }] : undefined,
        keywords: [...post.frontmatter.tags, ...post.frontmatter.categories],
        openGraph: {
            title: post.frontmatter.title,
            description: post.frontmatter.excerpt || post.content.slice(0, 160),
            type: 'article',
            publishedTime: post.frontmatter.date,
            authors: post.frontmatter.author ? [post.frontmatter.author] : undefined,
            tags: post.frontmatter.tags,
            images: post.frontmatter.cover
                ? [
                    {
                        url: post.frontmatter.cover,
                        width: 1200,
                        height: 630,
                        alt: post.frontmatter.title,
                    },
                ]
                : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.frontmatter.title,
            description: post.frontmatter.excerpt || post.content.slice(0, 160),
            images: post.frontmatter.cover ? [post.frontmatter.cover] : undefined,
        },
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) {
        notFound();
    }

    // Get related posts
    const relatedPosts = await getRelatedPosts(slug, 3);

    return (
        <div className="min-h-screen bg-white dark:bg-[#121212]">
            {/* Header */}
            <BlogHeader showBackButton />

            {/* Article */}
            <PostRenderer post={post} relatedPosts={relatedPosts} />

            {/* More from Blogspace CTA */}
            <section className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0a0a0a] py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Explore More Articles
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Discover more tutorials, tips, and insights on AI and design.
                    </p>
                    <a
                        href="/blogspace"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0f7d70] to-[#0a3d40] text-white rounded-full font-medium hover:shadow-lg hover:shadow-[#0f7d70]/30 transition-shadow"
                    >
                        Browse All Articles
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </a>
                </div>
            </section>
        </div>
    );
}
