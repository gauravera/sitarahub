"use client";

import { useNavigate } from "react-router-dom";
import React, { useCallback, useMemo } from "react";
import {
  Star,
  Heart,
  ShoppingCart,
  Zap,
  Trash2,
  Minus,
  Plus,
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/priceUtils";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useProductDiscount } from "../hooks/useProductDiscount"; 
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

  const { addToCart, decreaseQuantity, removeFromCart, getItemQuantity } =
    useCart();

  const navigate = useNavigate();
  const inWishlist = isInWishlist(product.id);

  const quantity = getItemQuantity(product.id);

  const { discountPercent, savedAmount, displayPrice } = useProductDiscount(
    product.id,
    product.price
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
    [
      product.id,
      product.title,
      product.price,
      product.image,
      displayPrice,
      discountPercent,
    ]
  );

  const imageVariants = {
    hover: { scale: 1.1, transition: { duration: 0.3 } },
  };

  const handleNavigate = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigate(`/product/${product.id}`);
    },
    [navigate, product.id]
  );

  const handleWishlistToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (inWishlist) {
        removeFromWishlist(product.id);
        toast.info(
          `${product.title.substring(0, 20)}... removed from wishlist.`,
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
      } else {
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
    },
    [inWishlist, addToWishlist, removeFromWishlist, product]
  );

  const handleIncrease = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart(cartItem);
      if (quantity === 0) {
        toast.success(`${product.title.substring(0, 20)}... added to cart!`, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
    },
    [addToCart, cartItem, product.title, quantity]
  );

  const handleDecrease = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      decreaseQuantity(product.id);
    },
    [decreaseQuantity, product.id]
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      removeFromCart(product.id);
      toast.error(`${product.title.substring(0, 20)}... removed from cart.`, {
        position: "top-right",
        autoClose: 2000,
      });
    },
    [removeFromCart, product.id, product.title]
  );

  const handleBuyNow = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (quantity === 0) {
        addToCart(cartItem);
      }
      navigate("/cart");
    },
    [addToCart, cartItem, navigate, quantity]
  );

  return (
    <motion.div
      transition={{ type: "spring", stiffness: 300 }}
      className="block h-full"
    >
      <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all hover:border-primary/30 group h-full flex flex-col">
        {/* --- MODIFIED: Changed from motion.div to div, removed variants/whileHover --- */}
        <div
          className="relative w-full h-48 bg-white overflow-hidden cursor-pointer"
          onClick={handleNavigate}
        >
          {/* --- MODIFIED: Changed from img to motion.img, added variants/whileHover --- */}
          <motion.img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-contain p-4"
            variants={imageVariants}
            whileHover="hover"
          />

          {/* This now uses the correct discountPercent */}
          {discountPercent > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-md">
              -{discountPercent}%
            </div>
          )}

          <motion.button
            onClick={handleWishlistToggle}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute top-2 right-2 p-2 rounded-full transition-colors shadow-sm ${
              inWishlist
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
          </motion.button>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3
            className="font-semibold text-card-foreground line-clamp-2 mb-2 text-sm group-hover:text-primary transition-colors cursor-pointer"
            onClick={handleNavigate}
          >
            {product.title}
          </h3>

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

          {/* 💰 PRICE SECTION (Now uses the hook's values) */}
          <div className="mb-4">
            {discountPercent > 0 ? (
              <>
                <p className="text-primary font-bold text-lg">
                  {formatPrice(displayPrice)}
                </p>
                <div className="flex items-baseline gap-2 text-sm">
                  <span className="text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-green-600 font-semibold">
                    Save {formatPrice(savedAmount)}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-primary font-bold text-lg">
                {formatPrice(product.price)}
              </p>
            )}
          </div>

          {/* --- ACTIONS --- */}
          <div className="flex gap-2 mt-auto">
            {quantity === 0 ? (
              <motion.button
                onClick={handleIncrease}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                aria-label={`Add ${product.title} to cart`}
              >
                <ShoppingCart size={16} />
                Add
              </motion.button>
            ) : (
              <div className="flex-1 flex items-center justify-between gap-1 px-2 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm">
                {quantity === 1 ? (
                  <motion.button
                    onClick={handleRemove}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="rounded-md hover:bg-primary/70"
                    aria-label={`Remove ${product.title} from cart`}
                  >
                    <Trash2 size={14} />
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleDecrease}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="rounded-md hover:bg-primary/70"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </motion.button>
                )}

                <motion.span
                  key={quantity}
                  initial={{ opacity: 0.5, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className="font-bold text-sm w-6 text-center"
                  aria-live="polite"
                >
                  {quantity}
                </motion.span>

                <motion.button
                  onClick={handleIncrease}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="rounded-md hover:bg-primary/70"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </motion.button>
              </div>
            )}

            <motion.button
              onClick={handleBuyNow}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium text-sm"
              aria-label={`Buy ${product.title} now`}
            >
              <Zap size={16} />
              Buy Now
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
