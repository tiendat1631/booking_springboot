"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createBusSchema, type CreateBusInput } from "../_lib/validations";
import { createBus } from "../_lib/actions";

const busTypeOptions = [
    { label: "Seater (Ghế ngồi)", value: "SEATER" },
    { label: "Sleeper (Giường nằm)", value: "SLEEPER" },
    { label: "Limousine (VIP)", value: "LIMOUSINE" },
] as const;

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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="licensePlate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>License Plate</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. 51B-12345"
                                            className="font-mono uppercase"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bus Type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select bus type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {busTypeOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                </Form>
            </DialogContent>
        </Dialog>
    );
}
