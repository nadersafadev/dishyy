'use client'

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
import { Edit } from 'lucide-react'
import { useState } from 'react'
import { EditPartyForm } from './edit-party-form'
import { Party, PartyDish, PartyParticipant } from '@prisma/client'

interface PartyWithDetails extends Party {
  dishes: (PartyDish & {
    dish: {
      name: string
      unit: string
    }
  })[]
  participants: (PartyParticipant & {
    user: {
      name: string
    }
  })[]
}

interface EditPartyDialogProps {
  party: PartyWithDetails
}

export function EditPartyDialog({ party }: EditPartyDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='icon' className='h-9 w-9'>
          <Edit className='h-4 w-4' />
          <span className='sr-only'>Edit party</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Party</DialogTitle>
          <DialogDescription>
            Make changes to the party details.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='max-h-[80vh]'>
          <EditPartyForm party={party} onClose={() => setOpen(false)} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
