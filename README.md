# 🥗 Food Explorer

**A Premium Food Discovery & Nutrition Tracking Application**

> **Time Taken:** 5 Days  
> **Repository:** [https://github.com/Mithlesh-95/Food-Explorer.git](https://github.com/Mithlesh-95/Food-Explorer.git)

---

## 🚀 Project Overview
Food Explorer is a high-performance React application designed to help users discover detailed nutritional information about food products through an intuitive barcode scanning interface. Built as a technical assignment, it emphasizes **robust real-world API integration**, **advanced camera lifecycle management**, and a **premium, glassmorphism-inspired UI/UX**.

## ✨ Key Features

### 🔍 Live Barcode Scanner
- **Direct Implementation:** Uses `@zxing/library` for high-speed, direct-to-video barcode detection.
- **Robust Hardware Control:** Custom-built manual stream management ensures the camera hardware is **immediately released** upon scan success or modal closure, preventing "camera-still-on" issues common in standard libraries.
- **Initialization Watchdog:** A 10-second timeout guard prevents UI hangs during hardware initialization.
- **Manual Fallback:** A text-entry fallback ensures the app remains usable even if the user's camera has poor focus or lighting.

### 🍱 Product Discovery & Details
- **OpenFoodFacts Integration:** Real-time data fetching for over 1M+ products.
- **Intelligent Fallback:** A "Demo Mode" automatically activates when the external API is unreachable, providing high-quality mock data so the app remains fully functional for reviewers.
- **Nutritional Grading:** Visual Nutri-Score indicators (A-E) for quick health assessment.

### 🛒 Daily Log (Cart System)
- **Real-time Tracking:** Quantities and nutritional totals update instantly as items are added.
- **Persistence:** All log data is saved to `localStorage`, ensuring user data survives page refreshes.

### 📜 Scan History
- **Automatic Logging:** Every product viewed or scanned is added to a persistent "Scan History," allowing users to re-visit findings without re-scanning.

### 💎 Premium UI/UX
- **Modern Aesthetics:** Tailored HSL color palettes, glassmorphism headers, and smooth Tailwind animations (`scan-line`, `slide-in`, `fade-in`).
- **Responsive Design:** A mobile-first approach that scales beautifully to tablet and desktop.
- **Interactive Navigation:** Global bottom bar and a functional hamburger side-drawer.

---

## 🛠️ Technology Stack
- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS
- **Barcode Decoding:** `@zxing/library`
- **Routing:** React Router v6
- **State Management:** Context API (Cart & History)
- **Icons:** Google Material Symbols
- **API:** OpenFoodFacts JSON API

---

## ⚙️ Installation & Running

### 1. Clone the repository
```bash
git clone https://github.com/Mithlesh-95/Food-Explorer.git
cd food-explorer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

---

## 🧠 Design Decisions & Technical Challenges

### 1. Why ZXing over native browser libs?
Standard libraries like `html5-qrcode` often handle the camera stream internally, leading to race conditions where the camera light stays on after the component unmounts. I chose a **direct-to-video** approach with `@zxing/library` to gain absolute control over the `MediaStream` object. This allowed for explicit track termination in the React `useEffect` cleanup.

### 2. Resilience via Demo Mode
APIs like OpenFoodFacts can sometimes be slow or rate-limited. I implemented the `isMock` flag architecture in the API service. If a fetch fails, the app doesn't break; instead, it seamlessly transitions into a polished "Demo Mode" with a visible banner, ensuring the interviewer can always see the app's potential.

### 3. Navigation & Context
Using the **Context API** for the Cart/Log was a deliberate choice over heavier libraries like Redux. It provides clean, performant state sharing for this specific use case without adding unnecessary boilerplate or bundle size.

---
