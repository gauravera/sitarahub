const USD_TO_INR_RATE = 87.9;

export const formatPrice = (usdPrice: number): string => {
  const inrPrice = usdPrice * USD_TO_INR_RATE;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(inrPrice);
};
