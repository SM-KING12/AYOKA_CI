import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';
import { usePartner } from '../../contexts/PartnerContext';
import { PageTransition } from '../../components/UI';
import type { PartnerCalendarEvent } from '../../types/partner';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const eventTypeColors: Record<PartnerCalendarEvent['type'], string> = {
  booking: 'bg-ai-400',
  block: 'bg-gold-500',
  availability: 'bg-nature-400',
};

const eventStatusDot: Record<PartnerCalendarEvent['status'], string> = {
  confirmed: 'bg-nature-400',
  pending: 'bg-gold-500',
  cancelled: 'bg-red-400',
  completed: 'bg-gray-300',
};

function getCalendarGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: { date: number; month: number; current: boolean }[] = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ date: prevMonthDays - i, month: month - 1, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: d, month, current: true });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ date: d, month: month + 1, current: false });
  }

  return cells;
}

export default function CalendarPage() {
  const { calendarEvents } = usePartner();
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(5); // June (0-indexed)
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const cells = useMemo(() => getCalendarGrid(year, month), [year, month]);

  const prev = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const getEventsForDate = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarEvents.filter((e) => e.date === dateStr);
  };

  const selectedEvents = selectedDate
    ? calendarEvents.filter((e) => e.date === selectedDate)
    : [];

  const today = new Date();
  const isToday = (day: number) =>
    year === today.getFullYear() && month === today.getMonth() && day === today.getDate();

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-navy-800">Calendrier</h1>
          <p className="text-gray-500 font-body text-sm mt-0.5">Planifiez et suivez vos réservations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 bg-white rounded-card-lg shadow-soft p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={prev} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-5 h-5 text-navy-800" />
            </button>
            <h2 className="font-heading font-bold text-lg text-navy-800">
              {MONTHS[month]} {year}
            </h2>
            <button onClick={next} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ChevronRight className="w-5 h-5 text-navy-800" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-heading font-semibold text-gray-400 py-2">{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell, i) => {
              const events = getEventsForDate(cell.date, cell.current);
              const dateStr = cell.current
                ? `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.date).padStart(2, '0')}`
                : '';
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={i}
                  onClick={() => cell.current && setSelectedDate(dateStr === selectedDate ? null : dateStr)}
                  className={`relative min-h-[72px] p-1.5 rounded-xl text-left transition-all duration-200 ${
                    !cell.current ? 'opacity-30 cursor-default' :
                    isSelected ? 'bg-ai-400/10 ring-2 ring-ai-400/30' :
                    isToday(cell.date) ? 'bg-navy-50' :
                    'hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-xs font-heading font-medium ${
                    isToday(cell.date) && cell.current ? 'text-ai-400 font-bold' : 'text-navy-800'
                  }`}>
                    {cell.date}
                  </span>
                  {events.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {events.slice(0, 2).map((e) => (
                        <div key={e.id} className={`h-1.5 rounded-full ${eventTypeColors[e.type]}`} />
                      ))}
                      {events.length > 2 && (
                        <div className="text-[9px] font-heading font-medium text-gray-400">+{events.length - 2}</div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day Detail */}
        <div className="bg-white rounded-card-lg shadow-soft p-6">
          <h3 className="font-heading font-bold text-sm text-navy-800 mb-4">
            {selectedDate ? new Date(selectedDate + 'T12:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Sélectionnez un jour'}
          </h3>
          {selectedEvents.length === 0 ? (
            <p className="text-gray-400 text-sm font-body">
              {selectedDate ? 'Aucun événement ce jour' : 'Cliquez sur un jour du calendrier'}
            </p>
          ) : (
            <div className="space-y-3">
              {selectedEvents.map((e) => (
                <div key={e.id} className="p-3 rounded-xl bg-gray-50">
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${eventStatusDot[e.status]}`} />
                    <div>
                      <div className="font-heading font-semibold text-xs text-navy-800">{e.title}</div>
                      <div className="flex items-center gap-2 text-gray-400 text-[10px] font-body mt-1">
                        <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {e.time}</span>
                        {e.guests > 0 && <span className="flex items-center gap-0.5"><Users className="w-3 h-3" /> {e.guests} pers.</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
