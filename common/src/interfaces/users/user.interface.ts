export interface IUser {
  id?: number;
  name: string;
  email: string;
  phone?: number | null;
  password?: string | null;
  role?: 'admin' | 'user';
  otp_enabled?: boolean;
  last_logged_in_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}
