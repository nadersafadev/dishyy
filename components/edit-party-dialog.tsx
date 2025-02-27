'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Edit2Icon } from 'lucide-react'
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
        <Button variant='outline' size='icon'>
          <Edit2Icon className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Party</DialogTitle>
        </DialogHeader>
        <EditPartyForm party={party} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
