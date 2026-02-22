import type { ListingStatus, OrderStatus } from "./enums.js";

/* ── Request DTOs ── */

export interface CreateListingInput {
  title: string;
  description?: string;
  price_min: number;
}

export interface ReserveListingInput {
  listing_id: string;
  agreed_price: number;
}

export interface ConfirmEscrowInput {
  escrow_reference: string;
}

/* ── Response DTOs ── */

export interface ListingResponse {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price_min: number;
  status: ListingStatus;
  reserved_by: string | null;
  reserved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderResponse {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  agreed_price: number;
  status: OrderStatus;
  escrow_reference: string | null;
  escrow_confirmed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
}
