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

/* ── Listings ── */

export async function fetchListings(): Promise<ListingResponse[]> {
  const res = await fetch(`${API_URL}/listings`);
  return handleResponse<ListingResponse[]>(res);
}

export async function fetchListing(id: string): Promise<ListingResponse> {
  const res = await fetch(`${API_URL}/listings/${id}`);
  return handleResponse<ListingResponse>(res);
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
  return handleResponse<ListingResponse>(res);
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
  return handleResponse<OrderResponse>(res);
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
  return handleResponse<OrderResponse>(res);
}

export async function shipOrder(orderId: string): Promise<OrderResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/orders/${orderId}/ship`, {
    method: "POST",
    headers,
  });
  return handleResponse<OrderResponse>(res);
}

export async function completeOrder(orderId: string): Promise<OrderResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/orders/${orderId}/complete`, {
    method: "POST",
    headers,
  });
  return handleResponse<OrderResponse>(res);
}

export async function fetchMyOrders(): Promise<OrderResponse[]> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/orders/mine`, { headers });
  return handleResponse<OrderResponse[]>(res);
}

export async function fetchOrder(id: string): Promise<OrderResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/orders/${id}`, { headers });
  return handleResponse<OrderResponse>(res);
}
