// src/pages/CartPage.jsx
import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

const CartPage = () => {
    const { cartItems, addToCart, decrementQuantity, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();

    // Calculate totals
    const totalCalories = cartItems.reduce((acc, item) => {
        const kcal = item.nutriments?.['energy-kcal_100g'] || 0;
        return acc + (kcal * item.quantity);
    }, 0);

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    if (cartItems.length === 0) {
        return (
            <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mb-6 text-on-surface-variant/40">
                    <span className="material-symbols-outlined text-5xl">inventory_2</span>
                </div>
                <h2 className="font-headline font-bold text-3xl text-on-surface mb-2">Your log is empty</h2>
                <p className="text-on-surface-variant max-w-sm mb-8">
                    You haven't added any ingredients to your daily discovery log yet.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-headline font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95"
                >
                    Start Exploring
                </button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in pb-20">
            <header className="mb-10">
                <h2 className="font-headline font-extrabold text-4xl md:text-5xl tracking-tight text-on-surface mb-2">
                    Daily <span className="text-primary italic">Discovery Log</span>
                </h2>
                <p className="text-on-surface-variant font-medium">
                    Manage your tracked ingredients and view your nutritional summary.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Cart Items List */}
                <div className="lg:col-span-8 space-y-4">
                    {cartItems.map((item) => {
                        const id = item.id || item.code;
                        const kcalPer100g = item.nutriments?.['energy-kcal_100g'] || 0;

                        return (
                            <div
                                key={id}
                                className="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
                            >
                                <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden flex-shrink-0 border border-outline-variant/10 p-2">
                                    <img
                                        src={item.image_url || 'https://via.placeholder.com/150'}
                                        alt={item.product_name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-headline font-bold text-lg text-on-surface truncate">
                                        {item.product_name || 'Unnamed Product'}
                                    </h3>
                                    <p className="text-on-surface-variant text-sm truncate uppercase tracking-wider font-label text-[10px] font-bold">
                                        {item.brands || 'Unknown Brand'}
                                    </p>
                                    <p className="text-primary font-bold text-sm mt-1">
                                        {kcalPer100g} kcal / 100g
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 bg-surface-container-high rounded-2xl p-1">
                                    <button
                                        onClick={() => decrementQuantity(id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">remove</span>
                                    </button>
                                    <span className="font-headline font-bold min-w-[1.5rem] text-center">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => addToCart(item)}
                                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">add</span>
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeFromCart(id)}
                                    className="p-2 text-on-surface-variant hover:text-error transition-colors"
                                >
                                    <span className="material-symbols-outlined">delete_outline</span>
                                </button>
                            </div>
                        );
                    })}

                    <div className="pt-4">
                        <button
                            onClick={clearCart}
                            className="text-on-surface-variant hover:text-on-surface font-label text-xs font-bold uppercase tracking-widest flex items-center gap-2 group"
                        >
                            <span className="material-symbols-outlined text-lg group-hover:rotate-90 transition-transform">refresh</span>
                            Clear Entire Log
                        </button>
                    </div>
                </div>

                {/* Right: Summary Card */}
                <div className="lg:col-span-4 sticky top-28">
                    <div className="bg-surface-container-highest p-8 rounded-[2.5rem] shadow-sm border border-outline-variant/10">
                        <h3 className="font-headline text-2xl font-bold mb-6">Log Summary</h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-on-surface-variant">
                                <span>Unique Ingredients</span>
                                <span className="font-bold">{cartItems.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-on-surface-variant">
                                <span>Total Items</span>
                                <span className="font-bold">{totalItems}</span>
                            </div>
                            <hr className="border-outline-variant/10" />
                            <div className="flex justify-between items-end pt-2">
                                <div>
                                    <p className="text-on-surface-variant font-label text-[10px] uppercase font-bold tracking-widest">Total Energy</p>
                                    <h4 className="font-headline text-4xl font-extrabold text-primary">
                                        {Math.round(totalCalories)}
                                    </h4>
                                </div>
                                <span className="text-primary font-bold mb-1">kcal</span>
                            </div>
                        </div>

                        <button className="w-full bg-primary text-white py-4 rounded-2xl font-headline font-bold text-lg shadow-xl shadow-primary/10 hover:shadow-primary/20 active:scale-95 transition-all mb-4">
                            Export Analysis
                        </button>
                        <p className="text-[10px] text-on-surface-variant text-center px-4 font-body leading-relaxed">
                            *Calorie calculation is an approximation based on 100g servings for each item in your log.
                        </p>
                    </div>

                    <div className="mt-6 p-6 bg-primary/5 rounded-3xl border border-primary/10">
                        <div className="flex items-start gap-4">
                            <span className="material-symbols-outlined text-primary">lightbulb</span>
                            <div>
                                <h4 className="text-sm font-bold text-on-surface mb-1">Daily Insight</h4>
                                <p className="text-xs text-on-surface-variant">
                                    You have discovered 3 categories today. Try adding a fruit to balance your energy!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
