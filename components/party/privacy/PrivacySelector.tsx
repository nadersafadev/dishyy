import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Privacy } from '@prisma/client';
import { usePartyPrivacyStore } from '@/store/partyPrivacyStore';
import { Lock, Globe, Users, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PrivacySelectorProps {
  partyId?: string;
  currentStatus: Privacy;
  isHost?: boolean;
  onChange?: (value: Privacy) => void;
}

const privacyOptions = [
  {
    value: Privacy.PUBLIC,
    label: 'Public',
    description: 'Anyone can view and join the party',
    icon: Globe,
    variant: 'default' as const,
  },
  {
    value: Privacy.CLOSED,
    label: 'Closed',
    description: 'Anyone can view, but joining requires approval',
    icon: Users,
    variant: 'secondary' as const,
  },
  {
    value: Privacy.PRIVATE,
    label: 'Private',
    description: 'Limited visibility, invitation only',
    icon: Lock,
    variant: 'outline' as const,
  },
];

export function PrivacySelector({
  partyId,
  currentStatus,
  isHost = true,
  onChange,
}: PrivacySelectorProps) {
  const { setPartyPrivacy } = usePartyPrivacyStore();
  const currentOption =
    privacyOptions.find(option => option.value === currentStatus) ??
    privacyOptions[0];

  const handlePrivacyChange = (value: Privacy) => {
    if (onChange) {
      onChange(value);
    } else if (partyId) {
      setPartyPrivacy(partyId, value);
    }
  };

  if (!isHost) {
    return (
      <div className="flex items-center gap-2">
        <currentOption.icon className="h-4 w-4" />
        <Badge variant={currentOption.variant}>{currentOption.label}</Badge>
      </div>
    );
  }

  // If we have onChange prop, use RadioGroup (for forms)
  if (onChange) {
    return (
      <div className="space-y-2">
        <Label>Privacy</Label>
        <RadioGroup
          value={currentStatus}
          onValueChange={value => handlePrivacyChange(value as Privacy)}
          className="flex flex-col space-y-2"
        >
          {privacyOptions.map(option => (
            <div
              key={option.value}
              className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer group"
              onClick={() => handlePrivacyChange(option.value)}
            >
              <RadioGroupItem
                value={option.value}
                id={option.value}
                className="mt-0"
              />
              <div className="flex items-center gap-3">
                <option.icon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-accent-foreground" />
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor={option.value}
                    className="font-medium cursor-pointer group-hover:text-accent-foreground"
                  >
                    {option.label}
                  </Label>
                  <span className="text-xs text-muted-foreground group-hover:text-accent-foreground/70">
                    {option.description}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }

  // Otherwise use DropdownMenu (for party header)
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
            onClick={() => handlePrivacyChange(option.value)}
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
