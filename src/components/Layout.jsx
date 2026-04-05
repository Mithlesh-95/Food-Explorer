import React, { useState, useCallback } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import Scanner from './Scanner.jsx';
import { useCart } from '../context/CartContext.jsx';

// We define our layout function component
const Layout = () => {
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems } = useCart();

    // Effect to close drawer and profile whenever the route changes
    React.useEffect(() => {
        setIsDrawerOpen(false);
        setIsProfileOpen(false);
    }, [location.pathname]);

    const isHome = location.pathname === '/';
    const isCategories = location.pathname === '/categories';
    const isCart = location.pathname === '/cart';

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // The function that is triggered when the Live Camera successfully scans a barcode
    const handleSuccessfulScan = useCallback((decodedText) => {
        setIsScannerOpen(false);
        navigate(`/product/${decodedText}`);
    }, [navigate]);

    return (
        // The div wrapper uses Tailwind classes to set base background, text color, and full width/height
        <div className="bg-background text-on-surface font-body min-h-screen selection:bg-primary-container relative">

            <header className="fixed top-0 w-full z-50 bg-[#f7faf5]/80 backdrop-blur-xl flex justify-between items-center px-6 py-4 border-b border-outline-variant/10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            setIsDrawerOpen(true);
                            setIsProfileOpen(false);
                        }}
                        className="hover:bg-emerald-100/50 transition-colors p-2 rounded-full active:scale-95 duration-200"
                    >
                        {/* We render a material icon here */}
                        <span className="material-symbols-outlined text-emerald-800">menu</span>
                    </button>

                    {/* Main Title of the application */}
                    {/* Link lets the user click the title to return home */}
                    <Link to="/">
                        <h1 className="text-emerald-900 font-extrabold tracking-tighter font-headline text-2xl">
                            Food Explorer
                        </h1>
                    </Link>
                </div>

                {/* User profile picture container on the right side */}
                <div className="flex items-center gap-4 relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={`w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border transition-all duration-300 ${isProfileOpen ? 'border-primary ring-4 ring-primary/10' : 'border-outline-variant/15 hover:border-primary/50'}`}
                    >
                        <img
                            alt="Profile"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2cscWzIVEwTfXJv6OJBB2tgAd7SvehWy3p7r5n8mE9LV0sCs5XA4TTwFTxWPVMNmcYCwsTwdYyAkx70KTNlNbCGIJjMUlrcy6n6_EReX4Wu2LJJ917cxLsO_YiHqibPyMosUH_M-i6rT9ySsrGNFCGAy4uDKn-Uof7d-PVjz15Yha92zDUV4F819f7Ph5soKkdnHSy54JHBILi4L86L_l8m6sh8ubvSPS94MVu0YxHlbB91a_2PLFH0bmrhodBFvkh4i8JASoSag"
                        />
                    </button>

                    {/* Profile Dropdown Overlay */}
                    {isProfileOpen && (
                        <>
                            {/* Transparent backdrop that catches clicks "anywhere" to close the menu */}
                            <div
                                className="fixed inset-0 z-40 bg-black/[0.02]"
                                onClick={() => setIsProfileOpen(false)}
                            ></div>
                            <div className="absolute top-14 right-0 w-64 bg-surface-container-lowest rounded-[2rem] shadow-2xl border border-outline-variant/20 py-4 z-50 animate-fade-in shadow-emerald-900/5">
                                <div className="px-6 py-4 border-b border-outline-variant/10 mb-2">
                                    <p className="font-headline font-bold text-on-surface">Alex Discoverer</p>
                                    <p className="text-xs text-on-surface-variant">alex@foodexplorer.ai</p>
                                </div>
                                <div className="px-2">
                                    <button className="w-full flex items-center gap-4 px-4 py-3 hover:bg-surface-container-low rounded-2xl transition-colors text-sm font-medium text-on-surface">
                                        <span className="material-symbols-outlined text-primary">person</span>
                                        Profile Settings
                                    </button>
                                    <Link
                                        to="/history"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-surface-container-low rounded-2xl transition-colors text-sm font-medium text-on-surface"
                                    >
                                        <span className="material-symbols-outlined text-primary">history</span>
                                        Scan History
                                    </Link>
                                    <hr className="my-2 border-outline-variant/10 mx-4" />
                                    <button className="w-full flex items-center gap-4 px-4 py-3 hover:bg-error/5 text-error rounded-2xl transition-colors text-sm font-bold">
                                        <span className="material-symbols-outlined">logout</span>
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </header>

            {/* Side Drawer Component */}
            {isDrawerOpen && (
                <>
                    {/* Drawer Backdrop */}
                    <div
                        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm animate-fade-in"
                        onClick={() => setIsDrawerOpen(false)}
                    ></div>

                    {/* Drawer Content */}
                    <div className="fixed top-0 left-0 bottom-0 w-[80%] max-w-[320px] bg-white z-[70] shadow-2xl rounded-r-[2.5rem] p-8 flex flex-col animate-slide-in-left">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="font-headline font-extrabold text-2xl text-emerald-900 tracking-tighter">Food Explorer</h2>
                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className="w-10 h-10 bg-surface-variant/50 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="flex-1 space-y-2">
                            <Link
                                to="/"
                                onClick={() => setIsDrawerOpen(false)}
                                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isHome ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                            >
                                <span className="material-symbols-outlined">home</span>
                                <span className="font-bold">Home Discovery</span>
                            </Link>
                            <Link
                                to="/categories"
                                onClick={() => setIsDrawerOpen(false)}
                                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isCategories ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                            >
                                <span className="material-symbols-outlined">grid_view</span>
                                <span className="font-bold">Categories</span>
                            </Link>
                            <Link
                                to="/cart"
                                onClick={() => setIsDrawerOpen(false)}
                                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isCart ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                            >
                                <span className="material-symbols-outlined">inventory_2</span>
                                <span className="font-bold">Daily Log</span>
                            </Link>
                        </div>

                        <div className="mt-8">
                            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-on-surface-variant/50 px-4 mb-4">Quick Filter</p>
                            <div className="space-y-1">
                                {[
                                    { name: 'Beverages', id: 'en:beverages', icon: 'local_drink' },
                                    { name: 'Snacks', id: 'en:snacks', icon: 'cookie' },
                                    { name: 'Dairy', id: 'en:dairies', icon: 'egg' },
                                    { name: 'Chocolates', id: 'en:chocolates', icon: 'bakery_dining' }
                                ].map(cat => (
                                    <Link
                                        key={cat.id}
                                        to={`/?category=${cat.id}`}
                                        onClick={() => setIsDrawerOpen(false)}
                                        className="flex items-center gap-4 p-4 rounded-2xl text-on-surface-variant hover:bg-emerald-50 hover:text-emerald-900 transition-all text-sm font-medium"
                                    >
                                        <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto pt-8 border-t border-outline-variant/10">
                            <div className="bg-surface-container-low p-6 rounded-3xl">
                                <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-2">About App</p>
                                <p className="text-xs text-on-surface-variant leading-relaxed">
                                    Version 1.0.4<br />
                                    Built for premium food discovery using OpenFoodFacts API.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
                <Outlet />
            </main>

            {/* 
        This is the fixed bottom navigation bar menu.
        Like the header, it uses 'fixed bottom-0' to stick to the base of the screen.
      */}
            <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-8 pt-4 bg-[#f7faf5]/90 backdrop-blur-2xl z-50 rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">

                {/* Home Button Navigation link */}
                <Link to="/" className={`flex flex-col items-center justify-center rounded-2xl px-6 py-2 transition-all active:scale-90 duration-300 ${isHome ? 'bg-emerald-100 text-emerald-900' : 'text-emerald-700/50 hover:text-emerald-900'}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: isHome ? "'FILL' 1" : "" }}>home</span>
                    <span className="font-body text-[11px] font-semibold uppercase tracking-wider mt-1">Home</span>
                </Link>

                {/* Categories Button Navigation link */}
                <Link to="/categories" className={`flex flex-col items-center justify-center px-6 py-2 transition-all active:scale-90 duration-300 ${isCategories ? 'bg-emerald-100 text-emerald-900 rounded-2xl' : 'text-emerald-700/50 hover:text-emerald-900'}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: isCategories ? "'FILL' 1" : "" }}>grid_view</span>
                    <span className="font-body text-[11px] font-semibold uppercase tracking-wider mt-1">Categories</span>
                </Link>

                {/* Log (Cart) Button Navigation link */}
                <Link to="/cart" className={`flex flex-col items-center justify-center px-6 py-2 transition-all active:scale-90 duration-300 relative ${isCart ? 'bg-emerald-100 text-emerald-900 rounded-2xl' : 'text-emerald-700/50 hover:text-emerald-900'}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: isCart ? "'FILL' 1" : "" }}>inventory_2</span>
                    {cartCount > 0 && (
                        <span className="absolute top-2 right-4 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                            {cartCount}
                        </span>
                    )}
                    <span className="font-body text-[11px] font-semibold uppercase tracking-wider mt-1">Log</span>
                </Link>

                {/* Scanner Modal Trigger Button */}
                <button onClick={() => setIsScannerOpen(true)} className="flex flex-col items-center justify-center text-emerald-700/50 px-6 py-2 hover:text-emerald-900 active:scale-90 transition-transform duration-300">
                    <span className="material-symbols-outlined">barcode_scanner</span>
                    <span className="font-body text-[11px] font-semibold uppercase tracking-wider mt-1">Scanner</span>
                </button>
            </nav>

            {/* 
        This is the Simulated Barcode Scanner Overlay! 
        It sits at the very z-axis top of the app using z-[100] and covers the screen.
      */}
            {isScannerOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-fade-in">
                    <div className="bg-surface-container-lowest w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative border border-outline-variant/20 flex flex-col items-center">
                        <button onClick={() => setIsScannerOpen(false)} className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-2 bg-surface-variant rounded-full active:scale-95 transition-all text-sm leading-none flex items-center justify-center">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                        </button>

                        <div className="w-16 h-16 bg-primary-container text-primary rounded-2xl flex items-center justify-center mb-4 mt-2 shadow-inner">
                            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>qr_code_scanner</span>
                        </div>

                        <h2 className="font-headline font-bold text-2xl text-on-surface mb-2 text-center">Live Scanner</h2>
                        <p className="text-on-surface-variant text-center text-sm mb-6 px-4">
                            Point your camera at a product barcode to automatically discover its details.
                        </p>

                        {/* 
                          We embed our Live Scanner Component here. 
                        */}
                        <div className="w-full min-h-[300px] mb-6">
                            <Scanner onScanSuccess={handleSuccessfulScan} />
                        </div>

                        {/* Manual Entry Fallback */}
                        <div className="w-full border-t border-outline-variant/10 pt-6">
                            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest text-center mb-4">
                                Having trouble scanning?
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const val = e.target.barcode.value.trim();
                                    if (val) handleSuccessfulScan(val);
                                }}
                                className="flex gap-2"
                            >
                                <input
                                    name="barcode"
                                    type="text"
                                    placeholder="Enter barcode manually..."
                                    className="flex-1 bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                                <button
                                    type="submit"
                                    className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
                                >
                                    Go
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default Layout;
