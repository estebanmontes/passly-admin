import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

function generateOrderNumber(index: number): string {
  return `ORD-${String(index).padStart(5, "0")}`;
}

function generateQrCode(): string {
  return `PASS-${randomUUID().slice(0, 12).toUpperCase()}`;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  // Clean existing data (in reverse dependency order)
  await prisma.pass.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.eventBadge.deleteMany();
  await prisma.eventArtist.deleteMany();
  await prisma.ticketTier.deleteMany();
  await prisma.event.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.organizer.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // ─── Users ────────────────────────────────────────────────────────
  const admin_user = await prisma.user.create({
    data: {
      email: "estebanmgcr@gmail.com",
      name: "Esteban Montes",
      role: "ADMIN",
      emailVerified: true,
    },
  });

  const organizer_user = await prisma.user.create({
    data: {
      email: "admin@passly.io",
      name: "Alex Morgan",
      role: "ORGANIZER",
      emailVerified: true,
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      email: "customer@example.com",
      name: "Jamie Rivera",
      role: "CUSTOMER",
      emailVerified: true,
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: "sarah.chen@example.com",
      name: "Sarah Chen",
      role: "CUSTOMER",
      emailVerified: true,
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      email: "marcus.johnson@example.com",
      name: "Marcus Johnson",
      role: "CUSTOMER",
      emailVerified: true,
    },
  });

  const customer4 = await prisma.user.create({
    data: {
      email: "priya.patel@example.com",
      name: "Priya Patel",
      role: "CUSTOMER",
      emailVerified: true,
    },
  });

  const customers = [customer1, customer2, customer3, customer4];

  // ─── Organizers ───────────────────────────────────────────────────
  const adminOrganizer = await prisma.organizer.create({
    data: {
      userId: admin_user.id,
      name: "Passly HQ",
      slug: "passly-hq",
      description: "Passly headquarters — platform admin",
      website: "https://passly.io",
    },
  });

  const organizer = await prisma.organizer.create({
    data: {
      userId: organizer_user.id,
      name: "Passly Events",
      slug: "passly-events",
      description: "Premier event organizer",
      website: "https://events.passly.io",
    },
  });

  // ─── Venues (4 total) ─────────────────────────────────────────────
  const venue1 = await prisma.venue.create({
    data: {
      organizerId: organizer.id,
      name: "Central Park Arena",
      address: "123 Park Ave",
      city: "New York",
      state: "NY",
      country: "US",
      capacity: 5000,
      latitude: 40.785091,
      longitude: -73.968285,
    },
  });

  const venue2 = await prisma.venue.create({
    data: {
      organizerId: organizer.id,
      name: "Convention Center",
      address: "456 Main St",
      city: "San Francisco",
      state: "CA",
      country: "US",
      capacity: 2000,
      latitude: 37.7749,
      longitude: -122.4194,
    },
  });

  const venue3 = await prisma.venue.create({
    data: {
      organizerId: organizer.id,
      name: "The Grand Ballroom",
      address: "789 Broadway",
      city: "Los Angeles",
      state: "CA",
      country: "US",
      capacity: 1500,
      latitude: 34.0522,
      longitude: -118.2437,
    },
  });

  const venue4 = await prisma.venue.create({
    data: {
      organizerId: organizer.id,
      name: "Innovation Hub",
      address: "321 Tech Blvd",
      city: "Austin",
      state: "TX",
      country: "US",
      capacity: 800,
      latitude: 30.2672,
      longitude: -97.7431,
    },
  });

  const venues = [venue1, venue2, venue3, venue4];

  // ─── Events (7 total) ─────────────────────────────────────────────
  const event1 = await prisma.event.create({
    data: {
      organizerId: organizer.id,
      venueId: venue1.id,
      title: "Summer Music Festival",
      slug: "summer-music-festival-2026",
      description: "The biggest summer music festival of the year.",
      category: "FESTIVAL",
      status: "ON_SALE",
      availability: "AVAILABLE",
      startDate: new Date("2026-08-15T18:00:00Z"),
      endDate: new Date("2026-08-15T23:00:00Z"),
      currency: "USD",
      featured: true,
      ticketTiers: {
        create: [
          { name: "General Admission", price: 45.0, totalQuantity: 3000, soldCount: 2340 },
          { name: "VIP", price: 120.0, totalQuantity: 500, soldCount: 380 },
        ],
      },
      badges: { create: [{ variant: "HOT", label: "Trending" }] },
    },
  });

  const event2 = await prisma.event.create({
    data: {
      organizerId: organizer.id,
      venueId: venue2.id,
      title: "Tech Conference 2026",
      slug: "tech-conference-2026",
      description: "Annual technology conference featuring industry leaders.",
      category: "CONFERENCE",
      status: "SOLD_OUT",
      availability: "SOLD_OUT",
      startDate: new Date("2026-09-22T09:00:00Z"),
      endDate: new Date("2026-09-22T18:00:00Z"),
      currency: "USD",
      ticketTiers: {
        create: [
          { name: "Standard", price: 299.0, totalQuantity: 1000, soldCount: 1000, status: "SOLD_OUT" },
        ],
      },
      badges: { create: [{ variant: "SOLD_OUT", label: "Sold Out" }] },
    },
  });

  const event3 = await prisma.event.create({
    data: {
      organizerId: organizer.id,
      venueId: venue3.id,
      title: "Jazz Night Live",
      slug: "jazz-night-live-2026",
      description: "An intimate evening of world-class jazz performances.",
      category: "MUSIC",
      status: "ON_SALE",
      availability: "LIMITED",
      startDate: new Date("2026-10-05T20:00:00Z"),
      endDate: new Date("2026-10-05T23:30:00Z"),
      currency: "USD",
      ticketTiers: {
        create: [
          { name: "General", price: 65.0, totalQuantity: 800, soldCount: 620 },
          { name: "VIP Table", price: 200.0, totalQuantity: 50, soldCount: 38 },
        ],
      },
      badges: { create: [{ variant: "LIMITED", label: "Few Left" }] },
    },
  });

  const event4 = await prisma.event.create({
    data: {
      organizerId: organizer.id,
      venueId: venue4.id,
      title: "Startup Pitch Day",
      slug: "startup-pitch-day-2026",
      description: "Watch 20 startups pitch their ideas to top investors.",
      category: "NETWORKING",
      status: "DRAFT",
      availability: "AVAILABLE",
      startDate: new Date("2026-10-18T10:00:00Z"),
      endDate: new Date("2026-10-18T17:00:00Z"),
      currency: "USD",
      ticketTiers: {
        create: [
          { name: "Attendee", price: 25.0, totalQuantity: 500, soldCount: 0 },
        ],
      },
    },
  });

  const event5 = await prisma.event.create({
    data: {
      organizerId: organizer.id,
      venueId: venue1.id,
      title: "New Year's Eve Gala",
      slug: "nye-gala-2026",
      description: "Ring in the new year with an unforgettable gala.",
      category: "FESTIVAL",
      status: "SCHEDULED",
      availability: "AVAILABLE",
      startDate: new Date("2026-12-31T21:00:00Z"),
      endDate: new Date("2027-01-01T02:00:00Z"),
      currency: "USD",
      ticketTiers: {
        create: [
          { name: "Standard", price: 150.0, totalQuantity: 2000, soldCount: 450 },
          { name: "Premium", price: 350.0, totalQuantity: 300, soldCount: 120 },
        ],
      },
      badges: { create: [{ variant: "EARLY_BIRD", label: "Early Bird" }] },
    },
  });

  const event6 = await prisma.event.create({
    data: {
      organizerId: organizer.id,
      venueId: venue2.id,
      title: "Comedy Night Standup",
      slug: "comedy-night-standup-2026",
      description: "Top comedians performing live standup routines.",
      category: "COMEDY",
      status: "CANCELLED",
      availability: "AVAILABLE",
      startDate: new Date("2026-07-10T19:00:00Z"),
      endDate: new Date("2026-07-10T22:00:00Z"),
      currency: "USD",
      ticketTiers: {
        create: [
          { name: "General", price: 35.0, totalQuantity: 600, soldCount: 180 },
        ],
      },
    },
  });

  const event7 = await prisma.event.create({
    data: {
      organizerId: organizer.id,
      venueId: venue3.id,
      title: "AI & Machine Learning Workshop",
      slug: "ai-ml-workshop-2026",
      description: "Hands-on workshop covering the latest in AI and ML.",
      category: "WORKSHOP",
      status: "COMPLETED",
      availability: "SOLD_OUT",
      startDate: new Date("2026-03-15T09:00:00Z"),
      endDate: new Date("2026-03-15T17:00:00Z"),
      currency: "USD",
      ticketTiers: {
        create: [
          { name: "Workshop Pass", price: 199.0, totalQuantity: 100, soldCount: 100, status: "SOLD_OUT" },
        ],
      },
    },
  });

  const allEvents = [event1, event2, event3, event4, event5, event6, event7];
  const saleableEvents = [event1, event2, event3, event5, event7]; // Events that make sense to have orders

  // ─── Fetch ticket tiers for all events ────────────────────────────
  const allTiers = await prisma.ticketTier.findMany({
    where: { eventId: { in: allEvents.map((e) => e.id) } },
  });

  const tiersByEvent = new Map<string, typeof allTiers>();
  for (const tier of allTiers) {
    const existing = tiersByEvent.get(tier.eventId) ?? [];
    existing.push(tier);
    tiersByEvent.set(tier.eventId, existing);
  }

  // ─── Orders (50+) ────────────────────────────────────────────────
  const orderStatuses = ["PENDING", "CONFIRMED", "CONFIRMED", "CONFIRMED", "CONFIRMED", "FAILED", "REFUNDED", "CANCELLED"] as const;
  const paymentMethods = ["CREDIT_CARD", "DEBIT_CARD", "PAYPAL", "APPLE_PAY", "GOOGLE_PAY"] as const;

  let orderIndex = 1;

  for (let i = 0; i < 55; i++) {
    const customer = pickRandom(customers);
    const event = pickRandom(saleableEvents);
    const tiers = tiersByEvent.get(event.id) ?? [];
    if (tiers.length === 0) continue;

    const status = pickRandom(orderStatuses);
    const paymentMethod = pickRandom(paymentMethods);
    const createdAt = randomDate(new Date("2026-01-01"), new Date("2026-06-30"));

    // 1-3 items per order
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items: { ticketTierId: string; quantity: number; unitPrice: number; subtotal: number }[] = [];
    let subtotal = 0;

    for (let j = 0; j < numItems; j++) {
      const tier = pickRandom(tiers);
      const quantity = Math.floor(Math.random() * 3) + 1;
      const itemSubtotal = tier.price * quantity;
      items.push({
        ticketTierId: tier.id,
        quantity,
        unitPrice: tier.price,
        subtotal: itemSubtotal,
      });
      subtotal += itemSubtotal;
    }

    const fees = Math.round(subtotal * 0.05 * 100) / 100;
    const total = subtotal + fees;

    const order = await prisma.order.create({
      data: {
        userId: customer.id,
        eventId: event.id,
        orderNumber: generateOrderNumber(orderIndex++),
        status,
        subtotal,
        fees,
        total,
        currency: "USD",
        paymentMethod,
        createdAt,
        updatedAt: createdAt,
        items: { create: items },
      },
    });

    // Create passes for confirmed orders
    if (status === "CONFIRMED") {
      const totalQuantity = items.reduce((s, item) => s + item.quantity, 0);
      const passStatuses = ["VALID", "VALID", "VALID", "USED", "USED", "EXPIRED", "CANCELLED"] as const;

      for (let p = 0; p < totalQuantity; p++) {
        const passStatus = pickRandom(passStatuses);
        await prisma.pass.create({
          data: {
            orderId: order.id,
            userId: customer.id,
            qrCode: generateQrCode(),
            status: passStatus,
            scannedAt: passStatus === "USED" ? randomDate(createdAt, new Date()) : null,
            createdAt,
          },
        });
      }
    }
  }

  // Count results
  const [orderCount, passCount] = await Promise.all([
    prisma.order.count(),
    prisma.pass.count(),
  ]);

  console.log("Seeded successfully:");
  console.log("  Users:", admin_user.email, "(ADMIN),", organizer_user.email, "(ORGANIZER),", customers.length, "customers");
  console.log("  Organizers:", adminOrganizer.name, ",", organizer.name);
  console.log("  Venues:", venues.map((v) => v.name).join(", "));
  console.log("  Events:", allEvents.map((e) => e.title).join(", "));
  console.log("  Orders:", orderCount);
  console.log("  Passes:", passCount);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
