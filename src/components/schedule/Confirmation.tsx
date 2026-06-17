import { Link } from 'react-router-dom';
import { type BookingData } from './bookingService';

interface ConfirmationProps {
  booking: BookingData;
}

export default function Confirmation({ booking }: ConfirmationProps) {
  const details = [
    { label: 'Date', value: booking.bookingDate },
    { label: 'Time', value: booking.bookingTime },
    { label: 'Name', value: booking.name },
    { label: 'Organization', value: booking.organization },
    { label: 'Industry', value: booking.industry },
    { label: 'Topic', value: booking.topic },
  ];

  return (
    <div className="space-y-4">
      <div className="glass-card px-6 py-6 sm:px-8">
        <p className="mono-label text-red mb-1">Confirmed</p>
        <h2 className="text-[22px] sm:text-[28px] font-display font-black text-black leading-tight">
          Demo Scheduled
        </h2>
        <p className="text-[12px] text-black/40 mt-1">
          Confirmation sent to <span className="text-black/70 font-medium">{booking.email}</span>
        </p>
      </div>

      <div className="glass-card px-6 py-6 sm:px-8">
        <div className="mono-label text-black/25 mb-4">Booking Details</div>
        <div className="space-y-0">
          {details.map(({ label, value }, i) => (
            <div
              key={label}
              className={`flex items-center justify-between py-3 ${
                i < details.length - 1 ? 'border-b border-black/[0.06]' : ''
              }`}
            >
              <span className="mono-label text-black/25">{label}</span>
              <span className="text-[13px] font-medium text-black/80">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <Link to="/" className="btn-secondary w-full text-center block">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
