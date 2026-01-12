'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Filter, X, Check, ChevronDown } from 'lucide-react';
import { BlogCategory, BlogTag } from '@/src/lib/blog-types';
import { cn } from '@/src/lib/utils';

interface CategoryFilterProps {
    categories: BlogCategory[];
    tags?: BlogTag[];
    selectedCategory: string | null;
    selectedTags?: string[];
    onCategoryChange: (category: string | null) => void;
    onTagChange?: (tags: string[]) => void;
    variant?: 'horizontal' | 'sidebar';
}

export function CategoryFilter({
    categories,
    tags = [],
    selectedCategory,
    selectedTags = [],
    onCategoryChange,
    onTagChange,
    variant = 'horizontal',
}: CategoryFilterProps) {
    const [showAllCategories, setShowAllCategories] = React.useState(false);
    const [showTagDropdown, setShowTagDropdown] = React.useState(false);

    const displayedCategories = showAllCategories
        ? categories
        : categories.slice(0, 6);

    const toggleTag = (tagSlug: string) => {
        if (!onTagChange) return;

        if (selectedTags.includes(tagSlug)) {
            onTagChange(selectedTags.filter((t) => t !== tagSlug));
        } else {
            onTagChange([...selectedTags, tagSlug]);
        }
    };

    if (variant === 'sidebar') {
        return (
            <aside className="w-full lg:w-64 flex-shrink-0">
                <div className="sticky top-20 space-y-6">
                    {/* Categories Section */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200/50 dark:border-gray-800/50">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                            <Filter className="w-4 h-4 text-[#0f7d70]" />
                            Browse by Categories
                        </h3>

                        <div className="space-y-1">
                            {/* All Posts */}
                            <button
                                onClick={() => onCategoryChange(null)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                    !selectedCategory
                                        ? "bg-[#0f7d70] text-white"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                )}
                            >
                                <span>All Category</span>
                                {!selectedCategory && <Check className="w-4 h-4" />}
                            </button>

                            {categories.map((category) => (
                                <button
                                    key={category.slug}
                                    onClick={() => onCategoryChange(category.slug)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                        selectedCategory === category.slug
                                            ? "bg-[#0f7d70] text-white"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    )}
                                >
                                    <span>{category.name}</span>
                                    <span
                                        className={cn(
                                            "text-xs px-2 py-0.5 rounded-full",
                                            selectedCategory === category.slug
                                                ? "bg-white/20"
                                                : "bg-gray-100 dark:bg-gray-800"
                                        )}
                                    >
                                        {category.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags Section */}
                    {tags.length > 0 && (
                        <div className="p-6 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200/50 dark:border-gray-800/50">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                Popular Tags
                            </h3>

                            <div className="flex flex-wrap gap-2">
                                {tags.slice(0, 10).map((tag) => (
                                    <button
                                        key={tag.slug}
                                        onClick={() => toggleTag(tag.slug)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                                            selectedTags.includes(tag.slug)
                                                ? "bg-[#0f7d70] text-white"
                                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[#0f7d70]/10 hover:text-[#0f7d70]"
                                        )}
                                    >
                                        #{tag.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        );
    }

    // Horizontal variant
    return (
        <div className="w-full">
            <div className="flex flex-wrap items-center gap-3">
                {/* Filter Icon & Label (Mobile) */}
                <div className="sm:hidden flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">Filter:</span>
                </div>

                {/* Categories Pills */}
                <div className="flex flex-wrap gap-2">
                    {/* All Posts Pill */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onCategoryChange(null)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                            !selectedCategory
                                ? "bg-gradient-to-r from-[#0f7d70] to-[#0a3d40] text-white shadow-lg shadow-[#0f7d70]/20"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        )}
                    >
                        All Posts
                    </motion.button>

                    {/* Category Pills */}
                    {displayedCategories.map((category) => (
                        <motion.button
                            key={category.slug}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onCategoryChange(category.slug)}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2",
                                selectedCategory === category.slug
                                    ? "bg-gradient-to-r from-[#0f7d70] to-[#0a3d40] text-white shadow-lg shadow-[#0f7d70]/20"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            )}
                        >
                            {category.name}
                            <span
                                className={cn(
                                    "text-xs px-1.5 py-0.5 rounded-full",
                                    selectedCategory === category.slug
                                        ? "bg-white/20"
                                        : "bg-gray-200 dark:bg-gray-700"
                                )}
                            >
                                {category.count}
                            </span>
                        </motion.button>
                    ))}

                    {/* Show More Button */}
                    {categories.length > 6 && (
                        <button
                            onClick={() => setShowAllCategories(!showAllCategories)}
                            className="px-4 py-2 rounded-full text-sm font-medium text-[#0f7d70] bg-[#0f7d70]/10 hover:bg-[#0f7d70]/20 transition-colors flex items-center gap-1"
                        >
                            {showAllCategories ? 'Show Less' : `+${categories.length - 6} More`}
                            <ChevronDown
                                className={cn(
                                    "w-4 h-4 transition-transform",
                                    showAllCategories && "rotate-180"
                                )}
                            />
                        </button>
                    )}
                </div>

                {/* Tags Dropdown (Optional) */}
                {tags.length > 0 && onTagChange && (
                    <div className="relative ml-auto">
                        <button
                            onClick={() => setShowTagDropdown(!showTagDropdown)}
                            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                            Tags
                            {selectedTags.length > 0 && (
                                <span className="w-5 h-5 rounded-full bg-[#0f7d70] text-white text-xs flex items-center justify-center">
                                    {selectedTags.length}
                                </span>
                            )}
                            <ChevronDown
                                className={cn(
                                    "w-4 h-4 transition-transform",
                                    showTagDropdown && "rotate-180"
                                )}
                            />
                        </button>

                        {showTagDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 top-full mt-2 w-64 p-4 rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200/50 dark:border-gray-800/50 shadow-xl z-50"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        Filter by Tags
                                    </span>
                                    {selectedTags.length > 0 && (
                                        <button
                                            onClick={() => onTagChange([])}
                                            className="text-xs text-[#0f7d70] hover:underline"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                                    {tags.map((tag) => (
                                        <button
                                            key={tag.slug}
                                            onClick={() => toggleTag(tag.slug)}
                                            className={cn(
                                                "px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1",
                                                selectedTags.includes(tag.slug)
                                                    ? "bg-[#0f7d70] text-white"
                                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[#0f7d70]/10"
                                            )}
                                        >
                                            {selectedTags.includes(tag.slug) && (
                                                <Check className="w-3 h-3" />
                                            )}
                                            #{tag.name}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}

                {/* Active Filter Clear */}
                {(selectedCategory || selectedTags.length > 0) && (
                    <button
                        onClick={() => {
                            onCategoryChange(null);
                            onTagChange?.([]);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
}

export default CategoryFilter;
