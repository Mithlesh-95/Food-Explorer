import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchProducts, fetchCategories } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce.js';

const HomePage = () => {
    const [products, setProducts] = useState([]);

    const [categories, setCategories] = useState([]);

    const location = useLocation();
    const [selectedCategory, setSelectedCategory] = useState(() => {
        const params = new URLSearchParams(location.search);
        return params.get('category') || '';
    });

    // If navigating from Categories page directly
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cat = params.get('category');
        if (cat) {
            setSelectedCategory(cat);
        }
    }, [location.search]);

    // search properties
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 400); // 400ms premium typing delay

    const [searchMode, setSearchMode] = useState('name'); // 'name' or 'barcode'
    const [sortOrder, setSortOrder] = useState(''); // e.g. "product_name" or "nutriscore_score"

    // Pagination & Loading States
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true); // Tracks if there are more items to load
    const [isMock, setIsMock] = useState(false); // Tracks if we are using fallback data

    const navigate = useNavigate();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const result = await fetchCategories();
                // The API returns thousands of categories, we just take the first 15 for the demo UI
                setCategories((result.tags || []).slice(0, 15));
                if (result.isMock) setIsMock(true);
            } catch (error) {
                console.error("Failed loading categories", error);
            }
        };
        loadCategories();
    }, []); // Run once on mount

    const loadProducts = useCallback(async (isNewSearch = false) => {
        if (isLoading || (!hasMore && !isNewSearch)) return;

        setIsLoading(true);
        const currentPage = isNewSearch ? 1 : page;

        try {
            // Use the debounced search term instead of the raw fast keystrokes!
            const data = await fetchProducts(debouncedSearchTerm, selectedCategory, currentPage, sortOrder);

            if (data.isMock) setIsMock(true);

            if (data.products && data.products.length > 0) {
                setProducts(prev => isNewSearch ? data.products : [...prev, ...data.products]);
                setPage(currentPage + 1);
                setHasMore(data.products.length >= 20); // Dynamic assumed page boundary check
            } else {
                if (isNewSearch) setProducts([]);
                setHasMore(false);
            }
        } catch (err) {
            console.error("Fetch products failed", err);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchTerm, selectedCategory, page, sortOrder, isLoading, hasMore]);

    // We run loadProducts whenever the search term (debounced), category, or sort order changes!
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        loadProducts(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, selectedCategory, sortOrder]);

    const observer = useRef();
    const lastProductElementRef = useCallback((node) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            // When the specific sentinal element becomes visible on screen, load more
            if (entries[0].isIntersecting && hasMore) {
                loadProducts(false);
            }
        }, { threshold: 1.0 }); // threshold 1.0 means it has to be 100% visible

        if (node) observer.current.observe(node);
    }, [isLoading, hasMore, loadProducts]);

    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Stop the form from refreshing the webpage

        // If we are in barcode mode, we immediately redirect to the ProductDetail page for that barcode!
        if (searchMode === 'barcode' && searchTerm.trim() !== '') {
            navigate(`/product/${searchTerm}`);
        } else {
            // Otherwise, trigger the name search (handled automatically by the useEffect watching searchTerm)
        }
    };

    // ------- 5. JSX Render Output -------
    return (
        <div className="animate-fade-in">
            {/* API Fallback Indicator (Demo Mode) */}
            {isMock && (
                <div className="mb-8 flex items-center gap-4 bg-primary/5 border border-primary/10 p-4 rounded-3xl animate-fade-in group">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined">science</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-primary">Demo Mode Active</p>
                        <p className="text-xs text-on-surface-variant opacity-80">
                            The OpenFoodFacts API is currently unreachable. We are serving high-quality mock data for this demonstration.
                        </p>
                    </div>
                </div>
            )}

            {/* 5A. Hero Search Section (Matched to Stitch Design) */}
            <section className="mb-12">
                <div className="max-w-3xl mx-auto text-center mb-10">
                    <h2 className="font-headline font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-on-surface mb-4 sm:mb-6 leading-[1.1]">
                        Discover the alchemy in your <span className="text-primary italic">ingredients</span>.
                    </h2>

                    <form onSubmit={handleSearchSubmit} className="relative group">
                        <div className="flex items-center bg-surface-container-highest rounded-full p-2 transition-all duration-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/20 outline outline-1 outline-outline-variant/15">
                            <div className="flex items-center flex-1 px-4">
                                <span className="material-symbols-outlined text-on-surface-variant mr-3">search</span>
                                <input
                                    aria-label="Search items"
                                    className="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder:text-on-surface-variant/60 font-medium outline-none text-sm sm:text-base"
                                    placeholder={searchMode === 'name' ? "Search by product name..." : "Enter barcode numbers..."}
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Toggle buttons between Name search and Barcode search */}
                            <div className="flex items-center gap-1 p-1 bg-surface-container/50 rounded-full">
                                <button
                                    type="button"
                                    onClick={() => setSearchMode('name')}
                                    className={`${searchMode === 'name' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'} px-3 py-1.5 rounded-full text-xs font-bold transition-colors`}
                                >
                                    Name
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSearchMode('barcode')}
                                    className={`${searchMode === 'barcode' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'} px-3 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1`}
                                >
                                    <span className="material-symbols-outlined text-xs">barcode_scanner</span>
                                    Barcode
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* 5B. Categories Horizontal Scroll (Sticky Glassmorphism Nav) */}
                <div className="flex overflow-x-auto hide-scrollbar gap-2 sm:gap-3 py-3 sm:py-4 items-center sticky top-16 sm:top-20 z-40 bg-background/90 backdrop-blur-md rounded-b-2xl shadow-[0_8px_16px_-8px_rgba(0,0,0,0.05)] px-1 sm:px-2 -mx-1 sm:-mx-2 mb-4 sm:mb-6">
                    {/* Default 'All Products' chip */}
                    <button
                        onClick={() => setSelectedCategory('')}
                        aria-pressed={selectedCategory === ''}
                        className={`${selectedCategory === '' ? 'bg-primary-container text-on-primary-container ring-2 ring-primary/50 ring-offset-2 ring-offset-background' : 'bg-surface-variant text-on-surface-variant hover:bg-surface-container-high focus-visible:ring-2 focus-visible:ring-primary'} px-6 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all active:scale-95`}
                    >
                        All Products
                    </button>

                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            aria-pressed={selectedCategory === cat.id}
                            className={`${selectedCategory === cat.id ? 'bg-primary-container text-on-primary-container ring-2 ring-primary/50 ring-offset-2 ring-offset-background' : 'bg-surface-variant text-on-surface-variant hover:bg-surface-container-high focus-visible:ring-2 focus-visible:ring-primary'} px-6 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all outline-none`}
                        >
                            {cat.name}
                        </button>
                    ))}

                    {/* 5C. Sorting Dropdown Tool */}
                    <div className="ml-auto pl-4 border-l border-outline-variant/30 flex items-center gap-2">
                        <span className="text-sm font-bold text-on-surface-variant">Sort:</span>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="bg-surface-variant text-sm font-bold rounded-lg px-3 py-2 outline-none border-none text-on-surface cursor-pointer"
                        >
                            <option value="">Popularity</option>
                            <option value="product_name">Name (A-Z)</option>
                            <option value="-product_name">Name (Z-A)</option>
                            <option value="nutriscore_score">Nutri-Score (Best First)</option>
                            <option value="-nutriscore_score">Nutri-Score (Worst First)</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* 5D. Product Bento Grid Component */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {isLoading && products.length === 0 ? (
                    // Show 8 shimmering skeleton cards on the very first load 
                    Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                ) : (
                    products.map((product) => (
                        <ProductCard key={product.id || product.code} product={product} />
                    ))
                )}
            </div>

            {/* If the array is empty and it's not loading, show a Premium Fallback Message Box */}
            {!isLoading && products.length === 0 && (
                <div className="mt-16 bg-surface-container-low border border-outline-variant/20 rounded-[2rem] p-12 flex flex-col items-center justify-center max-w-2xl mx-auto shadow-sm">
                    <div className="w-20 h-20 bg-primary-container text-primary rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-4xl">search_off</span>
                    </div>
                    <h3 className="font-headline font-bold text-2xl text-on-surface mb-2">No alchemy found</h3>
                    <p className="text-on-surface-variant text-center max-w-sm">We couldn't find any ingredients matching your current search or category filters. Try widening your search!</p>
                </div>
            )}

            {/* 5E. Infinite Scroll Anchor Element */}
            {hasMore ? (
                <div
                    ref={lastProductElementRef}
                    className="mt-16 flex justify-center py-8"
                >
                    {isLoading && (
                        <div className="flex items-center gap-3 bg-surface-container-highest px-8 py-4 rounded-full font-bold text-on-surface shadow-sm animate-pulse">
                            Brewing...
                        </div>
                    )}
                </div>
            ) : (
                products.length > 0 && (
                    <div className="mt-16 pb-8 text-center">
                        <p className="text-on-surface-variant font-bold text-sm bg-surface-container-lowest inline-block px-8 py-3 rounded-full shadow-sm border border-outline-variant/10">You have discovered all the ingredients!</p>
                    </div>
                )
            )}
        </div>
    );
};

export default HomePage;
