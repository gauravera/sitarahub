"use client";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { Trash2, ShoppingBag, ArrowLeft, Check } from "lucide-react";
import { formatPrice } from "../lib/priceUtils";

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    total,
    discountTotal,
    finalTotal,
    clearCart,
  } = useCart();

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <Link
            to="/"
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 w-fit font-medium"
          >
            <ArrowLeft size={20} />
            <span>Back to Shopping</span>
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-12">
            Shopping Cart
          </h1>

          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <ShoppingBag
              size={64}
              className="mx-auto text-muted-foreground mb-6 opacity-30"
            />
            <p className="text-muted-foreground text-lg mb-8">
              Your cart is empty
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
        <Link
          to="/"
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 w-fit font-medium"
        >
          <ArrowLeft size={20} />
          <span>Back to Shopping</span>
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 sm:mb-12">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="bg-card border border-border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 hover:shadow-lg transition-all hover:border-primary/30"
                >
                  <div className="relative w-full sm:w-28 h-40 sm:h-28 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-card-foreground line-clamp-2 mb-2 text-sm sm:text-base">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-muted-foreground line-through text-sm">
                          {formatPrice(item.price)}
                        </p>
                        {item.discountPercent > 0 && (
                          <span className="bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded">
                            -{item.discountPercent}%
                          </span>
                        )}
                      </div>
                      <p className="text-primary font-bold text-lg">
                        {formatPrice(item.discountedPrice)}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="flex items-center border border-border rounded-lg bg-muted">
                        <motion.button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          whileHover={{ backgroundColor: "var(--background)" }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 sm:px-4 py-2 hover:bg-background transition-colors font-semibold text-sm"
                        >
                          −
                        </motion.button>
                        <span className="px-4 sm:px-5 py-2 border-l border-r border-border font-semibold text-sm">
                          {item.quantity}
                        </span>
                        <motion.button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          whileHover={{ backgroundColor: "var(--background)" }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 sm:px-4 py-2 hover:bg-background transition-colors font-semibold text-sm"
                        >
                          +
                        </motion.button>
                      </div>

                      <motion.button
                        onClick={() => removeFromCart(item.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                        title="Remove from cart"
                      >
                        <Trash2 size={20} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-card border border-border rounded-xl p-6 sm:p-7 lg:sticky lg:top-24 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-card-foreground mb-6 sm:mb-8">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-card-foreground font-semibold">
                    {formatPrice(total)}
                  </span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex justify-between text-sm bg-accent/10 p-2 rounded">
                    <span className="text-accent font-semibold">
                      Discount Savings
                    </span>
                    <span className="text-accent font-bold">
                      -{formatPrice(discountTotal)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-accent font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-card-foreground font-semibold">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className="flex justify-between mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-border">
                <span className="font-bold text-card-foreground text-base sm:text-lg">
                  Total
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  {formatPrice(finalTotal)}
                </span>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/checkout"
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-all font-bold mb-3 flex items-center justify-center gap-2 group text-sm sm:text-base"
                >
                  <Check
                    size={20}
                    className="group-hover:scale-110 transition-transform"
                  />
                  Proceed to Checkout
                </Link>
              </motion.div>

              <motion.button
                onClick={clearCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full border border-border text-foreground py-3 rounded-lg hover:bg-muted transition-colors font-semibold mb-4 text-sm sm:text-base"
              >
                Clear Cart
              </motion.button>

              <Link
                to="/"
                className="block text-center text-primary hover:text-primary/80 text-xs sm:text-sm font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
