'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Privacy } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormTextField } from '@/components/forms/form-text-field';
import { FormDateField } from '@/components/forms/form-date-field';
import { FormNumberField } from '@/components/forms/form-number-field';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  ArrowRight,
  CalendarIcon,
  Globe,
  Lock,
  Users,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormTextAreaField } from './forms/form-textarea-field';
import { FormRadioField } from './forms/form-radio-field';
import { Input } from '@/components/forms/input';
import { DishSelector } from './dishes/DishSelector';
import { DishWithRelations } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  date: z.date({
    required_error: 'Please select a date',
  }),
  maxParticipants: z.number().positive().optional(),
  privacy: z.nativeEnum(Privacy).default(Privacy.PUBLIC),
  dishes: z
    .array(
      z.object({
        dishId: z.string(),
        amountPerPerson: z.number().min(0, 'Amount cannot be negative'),
      })
    )
    .min(1, 'At least one dish is required'),
});

type FormData = z.infer<typeof formSchema>;

interface StepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: StepProps[] = [
  {
    title: 'Basic Information',
    description: 'Give your party a name and description',
    icon: <UtensilsCrossed className="h-6 w-6" />,
  },
  {
    title: 'Date & Participants',
    description: 'When is your party and who can join?',
    icon: <CalendarIcon className="h-6 w-6" />,
  },
  {
    title: 'Privacy Settings',
    description: 'Control who can see and join your party',
    icon: <Lock className="h-6 w-6" />,
  },
  {
    title: 'Select Dishes',
    description: 'Choose dishes and set amounts per person',
    icon: <UtensilsCrossed className="h-6 w-6" />,
  },
];

const CreatePartyForm: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [availableDishes, setAvailableDishes] = useState<DishWithRelations[]>(
    []
  );
  const [selectedDishes, setSelectedDishes] = useState<DishWithRelations[]>([]);
  const [isLoadingDishes, setIsLoadingDishes] = useState(false);

  const fetchDishes = async (search?: string) => {
    try {
      setIsLoadingDishes(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);

      const response = await fetch(`/api/dishes?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableDishes(data.dishes);
      }
    } catch (error) {
      console.error('Error fetching dishes:', error);
    } finally {
      setIsLoadingDishes(false);
    }
  };

  useEffect(() => {
    if (currentStep === 3) {
      fetchDishes();
    }
  }, [currentStep]);

  const handleDishSearch = (query: string) => {
    fetchDishes(query);
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      maxParticipants: undefined,
      privacy: Privacy.PUBLIC,
      dishes: [],
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      setSuccess(false);

      const response = await fetch('/api/parties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          date: data.date.toISOString(),
          maxParticipants: data.maxParticipants
            ? Number(data.maxParticipants)
            : undefined,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccess(true);
        form.reset();
        router.push(`/parties/${responseData.id}`);
        router.refresh();
      } else {
        setError(responseData.error || 'Failed to create party');
      }
    } catch (error) {
      console.error('Error creating party:', error);
      setError('An unexpected error occurred');
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleDishCreated = (dish: DishWithRelations) => {
    // Clear any existing error
    setError(null);
    // Add to available dishes
    setAvailableDishes(prev => [...prev, dish]);
  };

  const handleDishSelect = (dish: DishWithRelations) => {
    // Clear any existing error
    setError(null);

    // Update selected dishes
    setSelectedDishes(prev => {
      if (prev.some(d => d.id === dish.id)) {
        return prev;
      }
      return [...prev, dish];
    });

    // Update form value
    const currentDishes = form.getValues('dishes') || [];
    if (!currentDishes.some(d => d.dishId === dish.id)) {
      form.setValue(
        'dishes',
        [...currentDishes, { dishId: dish.id, amountPerPerson: 1 }],
        { shouldValidate: true }
      );
    }
  };

  const handleDishDeselect = (dishId: string) => {
    setSelectedDishes(prev => prev.filter(dish => dish.id !== dishId));
    const currentDishes = form.getValues('dishes') || [];
    form.setValue(
      'dishes',
      currentDishes.filter(dish => dish.dishId !== dishId)
    );
  };

  const handleAmountChange = (dishId: string, amount: number) => {
    const currentDishes = form.getValues('dishes') || [];
    form.setValue(
      'dishes',
      currentDishes.map(dish =>
        dish.dishId === dishId ? { ...dish, amountPerPerson: amount } : dish
      )
    );
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <FormTextField
              name="name"
              label="Party Name"
              placeholder="Enter a memorable name for your party"
            />
            <FormTextAreaField
              name="description"
              label="Description"
              placeholder="Tell your guests what this party is about"
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <FormDateField name="date" label="Party Date" />
            <FormNumberField
              name="maxParticipants"
              label="Maximum Participants"
              placeholder="Leave empty for no limit"
              description="Set a limit for the number of participants (optional)"
              min={1}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <FormRadioField
              name="privacy"
              label="Privacy"
              options={[
                {
                  value: Privacy.PUBLIC,
                  label: 'Public',
                  description: 'Anyone can view and join the party',
                  icon: Globe,
                },
                {
                  value: Privacy.CLOSED,
                  label: 'Closed',
                  description: 'Anyone can view, but joining requires approval',
                  icon: Users,
                },
                {
                  value: Privacy.PRIVATE,
                  label: 'Private',
                  description: 'Limited visibility, invitation only',
                  icon: Lock,
                },
              ]}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            {form.formState.errors.dishes && (
              <p className="text-sm text-destructive">
                {form.formState.errors.dishes.message}
              </p>
            )}

            <DishSelector
              availableDishes={availableDishes}
              selectedDishes={selectedDishes}
              onDishSelect={handleDishSelect}
              onDishDeselect={handleDishDeselect}
              onDishCreated={handleDishCreated}
              onSearch={handleDishSearch}
              isLoading={isLoadingDishes}
            />

            {selectedDishes.length > 0 && (
              <Card className="p-4">
                <h3 className="font-medium mb-4">Amount per Person</h3>
                <div className="space-y-4">
                  {form.watch('dishes')?.map(dish => {
                    const dishDetails = selectedDishes.find(
                      d => d.id === dish.dishId
                    );
                    return (
                      <div
                        key={dish.dishId}
                        className="flex items-center gap-4"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{dishDetails?.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {dishDetails?.unit}
                          </div>
                        </div>
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          value={dish.amountPerPerson}
                          onChange={e =>
                            handleAmountChange(
                              dish.dishId,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-24"
                        />
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto">
      {/* Progress Steps */}
      <div className="mb-4">
        <div className="grid grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                'relative',
                index < currentStep ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    'flex items-center justify-center w-12 h-12 rounded-full border-2 mb-3',
                    index === currentStep
                      ? 'border-primary bg-primary/10'
                      : index < currentStep
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/30'
                  )}
                >
                  {step.icon}
                </div>
                <div
                  className={cn(
                    'space-y-0.5',
                    index === currentStep && 'text-foreground'
                  )}
                >
                  <p
                    className={cn(
                      'text-sm font-medium',
                      index === currentStep && 'text-primary'
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground hidden md:block">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-1/2 right-0 top-6 h-[2px] -z-10">
                  <div className="w-full h-full bg-muted" />
                  {index < currentStep && (
                    <div className="absolute inset-0 bg-primary transition-all duration-300" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="relative mt-4 md:hidden">
          <div className="absolute top-0 left-0 h-1 bg-muted w-full rounded" />
          <div
            className="absolute top-0 left-0 h-1 bg-primary rounded transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 mb-6 bg-primary/10 text-primary rounded-lg text-sm">
          Party created successfully!
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-card rounded-lg shadow-sm">
            <div className="p-6">
              <div className="space-y-6">
                {/* Step Title */}
                <div className="pb-4 border-b md:hidden">
                  <h2 className="text-lg font-semibold">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {steps[currentStep].description}
                  </p>
                </div>

                {renderStepContent(currentStep)}

                <div className="flex justify-between pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  {currentStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {form.formState.isSubmitting
                        ? 'Creating...'
                        : 'Create Party'}
                    </Button>
                  ) : (
                    <Button type="button" onClick={nextStep}>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreatePartyForm;
