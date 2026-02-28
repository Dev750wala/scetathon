'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const roleRoutes: Record<string, string> = {
      STUDENT: '/dashboard/student',
      SUPERVISOR: '/dashboard/supervisor',
      PIC: '/dashboard/pic',
    };
    router.replace(roleRoutes[user.role] || '/dashboard/student');
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
    </div>
  );
}
