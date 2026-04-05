// src/App.jsx
// This is the root component of our application where we define routes.
// Routes map a specific URL path (like '/' or '/product/123') to a specific React component.

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import CartPage from './pages/CartPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';

// We define our application's layout and pages here.
function App() {
  return (
    // The Routes component looks through all its 'Route' children and renders the first one that matches the current URL.
    <Routes>
      {/* 
        The top-level Route determines what component wraps the inner pages.
        Here, we use a 'Layout' component that might contain our Header and Sidebar.
        The layout is persistent across page changes.
      */}
      <Route path="/" element={<Layout />}>
        {/* The 'index' route tells React to render HomePage when the user visits the root URL '/' */}
        <Route index element={<HomePage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="history" element={<HistoryPage />} />

        {/*
          This route captures dynamic URLs using the ':barcode' parameter.
          If the URL is '/product/737628064502', the ProductDetailsPage component
          will be able to read "737628064502" from the URL parameters.
        */}
        <Route path="product/:barcode" element={<ProductDetailsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
