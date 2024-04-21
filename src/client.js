// Supabase client that will connect our React app to the Supabase database
import { createClient } from "@supabase/supabase-js";

const URL = process.env.REACT_APP_SUPABASE_URL; // variables specified to nellify
const API_KEY = process.env.REACT_APP_SUPABASE_API_KEY;

export const supabase = createClient(URL, API_KEY);
