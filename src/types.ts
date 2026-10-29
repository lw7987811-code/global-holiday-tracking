export interface OverseasTrackerItem {
  id: string;
  exchange: 'CBOT' | 'CME' | 'COMEX' | 'NYMEX' | 'ICUS' | 'ICEU' | 'LME';
  name: string;
  focusType: 'opportunity' | 'risk' | 'neutral';
  focusText: string; // Max 6 chars
  isRisk?: boolean;
  lastPrice?: string;
  changePercent?: string;
}

export interface AnalystComment {
  id: string;
  title: string;
  summary: string;
  time: string;
  timestamp: number;
  author: string;
  authorRole: string;
  symbol: string;
  changeStr: string;
  isUp: boolean;
  hasAudio: boolean;
}

export interface HolidayNewsItem {
  id: string;
  time: string;
  tag: '宏观' | '外盘' | '内盘' | '行业' | string;
  title: string;
  content: string;
  source: string;
  imageUrl?: string;
  timestamp: number;
  isLead?: boolean;
}

export interface LiveStreamItem {
  id: string;
  title: string;
  shortTitle: string;
  startTime: string;
  duration: string;
  speaker: string;
  role: string;
  type: 'upcoming' | 'replay';
  tag?: string;
  heat?: number;
  status: 'upcoming' | 'live' | 'ended';
  avatarLetter: string;
}

export interface CheckInDay {
  day: string;
  dateStr: string;
  label: string;
  isFest?: boolean;
  isDone: boolean;
}

export interface GlobalEventItem {
  id: string;
  time: string;
  event: string;
  details: string;
  impact: string;
}

export interface AppConfig {
  themeColor: 'blue' | 'red' | 'orange';
  heroTitle: string;
  heroSub: string;
  heroBannerImg: string;
  updateTimeStr: string;
  fallbackFocusType: '' | 'opportunity' | 'risk' | 'neutral';
  fallbackFocusText: string;
  globalEvents: GlobalEventItem[];
}
