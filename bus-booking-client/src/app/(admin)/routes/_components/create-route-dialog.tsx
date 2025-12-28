"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
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
import { createRouteSchema, type CreateRouteInput } from "../_lib/validations";
import { createRoute } from "../_lib/actions";
import type { Station } from "@/types/station.types";

interface CreateRouteDialogProps {
    stations: Station[];
}

export function CreateRouteDialog({ stations }: CreateRouteDialogProps) {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [isPending, startTransition] = React.useTransition();

    const form = useForm<CreateRouteInput>({
        resolver: zodResolver(createRouteSchema),
        defaultValues: {
            name: "",
            departureStationId: "",
            arrivalStationId: "",
            distanceKm: 0,
            estimatedDurationMinutes: 0,
            basePrice: 0,
            description: "",
        },
    });

    const onSubmit = (data: CreateRouteInput) => {
        startTransition(async () => {
            const result = await createRoute(data);

            if (result.success) {
                toast.success("Route created successfully");
                form.reset();
                setOpen(false);
                router.refresh();
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
                        Create a new bus route between stations.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Route Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Sài Gòn - Đà Lạt"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="departureStationId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Departure Station</FormLabel>
                                        <StationCombobox
                                            stations={stations}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select departure..."
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="arrivalStationId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Arrival Station</FormLabel>
                                        <StationCombobox
                                            stations={stations}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select arrival..."
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="distanceKm"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Distance (km)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="estimatedDurationMinutes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duration (min)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="basePrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Base Price (₫)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Route description..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
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
                                Create Route
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

interface StationComboboxProps {
    stations: Station[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

function StationCombobox({ stations, value, onChange, placeholder }: StationComboboxProps) {
    const [open, setOpen] = React.useState(false);

    const selectedStation = stations.find((s) => s.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between",
                        !selectedStation && "text-muted-foreground"
                    )}
                >
                    <span className="truncate">
                        {selectedStation?.name ?? placeholder ?? "Select station..."}
                    </span>
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent 
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
                onWheel={(e) => e.stopPropagation()}
            >
                <Command>
                    <CommandInput placeholder="Search station..." />
                    <CommandList className="max-h-60 overflow-y-auto">
                        <CommandEmpty>No station found.</CommandEmpty>
                        <CommandGroup>
                            {stations.map((station) => (
                                <CommandItem
                                    key={station.id}
                                    value={station.name}
                                    onSelect={() => {
                                        onChange(station.id);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            value === station.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span>{station.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {station.province.name}
                                        </span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
