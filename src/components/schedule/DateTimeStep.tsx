import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import CalendarPicker from './CalendarPicker';
import TimePicker from './TimePicker';
import { formatDateForDisplay, formatDateForDB, getSlotsForDate } from './bookingConstants';
import { getBookedSlots } from './bookingService';

interface DateTimeStepProps {
  selectedDate: Date | null;
  selectedTime: string;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string) => void;
  onBack: () => void;
  onConfirm: () => void;
  submitting: boolean;
}

export default function DateTimeStep({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  onBack,
  onConfirm,
  submitting,
}: DateTimeStepProps) {
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  };

  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    onSelectTime('');
    const dateStr = formatDateForDB(selectedDate);
    getBookedSlots(dateStr).then((slots) => {
      setBookedSlots(slots);
      setLoadingSlots(false);
    });
  }, [selectedDate, onSelectTime]);

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <p className="mono-label text-red mb-1">Pick a Time</p>
        <h3 className="text-[15px] font-display font-black text-black">Select Date & Time</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl p-5" style={{
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(0,0,0,0.06)',
        }}>
          <div className="mono-label text-black/25 mb-4">Select a Date</div>
          <CalendarPicker selectedDate={selectedDate} onSelect={onSelectDate} />
        </div>

        <div className="rounded-xl p-5 min-h-[280px]" style={{
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(0,0,0,0.06)',
        }}>
          <div className="mono-label text-black/25 mb-4">Select a Time</div>
          {selectedDate ? (
            <>
              <div className="text-[11px] text-black/40 mb-4">
                {formatDateForDisplay(selectedDate)}
              </div>
              {isToday(selectedDate) ? (
                <div className="flex items-center justify-center h-full min-h-[160px]">
                  <p className="mono-label text-black/20">Sorry — All booked up!</p>
                </div>
              ) : (
                <TimePicker
                  slots={getSlotsForDate(selectedDate)}
                  bookedSlots={bookedSlots}
                  selectedTime={selectedTime}
                  onSelect={onSelectTime}
                  loading={loadingSlots}
                />
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <p className="mono-label text-black/15">Select a date first</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="btn-secondary flex-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <button
          onClick={onConfirm}
          disabled={!selectedDate || !selectedTime || submitting}
          className="btn-primary flex-1 disabled:opacity-25 disabled:cursor-not-allowed"
        >
          {submitting ? 'Scheduling...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
}
