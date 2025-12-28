"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, Check, ChevronsUpDown } from "lucide-react";
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
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createStationSchema, type CreateStationInput } from "../_lib/validations";
import { createStation } from "../_lib/actions";
import type { Province } from "@/types/station.types";

interface CreateStationDialogProps {
    provinces: Province[];
}

export function CreateStationDialog({ provinces }: CreateStationDialogProps) {
    const [open, setOpen] = React.useState(false);
    const [isPending, startTransition] = React.useTransition();

    const form = useForm<CreateStationInput>({
        resolver: zodResolver(createStationSchema),
        defaultValues: {
            name: "",
            address: "",
            province: {
                code: 0,
                name: "",
                codename: "",
            },
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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Station Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter station name..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter address..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="province"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Province</FormLabel>
                                    <ProvinceCombobox
                                        provinces={provinces}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
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
                                Create Station
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

interface ProvinceComboboxProps {
    provinces: Province[];
    value: { code: number; name: string; codename?: string };
    onChange: (value: { code: number; name: string; codename: string }) => void;
}

function ProvinceCombobox({ provinces, value, onChange }: ProvinceComboboxProps) {
    const [open, setOpen] = React.useState(false);

    const selectedProvince = provinces.find((p) => p.code === value.code);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between",
                        !selectedProvince && "text-muted-foreground"
                    )}
                >
                    {selectedProvince?.name ?? "Select province..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent 
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
                sideOffset={-40}
                onWheel={(e) => e.stopPropagation()}
            >
                <Command>
                    <CommandInput placeholder="Search province..." />
                    <CommandList className="max-h-60 overflow-y-auto">
                        <CommandEmpty>No province found.</CommandEmpty>
                        <CommandGroup>
                            {provinces.map((province) => (
                                <CommandItem
                                    key={province.code}
                                    value={province.name}
                                    onSelect={() => {
                                        onChange({
                                            code: province.code,
                                            name: province.name,
                                            codename: province.codename,
                                        });
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            value.code === province.code
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {province.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
