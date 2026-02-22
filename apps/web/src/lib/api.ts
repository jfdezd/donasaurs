import { supabase } from "./supabase";
import type {
  ListingResponse,
  OrderResponse,
  CreateListingInput,
  ReserveListingInput,
  ConfirmEscrowInput,
  ApiError,
} from "@donasaurs/domain";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json()) as ApiError;
    throw new Error(body.message ?? `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}


function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return 0;
}

function normalizeListing(listing: ListingResponse): ListingResponse {
  return {
    ...listing,
    price_min: toNumber((listing as ListingResponse & { price_min: unknown }).price_min),
  };
}

function normalizeOrder(order: OrderResponse): OrderResponse {
  return {
    ...order,
    agreed_price: toNumber((order as OrderResponse & { agreed_price: unknown }).agreed_price),
  };
}

/* ── Listings ── */

export async function fetchListings(): Promise<ListingResponse[]> {
  const res = await fetch(`${API_URL}/listings`);
  const data = await handleResponse<ListingResponse[]>(res);
  return data.map(normalizeListing);
}

export async function fetchListing(id: string): Promise<ListingResponse> {
  const res = await fetch(`${API_URL}/listings/${id}`);
  const data = await handleResponse<ListingResponse>(res);
  return normalizeListing(data);
}

export async function createListing(
  input: CreateListingInput,
): Promise<ListingResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/listings`, {
    method: "POST",
    headers,
    body: JSON.stringify(input),
  });
  const data = await handleResponse<ListingResponse>(res);
  return normalizeListing(data);
}

/* ── Orders ── */

export async function reserveListing(
  input: ReserveListingInput,
): Promise<OrderResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/orders/reserve`, {
    method: "POST",
    headers,
    body: JSON.stringify(input),
  });
  const data = await handleResponse<OrderResponse>(res);
  return normalizeOrder(data);
}

export async function confirmEscrow(
  orderId: string,
  input: ConfirmEscrowInput,
): Promise<OrderResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/orders/${orderId}/confirm-escrow`, {
    method: "POST",
    headers,
    body: JSON.stringify(input),
  });
  const data = await handleResponse<OrderResponse>(res);
  return normalizeOrder(data);
}

export async function shipOrder(orderId: string): Promise<OrderResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/orders/${orderId}/ship`, {
    method: "POST",
    headers,
  });
  const data = await handleResponse<OrderResponse>(res);
  return normalizeOrder(data);
}

export async function completeOrder(orderId: string): Promise<OrderResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/orders/${orderId}/complete`, {
    method: "POST",
    headers,
  });
  const data = await handleResponse<OrderResponse>(res);
  return normalizeOrder(data);
}

export async function fetchMyOrders(): Promise<OrderResponse[]> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/orders/mine`, { headers });
  const data = await handleResponse<OrderResponse[]>(res);
  return data.map(normalizeOrder);
}

export async function fetchOrder(id: string): Promise<OrderResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/orders/${id}`, { headers });
  const data = await handleResponse<OrderResponse>(res);
  return normalizeOrder(data);
}
