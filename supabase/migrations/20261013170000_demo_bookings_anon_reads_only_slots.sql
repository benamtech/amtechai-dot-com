/*
  The booking page reads which slots are taken; it never needs who booked them. Anonymous visitors could read every
  column of upcoming confirmed bookings (name, email, organization) with the public key. Now only the slot columns,
  and no update, delete or truncate. Applied to amtechai-dot-com-db on 2026-10-13 (table empty at the time); the live
  form was then booked once end to end (slot read 200, insert 201) and the test row removed.
  Revert: grant select, update, delete, truncate on public.demo_bookings to anon;
*/
revoke select on public.demo_bookings from anon;
grant select (booking_date, booking_time, status) on public.demo_bookings to anon;
revoke update, delete, truncate on public.demo_bookings from anon;
