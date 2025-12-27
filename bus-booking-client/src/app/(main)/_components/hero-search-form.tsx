"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Search, ArrowRightLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function HeroSearchForm() {
    const router = useRouter();
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState<Date>();

    const [open, setOpen] = useState(false);

    const handleSwap = () => {
        const temp = from;
        setFrom(to);
        setTo(temp);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        if (date) params.set("date", format(date, "yyyy-MM-dd"));
        router.push(`/search?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="w-full">
            <div className="bg-card rounded-2xl shadow-xl border border-border p-4 sm:p-6">
                <div className="flex flex-col gap-4">
                    {/* Row 1: From - Swap - To */}
                    <div className="flex flex-col sm:flex-row items-end gap-3">
                        {/* From */}
                        <div className="flex-1 w-full space-y-2">
                            <Label htmlFor="from" className="text-sm font-medium">
                                From
                            </Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary" />
                                <Input
                                    id="from"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    placeholder="Departure city"
                                    className="pl-10 h-12"
                                />
                            </div>
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

                        {/* To */}
                        <div className="flex-1 w-full space-y-2">
                            <Label htmlFor="to" className="text-sm font-medium">
                                To
                            </Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary" />
                                <Input
                                    id="to"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    placeholder="Arrival city"
                                    className="pl-10 h-12"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Date - Search */}
                    <div className="flex flex-col sm:flex-row items-end gap-3">
                        {/* Date Picker */}
                        <div className="flex-1 w-full space-y-2">
                            <Label className="text-sm font-medium">
                                Date
                            </Label>
                            <Popover open={open} onOpenChange={setOpen}>
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
                                            setDate(date)
                                            setOpen(false)
                                        }}
                                        disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                                        captionLayout="dropdown"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Search Button */}
                        <Button type="submit" size="lg" className="h-12 px-8 w-full sm:w-auto">
                            <Search className="size-4 mr-2" />
                            Search Trips
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
