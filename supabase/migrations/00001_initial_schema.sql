-- Donasaurs initial schema
-- This migration reflects the existing Supabase database schema.

-- ── ENUMs ──

CREATE TYPE public.listing_status AS ENUM (
  'ACTIVE', 'RESERVED', 'IN_ESCROW', 'SHIPPED', 'COMPLETED', 'CANCELLED', 'DISPUTED'
);

CREATE TYPE public.order_status AS ENUM (
  'CREATED', 'AWAITING_ESCROW', 'ESCROW_CONFIRMED', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'DISPUTED', 'FAILED'
);

CREATE TYPE public.dispute_status AS ENUM (
  'OPEN', 'UNDER_REVIEW', 'RESOLVED_BUYER', 'RESOLVED_SELLER', 'REJECTED'
);

-- ── Tables ──

CREATE TABLE public.users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL,
  username   TEXT NOT NULL,
  reputation_score NUMERIC DEFAULT 0,
  verified   BOOLEAN DEFAULT false,
  banned_at  TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE public.listings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id   UUID NOT NULL REFERENCES public.users(id),
  title       TEXT NOT NULL,
  description TEXT,
  price_min   NUMERIC NOT NULL,
  status      public.listing_status NOT NULL DEFAULT 'ACTIVE',
  reserved_by UUID REFERENCES public.users(id),
  reserved_at TIMESTAMP,
  version     INTEGER NOT NULL DEFAULT 1,
  created_at  TIMESTAMP NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE public.orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id          UUID NOT NULL REFERENCES public.listings(id),
  buyer_id            UUID NOT NULL REFERENCES public.users(id),
  seller_id           UUID NOT NULL REFERENCES public.users(id),
  agreed_price        NUMERIC NOT NULL,
  status              public.order_status NOT NULL DEFAULT 'CREATED',
  escrow_reference    TEXT,
  escrow_confirmed_at TIMESTAMP,
  version             INTEGER NOT NULL DEFAULT 1,
  created_at          TIMESTAMP NOT NULL DEFAULT now(),
  updated_at          TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE public.order_state_transitions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id       UUID NOT NULL REFERENCES public.orders(id),
  previous_state public.order_status,
  new_state      public.order_status NOT NULL,
  actor_id       UUID REFERENCES public.users(id),
  metadata       JSONB,
  created_at     TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE public.disputes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         UUID NOT NULL REFERENCES public.orders(id),
  opened_by        UUID NOT NULL REFERENCES public.users(id),
  status           public.dispute_status NOT NULL DEFAULT 'OPEN',
  resolution_notes TEXT,
  created_at       TIMESTAMP NOT NULL DEFAULT now(),
  resolved_at      TIMESTAMP
);

CREATE TABLE public.audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    UUID,
  action      TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id   UUID,
  ip_address  INET,
  user_agent  TEXT,
  metadata    JSONB,
  created_at  TIMESTAMP NOT NULL DEFAULT now()
);
