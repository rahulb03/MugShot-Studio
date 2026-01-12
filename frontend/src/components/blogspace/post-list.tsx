'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BlogPost } from '@/src/lib/blog-types';
import { PostCard } from './post-card';
import { Layers, FileText } from 'lucide-react';

interface PostListProps {
    posts: BlogPost[];
    title?: string;
    subtitle?: string;
    showEmpty?: boolean;
    columns?: 1 | 2 | 3;
    variant?: 'default' | 'compact' | 'horizontal';
}

export function PostList({
    posts,
    title,
    subtitle,
    showEmpty = true,
    columns = 3,
    variant = 'default',
}: PostListProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const getGridCols = () => {
        switch (columns) {
            case 1:
                return 'grid-cols-1';
            case 2:
                return 'grid-cols-1 md:grid-cols-2';
            case 3:
            default:
                return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
        }
    };

    if (posts.length === 0 && showEmpty) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20"
            >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0f7d70]/20 to-[#9b896c]/20 flex items-center justify-center mb-6">
                    <FileText className="w-10 h-10 text-[#0f7d70]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No posts found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                    There are no posts in this category yet. Check back soon for new content!
                </p>
            </motion.div>
        );
    }

    return (
        <section className="w-full">
            {/* Section Header */}
            {(title || subtitle) && (
                <div className="mb-8">
                    {title && (
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0f7d70] to-[#0a3d40] flex items-center justify-center">
                                <Layers className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                {title}
                            </h2>
                        </div>
                    )}
                    {subtitle && (
                        <p className="text-gray-600 dark:text-gray-400 ml-13 pl-0.5">
                            {subtitle}
                        </p>
                    )}
                </div>
            )}

            {/* Posts Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`grid ${getGridCols()} gap-6`}
            >
                {posts.map((post, index) => (
                    <PostCard
                        key={post.slug}
                        post={post}
                        index={index}
                        variant={variant}
                    />
                ))}
            </motion.div>
        </section>
    );
}

export default PostList;
