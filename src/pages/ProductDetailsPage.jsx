import React, { useState, useEffect } from 'react';
// useParams lets us read the dynamic parts of the URL.
// useNavigate lets us programmatically go back to the previous page.
import { useParams, useNavigate } from 'react-router-dom';
// The API function to get a single product
import { fetchProductByBarcode } from '../services/api.js';
// The global Cart context to allow users to add this product to their cart.
import { useCart } from '../context/CartContext.jsx';

const ProductDetailsPage = () => {
    const { barcode } = useParams();
    const navigate = useNavigate(); // Used to trigger a "Back" action
    const [product, setProduct] = useState(null); // Holds the fetched product data
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [isAdded, setIsAdded] = useState(false); // Success feedback state
    const [isMock, setIsMock] = useState(false); // Tracks if we are using fallback data
    const { addToCart } = useCart(); // Destructure the addToCart function from our global context

    useEffect(() => {
        const getProduct = async () => {
            try {
                setIsLoading(true);
                const data = await fetchProductByBarcode(barcode);

                // OpenFoodFacts returns status: 1 if found, status: 0 if not
                if (data.status === 1 && data.product) {
                    setProduct(data.product);
                    if (data.isMock) setIsMock(true);
                } else {
                    setError("Product not found in the OpenFoodFacts database.");
                }
            } catch (err) {
                console.error("Error fetching product details", err);
                setError("Failed to load product details. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        getProduct();
    }, [barcode]); // Re-run if the barcode URL changes

    useEffect(() => {
        if (product && barcode) {
            const saveToHistory = () => {
                const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
                const newEntry = {
                    barcode,
                    name: product.product_name || 'Unnamed Product',
                    image: product.image_url,
                    brand: product.brands ? product.brands.split(',')[0] : 'Unknown Brand',
                    timestamp: Date.now()
                };

                // Remove existing entry for same barcode to move it to top
                const filteredHistory = history.filter(item => item.barcode !== barcode);
                const updatedHistory = [newEntry, ...filteredHistory].slice(0, 50); // Keep last 50

                localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
            };
            saveToHistory();
        }
    }, [product, barcode]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
            setIsAdded(true);
            // Hide the success message after 3 seconds
            setTimeout(() => setIsAdded(false), 3000);
        }
    };

    // 4. Loading & Error UI
    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center font-headline text-2xl text-primary font-bold animate-pulse">
                Extracting Alchemy...
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex flex-col h-[80vh] items-center justify-center">
                <h2 className="text-error font-headline text-3xl font-bold mb-4">Error</h2>
                <p className="text-on-surface-variant mb-6">{error}</p>
                <button onClick={() => navigate(-1)} className="bg-primary text-white px-6 py-3 rounded-full font-bold">
                    Go Back
                </button>
            </div>
        );
    }

    // 5. Derived Data for UI
    const imageUrl = product.image_url || 'https://via.placeholder.com/600?text=No+Image';
    const categoryStr = product.categories ? product.categories.split(',')[0] : 'Unknown Category';
    const rawGrade = product.nutrition_grades?.toLowerCase();
    const nutritionGrade = ['a', 'b', 'c', 'd', 'e'].includes(rawGrade) ? rawGrade.toUpperCase() : '?';

    // Safely extract nutriments (defaults to "0" if missing)
    const nutriments = product.nutriments || {};
    const energy = nutriments['energy-kcal_100g'] ?? 'N/A';
    const fat = nutriments['fat_100g'] ?? 'N/A';
    const saturatedFat = nutriments['saturated-fat_100g'] ?? 'N/A';
    const carbs = nutriments['carbohydrates_100g'] ?? 'N/A';
    const sugars = nutriments['sugars_100g'] ?? 'N/A';
    const fiber = nutriments['fiber_100g'] ?? 'N/A';
    const proteins = nutriments['proteins_100g'] ?? 'N/A';
    const salt = nutriments['salt_100g'] ?? 'N/A';

    // Make an array of labels safely
    const labels = product.labels ? product.labels.split(',').slice(0, 3) : [];

    // 5.5 Advanced Health Badge Detection
    const analysisTags = product.ingredients_analysis_tags || [];
    const isVegan = analysisTags.includes('en:vegan');
    const isVegetarian = analysisTags.includes('en:vegetarian');
    const isGlutenFree = product.labels_tags?.includes('en:gluten-free') || product.ingredients_text?.toLowerCase().includes('gluten free');

    // 6. Final JSX Render (Heavily styled exactly like the Stitch design)
    return (
        <div className="animate-fade-in -mt-24 pt-20">
            {/* API Fallback Indicator (Demo Mode) */}
            {isMock && (
                <div className="mb-6 flex items-center gap-4 bg-primary/5 border border-primary/10 p-4 rounded-3xl animate-fade-in group max-w-6xl mx-auto mt-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined">science</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-primary">Demo Mode Active</p>
                        <p className="text-xs text-on-surface-variant opacity-80 font-medium">
                            This product details are served from mock data because the live API is unreachable.
                        </p>
                    </div>
                </div>
            )}
            {/* Back Button - Absolute to the container for better reliability */}
            <div className="max-w-6xl mx-auto px-6 relative h-0">
                <button
                    onClick={() => {
                        if (window.history.length > 1) {
                            navigate(-1);
                        } else {
                            navigate('/');
                        }
                    }}
                    className="absolute top-4 left-6 z-[60] w-12 h-12 bg-white shadow-xl border border-outline-variant/20 flex items-center justify-center rounded-full hover:bg-emerald-50 active:scale-90 transition-all"
                    title="Go Back"
                >
                    <span className="material-symbols-outlined text-emerald-800" style={{ fontSize: '24px' }}>arrow_back</span>
                </button>
            </div>

            {/* Hero Header Section */}
            <section className="relative w-full h-[530px] flex items-center justify-center overflow-hidden bg-surface-container-low rounded-t-[3rem] mt-4">
                <img
                    className="absolute inset-0 w-full h-full object-contain mix-blend-multiply opacity-90 scale-110"
                    src={imageUrl}
                    alt={product.product_name}
                />
                {/* We use inline styles to mimic the gradient from the stitch CSS */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(247, 250, 245, 0) 0%, #f7faf5 100%)' }}></div>

                <div className="relative z-10 flex flex-col items-center text-center px-6 mt-40">
                    <span className="text-on-surface-variant font-label text-sm uppercase tracking-[0.2em] mb-4 bg-white/50 backdrop-blur-md px-4 py-1 rounded-full">
                        {categoryStr}
                    </span>
                    <h2 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface mb-2 drop-shadow-md">
                        {product.product_name || 'Unnamed Product'}
                    </h2>
                    <p className="font-headline text-xl text-primary font-semibold mix-blend-darken bg-white/40 px-3 rounded-md">
                        {product.brands ? product.brands.split(',')[0] : 'Unknown Brand'}
                    </p>
                </div>
            </section>

            {/* Content Canvas */}
            <div className="max-w-6xl mx-auto relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">

                {/* Left Column: Ingredients & Info */}
                <div className="lg:col-span-7 space-y-8">

                    {/* Health Labels & Nutrition Grade */}
                    <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm flex flex-wrap items-center justify-between gap-6">
                        <div className="flex flex-wrap gap-3">
                            {isVegan && (
                                <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full font-label text-xs font-black uppercase tracking-wider border border-emerald-200 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">potted_plant</span>
                                    100% Vegan
                                </span>
                            )}
                            {isGlutenFree && (
                                <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full font-label text-xs font-black uppercase tracking-wider border border-amber-200 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">eco</span>
                                    Gluten Free
                                </span>
                            )}
                            {labels.length > 0 ? (
                                labels.map((lbl, idx) => (
                                    <span key={idx} className="px-4 py-2 bg-primary-container text-on-primary-container rounded-full font-label text-xs font-bold uppercase tracking-wider">
                                        {lbl.trim()}
                                    </span>
                                ))
                            ) : (!isVegan && !isGlutenFree && (
                                <span className="px-4 py-2 bg-surface-variant text-on-surface-variant rounded-full font-label text-xs font-bold uppercase tracking-wider">
                                    No Labels Available
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest font-bold">Nutri-Score</p>
                                <p className="text-primary font-headline text-lg font-extrabold">Grade</p>
                            </div>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-headline text-4xl font-black shadow-lg ${nutritionGrade === 'A' ? 'bg-nutrition-a' :
                                nutritionGrade === 'B' ? 'bg-nutrition-b' :
                                    nutritionGrade === 'C' ? 'bg-nutrition-c' :
                                        nutritionGrade === 'D' ? 'bg-nutrition-d' :
                                            nutritionGrade === 'E' ? 'bg-nutrition-e' : 'bg-gray-400'
                                }`}>
                                {nutritionGrade}
                            </div>
                        </div>
                    </div>

                    {/* Description & Ingredients */}
                    <div className="bg-surface-container-low p-8 rounded-[2rem] space-y-6">
                        <h3 className="font-headline text-2xl font-bold tracking-tight">The Alchemist's Notes</h3>
                        <p className="text-on-surface-variant leading-relaxed font-body">
                            {product.generic_name || "No detailed description available for this product item from the database."}
                        </p>
                        <hr className="border-outline-variant/15" />
                        <div className="space-y-3">
                            <h4 className="font-label text-xs uppercase tracking-widest font-bold text-on-surface-variant">Ingredients List</h4>
                            <p className="text-on-surface font-body leading-loose">
                                {product.ingredients_text || "The ingredients list is currently unavailable."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Nutritional Table Box */}
                <div className="lg:col-span-5 pb-8">
                    <div className="bg-surface-container-highest p-8 rounded-[2rem] sticky top-28">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h3 className="font-headline text-3xl font-bold tracking-tight">Nutrition</h3>
                                <p className="text-on-surface-variant font-label text-xs">Values per 100g / 100ml</p>
                            </div>
                            <span className="material-symbols-outlined text-primary text-3xl">analytics</span>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center py-4 border-b border-outline-variant/10">
                                <span className="font-body font-medium text-on-surface">Energy</span>
                                <span className="font-headline font-bold text-on-surface">{energy} kcal</span>
                            </div>
                            <div className="flex justify-between items-center py-4 border-b border-outline-variant/10">
                                <div className="flex flex-col">
                                    <span className="font-body font-medium text-on-surface">Total Fat</span>
                                    <span className="text-[10px] text-on-surface-variant uppercase font-bold">Of which saturated</span>
                                </div>
                                <div className="text-right">
                                    <span className="block font-headline font-bold text-on-surface">{fat}g</span>
                                    <span className="block text-xs text-on-surface-variant">{saturatedFat}g</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-4 border-b border-outline-variant/10">
                                <div className="flex flex-col">
                                    <span className="font-body font-medium text-on-surface">Carbohydrates</span>
                                    <span className="text-[10px] text-on-surface-variant uppercase font-bold">Of which sugars</span>
                                </div>
                                <div className="text-right">
                                    <span className="block font-headline font-bold text-on-surface">{carbs}g</span>
                                    <span className="block text-xs text-primary font-bold">{sugars}g</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-4 border-b border-outline-variant/10">
                                <span className="font-body font-medium text-on-surface">Fibre</span>
                                <span className="font-headline font-bold text-on-surface">{fiber}g</span>
                            </div>
                            <div className="flex justify-between items-center py-4 border-b border-outline-variant/10">
                                <span className="font-body font-medium text-on-surface">Proteins</span>
                                <span className="font-headline font-bold text-on-surface">{proteins}g</span>
                            </div>
                            <div className="flex justify-between items-center py-4">
                                <span className="font-body font-medium text-on-surface">Salt</span>
                                <span className="font-headline font-bold text-on-surface">{salt}g</span>
                            </div>
                        </div>

                        {/* Calling the Add To Cart function exported from context */}
                        <button
                            onClick={handleAddToCart}
                            className={`w-full mt-8 py-4 rounded-xl font-headline font-bold text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${isAdded ? 'bg-emerald-100 text-emerald-800 shadow-emerald-100/50' : 'bg-gradient-to-r from-primary to-primary-dim text-white shadow-primary/10 hover:shadow-primary/20'}`}
                        >
                            <span className="material-symbols-outlined">
                                {isAdded ? 'task_alt' : 'add_shopping_cart'}
                            </span>
                            {isAdded ? 'Added to Discovery Log' : 'Add to Daily Log'}
                        </button>

                        {isAdded && (
                            <Link
                                to="/cart"
                                className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-primary hover:underline animate-fade-in"
                            >
                                View your Log
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
