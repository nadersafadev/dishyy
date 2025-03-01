import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  buttonHref?: string;
}

export function PageHeader({
  title,
  description,
  buttonText,
  buttonIcon = <PlusIcon className="h-4 w-4" />,
  buttonHref,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {buttonText && buttonHref && (
        <Link href={buttonHref} className="self-start sm:self-auto">
          <Button className="gap-2 w-full sm:w-auto">
            {buttonIcon}
            {buttonText}
          </Button>
        </Link>
      )}
    </div>
  );
}
