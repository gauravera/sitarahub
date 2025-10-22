// src/components/Checkout.tsx (or wherever your Checkout component resides)

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  User,
  Loader2,
  AlertCircle,
  Calendar,
  Lock,
  Package,
  CalendarDays,
  DollarSign
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getPincodeDetails } from "../lib/api";

// Assuming you've saved your logo as 'logo.png' in the 'public' directory
import logo from "../assets/Sitarahub.avif"; // <-- Updated to your PNG logo

// Helper component for cleaner, icon-based inputs (remains unchanged)
const FormInput = ({
  name,
  value,
  placeholder,
  type = "text",
  icon: Icon,
  onChange,
  onBlur,
  maxLength,
  disabled,
  error,
}: {
  name: string;
  value: string;
  placeholder: string;
  type?: string;
  icon: React.ElementType;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  maxLength?: number;
  disabled?: boolean;
  error?: string;
}) => (
  <div className="sm:col-span-1">
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon
          className={`h-5 w-5 ${
            error ? "text-red-400" : "text-muted-foreground"
          }`}
          aria-hidden="true"
        />
      </div>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        maxLength={maxLength}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full rounded-lg border bg-muted py-3 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
          error
            ? "border-red-500 focus:ring-red-500/50"
            : "border-border"
        }`}
      />
      {name === "zipCode" && disabled && ( // Show loader specifically for zip code
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      )}
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-1.5 flex items-center gap-1 text-sm text-red-500"
      >
        <AlertCircle size={14} />
        {error}
      </motion.p>
    )}
  </div>
);


// --- NEW COMPONENT: OrderConfirmation ---
interface OrderConfirmationProps {
  firstName: string;
  email: string;
  orderId: string;
  estimatedDelivery: string;
  totalAmount: number;
}

const OrderConfirmation = ({
  firstName,
  email,
  orderId,
  estimatedDelivery,
  totalAmount,
}: OrderConfirmationProps) => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
      <motion.div
        className="text-center max-w-lg mx-auto bg-card border border-border rounded-xl p-8 shadow-xl"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Logo - Using your provided image */}
        <motion.img
          src={logo}
          alt="YourShop Logo"
          className="mx-auto h-20 mb-6 object-contain" // Increased height, object-contain for aspect ratio
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        />

        {/* Confirmed Checkmark Animation */}
        <motion.div
          className="w-24 h-24 bg-[#00A99D] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg" // Adjusted color to match logo teal
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
        >
          <Check size={50} className="text-white" />
        </motion.div>

        {/* Personalized Message */}
        <motion.h1
          className="text-4xl font-extrabold text-foreground mb-4 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          Order Confirmed!
        </motion.h1>
        <motion.p
          className="text-muted-foreground text-lg mb-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          Thank you for your purchase, <span className="text-[#00A99D] font-semibold">{firstName}</span>! {/* Adjusted color */}
          Your order has been successfully placed.
        </motion.p>

        {/* Order Details Card */}
        <motion.div
          className="bg-muted p-6 rounded-lg border border-border text-left space-y-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <div className="flex items-center justify-between text-foreground">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Package size={20} /> Order ID:
            </span>
            <span className="font-semibold">{orderId}</span>
          </div>
          <div className="flex items-center justify-between text-foreground">
            <span className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays size={20} /> Estimated Delivery:
            </span>
            <span className="font-semibold">{estimatedDelivery}</span>
          </div>
          <div className="flex items-center justify-between text-foreground">
            <span className="flex items-center gap-2 text-muted-foreground">
              <DollarSign size={20} /> Total Amount:
            </span>
            <span className="text-xl font-bold text-[#00A99D]">${totalAmount.toFixed(2)}</span> {/* Adjusted color */}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            A detailed confirmation email has been sent to <span className="font-medium text-foreground">{email}</span>.
          </p>
        </motion.div>

        {/* Call to action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <Link
            to="/orders" // Link to a hypothetical orders page
            className="flex-1 inline-flex items-center justify-center bg-accent text-accent-foreground px-8 py-3 rounded-lg hover:bg-accent/80 transition-colors font-semibold"
          >
            Track Your Order
          </Link>
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center bg-[#00A99D] text-white px-8 py-3 rounded-lg hover:bg-[#00A99D]/90 transition-colors font-semibold" // Adjusted button color
          >
            Continue Shopping
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
};
// --- END NEW COMPONENT ---


export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [orderPlaced, setOrderPlaced] = useState(false);
  // States for order confirmation details
  const [orderId, setOrderId] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");


  // --- Empty Cart Screen (No changes) ---
  if (cart.length === 0 && !orderPlaced) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Link
            to="/cart"
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 w-fit font-medium"
          >
            <ArrowLeft size={20} />
            Back to Cart
          </Link>
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">
              Your cart is empty
            </p>
            <Link to="/" className="text-primary hover:underline font-medium">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // --- Render OrderConfirmation Component ---
  if (orderPlaced) {
    return (
      <OrderConfirmation
        firstName={formData.firstName}
        email={formData.email}
        orderId={orderId}
        estimatedDelivery={estimatedDelivery}
        totalAmount={total * 1.1} // Assuming 10% tax
      />
    );
  }

  // --- Validation Logic (No changes) ---
  const validateField = (name: string, value: string) => {
    let error = "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!value) {
      error = "This field is required";
    } else {
      switch (name) {
        case "email":
          if (!emailRegex.test(value)) error = "Please enter a valid email";
          break;
        case "phone":
          if (!/^\d{10}$/.test(value)) error = "Must be 10 digits";
          break;
        case "zipCode":
          if (!/^\d{6}$/.test(value)) error = "Must be 6 digits";
          break;
        case "cardNumber":
          if (!/^\d{16}$/.test(value.replace(/\s/g, ''))) error = "Must be 16 digits";
          break;
        case "expiryDate":
          if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) error = "Must be in MM/YY format (e.g., 12/25)";
          break;
        case "cvv":
          if (!/^\d{3,4}$/.test(value)) error = "Must be 3 or 4 digits";
          break;
      }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear error for this field as the user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
    
    // Special blur logic for zipCode
    if (name === "zipCode") {
      handleZipCodeBlur(value);
    }
  };

  const handleZipCodeBlur = async (zipCode: string) => {
    if (zipCode.length !== 6) {
      return;
    }
    
    setIsPincodeLoading(true);
    setErrors((prev) => ({ ...prev, city: undefined, state: undefined }));
    
    try {
      const data = await getPincodeDetails(zipCode);
      if (data && data[0].Status === "Success" && data[0].PostOffice) {
        const postOffice = data[0].PostOffice[0];
        setFormData((prev) => ({
          ...prev,
          city: postOffice.District,
          state: postOffice.State,
        }));
        toast.success("City and State auto-filled!");
        setErrors((prev) => ({ ...prev, city: undefined, state: undefined }));
      } else {
        toast.error(data[0]?.Message || "Invalid PIN Code");
        setErrors((prev) => ({ ...prev, zipCode: "Invalid PIN Code" }));
      }
    } catch (error) {
      console.error("Error fetching pincode data:", error);
      toast.error("Could not fetch PIN Code details.");
    }
    setIsPincodeLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let isValid = true;
    const newErrors: Partial<typeof formData> = {};
    
    (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) => {
      // For city and state, only require if zipCode is valid and they are empty
      if (key === "city" || key === "state") {
        if (!formData[key] && !errors.zipCode) { // Only error if zipCode didn't fill it
          newErrors[key] = "This field is required";
          isValid = false;
        }
      } else if (!validateField(key, formData[key])) {
        isValid = false;
        // Ensure error is set for empty fields on submit
        if (!formData[key]) newErrors[key] = "This field is required";
      }
    });
    
    setErrors((prev) => ({ ...prev, ...newErrors }));

    if (!isValid) {
      toast.error("Please fix the errors in the form.");
      setIsSubmitting(false);
      return;
    }

    // --- All Good! Proceed to submit ---
    console.log("Form Submitted:", formData);
    
    // Simulate API call for order submission
    setTimeout(() => {
      // Generate dummy order ID and delivery date
      const dummyOrderId = Math.random().toString(36).substring(2, 10).toUpperCase();
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 5); // 5 days from now
      const estimatedDeliveryString = deliveryDate.toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric'
      });

      setOrderId(dummyOrderId);
      setEstimatedDelivery(estimatedDeliveryString);
      setOrderPlaced(true);
      clearCart();
      setIsSubmitting(false);
    }, 1500);
  };
  
  // --- Checkout Form ---
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link
          to="/cart"
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 w-fit font-medium"
        >
          <ArrowLeft size={20} />
          Back to Cart
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* --- 1. Shipping Info --- */}
              <motion.div
                className="bg-card border border-border rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</span>
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                  <FormInput
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    icon={User}
                    error={errors.firstName}
                  />
                  <FormInput
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    icon={User}
                    error={errors.lastName}
                  />
                  <FormInput
                    name="email"
                    placeholder="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    icon={Mail}
                    error={errors.email}
                  />
                  <FormInput
                    name="phone"
                    placeholder="Phone Number (10 digits)"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    maxLength={10}
                    icon={Phone}
                    error={errors.phone}
                  />
                  <div className="sm:col-span-2">
                    <FormInput
                      name="address"
                      placeholder="Street Address"
                      value={formData.address}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      icon={MapPin}
                      error={errors.address}
                    />
                  </div>
                  <FormInput
                    name="zipCode"
                    placeholder="Zip Code (6 digits)"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    maxLength={6}
                    icon={MapPin}
                    disabled={isPincodeLoading}
                    error={errors.zipCode}
                  />
                  <FormInput
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    icon={MapPin}
                    error={errors.city}
                    disabled={isPincodeLoading || formData.city !== ''}
                  />
                  <div className="sm:col-span-2">
                    <FormInput
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      icon={MapPin}
                      error={errors.state}
                      disabled={isPincodeLoading || formData.state !== ''}
                    />
                  </div>
                </div>
              </motion.div>

              {/* --- 2. Payment Info --- */}
              <motion.div
                className="bg-card border border-border rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</span>
                  Payment Information
                </h2>
                <div className="space-y-6">
                  <FormInput
                    name="cardNumber"
                    placeholder="Card Number (16 digits)"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    maxLength={16}
                    icon={CreditCard}
                    error={errors.cardNumber}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      maxLength={5}
                      icon={Calendar}
                      error={errors.expiryDate}
                    />
                    <FormInput
                      name="cvv"
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      maxLength={4}
                      icon={Lock}
                      error={errors.cvv}
                    />
                  </div>
                </div>
              </motion.div>

              {/* --- Submit Button --- */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 font-bold text-primary-foreground text-lg transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  `Place Order - $${(total * 1.1).toFixed(2)}`
                )}
              </motion.button>
            </form>
          </div>

          {/* --- Order Summary (Sticky) --- */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-card border border-border rounded-xl p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.title.substring(0, 25)}... x {item.quantity}
                    </span>
                    <span className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-500 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span className="font-semibold">
                    ${(total * 0.1).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="border-t border-border mt-6 pt-6 flex justify-between items-center">
                <span className="text-lg font-bold text-foreground">
                  Grand Total
                </span>
                <span className="text-2xl font-bold text-primary">
                  ${(total * 1.1).toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
