import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  X,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { useCivicCalendar } from '../hooks/useCivicCalendar';
import {
  LAST_VERIFIED_DATASET_DATE,
  OFFICIAL_DISCLAIMER_TEXT,
  isHolidayOnDate
} from '../data/holidays';

interface CivicCalendarProps {
  onClose: () => void;
}

export const CivicCalendar: React.FC<CivicCalendarProps> = ({ onClose }) => {
  const {
    currentDate,
    selectedDate,
    setSelectedDate,
    selectedDateStr,
    viewMode,
    setViewMode,
    location,
    updateLocation,
    availableStates,
    activeCategories,
    toggleCategory,
    showReminders,
    setShowReminders,
    addReminder,
    deleteReminder,
    getRemindersForDate,
    selectedHolidays,
    selectedReminders,
    officeStatus,
    formatDateISO,
    goToToday,
    prevWeek,
    nextWeek,
    prevMonth,
    nextMonth
  } = useCivicCalendar();

  // Add reminder inline form state
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Location selector expand toggle
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showFilterPicker, setShowFilterPicker] = useState(false);

  const selectedStateDistricts =
    availableStates.find((s) => s.state === location.state)?.districts || ['All Districts'];

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    updateLocation({
      state: newState,
      district: 'All Districts'
    });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateLocation({
      state: location.state,
      district: e.target.value
    });
  };

  const handleSaveReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await addReminder(selectedDateStr, newTitle, newTime, newNotes);
    setNewTitle('');
    setNewTime('');
    setNewNotes('');
    setShowAddReminder(false);
  };

  // Helper: Get days for the current week view
  const getDaysForWeek = () => {
    const curr = new Date(currentDate);
    const dayOfWeek = curr.getDay(); // 0 is Sunday
    const startOfWeek = new Date(curr);
    startOfWeek.setDate(curr.getDate() - dayOfWeek);

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  };

  // Helper: Get days for monthly view (including padding days)
  const getDaysForMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDay = firstDayOfMonth.getDay(); // 0 is Sunday
    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    // Prev month padding
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const d = new Date(year, month, i);
      days.push({ date: d, isCurrentMonth: true });
    }

    // Next month padding to fill grid (multiple of 7)
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(year, month + 1, i);
        days.push({ date: d, isCurrentMonth: false });
      }
    }

    return days;
  };

  const isToday = (d: Date) => {
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  const isSelected = (d: Date) => {
    return (
      d.getDate() === selectedDate.getDate() &&
      d.getMonth() === selectedDate.getMonth() &&
      d.getFullYear() === selectedDate.getFullYear()
    );
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div
      className="absolute right-0 top-full mt-2 w-[350px] sm:w-[460px] md:w-[500px] max-w-[calc(100vw-1.5rem)] bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 text-slate-800 dark:text-slate-200 animate-in fade-in slide-in-from-top-2 duration-150 flex flex-col max-h-[85vh] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Civic Calendar & Office Timings"
    >
      {/* 1. Header with View Controls */}
      <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/70 dark:bg-zinc-950 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">Civic Calendar</h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300">
              Verified 2026
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Week / Month Toggle */}
          <div className="flex items-center bg-slate-200/80 dark:bg-zinc-900 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setViewMode('week')}
              className={`px-2.5 py-1 rounded-md transition ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-zinc-800 text-blue-700 dark:text-blue-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-2.5 py-1 rounded-md transition ${
                viewMode === 'month'
                  ? 'bg-white dark:bg-zinc-800 text-blue-700 dark:text-blue-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Month
            </button>
          </div>

          {/* Close Popover */}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-zinc-800 rounded-lg transition"
            aria-label="Close Calendar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="overflow-y-auto p-4 space-y-4 divide-y divide-slate-100 dark:divide-zinc-800">
        {/* 2. Location & Filter Sub-Bar */}
        <div className="space-y-2 pb-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Location selector toggle button */}
            <button
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-200 font-medium transition"
              title="Change State and District for Local Holidays"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
              <span className="font-semibold text-slate-900 dark:text-white">{location.state}</span>
              <span className="text-slate-400 dark:text-slate-500">•</span>
              <span className="text-slate-600 dark:text-slate-300 truncate max-w-[120px]">{location.district}</span>
            </button>

            {/* Filter categories toggle button */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowFilterPicker(!showFilterPicker)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-medium transition ${
                  showFilterPicker
                    ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                    : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Filter className="w-3 h-3" />
                <span>Filters</span>
              </button>

              <button
                onClick={goToToday}
                className="px-2 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-lg transition border border-blue-200 dark:border-blue-900"
              >
                Today
              </button>
            </div>
          </div>

          {/* Collapsible Location Picker */}
          {showLocationPicker && (
            <div className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl space-y-2 animate-in fade-in duration-100">
              <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Select Official Jurisdiction:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">State / UT</label>
                  <select
                    value={location.state}
                    onChange={handleStateChange}
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    {availableStates.map((s) => (
                      <option key={s.state} value={s.state}>
                        {s.state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">District</label>
                  <select
                    value={location.district}
                    onChange={handleDistrictChange}
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    {selectedStateDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                Determines state gazette holidays and local district administration orders.
              </p>
            </div>
          )}

          {/* Collapsible Category Filters & Legend */}
          {showFilterPicker && (
            <div className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl space-y-2 text-xs animate-in fade-in duration-100">
              <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Holiday & Event Filters:</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleCategory('national')}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] font-medium transition ${
                    activeCategories.includes('national')
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                      : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  <span>National Gazetted</span>
                </button>
                <button
                  onClick={() => toggleCategory('state')}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] font-medium transition ${
                    activeCategories.includes('state')
                      ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                      : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>State Gazetted</span>
                </button>
                <button
                  onClick={() => toggleCategory('district')}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] font-medium transition ${
                    activeCategories.includes('district')
                      ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800 text-purple-800 dark:text-purple-300'
                      : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>District Local</span>
                </button>
                <button
                  onClick={() => setShowReminders(!showReminders)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] font-medium transition ${
                    showReminders
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-300'
                      : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>Personal Reminders</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Calendar Grid (Week or Month) */}
        <div className="pt-3 space-y-2">
          {/* Navigation Bar for Period */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <button
              onClick={viewMode === 'week' ? prevWeek : prevMonth}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-300 transition"
              aria-label={viewMode === 'week' ? 'Previous Week' : 'Previous Month'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-slate-900 dark:text-white font-bold">
              {viewMode === 'week'
                ? `Week of ${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`
                : `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
            </span>

            <button
              onClick={viewMode === 'week' ? nextWeek : nextMonth}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-300 transition"
              aria-label={viewMode === 'week' ? 'Next Week' : 'Next Month'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* ============ WEEK VIEW ============ */}
          {viewMode === 'week' && (
            <div className="grid grid-cols-7 gap-1 pt-1">
              {getDaysForWeek().map((day) => {
                const dateIso = formatDateISO(day);
                const hasHoliday = isHolidayOnDate(
                  dateIso,
                  location.state,
                  location.district,
                  activeCategories
                );
                const hasReminders = getRemindersForDate(dateIso).length > 0;
                const isDaySelected = isSelected(day);
                const isDayToday = isToday(day);
                const dayName = weekDayNames[day.getDay()];

                return (
                  <button
                    key={dateIso}
                    onClick={() => setSelectedDate(day)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition text-center relative focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                      isDaySelected
                        ? 'bg-blue-700 text-white shadow-sm'
                        : isDayToday
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800'
                        : 'bg-white dark:bg-black hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-zinc-800'
                    }`}
                  >
                    <span
                      className={`text-[10px] uppercase font-semibold ${
                        isDaySelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {dayName}
                    </span>
                    <span className="text-sm font-bold mt-0.5">{day.getDate()}</span>

                    {/* Indicator dots */}
                    <div className="flex items-center justify-center gap-1 mt-1 h-1.5">
                      {hasHoliday && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isDaySelected ? 'bg-rose-300' : 'bg-rose-600'
                          }`}
                          title="Gazetted Holiday"
                        />
                      )}
                      {hasReminders && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isDaySelected ? 'bg-sky-200' : 'bg-blue-600'
                          }`}
                          title="Personal Reminder"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* ============ MONTH VIEW ============ */}
          {viewMode === 'month' && (
            <div className="space-y-1 pt-1">
              {/* Day header labels */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">
                {weekDayNames.map((d) => (
                  <div key={d} className="py-0.5">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells grid */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysForMonth().map(({ date, isCurrentMonth }) => {
                  const dateIso = formatDateISO(date);
                  const hasHoliday = isHolidayOnDate(
                    dateIso,
                    location.state,
                    location.district,
                    activeCategories
                  );
                  const hasReminders = getRemindersForDate(dateIso).length > 0;
                  const isDaySelected = isSelected(date);
                  const isDayToday = isToday(date);

                  return (
                    <button
                      key={dateIso}
                      onClick={() => setSelectedDate(date)}
                      className={`flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-lg transition relative text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                        isDaySelected
                          ? 'bg-blue-700 text-white font-bold shadow-sm'
                          : isDayToday
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800'
                          : isCurrentMonth
                          ? 'bg-white dark:bg-black hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-800 dark:text-slate-200'
                          : 'bg-slate-50/50 dark:bg-zinc-950/50 text-slate-300 dark:text-zinc-600 hover:bg-slate-100/50 dark:hover:bg-zinc-900/50'
                      }`}
                    >
                      <span>{date.getDate()}</span>

                      {/* Dots */}
                      <div className="flex items-center justify-center gap-0.5 mt-0.5 h-1">
                        {hasHoliday && (
                          <span
                            className={`w-1 h-1 rounded-full ${
                              isDaySelected ? 'bg-rose-300' : 'bg-rose-600'
                            }`}
                          />
                        )}
                        {hasReminders && (
                          <span
                            className={`w-1 h-1 rounded-full ${
                              isDaySelected ? 'bg-sky-200' : 'bg-blue-600'
                            }`}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 4. Selected Date Details Panel */}
        <div className="pt-3 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>
                  {selectedDate.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
                {isToday(selectedDate) && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Today
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{officeStatus.reason}</p>
            </div>

            {/* Office Status Badge */}
            <div
              className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                officeStatus.isOpen
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
              }`}
            >
              {officeStatus.isOpen ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Open Centers</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>Offices Closed</span>
                </>
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-zinc-950 p-2.5 rounded-lg border border-slate-100 dark:border-zinc-800">
            {officeStatus.note}
          </p>

          {/* Official Holidays on Selected Date */}
          {selectedHolidays.length > 0 ? (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                Verified Gazetted Holidays:
              </div>
              {selectedHolidays.map((holiday) => {
                const badgeColor =
                  holiday.category === 'national'
                    ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                    : holiday.category === 'state'
                    ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    : 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';

                return (
                  <div
                    key={holiday.id}
                    className="p-3 bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl space-y-2 text-xs shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                        {holiday.name}
                      </div>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md border shrink-0 ${badgeColor}`}
                      >
                        {holiday.category}
                      </span>
                    </div>

                    {holiday.description && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {holiday.description}
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Applies to: </span>
                        <span>
                          {holiday.applicableState === 'ALL'
                            ? 'All Indian States'
                            : `${holiday.applicableState} (${holiday.applicableDistrict})`}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Gazette Ref: </span>
                        <span className="font-mono text-[10px]">{holiday.officialNotificationRef}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 dark:text-slate-500">
                      <a
                        href={holiday.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 hover:underline font-medium"
                      >
                        <span>{holiday.sourceName}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      <span>Verified: {holiday.verifiedDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 dark:text-slate-500 italic">
              No gazetted public holidays notified for {location.state} on this date.
            </div>
          )}

          {/* Personal Reminders Section */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                Personal Reminders ({selectedReminders.length}):
              </span>
              <button
                onClick={() => setShowAddReminder(!showAddReminder)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
              >
                <Plus className="w-3 h-3" />
                <span>Add Reminder</span>
              </button>
            </div>

            {/* Inline Add Reminder Form */}
            {showAddReminder && (
              <form
                onSubmit={handleSaveReminder}
                className="p-3 bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl space-y-2 text-xs"
              >
                <div>
                  <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Reminder Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Visit PSK for Passport appointment"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-600 dark:text-slate-400 mb-0.5">Time (Optional)</label>
                    <input
                      type="text"
                      placeholder="10:30 AM"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 dark:text-slate-400 mb-0.5">Notes (Optional)</label>
                    <input
                      type="text"
                      placeholder="Carry original PAN & Aadhaar"
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddReminder(false)}
                    className="px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-zinc-800 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition shadow-xs"
                  >
                    Save Reminder
                  </button>
                </div>
              </form>
            )}

            {/* List of existing reminders for selected date */}
            {selectedReminders.map((rem) => (
              <div
                key={rem.id}
                className="flex items-start justify-between gap-2 p-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />
                    <span>{rem.title}</span>
                    {rem.time && (
                      <span className="text-[10px] text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/80 px-1.5 py-0.2 rounded-md font-medium">
                        {rem.time}
                      </span>
                    )}
                  </div>
                  {rem.notes && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-3">{rem.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => deleteReminder(rem.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  title="Delete reminder"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Standard Seva Kendra Timings Section */}
        <div className="pt-3 space-y-2">
          <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            Public Service Working Hours:
          </div>
          <div className="bg-slate-50 dark:bg-zinc-950 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-800 dark:text-slate-200">Monday – Friday:</span>
              <span className="font-mono text-slate-600 dark:text-slate-400">9:30 AM – 5:00 PM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-800 dark:text-slate-200">Saturday (Select PSK/ASK):</span>
              <span className="font-mono text-slate-600 dark:text-slate-400">9:00 AM – 2:00 PM</span>
            </div>
            <div className="flex justify-between items-center text-slate-400 dark:text-slate-500">
              <span>Sundays & Gazetted Holidays:</span>
              <span>Closed</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Footer Disclaimers & Action Links */}
      <div className="p-3 bg-slate-50 dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800 flex flex-col gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
        <div className="flex items-center justify-between">
          <span>Dataset verified: {LAST_VERIFIED_DATASET_DATE} (DoPT / State Gazettes)</span>
          <Link
            to="/offices"
            onClick={onClose}
            className="text-blue-700 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
          >
            <MapPin className="w-3 h-3" />
            <span>Regional Offices</span>
          </Link>
        </div>
        <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-tight">
          {OFFICIAL_DISCLAIMER_TEXT}
        </p>
      </div>
    </div>
  );
};
