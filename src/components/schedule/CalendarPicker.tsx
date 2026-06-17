import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarPickerProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function CalendarPicker({ selectedDate, onSelect }: CalendarPickerProps) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewMonth, setViewMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    if (prev.getFullYear() > today.getFullYear() - 1) setViewMonth(prev);
  };

  const nextMonth = () => {
    const next = new Date(year, month + 1, 1);
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, 1);
    if (next <= maxDate) setViewMonth(next);
  };

  const canGoPrev = new Date(year, month, 1) > new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoNext = new Date(year, month + 1, 1) <= new Date(today.getFullYear(), today.getMonth() + 3, 1);

  const monthLabel = viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="p-1.5 text-black/30 hover:text-black transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-[13px] font-semibold text-black tracking-wide">{monthLabel}</span>
        <button
          onClick={nextMonth}
          disabled={!canGoNext}
          className="p-1.5 text-black/30 hover:text-black transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-[9px] tracking-[0.15em] uppercase text-black/25 font-semibold py-2"
          >
            {d}
          </div>
        ))}

        {cells.map((date, i) => {
          if (!date) {
            return <div key={`empty-${i}`} className="aspect-square" />;
          }

          const isPast = date < today;
          const isSunday = date.getDay() === 0;
          const isDisabled = isPast || isSunday;
          const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
          const isToday = isSameDay(date, today);

          return (
            <button
              key={date.toISOString()}
              disabled={isDisabled}
              onClick={() => onSelect(date)}
              className={`aspect-square flex items-center justify-center text-[12px] font-medium rounded-lg transition-all duration-150 relative ${
                isDisabled
                  ? 'text-black/10 cursor-not-allowed'
                  : isSelected
                  ? 'bg-red text-white font-bold'
                  : isToday
                  ? 'text-black font-bold'
                  : 'text-black/60 hover:bg-black/[0.04]'
              }`}
            >
              {date.getDate()}
              {isToday && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
