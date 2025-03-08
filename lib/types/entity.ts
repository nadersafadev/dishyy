export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BaseEntity {
  id: string;
  name: string;
}

export interface EntityTableColumn<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface BaseEntityTableProps<T extends BaseEntity> {
  data: T[];
  columns: EntityTableColumn<T>[];
  pagination: PaginationMeta;
  sortBy?: string;
  sortOrder?: string;
  baseUrl: string;
  onDelete?: (id: string) => Promise<void>;
  onEdit?: (id: string) => void;
  editDialog?: (item: T) => React.ReactNode;
  actions?: (item: T) => React.ReactNode[];
  selectable?: boolean;
  selectedIds?: string[];
  onRowSelect?: (id: string) => void;
  onRowClick?: (item: T) => void;
}

export interface BaseEntityGridProps<T extends BaseEntity> {
  data: T[];
  renderCard: (item: T) => React.ReactNode;
  pagination: PaginationMeta;
  sortBy?: string;
  sortOrder?: string;
  baseUrl: string;
}
