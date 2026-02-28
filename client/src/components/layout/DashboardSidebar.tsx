'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Avatar from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

const STUDENT_NAV = [
  { href: '/dashboard/student', label: 'Dashboard', icon: '🏠' },
  { href: '/dashboard/student/report', label: 'New Report', icon: '📸' },
  { href: '/dashboard/student/history', label: 'My Reports', icon: '📋' },
];

const SUPERVISOR_NAV = [
  { href: '/dashboard/supervisor', label: 'Dashboard', icon: '🏠' },
  { href: '/dashboard/supervisor/jobs', label: 'Job Queue', icon: '⚙️' },
  { href: '/dashboard/supervisor/assign', label: 'Assign Workers', icon: '👷' },
];

const PIC_NAV = [
  { href: '/dashboard/pic', label: 'Dashboard', icon: '🏠' },
  { href: '/dashboard/pic/analytics', label: 'Analytics', icon: '📊' },
  { href: '/dashboard/pic/heatmap', label: 'Heatmap', icon: '🗺️' },
  { href: '/dashboard/pic/insights', label: 'AI Insights', icon: '🤖' },
  { href: '/dashboard/pic/audit', label: 'Audit Trail', icon: '🔐' },
];

const NAV_BY_ROLE: Record<string, typeof STUDENT_NAV> = {
  STUDENT: STUDENT_NAV,
  SUPERVISOR: SUPERVISOR_NAV,
  PIC: PIC_NAV,
};

export default function DashboardSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const navItems = user ? (NAV_BY_ROLE[user.role] || STUDENT_NAV) : STUDENT_NAV;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SC</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Swachh Campus</p>
            <p className="text-xs text-gray-400">360°</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      {user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <Avatar name={user.name} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-400">{user.role}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full text-xs text-gray-500 hover:text-red-600 text-left transition-colors">
            Sign out →
          </button>
        </div>
      )}
    </aside>
  );
}
