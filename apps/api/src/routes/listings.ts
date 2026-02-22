import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { ListingService } from "../services/listing-service.js";
import { ServiceError } from "../services/order-service.js";
import type { AuthUser } from "../middleware/auth.js";
import type { CreateListingInput } from "@donasaurs/domain";

const createListingSchema: z.ZodType<CreateListingInput> = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  price_min: z.number().positive(),
});

export async function listingRoutes(
  app: FastifyInstance,
  opts: { listingService: ListingService; authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void> },
): Promise<void> {
  const { listingService, authenticate } = opts;

  app.get("/listings", async () => {
    const listings = await listingService.getAllListings();
    return listings;
  });

  app.get<{ Params: { id: string } }>("/listings/:id", async (request, reply) => {
    const listing = await listingService.getListingById(request.params.id);
    if (!listing) {
      return reply.code(404).send({ statusCode: 404, error: "Not Found", message: "Listing not found" });
    }
    return listing;
  });

  app.post("/listings", {
    preHandler: [authenticate],
  }, async (request, reply) => {
    const parsed = createListingSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        statusCode: 400,
        error: "Bad Request",
        message: parsed.error.issues.map((i) => i.message).join(", "),
      });
    }

    try {
      if (typeof parsed.data.title !== "string" || typeof parsed.data.price_min !== "number") {
        return reply.code(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Invalid listing payload",
        });
      }

      const user = request.user as AuthUser;
      const listing = await listingService.createListing(user.sub, user.email, {
        title: parsed.data.title,
        description: parsed.data.description,
        price_min: parsed.data.price_min,
      });
      return reply.code(201).send(listing);
    } catch (err) {
      if (err instanceof ServiceError) {
        return reply.code(err.statusCode).send({ statusCode: err.statusCode, error: "Error", message: err.message });
      }
      throw err;
    }
  });
}
