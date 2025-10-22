"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
// --- UPDATED ---
// Import both Cart and Wishlist contexts
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext"; // Assuming this is the path
// ---
import { Star, ShoppingCart, ArrowLeft, Heart } from "lucide-react";
import { formatPrice, calculateDiscount } from "../lib/priceUtils";
import { toast } from "react-toastify";
import { getProductById } from "../lib/api";
import type { ApiProduct } from "../lib/api";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // --- UPDATED ---
  // Import cart and wishlist functions
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // --- UPDATED ---
  // Favorite state is now derived directly from the wishlist context
const isFavorite = product
  ? (wishlist as unknown as ApiProduct[]).some(
      (item: ApiProduct) => item.id === product.id
    )
  : false;
  // ---

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // --- UPDATED: Professional Cart Logic ---
  const handleAddToCart = () => {
    if (product) {
      const discount = calculateDiscount(product.price);

      // Create a single item object with the correct quantity
      // This is the standard pattern for e-commerce
      const itemToAdd = {
        id: product.id,
        title: product.title,
        price: product.price,
        discountedPrice: discount.finalPrice,
        discountPercent: discount.percent,
        image: product.image,
        quantity: quantity, // Pass the selected quantity
        // Also pass other useful info
        category: product.category,
        rating: product.rating,
      };

      // Pass this single item to your CartContext
      // NOTE: Your CartContext's addToCart function must be updated to handle this
      addToCart(itemToAdd);

      toast.success(
        // Updated toast to be more descriptive
        `${quantity} x ${product.title.substring(0, 20)}... added to cart!`,
        {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        }
      );

      setQuantity(1); // Reset quantity after adding
    }
  };

  // --- NEW: Wishlist Handler ---
  const handleToggleWishlist = () => {
    if (!product) return;

    if (isFavorite) {
      removeFromWishlist(product.id);
      toast.info(
        `${product.title.substring(0, 20)}... removed from wishlist.`,
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    } else {
      // Pass the full product object to the wishlist
      addToWishlist(product);
      toast.success(`${product.title.substring(0, 20)}... added to wishlist!`, {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="inline-block rounded-full h-16 w-16 border-4 border-border border-t-primary mb-6"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Link to="/" className="text-primary hover:underline font-medium">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const discount = calculateDiscount(product.price);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            to="/"
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 font-medium w-fit"
          >
            <ArrowLeft size={20} />
            Back to Products
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Panel */}
          <motion.div
            // --- UPDATED ---
            // Using aspect-square is cleaner and more responsive than h-96
            className="flex items-center justify-center bg-card border border-border rounded-xl p-8 aspect-square"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-full object-contain"
            />
          </motion.div>

          {/* Details Panel */}
          <motion.div
            // --- UPDATED ---
            // Removed justify-between to let content flow, will push actions down
            className="flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Top Section */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4 capitalize">
                    {product.category}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                    {product.title}
                  </h1>
                </div>

                {/* --- UPDATED: Wishlist Button --- */}
                <motion.button
                  onClick={handleToggleWishlist}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  // Using a more premium, subtle style for the "on" state
                  className={`p-3 rounded-lg transition-colors ${
                    isFavorite
                      ? "bg-accent/20 text-accent"
                      : "bg-muted text-muted-foreground hover:bg-border"
                  }`}
                  aria-label={
                    isFavorite ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <Heart
                    size={24}
                    fill={isFavorite ? "currentColor" : "none"}
                  />
                </motion.button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < Math.round(product.rating.rate)
                            ? "fill-accent text-accent"
                            : "text-border"
                        }
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-foreground">
                    {product.rating.rate}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  ({product.rating.count} reviews)
                </span>
              </div>

              {/* Price */}
              <motion.div
                className="mb-6 bg-muted/50 p-4 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-baseline gap-3 mb-2">
                  <p className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </p>
                  <span className="bg-accent text-accent-foreground text-sm font-bold px-2 py-1 rounded">
                    -{discount.percent}%
                  </span>
                </div>
                <p className="text-4xl font-bold text-primary mb-2">
                  {formatPrice(discount.finalPrice)}
                </p>
                <p className="text-sm text-accent font-semibold">
                  You save {formatPrice(discount.amount)}
                </p>
              </motion.div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  Description
                </h2>
                {/* --- UPDATED: Fixed HTML tag --- */}
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Bottom Section (Actions) */}
            <motion.div
              // --- UPDATED ---
              // mt-auto pushes this block to the bottom of the flex column
              className="space-y-4 mt-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-4">
                {/* --- UPDATED: Quantity Selector --- */}
                <div className="flex items-center border border-border rounded-lg">
                  <motion.button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 hover:bg-muted transition-colors rounded-l-lg"
                    aria-label="Decrease quantity"
                  >
                    -
                  </motion.button>
                  <span className="px-6 py-2 font-semibold" aria-live="polite">
                    {quantity}
                  </span>
                  <motion.button
                    onClick={() => setQuantity(quantity + 1)}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 hover:bg-muted transition-colors rounded-r-lg"
                    aria-label="Increase quantity"
                  >
                    +
                  </motion.button>
                </div>
                <span className="text-sm text-muted-foreground">In Stock</span>
              </div>

              {/* Add to Cart Button */}
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary text-primary-foreground py-4 rounded-lg hover:bg-primary/90 transition-all font-semibold flex items-center justify-center gap-2 text-lg"
              >
                <ShoppingCart size={24} />
                Add to Cart
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
