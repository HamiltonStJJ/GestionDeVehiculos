import { createClient } from "@supabase/supabase-js";

const supabaseUrl ="https://bsqlflojnthiyolgzbcm.supabase.co" 
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzcWxmbG9qbnRoaXlvbGd6YmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2NDE3ODQsImV4cCI6MjA1MDIxNzc4NH0.aSeUsSWASozB3JKQyJGEZSu3Iuswr7KwpPAObYE-12Y"
export const supabase = createClient(supabaseUrl, supabaseAnonKey);