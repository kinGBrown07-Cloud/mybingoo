const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://qqwvqfpgkqkrxvpxzqjz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxd3ZxZnBna3FrcnhmcHh6cWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk0OTY2NDgsImV4cCI6MjAyNTA3MjY0OH0.BqQY4RCNkGcw6P6PQX_QVGvpqkwDPOOxGZmBfnWgZLg'
);

async function checkUsers() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*');

    if (error) throw error;
    console.log('Users:', users);
  } catch (err) {
    console.error('Error:', err);
  }
}

checkUsers();
