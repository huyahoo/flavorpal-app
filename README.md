# FlavorPal 🍜🌿

**Your Smart Companion for Navigating Goods Finds!**

FlavorPal is a progressive web application designed to help you make informed and delightful food choice, particularly travelers and adventurous eaters, remember their impressions of grocery products and make informed purchasing decisions. It combines a personal product review database with AI-driven ingredient insights tailored to individual health profiles. Whether you're tracking dietary needs, curious about ingredients, or want to remember your culinary experiences, FlavorPal is here to assist.

# 

**Version:** Flavor Pal v1.1.3 (May 31, 2025)

## Overview

Ever found yourself puzzled by an ingredient list or wondering if a new snack fits your health goals? FlavorPal empowers you to:

* **Scan & Learn:** Quickly scan product barcodes (or input them manually) to fetch product details.
* **Photo Capture:** Photo-based product identification
* **Personalized Health Insights:** Get AI-driven summaries and conclusions about products based on their ingredients and *your* personalized dietary flags (e.g., allergies, preferences like "low-sugar").
* **Review & Remember:** Log your own taste experiences with star ratings and detailed notes. Never forget that amazing snack or the one you'd rather avoid!
* **Track Your Journey:** All your scanned and reviewed items are saved in a comprehensive history, filterable by review status, date, and more.
* **Discover & Share:** See what other FlavorPal users are reviewing in a dynamic "Discover" feed. Like reviews and get inspired for your next shopping trip.
* **Gamified Experience:** Earn badges for your food explorations and accumulate "TastePoints" which can be (conceptually) converted into rewards.

FlavorPal aims to make grocery shopping more transparent, personalized, and fun!

## Key Features

* **📱 PWA (Progressive Web App):** Installable on your device for an app-like experience without browser toolbars.
* **🔍 Barcode Scanning:** (Integrated with Open Food Facts via your backend) Instantly retrieve product information.
* **✍️ Manual Barcode Input:** Fallback for when scanning isn't possible or fails.
* **🔍 Photo Capture:** Can't find product through barcode, there is another option help you to identify product.
* **🤖 AI-Powered Health Insights:** Get quick summaries tailored to *your* health profile.
* **📸 Ingredient Photo Analysis (In-Progress):** Upload or take a photo of an ingredient list to get enhanced AI insights.
* **⭐ User Reviews & Ratings:** Keep a personal log of your opinions on products.
* **📜 Comprehensive History:** Easily find previously scanned or reviewed items.
* **🌍 Discover Feed:** See what other users are reviewing and liking.
* **👤 Personalized Account:**
    * Manage your display name and email.
    * Set and update your dietary health flags.
    * View earned badges.
    * Track and (conceptually) convert TastePoints.
* **🔐 Secure Authentication:** JWT-based login and registration.

## Technology Stack

* **Frontend:** Vue.js 3 with Vite, Pinia for state management, Vue Router, and Tailwind CSS for styling.
* **Backend:** FastAPI (Python), Supabase (BaaS), PostgreSQL.
* **AI Engine:** Open AI
* **Deployment:** Frontend designed as a PWA, deployable on platforms like Netlify or Surge.sh. Backend is Dockerized.

## Getting Started

*(This section would typically include instructions on how to set up and run the project locally, for both frontend and backend.)*

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/huyahoo/flavorpal-app.git](https://github.com/huyahoo/flavorpal-app.git)
    cd flavorpal-app
    ```
2.  **Backend Setup:**
    * Navigate to the [backend](backend) directory.
    * Follow instructions in [backend/README.md](backend/README.md).
3.  **Frontend Setup:**
    * Navigate to the [frontend](frontend) directory.
    * Follow instructions in [frontend/README.md](frontend/README.md).
4.  **AI Engine Setup:**
    * Navigate to the [aiengine-cloudflare](aiengine-cloudflare) directory.
    * Follow instructions in [aiengine-cloudflare/README.md](aiengine-cloudflare/README.md).
  
### Running FE, BE in local
Make sure you have Docker installed.

```bash
cd flavorpal-app
docker compose up --build -d
```

## Backup branch
### Infra Production-ready Version
- Checkout branch `dev/infra`
```bash
git checkout dev/infra
```

### Supabase Cloud
- Checkot branch `dev/backend-supabasecloud`
```bash
git checkout dev/backend-supabasecloud
```

## Credits

This application is under development by a team for the **内定者Hack U 2025** hackathon from [LINE Yahoo](https://www.lycorp.co.jp/ja/).

---

Thank you for checking out FlavorPal!
