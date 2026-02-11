export interface StatMetric {
  title: string;
  value: string;
  subValue?: string;
  subTextColor?: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  badgeLabel?: string;
  badgeColor?: string;
}

export interface Asset {
  name: string;
  percent: number;
  amount: number;
  color: string;
}

export interface Activity {
  id: string;
  entityName: string;
  symbol: string;
  amount: number;
  date: string;
  status: 'completed' | 'received' | 'pending';
  icon: string;
  colorTheme: 'green' | 'red' | 'blue' | 'yellow'; 
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'info' | 'warning';
}