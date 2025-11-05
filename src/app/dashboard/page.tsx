import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Overview of your account',
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Welcome Section */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here's your dashboard overview.
            </p>
          </div>

          {/* Content Area - Add your content here */}
          <div className="rounded-lg border bg-card p-8">
            <div className="text-center text-muted-foreground">
              <p>Your dashboard content goes here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
