import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import { FormTextField } from '@/components/ui/form-text-field'

interface AddPartyDishDialogProps {
  partyId: string
}

const formSchema = z.object({
  dishId: z.string().min(1, 'Please select a dish'),
  amountPerPerson: z.number().min(0.1, 'Amount must be greater than 0'),
})

export function AddPartyDishDialog({ partyId }: AddPartyDishDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dishes, setDishes] = useState<{ id: string; name: string }[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dishId: '',
      amountPerPerson: undefined,
    },
  })

  // Fetch available dishes when dialog opens
  const fetchDishes = async () => {
    try {
      const response = await fetch('/api/dishes')
      if (!response.ok) throw new Error('Failed to fetch dishes')
      const data = await response.json()
      setDishes(data)
    } catch (error) {
      console.error('Error fetching dishes:', error)
      toast.error('Failed to load dishes')
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/parties/${partyId}/dishes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to add dish')
      }

      toast.success('Dish added to party successfully')
      setIsOpen(false)
      form.reset()
      router.refresh()
    } catch (error) {
      console.error('Error adding dish:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to add dish')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (open) fetchDishes()
      }}
    >
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='h-8'>
          <Plus className='h-4 w-4 mr-2' />
          Add Dish
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Dish to Party</DialogTitle>
          <DialogDescription>
            Select a dish and specify the amount needed per person.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='max-h-[80vh]'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <select
                {...form.register('dishId')}
                className='w-full p-2 border rounded-md'
              >
                <option value=''>Select a dish...</option>
                {dishes.map((dish) => (
                  <option key={dish.id} value={dish.id}>
                    {dish.name}
                  </option>
                ))}
              </select>
              <FormTextField
                name='amountPerPerson'
                label='Amount per person'
                type='number'
                step='0.1'
                min='0.1'
                onChange={(e) => {
                  const value = parseFloat(e.target.value)
                  if (!isNaN(value)) {
                    form.setValue('amountPerPerson', value)
                  }
                }}
              />
              <DialogFooter>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Dish'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
