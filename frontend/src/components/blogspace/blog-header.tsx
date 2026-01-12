'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Menu, X, Home, BookOpen, Layers, Tag } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { BlogCategory } from '@/src/lib/blog-types';

interface BlogHeaderProps {
    categories?: BlogCategory[];
    selectedCategory?: string | null;
    onCategoryChange?: (category: string | null) => void;
    showBackButton?: boolean;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
}

export function BlogHeader({
    categories = [],
    selectedCategory,
    onCategoryChange,
    showBackButton = false,
    searchQuery = '',
    onSearchChange,
}: BlogHeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [searchOpen, setSearchOpen] = React.useState(false);

    return (
        <header className="sticky top-0 z-50 w-full">
            {/* Glassmorphic Background */}
            <div className="absolute inset-0 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left Section: Logo or Back Button */}
                    <div className="flex items-center gap-4">
                        {showBackButton ? (
                            <Link
                                href="/blogspace"
                                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#0f7d70] dark:hover:text-[#0f7d70] transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="hidden sm:inline font-medium">Back to Blog</span>
                            </Link>
                        ) : (
                            <Link href="/blogspace" className="flex items-center gap-3 group">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0f7d70] to-[#0a3d40] flex items-center justify-center shadow-lg shadow-[#0f7d70]/20 group-hover:shadow-[#0f7d70]/40 transition-shadow">
                                        <BookOpen className="w-5 h-5 text-white" />
                                    </div>
                                    <motion.div
                                        className="absolute -inset-1 rounded-xl bg-gradient-to-br from-[#0f7d70] to-[#0a3d40] opacity-0 group-hover:opacity-30 blur transition-opacity"
                                        initial={false}
                                    />
                                </div>
                                <div className="hidden sm:block">
                                    <span className="text-xl font-bold tracking-tight font-silver text-[#0f7d70]">
                                        Blogspace
                                    </span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                                        by MugShot Studio
                                    </p>
                                </div>
                            </Link>
                        )}
                    </div>

                    {/* Center Section: Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        <NavLink href="/" icon={<Home className="w-4 h-4" />}>
                            Home
                        </NavLink>
                        <NavLink
                            href="/blogspace"
                            active={!selectedCategory}
                            icon={<BookOpen className="w-4 h-4" />}
                            onClick={() => onCategoryChange?.(null)}
                        >
                            All Posts
                        </NavLink>

                        {/* Category Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#0f7d70] dark:hover:text-[#0f7d70] transition-colors">
                                <Layers className="w-4 h-4" />
                                Categories
                                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute top-full left-0 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                <div className="py-2 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-xl">
                                    {categories.map((category) => (
                                        <button
                                            key={category.slug}
                                            onClick={() => onCategoryChange?.(category.slug)}
                                            className={cn(
                                                "w-full flex items-center justify-between px-4 py-2 text-sm transition-colors",
                                                selectedCategory === category.slug
                                                    ? "bg-[#0f7d70]/10 text-[#0f7d70]"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            )}
                                        >
                                            <span>{category.name}</span>
                                            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                                {category.count}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Right Section: Search & Mobile Menu */}
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <div className="relative">
                            {searchOpen ? (
                                <motion.div
                                    initial={{ width: 40, opacity: 0 }}
                                    animate={{ width: 240, opacity: 1 }}
                                    exit={{ width: 40, opacity: 0 }}
                                    className="flex items-center"
                                >
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => onSearchChange?.(e.target.value)}
                                        placeholder="Search articles..."
                                        className="w-full h-10 pl-10 pr-4 text-sm bg-gray-100 dark:bg-gray-800 rounded-full border-0 focus:ring-2 focus:ring-[#0f7d70] outline-none transition-all"
                                        autoFocus
                                    />
                                    <Search className="absolute left-3 w-4 h-4 text-gray-400" />
                                    <button
                                        onClick={() => {
                                            setSearchOpen(false);
                                            onSearchChange?.('');
                                        }}
                                        className="absolute right-3 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                                    >
                                        <X className="w-3 h-3 text-gray-500" />
                                    </button>
                                </motion.div>
                            ) : (
                                <button
                                    onClick={() => setSearchOpen(true)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </button>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            ) : (
                                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <motion.div
                    initial={false}
                    animate={{
                        height: mobileMenuOpen ? 'auto' : 0,
                        opacity: mobileMenuOpen ? 1 : 0,
                    }}
                    className="lg:hidden overflow-hidden"
                >
                    <div className="py-4 border-t border-gray-200/50 dark:border-gray-800/50">
                        <div className="space-y-1">
                            <MobileNavLink href="/" icon={<Home className="w-4 h-4" />}>
                                Home
                            </MobileNavLink>
                            <MobileNavLink
                                href="/blogspace"
                                active={!selectedCategory}
                                icon={<BookOpen className="w-4 h-4" />}
                                onClick={() => {
                                    onCategoryChange?.(null);
                                    setMobileMenuOpen(false);
                                }}
                            >
                                All Posts
                            </MobileNavLink>

                            <div className="pt-2 pb-1">
                                <span className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Categories
                                </span>
                            </div>

                            {categories.map((category) => (
                                <button
                                    key={category.slug}
                                    onClick={() => {
                                        onCategoryChange?.(category.slug);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-2 text-sm transition-colors rounded-lg mx-2",
                                        selectedCategory === category.slug
                                            ? "bg-[#0f7d70]/10 text-[#0f7d70]"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    )}
                                    style={{ width: 'calc(100% - 16px)' }}
                                >
                                    <span className="flex items-center gap-2">
                                        <Tag className="w-4 h-4" />
                                        {category.name}
                                    </span>
                                    <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                        {category.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </header>
    );
}

// Helper Components
interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    active?: boolean;
    icon?: React.ReactNode;
    onClick?: () => void;
}

function NavLink({ href, children, active, icon, onClick }: NavLinkProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                active
                    ? "bg-[#0f7d70]/10 text-[#0f7d70]"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
        >
            {icon}
            {children}
        </Link>
    );
}

function MobileNavLink({ href, children, active, icon, onClick }: NavLinkProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg mx-2 transition-colors",
                active
                    ? "bg-[#0f7d70]/10 text-[#0f7d70]"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
            style={{ width: 'calc(100% - 16px)' }}
        >
            {icon}
            {children}
        </Link>
    );
}

export default BlogHeader;
