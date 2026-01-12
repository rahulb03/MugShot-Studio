'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, BookOpen } from 'lucide-react';
import {
    BlogHeader,
    FeaturedPost,
    PostList,
    CategoryFilter,
} from '@/src/components/blogspace';
import { BlogPost, BlogCategory, BlogTag } from '@/src/lib/blog-types';


interface BlogspaceClientProps {
    initialPosts: BlogPost[];
    categories: BlogCategory[];
    tags: BlogTag[];
    featuredPost: BlogPost | null;
}

export default function BlogspacePage({
    initialPosts,
    categories,
    tags,
    featuredPost,
}: BlogspaceClientProps) {
    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
    const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [filteredPosts, setFilteredPosts] = React.useState<BlogPost[]>(initialPosts);

    // Filter posts based on selection
    React.useEffect(() => {
        let result = initialPosts;

        // Filter by category
        if (selectedCategory) {
            result = result.filter((post) =>
                post.frontmatter.categories.some(
                    (cat) => cat.toLowerCase().replace(/\s+/g, '-') === selectedCategory
                )
            );
        }

        // Filter by tags
        if (selectedTags.length > 0) {
            result = result.filter((post) =>
                selectedTags.some((tag) =>
                    post.frontmatter.tags.some((t) => t.toLowerCase().replace(/\s+/g, '-') === tag)
                )
            );
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (post) =>
                    post.frontmatter.title.toLowerCase().includes(query) ||
                    post.frontmatter.excerpt?.toLowerCase().includes(query) ||
                    post.frontmatter.tags.some((tag) => tag.toLowerCase().includes(query)) ||
                    post.frontmatter.categories.some((cat) => cat.toLowerCase().includes(query))
            );
        }

        // Exclude featured post from the main list if it exists
        if (featuredPost && !selectedCategory && !searchQuery && selectedTags.length === 0) {
            result = result.filter((post) => post.slug !== featuredPost.slug);
        }

        setFilteredPosts(result);
    }, [selectedCategory, selectedTags, searchQuery, initialPosts, featuredPost]);

    const handleCategoryChange = (category: string | null) => {
        setSelectedCategory(category);
    };

    const handleTagChange = (tags: string[]) => {
        setSelectedTags(tags);
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
            {/* Header */}
            <BlogHeader
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
            />

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#0f7d70]/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#9b896c]/10 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0f7d70]/10 text-[#0f7d70] text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            Read Our Blog
                        </div>

                        {/* Main Title */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                            Browse Our{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f7d70] to-[#9b896c]">
                                Resources
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Explore tutorials, tips, and insights on AI, design, and creativity.
                            Stay updated with the latest from MugShot Studio.
                        </p>
                    </motion.div>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-wrap justify-center gap-8 mb-12"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0f7d70] to-[#0a3d40] flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {initialPosts.length}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Articles</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9b896c] to-[#0a3d40] flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {categories.length}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Categories</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {/* Featured Post - Only show when no filters active */}
                {featuredPost && !selectedCategory && !searchQuery && selectedTags.length === 0 && (
                    <section className="mb-16">
                        <FeaturedPost post={featuredPost} />
                    </section>
                )}

                {/* Filter Section */}
                <section className="mb-8">
                    <CategoryFilter
                        categories={categories}
                        tags={tags}
                        selectedCategory={selectedCategory}
                        selectedTags={selectedTags}
                        onCategoryChange={handleCategoryChange}
                        onTagChange={handleTagChange}
                        variant="horizontal"
                    />
                </section>

                {/* Results Header */}
                {(selectedCategory || searchQuery || selectedTags.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-6"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Showing{' '}
                            <span className="font-medium text-gray-900 dark:text-white">
                                {filteredPosts.length}
                            </span>{' '}
                            {filteredPosts.length === 1 ? 'result' : 'results'}
                            {selectedCategory && (
                                <>
                                    {' '}in{' '}
                                    <span className="font-medium text-[#0f7d70]">
                                        {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                                    </span>
                                </>
                            )}
                            {searchQuery && (
                                <>
                                    {' '}for{' '}
                                    <span className="font-medium text-[#0f7d70]">"{searchQuery}"</span>
                                </>
                            )}
                        </p>
                    </motion.div>
                )}

                {/* Posts Grid */}
                <PostList
                    posts={filteredPosts}
                    title={selectedCategory ? `${categories.find((c) => c.slug === selectedCategory)?.name || 'Category'} Articles` : undefined}
                    showEmpty={true}
                />
            </main>

            {/* Footer CTA */}
            <section className="bg-gradient-to-br from-[#0a3d40] to-[#0f7d70] py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Ready to Create Amazing Thumbnails?
                        </h2>
                        <p className="text-lg text-white/80 mb-8">
                            Apply what you've learned and transform your visual content with AI.
                        </p>
                        <a
                            href="/download"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0a3d40] rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-xl"
                        >
                            Get Started Free
                            <svg
                                className="w-5 h-5"
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
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
