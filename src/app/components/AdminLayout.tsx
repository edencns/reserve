import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Button } from './Button';
import { getCurrentUser, logoutUser } from '../mockData';
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  Users,
  FileText,
  BarChart3,
  DollarSign,
  Building2,
  LogOut,
  Receipt,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();

  if (!currentUser) {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = () => {
    logoutUser();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/events', label: 'Events', icon: Calendar },
    { path: '/admin/reservations', label: 'Reservations', icon: Ticket },
    { path: '/admin/vendors', label: 'Vendors', icon: Users },
    { path: '/admin/participation-fees', label: 'Fees', icon: Receipt },
    { path: '/admin/contracts', label: 'Contracts', icon: FileText },
    { path: '/admin/statistics', label: 'Statistics', icon: BarChart3 },
    { path: '/admin/settlement', label: 'Settlement', icon: DollarSign },
    { path: '/admin/company', label: 'Company', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-[var(--brand-lime)] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[var(--brand-dark)] flex flex-col">
        <div className="p-8 border-b border-[var(--brand-dark)]">
          <Link to="/admin" className="font-serif text-3xl">
            Aura Admin
          </Link>
          <div className="text-xs uppercase tracking-[0.15em] text-[var(--brand-accent)] mt-2">
            {currentUser.role}
          </div>
        </div>

        <nav className="flex-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 mb-1 transition-colors ${
                  isActive
                    ? 'bg-[var(--brand-dark)] text-[var(--brand-lime)]'
                    : 'hover:bg-[var(--brand-accent)]/20'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--brand-dark)]">
          <div className="mb-4 text-sm">
            <div className="opacity-70 text-xs uppercase tracking-wider mb-1">Logged in as</div>
            <div>{currentUser.email}</div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}