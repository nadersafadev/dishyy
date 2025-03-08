import { DishForm } from '@/components/DishForm';
import { DishWithRelations } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EditDishDialogProps {
  dish: DishWithRelations;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDishDialog({
  dish,
  open,
  onOpenChange,
}: EditDishDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Dish: {dish.name}</DialogTitle>
        </DialogHeader>
        <DishForm
          dish={{
            ...dish,
            category: dish.category || undefined,
            defaultAmount: null,
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
