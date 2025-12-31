"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import type { Province } from "@/schemas/province.schema";

interface ProvinceComboboxProps {
    provinces: Province[];
    value?: Province;
    onChange: (value: Province) => void;
    placeholder?: string;
    disabled?: boolean;
}

export function ProvinceCombobox({ 
    provinces, 
    value, 
    onChange, 
    placeholder = "Select province...",
    disabled = false,
}: ProvinceComboboxProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-between",
                        !value && "text-muted-foreground"
                    )}
                >
                    <span className="truncate">
                        {value?.name ?? placeholder}
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
                    <CommandInput placeholder="Search province..." />
                    <CommandList className="max-h-60 overflow-y-auto">
                        <CommandEmpty>No province found.</CommandEmpty>
                        <CommandGroup>
                            {provinces.map((province) => (
                                <CommandItem
                                    key={province.code}
                                    value={province.name}
                                    onSelect={() => {
                                        onChange(province);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            value?.code === province.code
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    <span>{province.name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
