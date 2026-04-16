import { DashboardScreen } from '@/components/dashboard';
import { MobileShell } from '@/components/mobile-shell';

export default function HomePage() {
  return (
    <MobileShell>
      <DashboardScreen />
    </MobileShell>
  );
}
