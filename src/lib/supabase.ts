import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kkfnbdxfbubumnumnjkq.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZm5iZHhmYnVidW1udW1uamtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MjE1NjcsImV4cCI6MjA5MDQ5NzU2N30.I-vjqRT9q4gM0H87XxshlwRtj9zoiViiIj-2J99AfTM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export interface AppContent {
  scope: string
  key: string
  value: string
  updated_at?: string
}

export interface SiteConfig {
  id: number
  church_name: string
  pastor_name: string
  tagline: string
  denomination: string
  logo_url: string
  primary_color: string
  updated_at?: string
}

export interface MenuItem {
  module_key: string
  display_text: string
  sort_order: number
  active: boolean
}
