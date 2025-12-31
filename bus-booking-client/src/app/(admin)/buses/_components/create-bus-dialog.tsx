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
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CreateBusInput, createBusSchema } from "@/lib/validations";
import { createBus } from "@/actions";
import { busTypeEnum } from "@/schemas";

const busTypeLabels: Record<typeof busTypeEnum.options[number], string> = {
    SEATER: "Seater (Ghế ngồi)",
    SLEEPER: "Sleeper (Giường nằm)",
    LIMOUSINE: "Limousine (VIP)",
};

const busTypeOptions = busTypeEnum.options.map((value) => ({
    label: busTypeLabels[value],
    value,
}));

export function CreateBusDialog() {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [isPending, startTransition] = React.useTransition();

    const form = useForm<CreateBusInput>({
        resolver: zodResolver(createBusSchema),
        defaultValues: {
            licensePlate: "",
            type: "SEATER",
        },
    });

    const onSubmit = (data: CreateBusInput) => {
        startTransition(async () => {
            const result = await createBus(data);

            if (result.success) {
                toast.success("Bus created successfully");
                form.reset();
                setOpen(false);
                router.refresh();
            } else {
                toast.error(result.error ?? "Failed to create bus");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Add Bus
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Bus</DialogTitle>
                    <DialogDescription>
                        Register a new bus to the fleet.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FieldGroup>
                        <Controller
                            name="licensePlate"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="bus-license-plate">License Plate</FieldLabel>
                                    <Input
                                        {...field}
                                        id="bus-license-plate"
                                        placeholder="e.g. 51B-12345"
                                        className="font-mono uppercase"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="type"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="bus-type">Bus Type</FieldLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger id="bus-type" aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Select bus type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {busTypeOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="animate-spin" />}
                            Create Bus
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
