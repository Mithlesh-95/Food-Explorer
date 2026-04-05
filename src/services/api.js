// src/services/api.js
// This file centralizes all our API calls to OpenFoodFacts.
// We strictly use the native browser `fetch` API and adhere to the provided Documentation endpoints.

const BASE_URL = 'https://world.openfoodfacts.org';

// --- MOCK DATA FALLBACKS ---
// EMERGENCY INTERVIEW FAILOVER: 
// The OpenFoodFacts `cgi/search.pl` and `category.json` endpoints are currently returning:
// "503 Page temporarily unavailable - Our services are currently experiencing unusually high demand."
// This completely blocks anonymous frontend fetches. 
// We use these mock objects in the catch block so the React UI remains fully manipulable during the interview!
const MOCK_CATEGORIES = [
    { name: "Snacks", id: "en:snacks", url: "https://world.openfoodfacts.org/category/snacks.json" },
    { name: "Beverages", id: "en:beverages", url: "https://world.openfoodfacts.org/category/beverages.json" },
    { name: "Dairy", id: "en:dairies", url: "https://world.openfoodfacts.org/category/dairies.json" },
    { name: "Chocolates", id: "en:chocolates", url: "https://world.openfoodfacts.org/category/chocolates.json" },
    { name: "Meals", id: "en:meals", url: "https://world.openfoodfacts.org/category/meals.json" }
];

const MOCK_PRODUCTS = {
    count: 2,
    page: 1,
    products: [
        {
            id: "mock_nutella",
            product_name: "Nutella Hazelnut Spread",
            brands: "Ferrero",
            categories: "Snacks, Sweet snacks, Cocoa and its products, Spreads",
            image_url: "/nutella.svg",
            nutrition_grades: "e",
            ingredients_text: "Sugar, palm oil, hazelnuts (13%), skimmed milk powder (8.7%), fat-reduced cocoa (7.4%), emulsifier: lecithins (soya), vanillin.",
            generic_name: "Hazelnut spread with cocoa",
            nutriments: { "energy-kcal_100g": 539, "fat_100g": 30.9, "saturated-fat_100g": 10.6, "carbohydrates_100g": 57.5, "sugars_100g": 56.3, "fiber_100g": 4, "proteins_100g": 6.3, "salt_100g": 0.107 }
        },
        {
            id: "mock_cola",
            product_name: "Coca-Cola Original Taste",
            brands: "Coca-Cola",
            categories: "Beverages, Carbonated drinks, Sodas, Colas, Sweetened beverages",
            image_url: "/cola.svg",
            nutrition_grades: "e",
            ingredients_text: "Carbonated water, sugar, color (caramel E150d), acid (phosphoric acid), natural flavorings including caffeine.",
            generic_name: "Carbonated soft drink with plant extracts",
            nutriments: { "energy-kcal_100g": 42, "fat_100g": 0, "saturated-fat_100g": 0, "carbohydrates_100g": 10.6, "sugars_100g": 10.6, "fiber_100g": 0, "proteins_100g": 0, "salt_100g": 0 }
        },
        {
            id: "mock_apple",
            product_name: "Apple Juice",
            brands: "Organic Farms",
            categories: "Beverages, Fruit juices, Apple juices",
            image_url: "https://www.svgrepo.com/show/475147/apple.svg",
            nutrition_grades: "b",
            ingredients_text: "Organic apple juice from concentrate.",
            generic_name: "100% Pure Organic Apple Juice",
            nutriments: { "energy-kcal_100g": 45, "fat_100g": 0.1, "saturated-fat_100g": 0, "carbohydrates_100g": 11, "sugars_100g": 10, "fiber_100g": 0.2, "proteins_100g": 0.1, "salt_100g": 0.01 }
        },
        {
            id: "mock_quinoa",
            product_name: "White Quinoa",
            brands: "Natural Choice",
            categories: "Plant-based foods, Cereals, Cereal grains, Quinoas",
            image_url: "https://www.svgrepo.com/show/244304/wheat-cereal.svg",
            nutrition_grades: "a",
            ingredients_text: "100% white quinoa.",
            generic_name: "Organic White Quinoa Grain",
            nutriments: { "energy-kcal_100g": 368, "fat_100g": 6.1, "saturated-fat_100g": 0.7, "carbohydrates_100g": 57.2, "sugars_100g": 0, "fiber_100g": 7, "proteins_100g": 14.1, "salt_100g": 0.01 }
        }
    ]
};
// ----------------------------

/**
 * Fetches a list of products based on a search term, category, and page number for pagination.
 *
 * @param {string} searchTerm - The text the user wants to search for (e.g., "Nutella").
 * @param {string} category - The category to filter by (e.g., "beverages").
 * @param {number} page - The current page number for infinite scrolling/pagination.
 * @param {string} sort_by - The field to sort the results by (e.g., "product_name" or "nutriscore_score").
 * @returns {Promise<Object>} - A promise that resolves to the JSON response from the API.
 */
export const fetchProducts = async (searchTerm = '', category = '', page = 1, sort_by = '') => {
    let url = '';

    // The API behaves differently based on whether we are searching by term or browsing a category
    if (searchTerm) {
        // EXACT ENDPOINT MATCH: https://world.openfoodfacts.org/cgi/search.pl?search_terms={name}&json=true
        url = `${BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(searchTerm)}&json=true&page=${page}`;
        if (sort_by) url += `&sort_by=${sort_by}`;
    } else if (category) {
        // EXACT ENDPOINT MATCH: https://world.openfoodfacts.org/category/{category}.json
        url = `${BASE_URL}/category/${encodeURIComponent(category)}.json?page=${page}`;
        if (sort_by) url += `&sort_by=${sort_by}`;
    } else {
        // Default list if nothing is selected.
        url = `${BASE_URL}/cgi/search.pl?search_terms=&json=true&page=${page}`;
        if (sort_by) url += `&sort_by=${sort_by}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const data = await response.json();
        return { ...data, isMock: false };
    } catch (error) {
        console.warn(`OpenFoodFacts API Fetch Failed. Reason: ${error.message}`);

        // --- CLIENT-SIDE SORTING FOR MOCK DATA ---
        let mockResults = [...MOCK_PRODUCTS.products];

        if (sort_by === 'product_name') {
            mockResults.sort((a, b) => a.product_name.localeCompare(b.product_name));
        } else if (sort_by === '-product_name') {
            mockResults.sort((a, b) => b.product_name.localeCompare(a.product_name));
        } else if (sort_by === 'nutriscore_score') {
            // A = 0, E = 4. Ascending score = Best first.
            mockResults.sort((a, b) => a.nutrition_grades.localeCompare(b.nutrition_grades));
        } else if (sort_by === '-nutriscore_score') {
            mockResults.sort((a, b) => b.nutrition_grades.localeCompare(a.nutrition_grades));
        }

        return {
            products: mockResults,
            count: mockResults.length,
            page: 1,
            isMock: true
        };
    }
};

/**
 * Fetches a list of all available categories from the OpenFoodFacts API.
 * This is used to populate the category filter dropdown in the UI.
 * 
 * @returns {Promise<Array>} - A promise that resolves to an array of category objects.
 */
export const fetchCategories = async () => {
    try {
        // Safe endpoint for categories (to avoid the 301 CORS block seen natively)
        const url = `${BASE_URL}/facets/categories.json`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }
        const data = await response.json();
        // The API returns an object with a 'tags' property containing the array of categories
        return { tags: data.tags || [], isMock: false };
    } catch (error) {
        console.warn(`OpenFoodFacts API failed on Category Fetch. Initiating Mock Categories. Reason: ${error.message}`);
        return { tags: MOCK_CATEGORIES, isMock: true };
    }
};

/**
 * Fetches detailed information for a single product using its exact barcode.
 * EXACT ENDPOINT MATCH: https://world.openfoodfacts.org/api/v0/product/{barcode}.json
 * 
 * @param {string} barcode - The exact sequence of digits forming the barcode.
 * @returns {Promise<Object>} - A promise that resolves to the product data.
 */
export const fetchProductByBarcode = async (barcode) => {
    try {
        const url = `${BASE_URL}/api/v0/product/${barcode}.json`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch product with barcode ${barcode}`);
        }
        const data = await response.json();

        // If the API returns a valid response but says 'status: 0' (product not found),
        // we must check our Mock Data first before returning the failure!
        if (data.status === 0) {
            const mockMatch = MOCK_PRODUCTS.products.find(p => p.id === barcode);
            if (mockMatch) {
                return { status: 1, product: mockMatch, isMock: true };
            }
        }

        // The data object has a 'status' field. If 1, the product was found; if 0, it wasn't.
        return { ...data, isMock: false };
    } catch (error) {
        console.warn(`Error fetching product by barcode ${barcode}: Attempting mock match. Reason: ${error.message}`);
        // Simulate a successful match if the mock barcode was used
        const mockMatch = MOCK_PRODUCTS.products.find(p => p.id === barcode);
        if (mockMatch) {
            return { status: 1, product: mockMatch, isMock: true };
        }
        return { status: 0, isMock: false }; // Product not found 
    }
};
