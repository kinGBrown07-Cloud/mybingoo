import App from 'next/app';
// ...existing code...

if (!process.env.NEXT_PUBLIC_APP_URL) {
  console.error('NEXT_PUBLIC_APP_URL is not defined in the environment variables.');
}

// ...existing code...
export default App;
