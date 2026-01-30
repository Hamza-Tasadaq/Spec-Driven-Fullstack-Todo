import { AuthForm } from '@/components/AuthForm';

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <AuthForm mode="signup" />
    </main>
  );
}
