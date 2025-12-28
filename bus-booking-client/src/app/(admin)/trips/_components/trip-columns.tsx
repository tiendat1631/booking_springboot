"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowRight, Bus, Armchair, BedDouble, Users } from "lucide-react";

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
import type { TripSummary } from "@/types/trip.types";
import type { Route } from "@/types/route.types";

// Format price in VND
function formatPrice(price: number): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
}

// Format date/time
function formatDateTime(dateString: string): { date: string; time: string } {
    const date = new Date(dateString);
    return {
        date: date.toLocaleDateString("vi-VN"),
        time: date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };
}

// Get bus type icon
function getBusTypeIcon(type: string) {
    switch (type) {
        case "SEATER":
            return <Armchair className="size-3" />;
        case "SLEEPER":
            return <BedDouble className="size-3" />;
        case "LIMOUSINE":
            return <Bus className="size-3" />;
        default:
            return <Bus className="size-3" />;
    }
}

// Get status badge variant
function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
        case "SCHEDULED":
            return "default";
        case "DEPARTED":
            return "outline";
        case "COMPLETED":
            return "secondary";
        case "CANCELLED":
            return "destructive";
        default:
            return "secondary";
    }
}


interface GetTripColumnsOptions {
    statuses?: string[];
    busTypes?: string[];
}

export function getTripColumns(options?: GetTripColumnsOptions): ColumnDef<TripSummary>[] {

    const statusOptions = options?.statuses?.map((s) => ({
        label: s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " "),
        value: s,
    })) ?? [];

    const busTypeOptions = options?.busTypes?.map((t) => ({
        label: t.charAt(0) + t.slice(1).toLowerCase(),
        value: t,
    })) ?? [];

    return [
        {
            id: "route",
            accessorKey: "route",
            header: "Route",
            cell: ({ row }) => {
                const route = row.original.route;
                return (
                    <div className="flex flex-col gap-0.5">
                        <div className="font-medium">{route.name}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span>{route.departureStation}</span>
                            <ArrowRight className="size-3" />
                            <span>{route.arrivalStation}</span>
                        </div>
                    </div>
                );
            },
            meta: {
                label: "Route",
                variant: "text",
                placeholder: "Search route...",
            },
            enableColumnFilter: true,
            enableSorting: false,
        },
        {
            id: "departureTime",
            accessorKey: "departureTime",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Departure" />
            ),
            cell: ({ row }) => {
                const departure = formatDateTime(row.original.departureTime);
                const arrival = formatDateTime(row.original.arrivalTime);
                return (
                    <div className="flex flex-col gap-0.5">
                        <div className="font-medium">{departure.date}</div>
                        <div className="text-sm text-muted-foreground">
                            {departure.time} → {arrival.time}
                        </div>
                    </div>
                );
            },
            enableSorting: true,
        },
        {
            id: "formattedDuration",
            accessorKey: "formattedDuration",
            header: "Duration",
            cell: ({ row }) => (
                <Badge variant="outline">{row.original.formattedDuration}</Badge>
            ),
            enableSorting: false,
        },
        {
            id: "bus",
            accessorKey: "bus",
            header: "Bus",
            cell: ({ row }) => {
                const bus = row.original.bus;
                return (
                    <div className="flex flex-col gap-0.5">
                        <div className="font-mono text-sm">{bus.licensePlate}</div>
                        <Badge variant="outline" className="gap-1 w-fit text-xs">
                            {getBusTypeIcon(bus.type)}
                            {bus.type}
                        </Badge>
                    </div>
                );
            },
            meta: {
                label: "Bus Type",
                variant: "select",
                options: busTypeOptions,
            },
            filterFn: (row, id, value) => {
                return row.original.bus.type === value;
            },
            enableColumnFilter: true,
            enableSorting: false,
        },
        {
            id: "price",
            accessorKey: "price",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Price" />
            ),
            cell: ({ row }) => (
                <div className="font-medium">{formatPrice(row.original.price)}</div>
            ),
            enableSorting: true,
        },
        {
            id: "seats",
            accessorKey: "availableSeats",
            header: "Seats",
            cell: ({ row }) => {
                const available = row.original.availableSeats;
                const total = row.original.totalSeats;
                const isFull = available === 0;
                return (
                    <div className="flex items-center gap-1">
                        <Users className="size-4 text-muted-foreground" />
                        <span className={isFull ? "text-destructive font-medium" : ""}>
                            {available}/{total}
                        </span>
                    </div>
                );
            },
            enableSorting: false,
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
                options: statusOptions,
            },
            enableColumnFilter: true,
            enableSorting: false,
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const trip = row.original;

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
                                onClick={() => navigator.clipboard.writeText(trip.tripId)}
                            >
                                Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            {trip.status === "SCHEDULED" && (
                                <DropdownMenuItem className="text-destructive">
                                    Cancel Trip
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
    ];
}
