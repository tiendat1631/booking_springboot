"use client";

import { useState } from "react";
import { Bus, Armchair, BedDouble, Clock, RotateCcw } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { TripSummary } from "@/types/trip.types";

const TIME_SLOTS = [
    { id: "morning", label: "Morning", range: "06:00 - 12:00", start: 6, end: 12 },
    { id: "afternoon", label: "Afternoon", range: "12:00 - 18:00", start: 12, end: 18 },
    { id: "evening", label: "Evening", range: "18:00 - 24:00", start: 18, end: 24 },
] as const;

const BUS_TYPES = [
    { id: "SEATER", label: "Seater", icon: Armchair },
    { id: "SLEEPER", label: "Sleeper", icon: BedDouble },
    { id: "LIMOUSINE", label: "Limousine", icon: Bus },
] as const;

interface SearchFiltersProps {
    trips: TripSummary[];
    onFilter: (filtered: TripSummary[]) => void;
    variant?: "card" | "plain";
}

export function SearchFilters({ trips, onFilter, variant = "card" }: SearchFiltersProps) {
    const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
    const [selectedBusTypes, setSelectedBusTypes] = useState<string[]>([]);

    const applyFilters = (times: string[], busTypes: string[]) => {
        let filtered = [...trips];

        if (times.length > 0) {
            filtered = filtered.filter((trip) => {
                const hour = new Date(trip.departureTime).getHours();
                return times.some((timeId) => {
                    const slot = TIME_SLOTS.find((s) => s.id === timeId);
                    if (!slot) return false;
                    return hour >= slot.start && hour < slot.end;
                });
            });
        }

        if (busTypes.length > 0) {
            filtered = filtered.filter((trip) => busTypes.includes(trip.bus.type));
        }

        onFilter(filtered);
    };

    const handleTimeChange = (timeId: string, checked: boolean) => {
        const updated = checked
            ? [...selectedTimes, timeId]
            : selectedTimes.filter((t) => t !== timeId);
        setSelectedTimes(updated);
        applyFilters(updated, selectedBusTypes);
    };

    const handleBusTypeChange = (typeId: string, checked: boolean) => {
        const updated = checked
            ? [...selectedBusTypes, typeId]
            : selectedBusTypes.filter((t) => t !== typeId);
        setSelectedBusTypes(updated);
        applyFilters(selectedTimes, updated);
    };

    const clearAll = () => {
        setSelectedTimes([]);
        setSelectedBusTypes([]);
        onFilter(trips);
    };

    const getTimeSlotCount = (slot: typeof TIME_SLOTS[number]) => {
        return trips.filter((trip) => {
            const hour = new Date(trip.departureTime).getHours();
            return hour >= slot.start && hour < slot.end;
        }).length;
    };

    const getBusTypeCount = (type: string) => {
        return trips.filter((trip) => trip.bus.type === type).length;
    };

    const hasActiveFilters = selectedTimes.length > 0 || selectedBusTypes.length > 0;

    const wrapperClassName = variant === "card" 
        ? "bg-card border rounded-xl p-4" 
        : "";

    return (
        <div className={wrapperClassName}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-sm">Refine Results</span>
                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearAll}>
                        <RotateCcw className="size-3 mr-1" />
                        Clear
                    </Button>
                )}
            </div>

            {/* Departure Time */}
            <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Clock className="size-3.5" />
                    Departure Time
                </div>
                <div className="space-y-1.5">
                    {TIME_SLOTS.map((slot) => {
                        const count = getTimeSlotCount(slot);
                        if (count === 0) return null;
                        return (
                            <label
                                key={slot.id}
                                className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                            >
                                <Checkbox
                                    id={slot.id}
                                    checked={selectedTimes.includes(slot.id)}
                                    onCheckedChange={(checked) =>
                                        handleTimeChange(slot.id, checked as boolean)
                                    }
                                />
                                <span className="flex-1 text-sm">{slot.label}</span>
                                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                    {count}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>

            <Separator className="my-4" />

            {/* Bus Type */}
            <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Bus className="size-3.5" />
                    Bus Type
                </div>
                <div className="space-y-1.5">
                    {BUS_TYPES.map((type) => {
                        const count = getBusTypeCount(type.id);
                        if (count === 0) return null;
                        const Icon = type.icon;
                        return (
                            <label
                                key={type.id}
                                className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                            >
                                <Checkbox
                                    id={type.id}
                                    checked={selectedBusTypes.includes(type.id)}
                                    onCheckedChange={(checked) =>
                                        handleBusTypeChange(type.id, checked as boolean)
                                    }
                                />
                                <Icon className="size-4 text-muted-foreground" />
                                <span className="flex-1 text-sm">{type.label}</span>
                                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                    {count}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
