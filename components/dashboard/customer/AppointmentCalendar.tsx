import type { CustomerDashboardOrder } from "@/lib/dashboard/customer.server";
import { CalendarDays, Clock3 } from "lucide-react";
import { getSuggestedLabVisit } from "./dashboard-helpers";

function buildCalendarDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const leadingBlanks = firstDay.getDay();

  return [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: lastDay.getDate() }, (_, index) => {
      const date = new Date(year, month, index + 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }),
  ];
}

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

export function AppointmentCalendar({
  orders,
}: {
  orders: CustomerDashboardOrder[];
}) {
  const today = new Date();
  const suggestedVisit = getSuggestedLabVisit(orders);
  const calendarDays = buildCalendarDays(today);
  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(today);
  const suggestedInCurrentMonth =
    suggestedVisit &&
    suggestedVisit.date.getMonth() === today.getMonth() &&
    suggestedVisit.date.getFullYear() === today.getFullYear();

  return (
    <section className='rounded-2xl border border-blue-100 bg-white p-5 shadow-lg shadow-blue-100/25 sm:p-6'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
            Lab visit calendar
          </p>
          <h2 className='mt-1 text-lg font-semibold text-slate-950'>
            {monthLabel}
          </h2>
        </div>
        <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600'>
          <CalendarDays className='h-5 w-5' />
        </span>
      </div>

      <div className='mt-5 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-[0.08em] text-slate-500'>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className='mt-2 grid grid-cols-7 gap-1'>
        {calendarDays.map((date, index) => {
          const isToday = date ? isSameDay(date, today) : false;
          const isSuggested =
            date && suggestedInCurrentMonth
              ? isSameDay(date, suggestedVisit.date)
              : false;

          return (
            <div
              key={date?.toISOString() || `blank-${index}`}
              className={
                date
                  ? `flex aspect-square items-center justify-center rounded-md text-sm font-medium ${
                      isSuggested
                        ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-sm"
                        : isToday
                          ? "border border-blue-300 bg-blue-50 text-blue-800"
                          : "bg-blue-50/50 text-slate-700"
                    }`
                  : "aspect-square"
              }
            >
              {date?.getDate()}
            </div>
          );
        })}
      </div>

      <div className='mt-5 rounded-xl border border-dashed border-blue-200 bg-blue-50/50 p-4'>
        {suggestedVisit ? (
          <>
            <div className='flex items-start gap-2'>
              <Clock3 className='mt-0.5 h-4 w-4 shrink-0 text-blue-600' />
              <div>
                <p className='text-sm font-semibold text-slate-950'>
                  Lab visit suggested
                </p>
                <p className='mt-1 text-sm leading-6 text-slate-600'>
                  {suggestedVisit.orderNumber} is ready for a lab visit. This
                  calendar marks the readiness date, not a booked appointment.
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className='text-sm font-semibold text-slate-950'>
              No scheduled appointments connected yet
            </p>
            <p className='mt-1 text-sm leading-6 text-slate-600'>
              Appointment booking data is not connected to this dashboard yet.
              Ready-for-lab orders will be highlighted here when available.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
