import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { ImageIcon, X } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  onRemove: () => void
  disabled?: boolean
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const file = acceptedFiles[0]
        if (!file) return

        setLoading(true)
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: await new Promise((resolve) => {
              const reader = new FileReader()
              reader.onloadend = () => resolve(reader.result)
              reader.readAsDataURL(file)
            }),
          }),
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const data = await response.json()
        onChange(data.url)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    maxFiles: 1,
    disabled: disabled || loading,
  })

  return (
    <div className='space-y-4 w-full'>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-4 hover:bg-muted/50 transition cursor-pointer',
          isDragActive && 'border-primary',
          disabled && 'opacity-50 cursor-default'
        )}
      >
        <input {...getInputProps()} />
        <div className='flex flex-col items-center justify-center gap-2'>
          <div className='p-2 bg-muted rounded-full'>
            <ImageIcon className='w-6 h-6 text-muted-foreground' />
          </div>
          <p className='text-sm text-muted-foreground text-center'>
            {loading ? (
              'Uploading...'
            ) : (
              <>
                Drag & drop an image here, or click to select
                <br />
                <span className='text-xs'>
                  Supported formats: PNG, JPG, GIF
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      {value && (
        <div className='relative aspect-video rounded-lg overflow-hidden'>
          <div className='absolute top-2 right-2 z-10'>
            <Button
              type='button'
              variant='destructive'
              size='icon'
              className='h-7 w-7'
              onClick={onRemove}
              disabled={disabled || loading}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
          <Image
            src={value}
            alt='Upload'
            className='object-cover'
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
      )}
    </div>
  )
}
