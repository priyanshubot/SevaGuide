export type HolidayCategory = 'national' | 'state' | 'district';

export interface VerifiedHoliday {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  category: HolidayCategory;
  applicableState: string; // 'ALL' or specific Indian State / UT
  applicableDistrict: string; // 'ALL' or specific District
  sourceName: string;
  sourceUrl: string;
  officialNotificationRef: string;
  isOfficeClosed: boolean; // Confirmed by official gazette
  verifiedDate: string; // YYYY-MM-DD
  description?: string;
}

export interface PersonalReminder {
  id: string;
  userId?: string;
  date: string; // YYYY-MM-DD
  title: string;
  notes?: string;
  time?: string;
  createdAt: string;
}

export interface CalendarLocation {
  state: string;
  district: string;
}

export interface StateDistrictOption {
  state: string;
  districts: string[];
}
