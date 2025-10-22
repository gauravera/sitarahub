"use client";

import React, { useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Heart, ShoppingCart, Zap } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/priceUtils";
import { motion } from "framer-motion";
import { toast } from "react-toastify"; // --- ADDED ---

// Create a motion-enabled Link component
const MotionLink = motion(Link);

interface Product {
  id: number;
  title: string;
  price: number;
  discountedPrice?: number;
  discountPercent?: number;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const inWishlist = isInWishlist(product.id);

  // --- Derived State (Memoized) ---
  const discountPercent = useMemo(
    () =>
      product.discountPercent ||
      (product.discountedPrice !== undefined
        ? Math.round(
            ((product.price - product.discountedPrice) / product.price) * 100
          )
        : 0),
    [product.discountPercent, product.discountedPrice, product.price]
  );

  // --- UPDATED: Memoized for consistency ---
  const displayPrice = useMemo(
    () =>
      product.discountedPrice !== undefined
        ? product.discountedPrice
        : product.price,
    [product.discountedPrice, product.price]
  );

  const cartItem = useMemo(
    () => ({
      id: product.id,
      title: product.title,
      price: product.price,
      discountedPrice: displayPrice,
      discountPercent: discountPercent,
      image: product.image,
    }),
    // --- UPDATED: More granular dependencies ---
    [
      product.id,
      product.title,
      product.price,
      product.image,
      displayPrice,
      discountPercent,
    ]
  );

  // --- Animation Variants ---
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const imageVariants = {
    hover: { scale: 1.1, transition: { duration: 0.3 } },
  };

  // --- Optimized Event Handlers (Memoized) ---
  const handleWishlistToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (inWishlist) {
        removeFromWishlist(product.id);
        // --- ADDED: Toast notification ---
        toast.info(
          `${product.title.substring(0, 20)}... removed from wishlist.`,
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
      } // ...
      else {
        addToWishlist(product.id);
        toast.success(
          `${product.title.substring(0, 20)}... added to wishlist!`,
          {
            position: "top-right",
            autoClose: 2000,
            theme: "colored",
          }
        );
      }
      // ...
    },
    // --- UPDATED: Added `product` to dependencies ---
    [
      inWishlist,
      addToWishlist,
      removeFromWishlist,
      product, // Pass the whole product
    ]
  );

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart(cartItem);
      // --- ADDED: Toast notification ---
      toast.success(`${product.title.substring(0, 20)}... added to cart!`, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    },
    // --- UPDATED: Added `product.title` for toast ---
    [addToCart, cartItem, product.title]
  );

  const handleBuyNow = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart(cartItem);
      navigate("/cart");
    },
    [addToCart, cartItem, navigate]
  );

  return (
    <MotionLink
      to={`/product/${product.id}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="block h-full"
      aria-label={`View details for ${product.title}`}
    >
      <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all hover:border-primary/30 group h-full flex flex-col">
        {/* --- IMAGE CONTAINER --- */}
        <motion.div
          className="relative w-full h-48 bg-white overflow-hidden"
          variants={imageVariants}
          whileHover="hover"
        >
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-contain p-4"
          />

          {/* --- DISCOUNT PERCENTAGE CIRCLE (Top-Left) --- */}
          {discountPercent > 0 && (
            <motion.div
              className="absolute top-3 left-3 bg-red-500 text-white rounded-full w-14 h-14 flex items-center justify-center font-bold text-sm shadow-lg z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              aria-hidden="true"
            >
              -{discountPercent}%
            </motion.div>
          )}

          {/* --- WISHLIST BUTTON (Top-Right) --- */}
          <motion.button
            onClick={handleWishlistToggle}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute top-3 right-3 p-2 rounded-lg transition-colors z-10 ${
              inWishlist
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground hover:bg-border"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart size={20} fill={inWishlist ? "currentColor" : "none"} />
          </motion.button>
        </motion.div>

        {/* --- CONTENT CONTAINER --- */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-card-foreground line-clamp-2 mb-2 text-sm group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* --- RATING --- */}
          <div
            className="flex items-center gap-2 mb-3"
            aria-label={`Rating: ${product.rating.rate.toFixed(
              1
            )} out of 5 stars with ${product.rating.count} reviews`}
          >
            <div className="flex items-center gap-1" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.round(product.rating.rate)
                      ? "fill-accent text-accent"
                      : "text-border"
                  }
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.rating.count})
            </span>
          </div>

          {/* --- PRICE DISPLAY (Discounted Price + Original Price) --- */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              {discountPercent > 0 && (
                <p className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </p>
              )}
              <p className="text-primary font-bold text-xl">
                {formatPrice(displayPrice)}
              </p>
            </div>
          </div>

          {/* --- ACTIONS (Always Visible, pushed to bottom) --- */}
          <div className="flex gap-2 mt-auto">
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
              aria-label={`Add ${product.title} to cart`}
            >
              <ShoppingCart size={16} />
              Add
            </motion.button>
            <motion.button
              onClick={handleBuyNow}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium text-sm"
              aria-label={`Buy ${product.title} now`}
            >
              <Zap size={16} />
              Buy
            </motion.button>
          </div>
        </div>
      </div>
    </MotionLink>
  );
}
