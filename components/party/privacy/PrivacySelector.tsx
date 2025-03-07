import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PartyPrivacyStatus } from '@/lib/types/party';
import { usePartyPrivacyStore } from '@/store/partyPrivacyStore';
import { Lock, Globe, Users, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PrivacySelectorProps {
  partyId: string;
  currentStatus: PartyPrivacyStatus;
  isHost: boolean;
}

const privacyOptions = [
  {
    value: PartyPrivacyStatus.PUBLIC,
    label: 'Public',
    description: 'Anyone can view and join the party',
    icon: Globe,
    variant: 'default' as const,
  },
  {
    value: PartyPrivacyStatus.CLOSED,
    label: 'Closed',
    description: 'Anyone can view, but joining requires approval',
    icon: Users,
    variant: 'secondary' as const,
  },
  {
    value: PartyPrivacyStatus.PRIVATE,
    label: 'Private',
    description: 'Limited visibility, invitation only',
    icon: Lock,
    variant: 'outline' as const,
  },
];

export function PrivacySelector({
  partyId,
  currentStatus,
  isHost,
}: PrivacySelectorProps) {
  const { setPartyPrivacy } = usePartyPrivacyStore();
  const currentOption =
    privacyOptions.find(option => option.value === currentStatus) ??
    privacyOptions[2];

  if (!isHost) {
    return (
      <div className="flex items-center gap-2">
        <currentOption.icon className="h-4 w-4" />
        <Badge variant={currentOption.variant}>{currentOption.label}</Badge>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
          <currentOption.icon className="h-4 w-4" />
          <Badge variant={currentOption.variant}>{currentOption.label}</Badge>
          <ChevronDown className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {privacyOptions.map(option => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setPartyPrivacy(partyId, option.value)}
            className="flex items-center gap-3 cursor-pointer py-3 px-4 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
          >
            <option.icon className="h-4 w-4 shrink-0" />
            <div className="flex flex-col gap-1">
              <span className="font-medium">{option.label}</span>
              <span className="text-xs text-muted-foreground group-hover:text-accent-foreground/70">
                {option.description}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
