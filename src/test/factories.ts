export function createMockVenue(index: number) {
  return {
    id: `venue-${index}`,
    name: `Venue ${index}`,
    address: `${index} Main St`,
    city: "New York",
    state: "NY",
    country: "US",
    capacity: 1000 + index * 500,
    latitude: null,
    longitude: null,
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { events: index % 3 },
  };
}

export function createMockOrder(index: number) {
  return {
    id: `order-${index}`,
    orderNumber: `ORD-${String(index).padStart(5, "0")}`,
    status: ["PENDING", "CONFIRMED", "FAILED", "REFUNDED", "CANCELLED"][index % 5],
    subtotal: 100 + index * 10,
    fees: 5 + index,
    total: 105 + index * 11,
    currency: "USD",
    paymentMethod: "CREDIT_CARD",
    createdAt: new Date(2026, 0, index + 1),
    user: {
      name: `Customer ${index}`,
      email: `customer${index}@example.com`,
      image: null,
    },
    event: { title: `Event ${index % 3}` },
  };
}

export function createMockPass(index: number) {
  return {
    id: `pass-${index}`,
    qrCode: `PASS-${String(index).padStart(12, "0")}`,
    status: ["VALID", "USED", "EXPIRED", "CANCELLED", "TRANSFERRED"][index % 5],
    scannedAt: index % 5 === 1 ? new Date() : null,
    createdAt: new Date(),
    user: {
      name: `Attendee ${index}`,
      email: `attendee${index}@example.com`,
      image: null,
    },
    order: {
      event: { id: `event-${index % 3}`, title: `Event ${index % 3}` },
      items: [
        {
          ticketTier: { id: `tier-${index}`, name: `Tier ${index % 3}` },
        },
      ],
    },
  };
}

export function createMockVenues(count: number) {
  return Array.from({ length: count }, (_, i) => createMockVenue(i + 1));
}

export function createMockOrders(count: number) {
  return Array.from({ length: count }, (_, i) => createMockOrder(i + 1));
}

export function createMockPasses(count: number) {
  return Array.from({ length: count }, (_, i) => createMockPass(i + 1));
}
