import type { FastifyRequest, FastifyReply } from "fastify";
import { createRemoteJWKSet, jwtVerify } from "jose";

export interface AuthUser {
  sub: string;
  email: string;
}

declare module "fastify" {
  interface FastifyRequest {
    user: AuthUser;
  }
}

/**
 * Build a Fastify preHandler hook that validates Supabase JWTs
 * using the project's JWKS endpoint (asymmetric ECC P-256 keys).
 */
export function buildAuthHook(supabaseUrl: string) {
  const jwksUrl = new URL("/auth/v1/.well-known/jwks.json", supabaseUrl);
  const jwks = createRemoteJWKSet(jwksUrl);

  return async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const header = request.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      reply.code(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Missing or invalid Authorization header",
      });
      return;
    }

    const token = header.slice(7);

    try {
      const { payload } = await jwtVerify(token, jwks, {
        issuer: `${supabaseUrl}/auth/v1`,
      });

      if (!payload.sub || !payload.email) {
        reply.code(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid token payload",
        });
        return;
      }

      request.user = {
        sub: payload.sub,
        email: payload.email as string,
      };
    } catch {
      reply.code(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Invalid or expired token",
      });
    }
  };
}
