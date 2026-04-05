import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../services/api.js';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMock, setIsMock] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setIsLoading(true);
                // We'll fetch all categories, but limit rendering to the top ~50 for a nice visual grid
                const result = await fetchCategories();
                setCategories((result.tags || []).slice(0, 50));
                if (result.isMock) setIsMock(true);
            } catch (err) {
                console.error("Failed to load categories:", err);
                setError("Failed to load categories.");
            } finally {
                setIsLoading(false);
            }
        };

        loadCategories();
    }, []);

    // A mapping function to inject some visual flair (colors/icons) based on category name strings
    const getCategoryStyles = (categoryName) => {
        const lowerName = categoryName.toLowerCase();
        if (lowerName.includes('snack') || lowerName.includes('sweet')) return { icon: 'cookie', bg: 'bg-amber-100', text: 'text-amber-800' };
        if (lowerName.includes('beverage') || lowerName.includes('drink')) return { icon: 'local_cafe', bg: 'bg-blue-100', text: 'text-blue-800' };
        if (lowerName.includes('dairy') || lowerName.includes('cheese')) return { icon: 'water_drop', bg: 'bg-yellow-100', text: 'text-yellow-800' };
        if (lowerName.includes('meat') || lowerName.includes('poultry')) return { icon: 'set_meal', bg: 'bg-red-100', text: 'text-red-800' };
        if (lowerName.includes('fruit') || lowerName.includes('vegetable')) return { icon: 'nutrition', bg: 'bg-emerald-100', text: 'text-emerald-800' };
        if (lowerName.includes('meal') || lowerName.includes('frozen')) return { icon: 'restaurant', bg: 'bg-purple-100', text: 'text-purple-800' };

        // Default style
        return { icon: 'category', bg: 'bg-surface-variant', text: 'text-on-surface-variant' };
    };

    return (
        <div className="animate-fade-in pb-12">
            {/* API Fallback Indicator (Demo Mode) */}
            {isMock && (
                <div className="mb-8 flex items-center gap-4 bg-primary/5 border border-primary/10 p-4 rounded-3xl animate-fade-in group">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined">science</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-primary">Demo Mode Active</p>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">
                            Showing sample data due to temporary API issues.
                        </p>
                    </div>
                </div>
            )}

            <header className="text-center mb-12">
                <h2 className="font-headline font-extrabold text-4xl md:text-6xl tracking-tight text-on-surface mb-4">
                    Explore <span className="text-primary italic">Categories</span>
                </h2>
                <p className="text-on-surface-variant text-lg">
                    Discover specialized ingredients and find your desired food profiles.
                </p>
            </header>

            {isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Skeleton loaders for the categories */}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="h-32 bg-surface-container-high rounded-3xl animate-pulse flex items-center justify-center"></div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-20 text-error font-bold font-headline">{error}</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-cols-5 gap-6">
                    {categories.map((cat) => {
                        const styles = getCategoryStyles(cat.name);
                        return (
                            <Link
                                to={`/?category=${cat.id}`}
                                key={cat.id}
                                className="group relative overflow-hidden bg-surface-container-low rounded-3xl flex flex-col items-center justify-center p-6 text-center shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 border border-outline-variant/10"
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 ${styles.bg}`}>
                                    <span className={`material-symbols-outlined text-3xl ${styles.text}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                                        {styles.icon}
                                    </span>
                                </div>
                                <h3 className="font-headline font-bold text-sm text-on-surface line-clamp-2">
                                    {cat.name}
                                </h3>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;
