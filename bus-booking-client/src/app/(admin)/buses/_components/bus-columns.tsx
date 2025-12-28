"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Bus, Armchair, BedDouble } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { Bus as BusType } from "@/types/bus.types";

// Get bus type icon
function getBusTypeIcon(type: string) {
    switch (type) {
        case "SEATER":
            return <Armchair className="size-4" />;
        case "SLEEPER":
            return <BedDouble className="size-4" />;
        case "LIMOUSINE":
            return <Bus className="size-4" />;
        default:
            return <Bus className="size-4" />;
    }
}

// Get status badge variant
function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
        case "ACTIVE":
            return "default";
        case "INACTIVE":
            return "secondary";
        case "MAINTENANCE":
            return "outline";
        default:
            return "secondary";
    }
}

interface GetBusColumnsOptions {
    busTypes?: string[];
    busStatuses?: string[];
}

export function getBusColumns(options?: GetBusColumnsOptions): ColumnDef<BusType>[] {
    const busTypeOptions = options?.busTypes?.map((t) => ({
        label: t.charAt(0) + t.slice(1).toLowerCase(),
        value: t,
    })) ?? [];

    const busStatusOptions = options?.busStatuses?.map((s) => ({
        label: s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " "),
        value: s,
    })) ?? [];

    return [
        {
            id: "licensePlate",
            accessorKey: "licensePlate",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="License Plate" />
            ),
            cell: ({ row }) => (
                <div className="font-mono font-medium">{row.getValue("licensePlate")}</div>
            ),
            meta: {
                label: "License Plate",
                variant: "text",
                placeholder: "Search by plate...",
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            id: "type",
            accessorKey: "type",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Type" />
            ),
            cell: ({ row }) => {
                const type = row.original.type;
                return (
                    <Badge variant="outline" className="gap-1">
                        {getBusTypeIcon(type)}
                        {type}
                    </Badge>
                );
            },
            meta: {
                label: "Type",
                variant: "select",
                options: busTypeOptions,
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            id: "totalSeats",
            accessorKey: "totalSeats",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Seats" />
            ),
            cell: ({ row }) => (
                <div className="text-center font-medium">{row.original.totalSeats}</div>
            ),
            enableSorting: true,
        },
        {
            id: "status",
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Status" />
            ),
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <Badge variant={getStatusVariant(status)}>
                        {status}
                    </Badge>
                );
            },
            meta: {
                label: "Status",
                variant: "select",
                options: busStatusOptions,
            },
            enableColumnFilter: true,
            enableSorting: false,
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const bus = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="size-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(bus.id)}
                            >
                                Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>
                                {bus.status === "ACTIVE" ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>Set Maintenance</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
    ];
}
