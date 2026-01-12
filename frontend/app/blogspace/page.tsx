import { Suspense } from 'react';
import { getAllBlogPosts, getAllCategories, getAllTags, getFeaturedPosts } from '@/src/lib/blog';
import BlogspacePage from './blogspace-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blogspace - MugShot Studio',
    description: 'Explore our collection of articles on AI, design, technology, and creativity. Stay updated with the latest tips, tutorials, and insights from the MugShot Studio team.',
    openGraph: {
        title: 'Blogspace - MugShot Studio',
        description: 'Explore our collection of articles on AI, design, technology, and creativity.',
        type: 'website',
    },
};

// Loading skeleton for suspense
function BlogspaceLoading() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Featured Post Skeleton */}
                <div className="h-[400px] rounded-3xl bg-gray-200 dark:bg-gray-800 animate-pulse mb-12" />

                {/* Filter Skeleton */}
                <div className="flex gap-3 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-10 w-24 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                    ))}
                </div>

                {/* Posts Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="rounded-2xl bg-white dark:bg-[#1a1a1a] overflow-hidden">
                            <div className="h-48 bg-gray-200 dark:bg-gray-800 animate-pulse" />
                            <div className="p-6 space-y-3">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                                <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default async function Page() {
    // Fetch all data in parallel
    const [posts, categories, tags, featuredPosts] = await Promise.all([
        getAllBlogPosts(),
        getAllCategories(),
        getAllTags(),
        getFeaturedPosts(),
    ]);

    return (
        <Suspense fallback={<BlogspaceLoading />}>
            <BlogspacePage
                initialPosts={posts}
                categories={categories}
                tags={tags}
                featuredPost={featuredPosts[0] || null}
            />
        </Suspense>
    );
}
