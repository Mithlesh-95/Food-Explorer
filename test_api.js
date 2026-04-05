const BASE_URL = 'https://world.openfoodfacts.org';

async function test() {
    // 1. Search Empty
    const url1 = `${BASE_URL}/cgi/search.pl?search_terms=&json=true&page=1`;
    const res1 = await fetch(url1);
    const data1 = await res1.json();
    console.log("Empty Search Products Count:", data1.products ? data1.products.length : "NO PRODUCTS ARRAY", typeof data1.products);

    // 2. Categories List
    const url2 = `${BASE_URL}/facets/categories.json`;
    const res2 = await fetch(url2);
    const data2 = await res2.json();
    console.log("Categories Count:", data2.tags ? data2.tags.length : "NO TAGS ARRAY");
}

test();
