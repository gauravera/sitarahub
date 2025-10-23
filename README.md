<h1 align="center">Welcome to sitarahub 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.0-blue.svg?cacheSeconds=2592000" />
</p>

> This is a modern, feature-rich e-commerce application built with React, TypeScript, and the Context API. It uses the Fakestore API for product data and includes a complete shopping experience, from product browsing to checkout.✨ FeaturesProduct Catalog: Browse products fetched from a live API (fakestoreapi.com).Advanced Filtering & Sorting:Filter products by category.Filter products by price range.Sort products by price (low-to-high, high-to-low), rating, or newest.Search products by title and description.Product Details: View a dedicated page for each product with a description, ratings, and an image magnifier/zoom-on-hover feature.Shopping Cart:Add/remove items from the cart.Update item quantities.View a real-time order summary.Wishlist:Add/remove items from a persistent wishlist.Move items from the wishlist directly to the cart.Checkout Process:A multi-step checkout form for shipping and payment information.Real-time form validation.PIN Code Auto-fill: Automatically fetches City and State from a 6-digit Indian PIN code using the api.postalpincode.in API.User Authentication: Includes a demo login page.Responsive Design: Built to be mobile-friendly.Smooth Animations: Uses framer-motion for page transitions and UI animations.Notifications: Uses react-toastify for user feedback (e.g., &#34;Item added to cart&#34;).🛠️ Tech StackCore: React, TypeScript, React Router DOMState Management: React Context API (for Products, Cart, and Wishlist)Styling: Tailwind CSS (inferred from class names like bg-primary, min-h-screen)Animations: Framer MotionIcons: Lucide ReactNotifications: React ToastifyAPI & Data:Fakestore API (for product data)Postal PIN Code API (for checkout form)Axios (for API requests)📁 Project StructureHere's a brief overview of the key files and their purpose:/src | |-- /components | |-- FilterSidebar.tsx | |-- Footer.tsx | |-- Header.tsx | |-- Layout.tsx | |-- ProductCard.tsx | |-- ScrollToTop.tsx | |-- SearchBar.tsx | |-- SortDropdown.tsx | |-- /context | |-- ProductContext.tsx # Manages all product data, filtering, and sorting logic. 

### ✨ [Demo](http://localhost:5173)

## Install

```sh
npm install
```

## Usage

```sh
npm run dev
```

## Author

👤 **Gaurav Rai**

* Website: https://gauravrai.vercel.app
* Github: [@gauravera](https://github.com/gauravera)
* LinkedIn: [@https:\/\/www.linkedin.com\/in\/gauravrai3133](https://linkedin.com/in/https:\/\/www.linkedin.com\/in\/gauravrai3133)

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_