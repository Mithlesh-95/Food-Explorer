import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HistoryPage = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        // Load history from localStorage
        const savedHistory = JSON.parse(localStorage.getItem('scanHistory') || '[]');
        // Sort by timestamp descending (newest first)
        setHistory(savedHistory.sort((a, b) => b.timestamp - a.timestamp));
    }, []);

    const clearHistory = () => {
        if (window.confirm("Are you sure you want to clear your scan history?")) {
            localStorage.setItem('scanHistory', '[]');
            setHistory([]);
        }
    };

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6 animate-fade-in">
                <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mb-6 text-on-surface-variant/30">
                    <span className="material-symbols-outlined text-5xl">history</span>
                </div>
                <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">No History Yet</h2>
                <p className="text-on-surface-variant max-w-xs mb-8">
                    Items you scan with the barcode scanner will appear here for quick access.
                </p>
                <Link to="/" className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                    Start Exploring
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-fade-in max-w-4xl mx-auto pb-12">
            <header className="flex items-center justify-between mb-10">
                <div>
                    <h2 className="font-headline text-4xl font-extrabold text-emerald-900 tracking-tighter">Scan History</h2>
                    <p className="text-on-surface-variant text-sm mt-1">Re-visit your recent discoveries</p>
                </div>
                <button
                    onClick={clearHistory}
                    className="flex items-center gap-2 text-error text-xs font-bold uppercase tracking-widest hover:bg-error/5 px-4 py-2 rounded-full transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">delete_sweep</span>
                    Clear All
                </button>
            </header>

            <div className="grid gap-4">
                {history.map((item, idx) => (
                    <Link
                        key={`${item.barcode}-${item.timestamp}`}
                        to={`/product/${item.barcode}`}
                        className="group flex items-center gap-4 bg-white p-4 rounded-3xl border border-outline-variant/10 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all animate-slide-in-left"
                        style={{ animationDelay: `${idx * 50}ms` }}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-surface-container-low overflow-hidden flex-shrink-0 border border-outline-variant/5">
                            <img
                                src={item.image || 'https://via.placeholder.com/150'}
                                alt={item.name}
                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-headline font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                                {item.name || 'Unknown Product'}
                            </h4>
                            <p className="text-xs text-on-surface-variant truncate opacity-70">
                                {item.brand || 'No brand info'} • {item.barcode}
                            </p>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1 opacity-50">Scanned</p>
                            <p className="text-xs font-medium text-on-surface capitalize">
                                {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant/20 group-hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default HistoryPage;
