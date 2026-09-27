import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isDemoMode = !supabaseUrl || !supabaseAnonKey

let _supabase: SupabaseClient | null = null

if (!isDemoMode) {
  _supabase = createClient(supabaseUrl!, supabaseAnonKey!)
}

// Export a real client or null (callers guard with isDemoMode)
export const supabase = _supabase
