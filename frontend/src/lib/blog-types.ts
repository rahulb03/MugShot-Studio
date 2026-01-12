// Blog Post Types for Blogspace

export interface BlogFrontmatter {
    title: string;
    date: string;
    categories: string[];
    tags: string[];
    cover?: string;
    excerpt?: string;
    author?: string;
    readTime?: string;
    featured?: boolean;
}

export interface BlogPost {
    slug: string;
    frontmatter: BlogFrontmatter;
    content: string;
    htmlContent?: string;
}

export interface BlogCategory {
    name: string;
    count: number;
    slug: string;
}

export interface BlogTag {
    name: string;
    count: number;
    slug: string;
}

export interface BlogMetadata {
    totalPosts: number;
    categories: BlogCategory[];
    tags: BlogTag[];
    authors: string[];
}
