import Link from 'next/link';

interface ParentCategory {
  id: string;
  name: string;
}

interface ParentCategoryLinkProps {
  parent: ParentCategory | null | undefined;
}

export function ParentCategoryLink({ parent }: ParentCategoryLinkProps) {
  if (!parent) {
    return (
      <p className="text-muted-foreground">
        This is a top-level category with no parent.
      </p>
    );
  }

  return (
    <div>
      <Link
        href={`/categories/${parent.id}`}
        className="font-medium hover:underline"
      >
        {parent.name}
      </Link>
    </div>
  );
}
