export const ListingStatus = {
  ACTIVE: "ACTIVE",
  RESERVED: "RESERVED",
  IN_ESCROW: "IN_ESCROW",
  SHIPPED: "SHIPPED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  DISPUTED: "DISPUTED",
} as const;

export type ListingStatus = (typeof ListingStatus)[keyof typeof ListingStatus];

export const OrderStatus = {
  CREATED: "CREATED",
  AWAITING_ESCROW: "AWAITING_ESCROW",
  ESCROW_CONFIRMED: "ESCROW_CONFIRMED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  DISPUTED: "DISPUTED",
  FAILED: "FAILED",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const DisputeStatus = {
  OPEN: "OPEN",
  UNDER_REVIEW: "UNDER_REVIEW",
  RESOLVED_BUYER: "RESOLVED_BUYER",
  RESOLVED_SELLER: "RESOLVED_SELLER",
  REJECTED: "REJECTED",
} as const;

export type DisputeStatus = (typeof DisputeStatus)[keyof typeof DisputeStatus];
