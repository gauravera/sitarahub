// Define the conversion rate
const USD_TO_INR_RATE = 87.9;

export const formatPrice = (usdPrice: number): string => {
  // 1. Convert the USD price to INR
  const inrPrice = usdPrice * USD_TO_INR_RATE;

  // 2. Format the new INR price
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(inrPrice);
};
