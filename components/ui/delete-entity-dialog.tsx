'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircleIcon } from 'lucide-react';
import { Input } from '@/components/forms/input';
import { Label } from '@/components/ui/label';

interface Warning {
  type: 'warning' | 'info';
  title: string;
  message: string;
}

interface DeleteEntityDialogProps {
  // Basic information
  entityId: string;
  entityName: string;
  entityType: string; // e.g., "Category", "Dish", "Unit"

  // Delete endpoint
  deleteEndpoint: string;

  // Optional additional info
  warnings?: Warning[];

  // UI customization
  title?: string;
  confirmText?: string;
  cancelText?: string;

  // Security options
  requireConfirmation?: boolean; // Whether to require typing entity name

  // Trigger button
  trigger?: React.ReactNode;

  // For controlled dialogs
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  // Callbacks
  onSuccess?: () => void;
}

export function DeleteEntityDialog({
  entityId,
  entityName,
  entityType,
  deleteEndpoint,
  warnings = [],
  title,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  requireConfirmation = false,
  trigger,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
}: DeleteEntityDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationInput, setConfirmationInput] = useState('');

  const isControlled =
    controlledOpen !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange(newOpen);
    } else {
      setOpen(newOpen);
    }

    // Reset confirmation text when dialog closes
    if (!newOpen) {
      setConfirmationInput('');
    }
  };

  const isConfirmed = !requireConfirmation || confirmationInput === entityName;
  const dialogTitle = title || `Delete ${entityType}`;

  const handleDelete = async () => {
    if (requireConfirmation && !isConfirmed) {
      setError(
        `Please type the exact ${entityType.toLowerCase()} name to confirm`
      );
      return;
    }

    try {
      setDeleting(true);
      setError(null);

      const response = await fetch(deleteEndpoint, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.error || `Failed to delete ${entityType.toLowerCase()}`
        );
      }

      setIsOpen(false);

      if (onSuccess) {
        onSuccess();
      }

      router.refresh();
    } catch (error) {
      console.error(`Error deleting ${entityType.toLowerCase()}:`, error);
      setError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setDeleting(false);
    }
  };

  const dialogContent = (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-destructive flex items-center gap-2">
          <AlertCircleIcon className="h-5 w-5" /> {dialogTitle}
        </DialogTitle>
      </DialogHeader>

      <div className="py-4">
        <p className="mb-4">
          Are you sure you want to {dialogTitle.toLowerCase()}{' '}
          <strong>{entityName}</strong>?
        </p>

        {warnings.map((warning, index) => (
          <div
            key={index}
            className={
              warning.type === 'warning'
                ? 'bg-amber-50 border border-amber-200 rounded-md p-3 mb-4'
                : 'bg-blue-50 border border-blue-200 rounded-md p-3 mb-4'
            }
          >
            <p
              className={
                warning.type === 'warning'
                  ? 'text-amber-800 font-medium'
                  : 'text-blue-800 font-medium'
              }
            >
              {warning.title}
            </p>
            <p
              className={
                warning.type === 'warning'
                  ? 'text-amber-700 text-sm mt-1'
                  : 'text-blue-700 text-sm mt-1'
              }
            >
              {warning.message}
            </p>
          </div>
        ))}

        {requireConfirmation && (
          <div className="space-y-2 pt-2 mt-4">
            <Label htmlFor="confirm-text" className="font-medium">
              Type the {entityType.toLowerCase()} name to confirm
            </Label>
            <Input
              id="confirm-text"
              value={confirmationInput}
              onChange={e => setConfirmationInput(e.target.value)}
              placeholder={`Type "${entityName}" to confirm`}
              className={`border-2 ${
                confirmationInput
                  ? confirmationInput === entityName
                    ? 'border-green-500 bg-green-50'
                    : 'border-destructive/50 bg-destructive/10'
                  : ''
              }`}
            />
            <p className="text-sm text-muted-foreground">
              Type the exact name to enable the {confirmText.toLowerCase()}{' '}
              button.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md mt-4">
            {error}
          </div>
        )}
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button
          variant="outline"
          onClick={() => setIsOpen(false)}
          disabled={deleting}
        >
          {cancelText}
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={deleting || !isConfirmed}
          className={
            isConfirmed
              ? ''
              : 'bg-destructive/50 text-destructive-foreground/50 cursor-not-allowed'
          }
        >
          {deleting ? `Deleting...` : confirmText}
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  if (trigger) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {dialogContent}
    </Dialog>
  );
}
