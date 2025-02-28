import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface NavItemProps {
  href: string;
  label: string;
  icon?: LucideIcon;
  isMobile?: boolean;
  children?: ReactNode;
}

export const NavItem = ({
  href,
  label,
  icon: Icon,
  isMobile = false,
  children,
}: NavItemProps) => {
  const mobileClasses =
    'text-base font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2';
  const desktopClasses =
    'text-sm font-medium text-muted-foreground hover:text-foreground transition-colors';

  const content = (
    <>
      {Icon && isMobile && <Icon className="h-4 w-4" />}
      {label}
      {children}
    </>
  );

  return (
    <Link href={href} className={isMobile ? mobileClasses : desktopClasses}>
      {content}
    </Link>
  );
};
