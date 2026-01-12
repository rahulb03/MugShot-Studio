'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { BlogPost } from '@/src/lib/blog-types';
import { formatBlogDate } from '@/src/lib/utils';

interface FeaturedPostProps {
    post: BlogPost;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
    const { frontmatter, slug } = post;

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative group"
        >
            <Link href={`/blogspace/${slug}`} className="block">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a3d40] via-[#0f7d70] to-[#9b896c] p-[1px]">
                    <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#121212]">
                        {/* Cover Image with Gradient Overlay */}
                        <div className="relative h-72 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
                            {/* Animated Gradient Background (Fallback) */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0f7d70] via-[#0a3d40] to-[#9b896c] animate-gradient-shift">
                                <div className="absolute inset-0 opacity-30">
                                    <div className="absolute top-0 left-0 w-96 h-96 bg-[#0f7d70] rounded-full blur-3xl animate-blob" />
                                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#9b896c] rounded-full blur-3xl animate-blob animation-delay-2000" />
                                    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#0a3d40] rounded-full blur-3xl animate-blob animation-delay-4000" />
                                </div>
                            </div>

                            {/* Cover Image */}
                            {frontmatter.cover && (
                                <Image
                                    src={frontmatter.cover}
                                    alt={frontmatter.title}
                                    fill
                                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                                    priority
                                />
                            )}

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                            {/* Featured Badge */}
                            <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0f7d70] to-[#0a3d40] rounded-full text-white text-sm font-medium shadow-lg shadow-[#0f7d70]/30"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Featured Article
                                </motion.div>
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
                                {/* Categories */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {frontmatter.categories.slice(0, 3).map((category) => (
                                        <span
                                            key={category}
                                            className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-medium rounded-full border border-white/20"
                                        >
                                            {category}
                                        </span>
                                    ))}
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-[#0f7d70]/90 transition-colors">
                                    {frontmatter.title}
                                </h2>

                                {/* Excerpt */}
                                <p className="text-gray-300 text-base sm:text-lg max-w-3xl mb-6 line-clamp-2 sm:line-clamp-3">
                                    {frontmatter.excerpt}
                                </p>

                                {/* Meta Info */}
                                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                                    {/* Author */}
                                    {frontmatter.author && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0f7d70] to-[#9b896c] flex items-center justify-center text-white font-bold text-sm">
                                                {frontmatter.author.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-white font-medium">
                                                {frontmatter.author}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            {formatBlogDate(frontmatter.date)}
                                        </span>
                                        {frontmatter.readTime && (
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                {frontmatter.readTime}
                                            </span>
                                        )}
                                    </div>

                                    {/* Read More Button */}
                                    <motion.div
                                        className="hidden sm:flex items-center gap-2 ml-auto px-5 py-2.5 bg-white text-[#0a3d40] rounded-full font-medium text-sm group-hover:bg-[#0f7d70] group-hover:text-white transition-all duration-300 shadow-lg"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Read Article
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}

export default FeaturedPost;
