export default async function handler(req, res) {
  const apiUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!apiUrl) {
    return res.status(500).json({ error: 'Supabase URL is not defined' });
  }

  // ...existing code...
}
