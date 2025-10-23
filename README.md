React E-Commerce Store

This is a modern, feature-rich e-commerce application built with React, TypeScript, and the Context API. It uses the Fakestore API for product data and includes a complete shopping experience, from product browsing to checkout.✨ FeaturesProduct Catalog: Browse products fetched from a live API (fakestoreapi.com).Advanced Filtering & Sorting:Filter products by category.Filter products by price range.Sort products by price (low-to-high, high-to-low), rating, or newest.Search products by title and description.Product Details: View a dedicated page for each product with a description, ratings, and an image magnifier/zoom-on-hover feature.Shopping Cart:Add/remove items from the cart.Update item quantities.View a real-time order summary.Wishlist:Add/remove items from a persistent wishlist.Move items from the wishlist directly to the cart.Checkout Process:A multi-step checkout form for shipping and payment information.Real-time form validation.PIN Code Auto-fill: Automatically fetches City and State from a 6-digit Indian PIN code using the api.postalpincode.in API.User Authentication: Includes a demo login page.Responsive Design: Built to be mobile-friendly.Smooth Animations: Uses framer-motion for page transitions and UI animations.Notifications: Uses react-toastify for user feedback (e.g., "Item added to cart").🛠️ Tech StackCore: React, TypeScript, React Router DOMState Management: React Context API (for Products, Cart, and Wishlist)Styling: Tailwind CSS (inferred from class names like bg-primary, min-h-screen)Animations: Framer MotionIcons: Lucide ReactNotifications: React ToastifyAPI & Data:Fakestore API (for product data)Postal PIN Code API (for checkout form)Axios (for API requests)📁 Project StructureHere's a brief overview of the key files and their purpose:/src
|
|-- /components
|   |-- FilterSidebar.tsx
|   |-- Footer.tsx
|   |-- Header.tsx
|   |-- Layout.tsx
|   |-- ProductCard.tsx
|   |-- ScrollToTop.tsx
|   |-- SearchBar.tsx
|   |-- SortDropdown.tsx
|
|-- /context
|   |-- ProductContext.tsx  # Manages all product data, filtering, and sorting logic.
|   |-- CartContext.tsx     # Manages all shopping cart state and actions.
|   |-- WishlistContext.tsx # Manages all wishlist state and actions.
|
|-- /hooks

|-- /lib (or /utils)
|   |-- api.ts              # Handles all external API calls (Fakestore, Postal PIN).
|   |-- priceUtils.ts       # (Inferred) Utility functions for formatting currency.

|-- /pages
|   |-- Home.tsx            # Main product listing page with filters.
|   |-- ProductDetail.tsx   # Detailed view for a single product.
|   |-- Cart.tsx            # Shopping cart page.
|   |-- Wishlist.tsx        # Wishlist page.
|   |-- Checkout.tsx        # Checkout form page.
|   |-- Login.tsx           # Demo login page.
|
-- App.tsx                 # Main app component, sets up routes and providers.

🚀 Getting Started
To get a local copy up and running, follow these simple steps.PrerequisitesNode.js (v16 or later)npm or yarnInstallationClone the repository:git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)

Navigate to the project directory:cd your-repo-name
Install dependencies:npm install
# or
yarn install
Running the AppStart the development server:npm run dev
# or
yarn dev
Open http://localhost:5173 (or your specified port) in your browser to see the application.
