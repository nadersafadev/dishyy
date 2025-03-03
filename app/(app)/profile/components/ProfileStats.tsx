import { StatCard } from '@/components/profile/StatCard';

interface ProfileStatsProps {
  totalParties: number;
  totalContributions: number;
}

export function ProfileStats({
  totalParties,
  totalContributions,
}: ProfileStatsProps) {
  return (
    <div>
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Stats</h3>
        <p className="text-sm text-muted-foreground">Your activity on Dishyy</p>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-1 gap-4">
        <StatCard title="Parties Hosted" value={totalParties} />

        <StatCard title="Dishes Contributed" value={totalContributions} />
      </div>
    </div>
  );
}
