"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ProvinceCombobox } from "@/components/shared/province-combobox";
import { CreateRouteInput, createRouteSchema } from "@/lib/validations";
import { createRoute } from "@/actions";
import { getVNProvinces } from "@/queries";
import { Spinner } from "@/components/ui/spinner";


interface CreateRouteDialogProps {
    promises: Promise<[
        Awaited<ReturnType<typeof getVNProvinces>>,
    ]>;
}

export function CreateRouteDialog({ promises }: CreateRouteDialogProps) {
    const [provinces] = React.use(promises);

    const [open, setOpen] = React.useState(false);
    const [isPending, startTransition] = React.useTransition();

    const form = useForm<CreateRouteInput>({
        resolver: zodResolver(createRouteSchema),
        defaultValues: {
            distanceKm: 0,
            estimatedDurationMinutes: 0,
            basePrice: 0,
            active: true,
        },
    });

    const onSubmit = (data: CreateRouteInput) => {
        startTransition(async () => {
            const result = await createRoute(data);

            if (result.success) {
                toast.success("Route created successfully");
                form.reset();
                setOpen(false);
            } else {
                toast.error(result.error ?? "Failed to create route");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Add Route
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add New Route</DialogTitle>
                    <DialogDescription>
                        Create a new bus route between provinces.
                    </DialogDescription>
                </DialogHeader>
                <form id="create-route-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-4">
                            <Controller
                                name="departureProvince"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Departure Province</FieldLabel>
                                        <ProvinceCombobox
                                            {...field}
                                            provinces={provinces}
                                            placeholder="Select departure..."
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="destinationProvince"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Destination Province</FieldLabel>
                                        <ProvinceCombobox
                                            {...field}
                                            provinces={provinces}
                                            placeholder="Select destination..."
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <Controller
                                name="distanceKm"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="route-distance">Distance (km)</FieldLabel>
                                        <Input
                                            {...field}
                                            id="route-distance"
                                            type="number"
                                            placeholder="0"
                                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="estimatedDurationMinutes"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="route-duration">Duration (min)</FieldLabel>
                                        <Input
                                            {...field}
                                            id="route-duration"
                                            type="number"
                                            placeholder="0"
                                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="basePrice"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="route-price">Base Price (₫)</FieldLabel>
                                        <Input
                                            {...field}
                                            id="route-price"
                                            type="number"
                                            placeholder="0"
                                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </div>

                        <Controller
                            name="active"
                            control={form.control}
                            render={({ field }) => (
                                <Field orientation="horizontal" className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                        <FieldLabel>Active</FieldLabel>
                                        <FieldDescription>
                                            Enable this route for booking
                                        </FieldDescription>
                                    </div>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Spinner />}
                            Create Route
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
