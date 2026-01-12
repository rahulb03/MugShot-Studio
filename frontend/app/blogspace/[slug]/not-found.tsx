'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md"
            >
                {/* Icon */}
                <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#0f7d70]/20 to-[#9b896c]/20 flex items-center justify-center">
                    <FileQuestion className="w-12 h-12 text-[#0f7d70]" />
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Post Not Found
                </h1>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    The blog post you're looking for doesn't exist or may have been moved.
                    Let's get you back on track.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/blogspace"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0f7d70] to-[#0a3d40] text-white rounded-full font-medium hover:shadow-lg hover:shadow-[#0f7d70]/30 transition-shadow"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
