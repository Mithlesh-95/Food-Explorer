// src/components/SkeletonCard.jsx
// A shimmering placeholder component to display while products are loading from the API.

import React from 'react';

const SkeletonCard = () => {
    return (
        <article className="bg-surface-container-lowest rounded-xl overflow-hidden flex flex-col h-[380px] border border-outline-variant/10 shadow-sm animate-pulse">
            {/* Image Placeholder */}
            <div className="aspect-square bg-surface-container-high w-full relative">
                {/* Nutrition Badge Placeholder */}
                <div className="absolute top-4 right-4 bg-surface-variant w-10 h-10 rounded-full" />
            </div>

            <div className="p-6 flex flex-col flex-1">
                {/* Category Label Placeholder */}
                <div className="h-3 bg-surface-container-high rounded-full w-1/4 mb-4"></div>

                {/* Product Name Placeholders (2 lines) */}
                <div className="h-5 bg-surface-container-high rounded-full w-3/4 mb-3"></div>
                <div className="h-5 bg-surface-container-high rounded-full w-1/2 mb-6"></div>

                {/* Footer Data Placeholder */}
                <div className="mt-auto pt-4 flex justify-between items-end">
                    <div className="flex flex-col gap-2">
                        <div className="h-2 bg-surface-container-high rounded w-12"></div>
                        <div className="h-4 bg-surface-container-high rounded w-16"></div>
                    </div>
                    {/* Details Link Placeholder */}
                    <div className="h-4 bg-primary-container rounded w-16"></div>
                </div>
            </div>
        </article>
    );
};

export default SkeletonCard;
