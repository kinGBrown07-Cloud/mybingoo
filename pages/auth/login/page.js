export default function Login() {
  const apiUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!apiUrl) {
    console.error('NEXT_PUBLIC_APP_URL is not defined.');
  }

  return (
    <div>
      {/* ...existing code... */}
    </div>
  );
}
