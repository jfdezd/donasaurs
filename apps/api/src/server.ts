import Fastify from "fastify";
import cors from "@fastify/cors";
import { loadEnv } from "./config/env.js";
import { getPool, closePool } from "./config/database.js";
import { buildAuthHook } from "./middleware/auth.js";
import { healthRoutes } from "./routes/health.js";
import { listingRoutes } from "./routes/listings.js";
import { orderRoutes } from "./routes/orders.js";
import { ListingService } from "./services/listing-service.js";
import { OrderService } from "./services/order-service.js";
import { ServiceError } from "./services/order-service.js";

async function main(): Promise<void> {
  const env = loadEnv();
  const pool = getPool(env.databaseUrl);

  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: (origin, cb) => {
      const allowed = [
        "http://localhost:3000",
        "https://donasaurs-web.vercel.app",
      ];
      // Also allow any origins from CORS_ORIGIN env var
      const extraOrigins = env.corsOrigin
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);
      const allAllowed = [...new Set([...allowed, ...extraOrigins])];

      if (!origin || allAllowed.includes(origin)) {
        cb(null, true);
        return;
      }
      cb(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  });

  // Global error handler
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ServiceError) {
      return reply.code(error.statusCode).send({
        statusCode: error.statusCode,
        error: "Error",
        message: error.message,
      });
    }
    app.log.error(error);
    return reply.code(500).send({
      statusCode: 500,
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  });

  const authenticate = buildAuthHook(env.supabaseUrl);
  const listingService = new ListingService(pool);
  const orderService = new OrderService(pool);

  await healthRoutes(app);
  await listingRoutes(app, { listingService, authenticate });
  await orderRoutes(app, { orderService, authenticate });

  // Graceful shutdown
  const shutdown = async (): Promise<void> => {
    app.log.info("Shutting down...");
    await app.close();
    await closePool();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  await app.listen({ port: env.port, host: env.host });
  app.log.info(`Server listening on ${env.host}:${env.port}`);
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
