const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oewvsjjuboytlsxtarjb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ld3Zzamp1Ym95dGxzeHRhcmpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0Njc1NjksImV4cCI6MjA4ODA0MzU2OX0.V08Rh3YFdXPWZ0MWlUcVLkw7OPLwAk58SNkiyw8jeqs';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

