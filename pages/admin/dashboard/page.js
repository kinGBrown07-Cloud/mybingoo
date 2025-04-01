import { useEffect } from 'react';

export default function Dashboard() {
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!apiUrl) {
      console.error('NEXT_PUBLIC_APP_URL is not defined.');
      return;
    }

    const url = new URL('/api/admin/dashboard', apiUrl);
    console.log('Dashboard API URL:', url.toString());
    // ...existing code...
  }, []);

  return (
    <div>
      {/* ...existing code... */}
    </div>
  );
}
