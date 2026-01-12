'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowUpRight, Tag } from 'lucide-react';
import { BlogPost } from '@/src/lib/blog-types';
import { formatBlogDate } from '@/src/lib/utils';
import { cn } from '@/src/lib/utils';

interface PostCardProps {
    post: BlogPost;
    index?: number;
    variant?: 'default' | 'compact' | 'horizontal';
}

export function PostCard({ post, index = 0, variant = 'default' }: PostCardProps) {
    const { frontmatter, slug } = post;

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1] as const,
            },
        },
    };

    if (variant === 'horizontal') {
        return (
            <motion.article
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="group"
            >
                <Link href={`/blogspace/${slug}`} className="block">
                    <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200/50 dark:border-gray-800/50 hover:border-[#0f7d70]/50 hover:shadow-lg hover:shadow-[#0f7d70]/5 transition-all duration-300">
                        {/* Image */}
                        <div className="relative w-full sm:w-48 h-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0f7d70]/80 to-[#0a3d40]/80" />
                            {frontmatter.cover && (
                                <Image
                                    src={frontmatter.cover}
                                    alt={frontmatter.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="192px"
                                />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex flex-col justify-center flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                {frontmatter.categories.slice(0, 1).map((category) => (
                                    <span
                                        key={category}
                                        className="text-xs font-medium text-[#0f7d70]"
                                    >
                                        {category}
                                    </span>
                                ))}
                                <span className="text-gray-300 dark:text-gray-600">•</span>
                                <span className="text-xs text-gray-500">
                                    {formatBlogDate(frontmatter.date)}
                                </span>
                            </div>

                            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-[#0f7d70] transition-colors">
                                {frontmatter.title}
                            </h3>

                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                                {frontmatter.excerpt}
                            </p>
                        </div>

                        {/* Arrow */}
                        <div className="hidden sm:flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-[#0f7d70] group-hover:text-white transition-all">
                                <ArrowUpRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.article>
        );
    }

    if (variant === 'compact') {
        return (
            <motion.article
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="group"
            >
                <Link href={`/blogspace/${slug}`} className="block">
                    <div className="p-4 rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200/50 dark:border-gray-800/50 hover:border-[#0f7d70]/50 transition-all duration-300">
                        <span className="text-xs font-medium text-[#0f7d70] mb-2 block">
                            {frontmatter.categories[0]}
                        </span>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#0f7d70] transition-colors">
                            {frontmatter.title}
                        </h3>
                        <span className="text-xs text-gray-500 mt-2 block">
                            {formatBlogDate(frontmatter.date)}
                        </span>
                    </div>
                </Link>
            </motion.article>
        );
    }

    // Default Variant
    return (
        <motion.article
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="group"
        >
            <Link href={`/blogspace/${slug}`} className="block h-full">
                <div className="h-full flex flex-col rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200/50 dark:border-gray-800/50 overflow-hidden hover:border-[#0f7d70]/50 hover:shadow-xl hover:shadow-[#0f7d70]/10 transition-all duration-300 transform hover:-translate-y-1">
                    {/* Image Container */}
                    <div className="relative h-48 sm:h-52 overflow-hidden">
                        {/* Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0f7d70] via-[#0a3d40] to-[#9b896c]" />

                        {/* Decorative Elements */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-4 right-4 w-24 h-24 border border-white/30 rounded-full" />
                            <div className="absolute bottom-4 left-4 w-16 h-16 border border-white/20 rounded-full" />
                        </div>

                        {/* Cover Image */}
                        {frontmatter.cover && (
                            <Image
                                src={frontmatter.cover}
                                alt={frontmatter.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                            />
                        )}

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                            {frontmatter.categories.slice(0, 2).map((category) => (
                                <span
                                    key={category}
                                    className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/30"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>

                        {/* Arrow Indicator */}
                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                            <ArrowUpRight className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5 sm:p-6">
                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-[#0f7d70] transition-colors">
                            {frontmatter.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                            {frontmatter.excerpt}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {frontmatter.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-md"
                                >
                                    <Tag className="w-3 h-3" />
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                            {/* Author */}
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0f7d70] to-[#9b896c] flex items-center justify-center text-white text-xs font-bold">
                                    {frontmatter.author?.charAt(0).toUpperCase() || 'A'}
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {frontmatter.author || 'Anonymous'}
                                </span>
                            </div>

                            {/* Meta */}
                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {formatBlogDate(frontmatter.date).split(',')[0]}
                                </span>
                                {frontmatter.readTime && (
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {frontmatter.readTime}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}

export default PostCard;
