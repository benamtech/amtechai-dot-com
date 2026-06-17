interface TimePickerProps {
  slots: string[];
  bookedSlots: string[];
  selectedTime: string;
  onSelect: (time: string) => void;
  loading: boolean;
}

export default function TimePicker({ slots, bookedSlots, selectedTime, onSelect, loading }: TimePickerProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="mono-label text-black/20">Loading availability...</div>
      </div>
    );
  }

  const morning = slots.filter((t) => t.includes('AM'));
  const afternoon = slots.filter((t) => t.includes('PM'));

  function renderSlots(slots: string[], label: string) {
    return (
      <div>
        <div className="mono-label text-black/25 mb-2">{label}</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {slots.map((time) => {
            const isBooked = bookedSlots.includes(time);
            const isSelected = selectedTime === time;

            return (
              <button
                key={time}
                disabled={isBooked}
                onClick={() => onSelect(time)}
                className={`px-2 py-2.5 text-[11px] tracking-wide rounded-lg transition-all duration-200 ${
                  isBooked
                    ? 'border border-black/5 text-black/15 cursor-not-allowed line-through'
                    : isSelected
                    ? 'bg-red text-white font-semibold'
                    : 'border border-black/10 text-black/60 hover:border-black/20 hover:text-black'
                }`}
              >
                {time.replace(' PST', '')}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {morning.length > 0 && renderSlots(morning, 'Morning')}
      {afternoon.length > 0 && renderSlots(afternoon, 'Afternoon')}
    </div>
  );
}
