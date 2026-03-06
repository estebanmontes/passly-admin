import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

  // Create admin user
  const admin_user = await prisma.user.create({
    data: {
      email: "estebanmgcr@gmail.com",
      name: "Esteban Montes",
      role: "ADMIN",
      emailVerified: true,
    },
  });

  // Create a demo organizer user
  const organizer_user = await prisma.user.create({
    data: {
      email: "admin@passly.io",
      name: "Alex Morgan",
      role: "ORGANIZER",
      emailVerified: true,
    },
  });

  // Create a demo customer
  const customer = await prisma.user.create({
    data: {
      email: "customer@example.com",
      name: "Jamie Rivera",
      role: "CUSTOMER",
      emailVerified: true,
    },
  });

  // Create organizer profile for admin
  const adminOrganizer = await prisma.organizer.create({
    data: {
      userId: admin_user.id,
      name: "Passly HQ",
      slug: "passly-hq",
      description: "Passly headquarters — platform admin",
    },
  });

  // Create organizer profile
  const organizer = await prisma.organizer.create({
    data: {
      userId: organizer_user.id,
      name: "Passly Events",
      slug: "passly-events",
      description: "Premier event organizer",
    },
  });

  // Create venues
  const venue1 = await prisma.venue.create({
    data: {
      organizerId: organizer.id,
      name: "Central Park Arena",
      address: "123 Park Ave",
      city: "New York",
      state: "NY",
      country: "US",
      capacity: 5000,
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
    },
  });

  // Create events
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
          {
            name: "General Admission",
            price: 45.0,
            totalQuantity: 3000,
            soldCount: 2340,
          },
          {
            name: "VIP",
            price: 120.0,
            totalQuantity: 500,
            soldCount: 380,
          },
        ],
      },
      badges: {
        create: [{ variant: "HOT", label: "Trending" }],
      },
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
          {
            name: "Standard",
            price: 299.0,
            totalQuantity: 1000,
            soldCount: 1000,
            status: "SOLD_OUT",
          },
        ],
      },
      badges: {
        create: [{ variant: "SOLD_OUT", label: "Sold Out" }],
      },
    },
  });

  console.log("Seeded successfully:");
  console.log("  Users:", admin_user.email, "(ADMIN),", organizer_user.email, "(ORGANIZER),", customer.email, "(CUSTOMER)");
  console.log("  Organizer:", organizer.name);
  console.log("  Venues:", venue1.name, ",", venue2.name);
  console.log("  Events:", event1.title, ",", event2.title);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
