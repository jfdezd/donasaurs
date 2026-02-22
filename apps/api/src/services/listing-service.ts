import type pg from "pg";
import type { Listing, CreateListingInput } from "@donasaurs/domain";
import { ListingRepository } from "../repositories/listing-repository.js";
import { UserRepository } from "../repositories/user-repository.js";

export class ListingService {
  private listingRepo: ListingRepository;
  private userRepo: UserRepository;

  constructor(pool: pg.Pool) {
    this.listingRepo = new ListingRepository(pool);
    this.userRepo = new UserRepository(pool);
  }

  async createListing(
    sellerId: string,
    email: string,
    input: CreateListingInput,
  ): Promise<Listing> {
    // Ensure user exists in our users table
    await this.userRepo.ensureUser(sellerId, email);

    return this.listingRepo.create(
      sellerId,
      input.title,
      input.description ?? null,
      input.price_min,
    );
  }

  async getAllListings(): Promise<Listing[]> {
    return this.listingRepo.findAll();
  }

  async getListingById(id: string): Promise<Listing | null> {
    return this.listingRepo.findById(id);
  }
}
