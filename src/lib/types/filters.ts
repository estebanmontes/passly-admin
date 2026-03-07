export interface OrderFilters {
  status?: string;
  eventId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface AttendeeFilters {
  eventId?: string;
  status?: string;
  tierId?: string;
}

export interface VenueFilters {
  // Venues only use search for now
}
