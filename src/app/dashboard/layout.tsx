import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/server';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'User dashboard',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth check
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirect=/dashboard&message=Please sign in to access dashboard');
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar user={user} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
