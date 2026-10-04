import { supabase } from '../../lib/supabase';

export interface BookingData {
  name: string;
  email: string;
  organization: string;
  industry: string;
  topic: string;
  bookingDate: string;
  bookingTime: string;
}

export async function getBookedSlots(date: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('demo_bookings')
    .select('booking_time')
    .eq('booking_date', date)
    .eq('status', 'confirmed');

  if (error) {
    console.error('Failed to fetch booked slots:', error);
    return [];
  }
  return (data || []).map((row) => row.booking_time);
}

export async function createBooking(booking: BookingData): Promise<boolean> {
  const { error } = await supabase.from('demo_bookings').insert({
    name: booking.name,
    email: booking.email,
    organization: booking.organization,
    industry: booking.industry,
    topic: booking.topic,
    booking_date: booking.bookingDate,
    booking_time: booking.bookingTime,
  });

  if (error) {
    console.error('Failed to create booking:', error);
    return false;
  }

  try {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-booking-email`;
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    });
  } catch (e) {
    console.error('Failed to send booking email:', e);
  }

  // The operator is also told through the platform's own mail (app.amtechai.com), so a booking reaches a
  // person even when the function above cannot send.
  try {
    await fetch('https://app.amtechai.com/site/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
  } catch (e) {
    console.error('Failed to notify the operator:', e);
  }

  return true;
}
