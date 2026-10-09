import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  PersonalReminder,
  CalendarLocation,
  HolidayCategory
} from '../types/calendar';
import {
  INDIAN_STATES_AND_DISTRICTS,
  getHolidaysForDate,
  getOfficeStatusForDate
} from '../data/holidays';

const STORAGE_LOCATION_KEY = 'sevaguide_user_location';
const STORAGE_REMINDERS_KEY = 'sevaguide_personal_reminders';

export const useCivicCalendar = () => {
  const { user } = useAuth();

  // Current viewed date cursor
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  // User-selected specific date
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // View mode
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  // User location (State & District)
  const [location, setLocation] = useState<CalendarLocation>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LOCATION_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      state: 'Delhi (NCT)',
      district: 'All Districts'
    };
  });

  // Category filters
  const [activeCategories, setActiveCategories] = useState<HolidayCategory[]>([
    'national',
    'state',
    'district'
  ]);
  const [showReminders, setShowReminders] = useState<boolean>(true);

  // Personal Reminders
  const [reminders, setReminders] = useState<PersonalReminder[]>([]);
  const [remindersLoading, setRemindersLoading] = useState<boolean>(false);

  // Sync location changes to localStorage and optionally to Supabase profile metadata
  const updateLocation = useCallback(
    (newLoc: CalendarLocation) => {
      setLocation(newLoc);
      try {
        localStorage.setItem(STORAGE_LOCATION_KEY, JSON.stringify(newLoc));
      } catch (e) {
        // ignore
      }

      if (user) {
        supabase.auth.updateUser({
          data: {
            state: newLoc.state,
            district: newLoc.district
          }
        }).catch(() => {
          // non-blocking
        });
      }
    },
    [user]
  );

  // Load reminders
  const loadReminders = useCallback(async () => {
    setRemindersLoading(true);
    let loaded: PersonalReminder[] = [];

    // First try localStorage
    try {
      const storageKey = user ? `${STORAGE_REMINDERS_KEY}_${user.id}` : STORAGE_REMINDERS_KEY;
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        loaded = JSON.parse(cached);
      }
    } catch (e) {
      // ignore
    }

    // If authenticated, optionally attempt to fetch from Supabase if table exists
    if (user) {
      try {
        const { data, error } = await supabase
          .from('personal_reminders')
          .select('*')
          .eq('user_id', user.id);

        if (!error && data && data.length > 0) {
          const fromDb: PersonalReminder[] = data.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            date: d.date,
            title: d.title,
            notes: d.notes,
            time: d.time,
            createdAt: d.created_at
          }));
          loaded = fromDb;
        }
      } catch (e) {
        // Gracefully ignore if table does not exist
      }
    }

    setReminders(loaded);
    setRemindersLoading(false);
  }, [user]);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  // Add reminder
  const addReminder = useCallback(
    async (dateStr: string, title: string, time?: string, notes?: string) => {
      const newRem: PersonalReminder = {
        id: `rem-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        userId: user?.id,
        date: dateStr,
        title: title.trim(),
        time: time || '',
        notes: notes || '',
        createdAt: new Date().toISOString()
      };

      const updated = [...reminders, newRem];
      setReminders(updated);

      // Save locally
      try {
        const storageKey = user ? `${STORAGE_REMINDERS_KEY}_${user.id}` : STORAGE_REMINDERS_KEY;
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) {
        // ignore
      }

      // If logged in, attempt to persist in Supabase
      if (user) {
        try {
          await supabase.from('personal_reminders').insert({
            id: newRem.id,
            user_id: user.id,
            date: newRem.date,
            title: newRem.title,
            time: newRem.time,
            notes: newRem.notes
          });
        } catch (e) {
          // ignore if table pending
        }
      }

      return newRem;
    },
    [reminders, user]
  );

  // Delete reminder
  const deleteReminder = useCallback(
    async (id: string) => {
      const updated = reminders.filter((r) => r.id !== id);
      setReminders(updated);

      try {
        const storageKey = user ? `${STORAGE_REMINDERS_KEY}_${user.id}` : STORAGE_REMINDERS_KEY;
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) {
        // ignore
      }

      if (user) {
        try {
          await supabase.from('personal_reminders').delete().eq('id', id);
        } catch (e) {
          // ignore
        }
      }
    },
    [reminders, user]
  );

  // Filter reminders for a specific date
  const getRemindersForDate = useCallback(
    (dateStr: string) => {
      if (!showReminders) return [];
      return reminders.filter((r) => r.date === dateStr);
    },
    [reminders, showReminders]
  );

  // Navigation helpers
  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  }, []);

  const prevWeek = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  }, []);

  const nextWeek = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  }, []);

  const prevMonth = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  }, []);

  const nextMonth = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  }, []);

  // Format date helper (YYYY-MM-DD)
  const formatDateISO = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const selectedDateStr = formatDateISO(selectedDate);
  const selectedHolidays = getHolidaysForDate(
    selectedDateStr,
    location.state,
    location.district,
    activeCategories
  );
  const selectedReminders = getRemindersForDate(selectedDateStr);
  const officeStatus = getOfficeStatusForDate(selectedDate, location.state, location.district);

  const toggleCategory = (cat: HolidayCategory) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return {
    currentDate,
    setCurrentDate,
    selectedDate,
    setSelectedDate,
    selectedDateStr,
    viewMode,
    setViewMode,
    location,
    updateLocation,
    availableStates: INDIAN_STATES_AND_DISTRICTS,
    activeCategories,
    toggleCategory,
    showReminders,
    setShowReminders,
    reminders,
    remindersLoading,
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
  };
};
