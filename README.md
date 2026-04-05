# Food Product Explorer

## Overview
This is a web application built as an assignment to explore food products using the OpenFoodFacts API. 

## Features Implemented
- **Homepage:** Lists food products fetched from the OpenFoodFacts API using infinite scroll.
- **Search (Name):** Allows searching specific products by typing their name in the Hero search bar.
- **Search (Barcode):** By switching to Barcode mode, users can input a barcode and directly navigate to the product detail page.
- **Category Filter:** Clicking on a category chip (e.g., Beverages) filters the API results in real-time.
- **Sorting:** Allows sorting products by Name (A-Z) or Nutri-score.
- **Product Details:** A separate page (`/product/:barcode`) showing the high-resolution image, ingredients, explicit nutritional value tables, and health labels (like Vegan, Gluten-free).
- **Cart Context (Bonus):** A global state was built using the native React Context API (no external libraries) allowing users to add an item to their cart from the detail page, maintaining it in `localStorage`.

## Method & Architecture
This application primarily uses:
- **ReactJS (Vite framework):** A fast modern React ecosystem. 
- **Tailwind CSS:** Used exclusively for styling to keep a utility-first methodology. It integrates directly with standard CSS files.
- **React Router DOM:** Handling client-side routing between the Home Page and the Details Page without page reloading.
- **React Context API:** Handles application state (specifically the Cart) seamlessly across all child components globally.
- **Native Fetch API:** All API interaction with OpenFoodFacts is handled cleanly using asynchronous `fetch()` calls. 

### Why this Tech Stack?
- **Vite & React:** Faster hot-module reloading and native ES Module support compared to Create React App.
- **Context API vs Redux:** Redux can be overkill for a very simple cart state. The Context API paired with `useReducer` or `useState` is far more scalable and standard for small-to-medium size assignments.
- **Native Fetch:** Avoids unnecessarily bloating the `node_modules` with libraries like Axios when the browser's native capabilities are sufficient.

## Time Taken
Approximate completion time: **3-4 hours**, mainly optimizing the seamless CSS grid representations, structuring the dynamic routing, and perfecting the fetch algorithms to map OpenFoodFacts data keys securely.

## How to Run Locally
1. Ensure Node.js is installed.
2. In the project directory, run:
   ```bash
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173`.
