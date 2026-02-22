import type { ListingStatus, OrderStatus, DisputeStatus } from "./enums.js";

export interface User {
  id: string;
  email: string;
  username: string;
  reputation_score: number;
  verified: boolean;
  banned_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price_min: number;
  status: ListingStatus;
  reserved_by: string | null;
  reserved_at: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  agreed_price: number;
  status: OrderStatus;
  escrow_reference: string | null;
  escrow_confirmed_at: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface OrderStateTransition {
  id: string;
  order_id: string;
  previous_state: OrderStatus | null;
  new_state: OrderStatus;
  actor_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Dispute {
  id: string;
  order_id: string;
  opened_by: string;
  status: DisputeStatus;
  resolution_notes: string | null;
  created_at: string;
  resolved_at: string | null;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}
