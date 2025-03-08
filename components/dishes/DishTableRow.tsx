import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  Check,
  Edit2Icon,
  ImageIcon,
  ImagePlusIcon,
  Trash2Icon,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DeleteDishDialog } from '@/components/dishes/DeleteDishDialog';
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/forms/input';
import { FilterDropdown, FilterOption } from '@/components/ui/FilterDropdown';
import { cn } from '@/lib/utils';
import { Unit, unitLabels } from '@/lib/types';
import { toast } from '@/lib/toast';

interface Category {
  id: string;
  name: string;
  parent?: { id: string; name: string } | null;
}

interface DishTableRowProps {
  dish: {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    category: { id: string; name: string } | null;
    unit: Unit;
    _count: { parties: number };
  };
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (dishId: string) => void;
}

interface FeedbackMessage {
  type: 'success' | 'error';
  text: string;
}

export function DishTableRow({
  dish,
  selectable = false,
  selected = false,
  onSelect,
}: DishTableRowProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(dish.name);
  const [editedDescription, setEditedDescription] = useState(
    dish.description || ''
  );
  const [editedCategory, setEditedCategory] = useState(
    dish.category?.id || 'none'
  );
  const [editedUnit, setEditedUnit] = useState<Unit>(dish.unit);
  const [editedImage, setEditedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(dish.imageUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);

  // Unit options
  const unitOptions: FilterOption[] = Object.entries(unitLabels).map(
    ([value, label]) => ({
      id: value,
      label,
      value,
    })
  );

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== dish.imageUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, dish.imageUrl]);

  // Fetch categories when entering edit mode
  useEffect(() => {
    if (isEditing && categories.length === 0) {
      const fetchCategories = async () => {
        try {
          setIsLoadingCategories(true);
          const response = await fetch('/api/categories');
          if (!response.ok) {
            throw new Error('Failed to fetch categories');
          }
          const data = await response.json();
          setCategories(data.categories || []);
        } catch (error) {
          console.error('Error fetching categories:', error);
        } finally {
          setIsLoadingCategories(false);
        }
      };

      fetchCategories();
    }
  }, [isEditing, categories.length]);

  // Convert categories to FilterOptions
  const categoryOptions: FilterOption[] = [
    { id: 'none', label: 'No Category', value: 'none' },
    // Add child categories first
    ...categories
      .filter(category => category.parent)
      .sort((a, b) => {
        if (a.parent && b.parent) {
          const parentCompare = a.parent.name.localeCompare(b.parent.name);
          return parentCompare !== 0
            ? parentCompare
            : a.name.localeCompare(b.name);
        }
        return 0;
      })
      .map(category => ({
        id: category.id,
        label: category.name,
        value: category.id,
        group: category.parent?.name,
        groupId: category.parent?.id,
      })),
    // Add parent categories as hidden options (only for group headers)
    ...categories
      .filter(category => !category.parent)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(category => ({
        id: category.id,
        label: category.name,
        value: category.id,
        isParent: true,
        hidden: true,
      })),
  ];

  // Clear error feedback after 3 seconds
  useEffect(() => {
    if (feedback?.type === 'error') {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Clear success feedback after 3 seconds
  useEffect(() => {
    if (showSuccessFeedback) {
      const timer = setTimeout(() => {
        setShowSuccessFeedback(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessFeedback]);

  const handleRowClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on action buttons or if in edit mode
    if ((e.target as HTMLElement).closest('.action-buttons') || isEditing) {
      return;
    }

    if (selectable && onSelect) {
      onSelect(dish.id);
      return;
    }

    router.push(`/dishes/${dish.id}`);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // If there's a new image, upload it first
      let imageUrl = dish.imageUrl;
      if (editedImage) {
        // Convert image to base64
        const base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(editedImage);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: base64Data }),
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const { url } = await uploadResponse.json();
        imageUrl = url;
      }

      // Update the dish with all data including the new image URL
      const response = await fetch(`/api/dishes/${dish.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedName,
          description: editedDescription || null,
          categoryId: editedCategory === 'none' ? null : editedCategory,
          unit: editedUnit,
          imageUrl: imageUrl || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update dish');
      }

      setIsEditing(false);
      router.refresh();
      toast.success('Success', 'Dish updated successfully');
    } catch (error) {
      console.error('Error updating dish:', error);
      toast.error(
        'Error',
        error instanceof Error ? error.message : 'Failed to update dish'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedName(dish.name);
    setEditedDescription(dish.description || '');
    setEditedCategory(dish.category?.id || 'none');
    setEditedUnit(dish.unit);
    setEditedImage(null);
    setPreviewUrl(dish.imageUrl);
    setIsEditing(false);
  };

  return (
    <>
      <TableRow
        onClick={handleRowClick}
        className={cn(
          'cursor-pointer hover:bg-muted/50 transition-colors',
          selected && 'bg-muted',
          isEditing && 'cursor-default hover:bg-transparent'
        )}
      >
        <TableCell>
          <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted group">
            {isEditing ? (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors"
                >
                  {previewUrl ? (
                    <>
                      <Image
                        src={previewUrl}
                        alt={dish.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ImagePlusIcon className="h-6 w-6 text-white" />
                      </div>
                    </>
                  ) : (
                    <ImagePlusIcon className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
              </>
            ) : dish.imageUrl ? (
              <Image
                src={dish.imageUrl}
                alt={dish.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
              </div>
            )}
          </div>
        </TableCell>
        <TableCell className="font-medium">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editedName}
                onChange={e => setEditedName(e.target.value)}
                placeholder="Dish name"
                className="w-full"
              />
              <Input
                value={editedDescription}
                onChange={e => setEditedDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full text-sm text-muted-foreground"
              />
              <FilterDropdown
                id="unit"
                options={unitOptions}
                value={editedUnit}
                onChange={value => setEditedUnit(value as Unit)}
                className="w-full"
                showLabel={false}
                placeholder="Select unit"
              />
            </div>
          ) : (
            <div>
              <div>{dish.name}</div>
              {dish.description && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {dish.description}
                </p>
              )}
            </div>
          )}
        </TableCell>
        <TableCell>
          {isEditing ? (
            <FilterDropdown
              id="category"
              options={categoryOptions}
              value={editedCategory}
              onChange={setEditedCategory}
              className="w-48"
              showLabel={false}
              disabled={isLoadingCategories}
            />
          ) : dish.category ? (
            <span className="text-primary hover:underline cursor-pointer">
              {dish.category.name}
            </span>
          ) : (
            <span className="text-muted-foreground">None</span>
          )}
        </TableCell>
        <TableCell>
          <Badge variant="outline">
            {dish._count.parties}{' '}
            {dish._count.parties === 1 ? 'party' : 'parties'}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end items-center gap-2 action-buttons">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-green-600 hover:text-white hover:bg-green-600"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  title="Edit Dish"
                  onClick={e => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                >
                  <Edit2Icon className="h-4 w-4" />
                </Button>
                <DeleteDishDialog
                  dishId={dish.id}
                  dishName={dish.name}
                  inMenuCount={dish._count.parties}
                  trigger={
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
                      title="Delete Dish"
                      onClick={e => e.stopPropagation()}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  }
                />
              </>
            )}
          </div>
        </TableCell>
      </TableRow>
      {/* Feedback Row */}
      {(feedback?.type === 'error' || showSuccessFeedback) && (
        <TableRow>
          <TableCell
            colSpan={5}
            className={cn(
              'animate-in slide-in-from-top-1 duration-200 p-0 border-t-0',
              isEditing ? 'bg-destructive/5' : 'bg-green-50'
            )}
          >
            <div className="px-4 py-2 text-center text-sm font-medium">
              {isEditing ? (
                <span className="text-destructive">
                  <span className="mr-1">⚠️</span>
                  {feedback?.text.includes('Failed to update')
                    ? "Oops! We couldn't save your changes. Let's try that again!"
                    : feedback?.text}
                </span>
              ) : (
                <span className="text-green-600">
                  <span className="mr-1">✨</span>
                  Great! Your changes to {dish.name} dish have been saved
                  <span className="ml-1">🎉</span>
                </span>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
