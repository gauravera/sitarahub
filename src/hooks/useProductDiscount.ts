// hooks/useProductDiscount.ts

import { useMemo } from "react";

/**
 *
 * @param productId The product's unique ID.
 * @param price The original price of the product.
 * @returns An object with discount info.
 */
export function useProductDiscount(
  productId: number | undefined,
  price: number | undefined
) {
  // Calculate the discount percentage (3% to 35%)
  const discountPercent = useMemo(() => {
    if (!productId) return 0;

    const min = 3;
    const max = 35;
    const range = max - min + 1; // 33
    return (productId % range) + min;
  }, [productId]);

  // Calculate the amount saved
  const savedAmount = useMemo(() => {
    if (!price || discountPercent === 0) return 0;
    return (price * discountPercent) / 100;
  }, [price, discountPercent]);

  // Calculate the final display price
  const displayPrice = useMemo(() => {
    if (!price) return 0;
    return price - savedAmount;
  }, [price, savedAmount]);

  return {
    discountPercent,
    savedAmount,
    displayPrice,
  };
}
