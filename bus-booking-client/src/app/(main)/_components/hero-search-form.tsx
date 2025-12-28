"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Search, ArrowRightLeft, Users, Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { Province } from "@/types/station.types";

interface HeroSearchFormProps {
    provinces: Province[];
}

export function HeroSearchForm({ provinces }: HeroSearchFormProps) {
    const router = useRouter();
    const [fromProvince, setFromProvince] = React.useState<Province | null>(null);
    const [toProvince, setToProvince] = React.useState<Province | null>(null);
    const [date, setDate] = React.useState<Date>();
    const [passengers, setPassengers] = React.useState(1);

    const [fromOpen, setFromOpen] = React.useState(false);
    const [toOpen, setToOpen] = React.useState(false);
    const [dateOpen, setDateOpen] = React.useState(false);

    const handleSwap = () => {
        const temp = fromProvince;
        setFromProvince(toProvince);
        setToProvince(temp);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fromProvince || !toProvince || !date) return;

        const params = new URLSearchParams();
        params.set("from", fromProvince.codename);
        params.set("to", toProvince.codename);
        params.set("date", format(date, "yyyy-MM-dd"));
        params.set("passengers", String(passengers));
        router.push(`/search?${params.toString()}`);
    };

    const isValid = fromProvince && toProvince && date && fromProvince.codename !== toProvince.codename;

    return (
        <form onSubmit={handleSearch} className="w-full">
            <div className="bg-card rounded-2xl shadow-xl border border-border p-4 sm:p-6">
                <div className="flex flex-col gap-4">
                    {/* Row 1: From - Swap - To */}
                    <div className="flex flex-col sm:flex-row items-end gap-3">
                        {/* From Province */}
                        <div className="flex-1 w-full space-y-2">
                            <Label className="text-sm font-medium">From</Label>
                            <Popover open={fromOpen} onOpenChange={setFromOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={fromOpen}
                                        className="w-full h-12 justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <MapPin className="size-4 text-primary shrink-0" />
                                            <span className={cn(!fromProvince && "text-muted-foreground")}>
                                                {fromProvince?.name ?? "Select departure province"}
                                            </span>
                                        </div>
                                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search province..." />
                                        <CommandList>
                                            <CommandEmpty>No province found.</CommandEmpty>
                                            <CommandGroup>
                                                {provinces.map((province) => (
                                                    <CommandItem
                                                        key={province.codename}
                                                        value={province.name}
                                                        onSelect={() => {
                                                            setFromProvince(province);
                                                            setFromOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 size-4",
                                                                fromProvince?.codename === province.codename
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
                        </div>

                        {/* Swap Button */}
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="rounded-full h-10 w-10 shrink-0 hidden sm:flex"
                            onClick={handleSwap}
                        >
                            <ArrowRightLeft className="size-4" />
                        </Button>

                        {/* To Province */}
                        <div className="flex-1 w-full space-y-2">
                            <Label className="text-sm font-medium">To</Label>
                            <Popover open={toOpen} onOpenChange={setToOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={toOpen}
                                        className="w-full h-12 justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <MapPin className="size-4 text-primary shrink-0" />
                                            <span className={cn(!toProvince && "text-muted-foreground")}>
                                                {toProvince?.name ?? "Select arrival province"}
                                            </span>
                                        </div>
                                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search province..." />
                                        <CommandList>
                                            <CommandEmpty>No province found.</CommandEmpty>
                                            <CommandGroup>
                                                {provinces.map((province) => (
                                                    <CommandItem
                                                        key={province.codename}
                                                        value={province.name}
                                                        onSelect={() => {
                                                            setToProvince(province);
                                                            setToOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 size-4",
                                                                toProvince?.codename === province.codename
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
                        </div>
                    </div>

                    {/* Row 2: Date - Passengers - Search */}
                    <div className="flex flex-col sm:flex-row items-end gap-3">
                        {/* Date Picker */}
                        <div className="flex-1 w-full space-y-2">
                            <Label className="text-sm font-medium">Date</Label>
                            <Popover open={dateOpen} onOpenChange={setDateOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        data-empty={!date}
                                        className={cn(
                                            "w-full h-12 justify-start text-left font-normal",
                                            "data-[empty=true]:text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 size-4 text-primary" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 overflow-hidden" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={(date) => {
                                            setDate(date);
                                            setDateOpen(false);
                                        }}
                                        disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                                        captionLayout="dropdown"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Passengers */}
                        <div className="w-full sm:w-32 space-y-2">
                            <Label htmlFor="passengers" className="text-sm font-medium">
                                Passengers
                            </Label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary" />
                                <Input
                                    id="passengers"
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={passengers}
                                    onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="pl-10 h-12"
                                />
                            </div>
                        </div>

                        {/* Search Button */}
                        <Button 
                            type="submit" 
                            size="lg" 
                            className="h-12 px-8 w-full sm:w-auto"
                            disabled={!isValid}
                        >
                            <Search className="size-4 mr-2" />
                            Search Trips
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
