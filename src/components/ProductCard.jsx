// src/components/ProductCard.jsx
// This component is responsible for displaying a single food item in our grid.
// It receives a "product" object via props, which contains all the data fetched from the OpenFoodFacts API.

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    // We calculate the nutrition grade color automatically.
    // The API gives us grades like 'a', 'b', 'c', 'd', 'e'. If it's missing or 'unknown', we map it to '?'.
    const rawGrade = product?.nutrition_grades?.toLowerCase();
    const isValidGrade = ['a', 'b', 'c', 'd', 'e'].includes(rawGrade);
    const nutritionGrade = isValidGrade ? rawGrade : '?';

    // A helper function to map the grade to our custom Tailwind colors (nutrition-a, nutrition-b, etc.)
    const getGradeColor = (grade) => {
        switch (grade) {
            case 'a': return 'bg-nutrition-a text-white';
            case 'b': return 'bg-nutrition-b text-white';
            case 'c': return 'bg-nutrition-c text-black';
            case 'd': return 'bg-nutrition-d text-white';
            case 'e': return 'bg-nutrition-e text-white';
            default: return 'bg-gray-300 text-gray-700'; // fallback
        }
    };

    // We assign a default image if the product doesn't have an 'image_url' to prevent broken UI if external placeholder links fail.
    const imageUrl = product.image_url || 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22300%22%20style%3D%22background%3A%23eee%22%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%23999%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';

    // We display energy in kcal. The API usually provides this inside nutriments.energy-kcal_100g.
    const energy = product.nutriments ? product.nutriments['energy-kcal_100g'] : null;

    return (
        <article className="bg-surface-container-low rounded-xl overflow-hidden flex flex-col group hover:translate-y-[-4px] transition-transform duration-300">

            {/* 
                This div is the square box for the image. 'aspect-square' forces it to be a perfect square.
                'relative' is needed so the absolute positioned Nutrition Grade badge sits correctly in the corner.
            */}
            <Link
                to={`/product/${product.id || product.code}`}
                className="aspect-square bg-white flex items-center justify-center p-8 overflow-hidden relative"
            >
                <img
                    alt={product.product_name || "Unknown Product"}
                    /* The image scales up (scale-110) smoothly when hovering over the card, achieving a premium feel. */
                    className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-110 duration-500"
                    src={imageUrl}
                />

                {/* 
                    Nutrition Grade Badge (A, B, C, D, E, or ?). 
                    It's absolutely positioned at the top-right (top-4 right-4).
                */}
                <div className={`absolute top-4 right-4 z-10 ${getGradeColor(nutritionGrade)} w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm uppercase`}>
                    {nutritionGrade}
                </div>
            </Link>

            {/* This is the bottom text section of the card */}
            <div className="p-6 flex flex-col flex-1">
                {/* Displays product category nicely styled as a faint label. We'll show the main category or a fallback. */}
                <span className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest mb-2 line-clamp-1 opacity-70">
                    {product.categories ? product.categories.split(',')[0] : 'Generic Category'}
                </span>

                {/* Product Name. We wrap it in a Link as well. */}
                <Link to={`/product/${product.id || product.code}`}>
                    <h3 className="font-headline font-bold text-xl text-on-surface mb-4 line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                        {product.product_name || "Unnamed Product"}
                    </h3>
                </Link>

                {/* The footer row of the card (Energy stats and Details button) pushed to bottom using mt-auto */}
                <div className="mt-auto pt-4 flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-tighter">Energy (100g)</span>
                        <span className="text-sm font-bold">{energy !== undefined && energy !== null ? `${energy} kcal` : 'N/A'}</span>
                    </div>

                    {/* Actions: Info link and Add to Cart button */}
                    <div className="flex items-center gap-3">
                        <Link to={`/product/${product.id || product.code}`} className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors bg-surface-container rounded-xl">
                            <span className="material-symbols-outlined text-xl">visibility</span>
                        </Link>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                addToCart(product);
                            }}
                            className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90 transition-all hover:bg-primary-dim"
                        >
                            <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
