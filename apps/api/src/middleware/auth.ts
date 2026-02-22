import type { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

export interface AuthUser {
  sub: string;
  email: string;
}

declare module "fastify" {
  interface FastifyRequest {
    user: AuthUser;
  }
}

export function buildAuthHook(jwtSecret: string) {
  return async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const header = request.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      reply.code(401).send({ statusCode: 401, error: "Unauthorized", message: "Missing or invalid Authorization header" });
      return;
    }

    const token = header.slice(7);

    try {
      const payload = jwt.verify(token, jwtSecret, {
        algorithms: ["HS256"],
      }) as jwt.JwtPayload;

      if (!payload.sub || !payload.email) {
        reply.code(401).send({ statusCode: 401, error: "Unauthorized", message: "Invalid token payload" });
        return;
      }

      request.user = {
        sub: payload.sub,
        email: payload.email as string,
      };
    } catch {
      reply.code(401).send({ statusCode: 401, error: "Unauthorized", message: "Invalid or expired token" });
    }
  };
}
