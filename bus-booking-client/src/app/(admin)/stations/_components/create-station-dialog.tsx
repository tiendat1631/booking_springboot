"use client";

import * as React from "react";
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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ProvinceCombobox } from "@/components/shared/province-combobox";
import { CreateStationInput, createStationSchema } from "@/lib/validations";
import { createStation } from "@/actions";
import { getVNProvinces } from "@/queries";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

interface CreateStationDialogProps {
    promises: Promise<[
        Awaited<ReturnType<typeof getVNProvinces>>,
    ]>;
}

export function CreateStationDialog({ promises }: CreateStationDialogProps) {
    const [provinces] = React.use(promises);
    const [open, setOpen] = React.useState(false);
    const [isPending, startTransition] = React.useTransition();

    const form = useForm<CreateStationInput>({
        resolver: zodResolver(createStationSchema),
        defaultValues: {
            name: "",
            address: "",
        },
    });

    const onSubmit = (data: CreateStationInput) => {
        startTransition(async () => {
            const result = await createStation(data);

            if (result.success) {
                toast.success("Station created successfully");
                form.reset();
                setOpen(false);
            } else {
                toast.error(result.error ?? "Failed to create station");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Add Station
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Station</DialogTitle>
                    <DialogDescription>
                        Create a new bus station. Fill in the details below.
                    </DialogDescription>
                </DialogHeader>
                <form id="create-station-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="station-name">Station Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id="station-name"
                                        placeholder="Enter station name..."
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="address"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="station-address">Address</FieldLabel>
                                    <InputGroup>
                                        <InputGroupTextarea
                                            {...field}  
                                            id="station-address"
                                            placeholder="Enter address..."
                                            rows={3}
                                            aria-invalid={fieldState.invalid}
                                        />
                                        <InputGroupAddon align="block-end">
                                            <InputGroupText className="tabular-nums">
                                                {field.value.length}/100 characters
                                            </InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="province"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Province</FieldLabel>
                                    <ProvinceCombobox
                                        {...field}
                                        provinces={provinces}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
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
                            Create Station
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
