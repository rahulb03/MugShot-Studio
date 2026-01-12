'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    User,
    Tag,
    Share2,
    Twitter,
    Linkedin,
    Link2,
    ChevronUp,
    MessageCircle,
    Heart,
    Bookmark,
} from 'lucide-react';
import { BlogPost } from '@/src/lib/blog-types';
import { formatBlogDate } from '@/src/lib/utils';
import { cn } from '@/src/lib/utils';

interface PostRendererProps {
    post: BlogPost;
    relatedPosts?: BlogPost[];
}

export function PostRenderer({ post, relatedPosts = [] }: PostRendererProps) {
    const { frontmatter, htmlContent, slug } = post;
    const [showScrollTop, setShowScrollTop] = React.useState(false);
    const [copied, setCopied] = React.useState(false);

    // Track scroll for back-to-top button
    React.useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Extract headings for table of contents
    const extractHeadings = () => {
        if (!htmlContent) return [];

        const headingRegex = /<h([2-3])[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h[2-3]>/g;
        const headings: { level: number; id: string; text: string }[] = [];
        let match;

        // Simple extraction for demo - in production use a proper parser
        const tempDiv = typeof document !== 'undefined' ? document.createElement('div') : null;
        if (tempDiv) {
            tempDiv.innerHTML = htmlContent;
            const h2s = tempDiv.querySelectorAll('h2, h3');
            h2s.forEach((heading, index) => {
                const id = heading.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `heading-${index}`;
                headings.push({
                    level: heading.tagName === 'H2' ? 2 : 3,
                    id,
                    text: heading.textContent || '',
                });
            });
        }

        return headings;
    };

    const headings = extractHeadings();

    const copyLink = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareOnTwitter = () => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(frontmatter.title);
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    };

    const shareOnLinkedIn = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <article className="relative">
            {/* Hero Section */}
            <header className="relative">
                {/* Cover Image */}
                <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0f7d70] via-[#0a3d40] to-[#9b896c]">
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0f7d70] rounded-full blur-3xl animate-pulse" />
                            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#9b896c] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                        </div>
                    </div>

                    {/* Cover Image */}
                    {frontmatter.cover && (
                        <Image
                            src={frontmatter.cover}
                            alt={frontmatter.title}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            priority
                        />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12 max-w-4xl mx-auto">
                        {/* Categories */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-wrap gap-2 mb-4"
                        >
                            {frontmatter.categories.map((category) => (
                                <Link
                                    key={category}
                                    href={`/blogspace?category=${category.toLowerCase()}`}
                                    className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/30 hover:bg-white/30 transition-colors"
                                >
                                    {category}
                                </Link>
                            ))}
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
                        >
                            {frontmatter.title}
                        </motion.h1>

                        {/* Meta Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-300"
                        >
                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0f7d70] to-[#9b896c] flex items-center justify-center text-white font-bold">
                                    {frontmatter.author?.charAt(0).toUpperCase() || 'A'}
                                </div>
                                <span className="font-medium text-white">
                                    {frontmatter.author || 'Anonymous'}
                                </span>
                            </div>

                            <span className="hidden sm:block text-gray-400">•</span>

                            <span className="flex items-center gap-1.5 text-sm">
                                <Calendar className="w-4 h-4" />
                                {formatBlogDate(frontmatter.date)}
                            </span>

                            {frontmatter.readTime && (
                                <>
                                    <span className="hidden sm:block text-gray-400">•</span>
                                    <span className="flex items-center gap-1.5 text-sm">
                                        <Clock className="w-4 h-4" />
                                        {frontmatter.readTime}
                                    </span>
                                </>
                            )}
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <motion.main
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex-1 min-w-0"
                    >
                        {/* Article Content */}
                        <div
                            className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-800
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                prose-a:text-[#0f7d70] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 dark:prose-strong:text-white
                prose-code:text-[#0f7d70] prose-code:bg-[#0f7d70]/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-pre:rounded-xl
                prose-blockquote:border-l-4 prose-blockquote:border-[#0f7d70] prose-blockquote:bg-[#0f7d70]/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                prose-img:rounded-xl prose-img:shadow-lg
                prose-ul:space-y-2 prose-ol:space-y-2
                prose-li:text-gray-600 dark:prose-li:text-gray-300
                prose-table:border prose-table:border-gray-200 dark:prose-table:border-gray-800 prose-table:rounded-lg prose-table:overflow-hidden
                prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:px-4 prose-th:py-2
                prose-td:px-4 prose-td:py-2 prose-td:border-t prose-td:border-gray-200 dark:prose-td:border-gray-800
                prose-hr:border-gray-200 dark:prose-hr:border-gray-800
              "
                            dangerouslySetInnerHTML={{ __html: htmlContent || '' }}
                        />

                        {/* Tags */}
                        {frontmatter.tags.length > 0 && (
                            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
                                        Tags:
                                    </span>
                                    {frontmatter.tags.map((tag) => (
                                        <Link
                                            key={tag}
                                            href={`/blogspace?tag=${tag.toLowerCase()}`}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-[#0f7d70]/10 hover:text-[#0f7d70] transition-colors"
                                        >
                                            <Tag className="w-3 h-3" />
                                            {tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Share Section */}
                        <div className="mt-8 p-6 rounded-2xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200/50 dark:border-gray-800/50">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        Share this article
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Found it helpful? Share it with your network!
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={shareOnTwitter}
                                        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-all"
                                        aria-label="Share on Twitter"
                                    >
                                        <Twitter className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={shareOnLinkedIn}
                                        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-all"
                                        aria-label="Share on LinkedIn"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={copyLink}
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                            copied
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-100 dark:bg-gray-800 hover:bg-[#0f7d70] hover:text-white"
                                        )}
                                        aria-label="Copy link"
                                    >
                                        <Link2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.main>

                    {/* Sidebar */}
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <div className="lg:sticky lg:top-20 space-y-6">
                            {/* Table of Contents */}
                            {headings.length > 0 && (
                                <div className="p-6 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200/50 dark:border-gray-800/50">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                        Table of Contents
                                    </h3>
                                    <nav className="space-y-2">
                                        {headings.map((heading, index) => (
                                            <a
                                                key={index}
                                                href={`#${heading.id}`}
                                                className={cn(
                                                    "block text-sm text-gray-600 dark:text-gray-400 hover:text-[#0f7d70] transition-colors",
                                                    heading.level === 3 && "pl-4"
                                                )}
                                            >
                                                {heading.text}
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                            )}

                            {/* Author Card */}
                            <div className="p-6 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200/50 dark:border-gray-800/50">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                    Written by
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0f7d70] to-[#9b896c] flex items-center justify-center text-white text-lg font-bold">
                                        {frontmatter.author?.charAt(0).toUpperCase() || 'A'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {frontmatter.author || 'Anonymous'}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Content Creator
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Related Posts */}
                            {relatedPosts.length > 0 && (
                                <div className="p-6 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200/50 dark:border-gray-800/50">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                        Related Articles
                                    </h3>
                                    <div className="space-y-4">
                                        {relatedPosts.map((relatedPost) => (
                                            <Link
                                                key={relatedPost.slug}
                                                href={`/blogspace/${relatedPost.slug}`}
                                                className="block group"
                                            >
                                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#0f7d70] transition-colors line-clamp-2">
                                                    {relatedPost.frontmatter.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatBlogDate(relatedPost.frontmatter.date)}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>

            {/* Back to Top Button */}
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: showScrollTop ? 1 : 0,
                    scale: showScrollTop ? 1 : 0.8,
                }}
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-[#0f7d70] to-[#0a3d40] text-white shadow-lg shadow-[#0f7d70]/30 flex items-center justify-center hover:shadow-xl hover:shadow-[#0f7d70]/40 transition-shadow z-50"
                aria-label="Scroll to top"
            >
                <ChevronUp className="w-5 h-5" />
            </motion.button>
        </article>
    );
}

export default PostRenderer;
