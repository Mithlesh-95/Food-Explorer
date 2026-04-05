// src/context/CartContext.jsx
// This file sets up a global state management system using React's built-in Context API.
// Without Context, we would have to pass cart data as "props" through every component (prop drilling).
// The Context API allows any component in the app to access the cart directly.

import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Create the Context
// This creates an empty "container" for our cart data.
// We can import this context in other files to read the data.
export const CartContext = createContext();

// 2. Create a Custom Hook
// We create a helper function useCart() so that components don't have to import useContext AND CartContext.
// They can just do: const { cart, addToCart } = useCart();
export const useCart = () => {
    return useContext(CartContext);
};

// 3. Create the Provider Component
// This component will wrap our entire application (usually inside main.jsx or App.jsx).
// Any component inside this wrapper will have access to the Context.
export const CartProvider = ({ children }) => {
    // We use useState to keep track of the items in the cart.
    // Initially, we check localStorage to see if there's saved cart data from a previous session.
    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem('foodExplorerCart');
            if (savedCart) {
                return JSON.parse(savedCart); // Convert string back to a JavaScript array
            }
        } catch (error) {
            console.error("Error reading cart from localStorage", error);
        }
        return []; // Start with an empty array if nothing is saved
    });

    // useEffect watches the cartItems array. Whenever it changes, this function runs.
    // This automatically saves the cart to the browser's localStorage whenever an item is added or removed.
    useEffect(() => {
        localStorage.setItem('foodExplorerCart', JSON.stringify(cartItems));
    }, [cartItems]);

    /**
     * Adds a product to the cart. If the item is already there, it increases the quantity.
     * @param {Object} product - The product object fetched from the API.
     */
    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const productId = product.id || product.code;
            const existingItem = prevItems.find(item => (item.id || item.code) === productId);

            if (existingItem) {
                return prevItems.map(item =>
                    (item.id || item.code) === productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    /**
     * Decreases the quantity of a product in the cart. If quantity reaches 0, removes it.
     * @param {string} productId - The product id or barcode.
     */
    const decrementQuantity = (productId) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => (item.id || item.code) === productId);

            if (existingItem && existingItem.quantity > 1) {
                return prevItems.map(item =>
                    (item.id || item.code) === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            }

            // If quantity is 1, remove the item
            return prevItems.filter(item => (item.id || item.code) !== productId);
        });
    };

    /**
     * Removes an item entirely from the cart, based on its barcode.
     * @param {string} productId - The product barcode.
     */
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => (item.id || item.code) !== productId));
    };

    /**
     * Clears all items from the cart.
     */
    const clearCart = () => {
        setCartItems([]);
    };

    // We expose specific values and functions to the rest of the app through the 'value' prop
    return (
        <CartContext.Provider value={{ cartItems, addToCart, decrementQuantity, removeFromCart, clearCart }}>
            {/* 'children' represents all the nested components inside this Provider */}
            {children}
        </CartContext.Provider>
    );
};
