"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { createTripSchema, CreateTripInput } from "@/lib/validations";
import { parseDateTime, combineDateTimeToISO } from "@/lib/format";
import { createTrip } from "@/actions";
import type { Bus } from "@/schemas/bus.schema";
import type { Station } from "@/schemas/station.schema";;

interface CreateTripDialogProps {
    buses: Bus[];
    stations: Station[];
}

export function CreateTripDialog({ buses, stations }: CreateTripDialogProps) {
    const [open, setOpen] = React.useState(false);
    const [isPending, startTransition] = React.useTransition();

    const form = useForm<CreateTripInput>({
        resolver: zodResolver(createTripSchema),
        defaultValues: {
            busId: "",
            departureStationId: "",
            destinationStationId: "",
            departureTime: "",
            arrivalTime: "",
            price: 0,
        },
    });

    const onSubmit = (data: CreateTripInput) => {
        startTransition(async () => {
            const result = await createTrip(data);

            if (result.success) {
                toast.success("Trip created successfully");
                form.reset();
                setOpen(false);
            } else {
                toast.error(result.error ?? "Failed to create trip");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Add Trip
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add New Trip</DialogTitle>
                    <DialogDescription>
                        Create a new trip. Fill in the details below.
                    </DialogDescription>
                </DialogHeader>
                <form id="create-trip-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FieldGroup>
                        {/* Bus Selection */}
                        <Controller
                            name="busId"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="trip-bus">Bus</FieldLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger id="trip-bus" aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Select a bus..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {buses.map((bus) => (
                                                <SelectItem key={bus.id} value={bus.id}>
                                                    {bus.licensePlate} - {bus.type} ({bus.totalSeats} seats)
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

                        {/* Departure Station */}
                        <Controller
                            name="departureStationId"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="trip-departure-station">Departure Station</FieldLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger id="trip-departure-station" aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Select departure station..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {stations.map((station) => (
                                                <SelectItem key={station.id} value={station.id}>
                                                    {station.name} ({station.province.name})
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

                        {/* Destination Station */}
                        <Controller
                            name="destinationStationId"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="trip-destination-station">Destination Station</FieldLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger id="trip-destination-station" aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Select destination station..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {stations.map((station) => (
                                                <SelectItem key={station.id} value={station.id}>
                                                    {station.name} ({station.province.name})
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

                        {/* Departure Time */}
                        <Controller
                            name="departureTime"
                            control={form.control}
                            render={({ field, fieldState }) => {
                                const { date: depDate, time: depTime } = parseDateTime(field.value);
                                const [depOpen, setDepOpen] = React.useState(false);
                                
                                return (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Departure Time</FieldLabel>
                                        <div className="flex gap-2">
                                            <Popover open={depOpen} onOpenChange={setDepOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 justify-between font-normal"
                                                        aria-invalid={fieldState.invalid}
                                                    >
                                                        {depDate ? depDate.toLocaleDateString("vi-VN") : "Select date"}
                                                        <ChevronDownIcon className="size-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={depDate}
                                                        captionLayout="dropdown"
                                                        onSelect={(date) => {
                                                            if (date) {
                                                                field.onChange(combineDateTimeToISO(date, depTime));
                                                            }
                                                            setDepOpen(false);
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <Input
                                                type="time"
                                                value={depTime}
                                                onChange={(e) => field.onChange(combineDateTimeToISO(depDate, e.target.value))}
                                                className="w-32 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                aria-invalid={fieldState.invalid}
                                            />
                                        </div>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                );
                            }}
                        />

                        {/* Arrival Time */}
                        <Controller
                            name="arrivalTime"
                            control={form.control}
                            render={({ field, fieldState }) => {
                                const { date: arrDate, time: arrTime } = parseDateTime(field.value);
                                const [arrOpen, setArrOpen] = React.useState(false);
                                
                                return (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Arrival Time</FieldLabel>
                                        <div className="flex gap-2">
                                            <Popover open={arrOpen} onOpenChange={setArrOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 justify-between font-normal"
                                                        aria-invalid={fieldState.invalid}
                                                    >
                                                        {arrDate ? arrDate.toLocaleDateString("vi-VN") : "Select date"}
                                                        <ChevronDownIcon className="size-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={arrDate}
                                                        captionLayout="dropdown"
                                                        onSelect={(date) => {
                                                            if (date) {
                                                                field.onChange(combineDateTimeToISO(date, arrTime));
                                                            }
                                                            setArrOpen(false);
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <Input
                                                type="time"
                                                value={arrTime}
                                                onChange={(e) => field.onChange(combineDateTimeToISO(arrDate, e.target.value))}
                                                className="w-32 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                aria-invalid={fieldState.invalid}
                                            />
                                        </div>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                );
                            }}
                        />

                        {/* Price */}
                        <Controller
                            name="price"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="trip-price">Price (VND)</FieldLabel>
                                    <Input
                                        id="trip-price"
                                        type="number"
                                        min={0}
                                        step={1000}
                                        value={field.value || ""}
                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                        placeholder="Enter price..."
                                        aria-invalid={fieldState.invalid}
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
                            Create Trip
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
