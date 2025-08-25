import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
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
import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { ProvinceResponse } from "@/services/province/types";




export function LocationSearch({
  value,
  setValue,
  items,
  label,
  placeholder,
  noResultText,
}: Props) {
  const [open, setOpen] = useState(false);
  
  const selectedItem = useMemo(
    () => items.find((item) => item.code === value),
    [items, value]
  );

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="md:w-sm justify-between"
          >
            {selectedItem ? selectedItem.name : placeholder}  
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="sm:w-sm p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>{noResultText}</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.code}
                    value={item.name}
                    onSelect={() => {
                      setValue(item.code);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.code
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}


type Props = {
  value: number | null;
  setValue: (newValue: number) => void;
  items: ProvinceResponse[];
  label: string;
  placeholder: string;
  noResultText: string;
};
