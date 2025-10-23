"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
// --- 1. IMPORT useProducts ---
import { useProducts } from "../context/ProductContext";
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  Heart,
  Minus,
  Plus,
} from "lucide-react";
import { formatPrice } from "../lib/priceUtils";
import { toast } from "react-toastify";
import { getProductById } from "../lib/api";
import type { ApiProduct } from "../lib/api";
import { useProductDiscount } from "../hooks/useProductDiscount";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  // --- 2. GET PRODUCTS AND LOADING STATE FROM CONTEXT ---
  const { products, loading: contextLoading } = useProducts();

  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isFavorite = product ? wishlist.includes(product.id) : false;

  // This is correct: it passes the USD price to the hook
  const { discountPercent, savedAmount, displayPrice } = useProductDiscount(
    product?.id,
    product?.price
  );

  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLaptopView, setIsLaptopView] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLaptopView(window.innerWidth >= 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // --- 3. UPDATED FETCH LOGIC ---
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    // Function to handle fetching
    const loadProduct = async () => {
      // Wait for the context to finish loading
      if (!contextLoading) {
        const productId = Number(id);

        // 1. Try to find the product in context
        const productFromContext = products.find((p) => p.id === productId);

        if (productFromContext) {
          // 2. Found it! Set from context.
          setProduct(productFromContext);
          setLoading(false);
        } else {
          // 3. Not in context (e.g., direct page load), so fetch it.
          console.warn(
            `Product ${id} not found in context. Fetching individually.`
          );
          try {
            const data = await getProductById(id);
            setProduct(data);
          } catch (error) {
            console.error("Failed to fetch product:", error);
          } finally {
            setLoading(false);
          }
        }
      }
    };

    loadProduct();
    // This effect now runs when the 'id' changes OR when the context finishes loading
  }, [id, products, contextLoading]);

  // This is correct: it passes USD prices to the cart context
  const handleAddToCart = useCallback(() => {
    if (product) {
      const itemBase = {
        id: product.id,
        title: product.title,
        price: product.price, // Original USD Price
        discountedPrice: displayPrice, // Discounted USD Price
        discountPercent: discountPercent,
        image: product.image,
      };

      addToCart(itemBase, quantity);

      toast.success(
        `${quantity} x ${product.title.substring(0, 20)}... added to cart!`,
        {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        }
      );

      setQuantity(1);
      navigate("/cart");
    }
  }, [product, quantity, addToCart, displayPrice, discountPercent, navigate]);

  const handleToggleWishlist = useCallback(() => {
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
      addToWishlist(product.id);
      toast.success(`${product.title.substring(0, 20)}... added to wishlist!`, {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    }
  }, [product, isFavorite, addToWishlist, removeFromWishlist]);

  const handleMouseEnter = () => {
    if (isLaptopView) setIsHovering(true);
  };
  const handleMouseLeave = () => {
    if (isLaptopView) setIsHovering(false);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (imageRef.current && isLaptopView) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    }
  };

  const ZOOM_LEVEL = 2.5;
  const MAGNIFIER_WIDTH = 700;
  const MAGNIFIER_HEIGHT = 530;

  const getMagnifiedStyle = () => {
    if (!imageRef.current) return {};

    const imgWidth = imageRef.current.offsetWidth;
    const imgHeight = imageRef.current.offsetHeight;

    const largeImageWidth = imgWidth * ZOOM_LEVEL;
    const largeImageHeight = imgHeight * ZOOM_LEVEL;

    const translateX = -mousePosition.x * ZOOM_LEVEL + MAGNIFIER_WIDTH / 2;
    const translateY = -mousePosition.y * ZOOM_LEVEL + MAGNIFIER_HEIGHT / 2;

    const minTranslateX = -(largeImageWidth - MAGNIFIER_WIDTH);
    const minTranslateY = -(largeImageHeight - MAGNIFIER_HEIGHT);

    const clampedTranslateX = Math.max(minTranslateX, Math.min(0, translateX));
    const clampedTranslateY = Math.max(minTranslateY, Math.min(0, translateY));

    return {
      width: `${MAGNIFIER_WIDTH}px`,
      height: `${MAGNIFIER_HEIGHT}px`,
      backgroundImage: `url(${product?.image || "/placeholder.svg"})`,
      backgroundSize: `${largeImageWidth}px ${largeImageHeight}px`,
      backgroundPosition: `${clampedTranslateX}px ${clampedTranslateY}px`,
      backgroundRepeat: "no-repeat",
    };
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
          <div className="relative">
            <motion.div
              className="flex items-center justify-center bg-card border border-border rounded-xl p-8 aspect-square"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                ref={imageRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-full object-contain cursor-zoom-in"
              />
            </motion.div>

            {isHovering && isLaptopView && (
              <motion.div
                className="absolute left-full top-0 ml-4 bg-white border border-border rounded-xl pointer-events-none z-10 hidden md:block"
                style={getMagnifiedStyle()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </div>

          {/* Details Panel */}
          <motion.div
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

                <motion.button
                  onClick={handleToggleWishlist}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
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

              {/* Price Section is correct: formatPrice converts USD to INR */}
              <motion.div
                className="mb-6 bg-muted/50 p-4 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {discountPercent > 0 ? (
                  <>
                    <div className="flex items-baseline gap-3 mb-2">
                      <p className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.price)}
                      </p>
                      <span className="bg-accent text-accent-foreground text-sm font-bold px-2 py-1 rounded">
                        -{discountPercent}%
                      </span>
                    </div>
                    <p className="text-4xl font-bold text-primary mb-2">
                      {formatPrice(displayPrice)}
                    </p>
                    <p className="text-sm text-accent font-semibold">
                      You save {formatPrice(savedAmount)}
                    </p>
                  </>
                ) : (
                  <p className="text-4xl font-bold text-primary mb-2">
                    {formatPrice(product.price)}
                  </p>
                )}
              </motion.div>

              <div className="mb-8">
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  Description
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            <motion.div
              className="space-y-4 mt-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <motion.button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 hover:bg-muted transition-colors rounded-l-lg"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
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
                    <Plus size={16} />
                  </motion.button>
                </div>
                <span className="text-sm text-muted-foreground">In Stock</span>
              </div>

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
