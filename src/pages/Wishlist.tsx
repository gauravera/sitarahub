"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useWishlist } from "../context/WishlistContext";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: {
    rate: number;
    count: number;
  };
}

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  useEffect(() => {
    const filtered = products.filter((p) => wishlist.includes(p.id));
    setWishlistProducts(filtered);
  }, [wishlist, products]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      discountedPrice: product.price,
      discountPercent: 0,
      image: product.image,
    });
    toast.success(`${product.title.substring(0, 20)}... added to cart!`);
  };

  const handleRemoveFromWishlist = (id: number, title: string) => {
    removeFromWishlist(id);
    toast.error(`${title.substring(0, 20)}... removed from wishlist.`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  if (wishlistProducts.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <Link
            to="/"
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 w-fit font-medium"
          >
            <ArrowLeft size={20} />
            Back to Shopping
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-12">
            My Wishlist
          </h1>

          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Heart
              size={64}
              className="mx-auto text-muted-foreground mb-6 opacity-30"
            />
            <p className="text-muted-foreground text-lg mb-8">
              Your wishlist is empty
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/"
                className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Continue Shopping
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* ... Back to Shopping Link and Title ... */}
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 sm:mb-12">
          My Wishlist
        </h1>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {wishlistProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all"
            >
              {/* ... product image ... */}
              <div className="relative w-full h-48 bg-muted overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-contain p-4"
                />
                <motion.button
                  onClick={() =>
                    handleRemoveFromWishlist(product.id, product.title)
                  }
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute top-3 right-3 p-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                >
                  <Trash2 size={18} />
                </motion.button>
              </div>
              <div className="p-5">
                {/* ... product title and price ... */}
                <motion.button
                  onClick={() => handleAddToCart(product)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-all font-semibold flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      {/* ❌ 5. Removed the old custom toast component */}
    </main>
  );
}
