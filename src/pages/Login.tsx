"use client";

import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/Sitarahub.avif";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ... (your existing validation logic)
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    toast.success(`Welcome back! Logged in as ${email}`);
    setEmail("");
    setPassword("");
  };

  return (
    // --- UPDATED ---
    // This div now centers the form on the *entire page* with a light background
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <motion.div
        className="max-w-md mx-auto w-full px-4" // Added w-full and px-4 for mobile
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* --- UPDATED --- Removed one layer of nesting */}
        <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-xl">
          <div className="text-center mb-8">
            {/* --- UPDATED --- 
                Replaced the LogIn icon <motion.div> 
                with your logo image
            */}
            <motion.div
              className="inline-block mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Using h-14 to match the size from your header for consistency */}
              <img src={logo} alt="Sitarahub Logo" className="h-14 w-auto" />
            </motion.div>

            <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-500 text-sm mt-2">
              Sign in to your Sitarahub account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-3 text-slate-400"
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  // --- UPDATED --- Using standard Tailwind colors
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-3 text-slate-400"
                />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  // --- UPDATED --- Using standard Tailwind colors
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              // --- UPDATED --- Using standard Tailwind colors
              className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors font-bold mt-6"
            >
              Sign In
            </motion.button>
          </form>

          {/* Sign-up link */}
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                // --- UPDATED --- Using standard Tailwind colors
                className="text-teal-600 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo info */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-400 text-center">
              Demo credentials: Use any email and password (min 6 chars)
            </p>
          </div>
        </div>

        {/* Back to Store link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            // --- UPDATED --- Using standard Tailwind colors
            className="text-teal-600 hover:underline text-sm font-medium"
          >
            ← Back to Store
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
