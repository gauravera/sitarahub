# 🛍️ Modern E-Commerce Store (React, TypeScript, Context API)

This is a **modern, feature-rich e-commerce application** built with **React**, **TypeScript**, and the **Context API**. It provides a complete, smooth shopping experience, from product browsing to a multi-step checkout.

The application leverages external APIs like the **Fakestore API** for product data and the **Postal PIN Code API** for a smart checkout experience.

---

## ✨ Features

### 🛒 Core Shopping Experience
* **Product Catalog**: Browse products fetched from a live API (`fakestoreapi.com`).
* **Product Details**: Dedicated page for each product with a description, ratings, and an **image magnifier/zoom-on-hover** feature.
* **Shopping Cart**: Add/remove items, update quantities, and view a real-time order summary.
* **Wishlist**: Persistent storage for favorite items with the ability to move them directly to the cart.

### ⚙️ Advanced Functionality
* **Advanced Filtering & Sorting**:
    * Filter products by **category** and **price range**.
    * Sort products by **price** (low-to-high, high-to-low), **rating**, or **newest** arrival.
    * Search products by title and description.
* **Checkout Process**:
    * A multi-step form for shipping and payment information with **real-time validation**.
    * **PIN Code Auto-fill**: Automatically fetches City and State from a 6-digit Indian PIN code using the `api.postalpincode.in` API.
* **User Authentication**: Includes a demo login page.

### 🎨 UI & User Experience
* **Responsive Design**: Built to be mobile-friendly.
* **Smooth Animations**: Uses **Framer Motion** for page transitions and engaging UI animations.
* **Notifications**: Uses `react-toastify` for clear user feedback (e.g., "Item added to cart").

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Core** | React, TypeScript, React Router DOM | Frontend Framework & Type Safety |
| **State Management** | React Context API | Centralized state for Products, Cart, and Wishlist |
| **Styling** | **Tailwind CSS** | Utility-first CSS framework for rapid styling |
| **Animations** | Framer Motion | Smooth and declarative UI animations |
| **Notifications** | React Toastify | Non-blocking user alerts |
| **API & Data** | Axios, Fakestore API, Postal PIN Code API | HTTP client and external data sources |
| **Icons** | Lucide React | Modern and accessible icon set |

---

## 🚀 Getting Started

To get a local copy of the project up and running, follow these simple steps.

### Prerequisites

* **Node.js** (v16 or later)
* **npm** or **yarn**

### Installation

1.  Clone the repository:
    ```bash
    git clone [[https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)]
    ```
2.  Navigate to the project directory:
    ```bash
    cd your-repo-name
    ```
3.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the App

Start the development server:

```bash
npm run dev
# or
yarn dev


Open http://localhost:5173 (or your specified port) in your browser to view the application.
