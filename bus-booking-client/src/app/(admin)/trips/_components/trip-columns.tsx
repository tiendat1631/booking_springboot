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
import { RouteSummary, Trip, busTypeEnum, tripStatusEnum } from "@/schemas";
import { formatPrice, formatDateTime, formatDuration } from "@/lib/format";


const busTypeLabels: Record<typeof busTypeEnum.options[number], string> = {
    SEATER: "Seater",
    SLEEPER: "Sleeper",
    LIMOUSINE: "Limousine",
};

const tripStatusLabels: Record<typeof tripStatusEnum.options[number], string> = {
    SCHEDULED: "Scheduled",
    BOARDING: "Boarding",
    IN_TRANSIT: "In Transit",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
};

function getBusTypeIcon(type: typeof busTypeEnum.options[number]) {
    switch (type) {
        case "SEATER":
            return <Armchair className="size-3" />;
        case "SLEEPER":
            return <BedDouble className="size-3" />;
        case "LIMOUSINE":
            return <Bus className="size-3" />;
    }
}

function getStatusVariant(status: typeof tripStatusEnum.options[number]): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
        case "SCHEDULED":
            return "default";
        case "BOARDING":
            return "outline";
        case "IN_TRANSIT":
            return "outline";
        case "COMPLETED":
            return "secondary";
        case "CANCELLED":
            return "destructive";
    }
}

const busTypeOptions = busTypeEnum.options.map((value) => ({
    label: busTypeLabels[value],
    value,
}));

const tripStatusOptions = tripStatusEnum.options.map((value) => ({
    label: tripStatusLabels[value],
    value,
}));

export function getTripColumns(routes: RouteSummary[]): ColumnDef<Trip>[] {
    const routeOptions = routes.map((route) => ({
        label: route.name,
        value: route.code,
    }));

    return [
        {
            id: "route",
            accessorKey: "route",
            header: "Route",
            cell: ({ row }) => {
                const route = row.original.route;
                const departure = row.original.departureStation;
                const arrival = row.original.destinationStation;
                return (
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 font-medium ">
                            <span>{departure.name}</span>
                            <ArrowRight className="size-3" />
                            <span>{arrival.name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{route.name}</div>

                    </div>
                );
            },
            meta: {
                label: "Route",
                variant: "multiSelect",
                options: routeOptions,
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
                return (
                    <div className="flex flex-col gap-0.5">
                        <div className="font-medium">{departure.date}</div>
                        <div className="text-sm text-muted-foreground">
                            {departure.time}
                        </div>
                    </div>
                );
            },
            meta: {
                label: "Departure Time",
                variant: "dateRange",
            },
            enableColumnFilter: true,
            enableSorting: true,
        },
        {
            id: "arrivalTime",
            accessorKey: "arrivalTime",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Arrival" />
            ),
            cell: ({ row }) => {
                const arrival = formatDateTime(row.original.arrivalTime);
                return (
                    <div className="flex flex-col gap-0.5">
                        <div className="font-medium">{arrival.date}</div>
                        <div className="text-sm text-muted-foreground">
                            {arrival.time}
                        </div>
                    </div>
                );
            },
            enableSorting: true,
        },
        {
            id: "durationMinutes",
            accessorKey: "durationMinutes",
            header: "Duration",
            cell: ({ row }) => (
                <Badge variant="outline">{formatDuration(row.original.durationMinutes)}</Badge>
            ),
            enableSorting: false,
        },
        {
            id: "busType",
            accessorKey: "busType",
            header: "Bus",
            cell: ({ row }) => {
                const bus = row.original.bus;
                return (
                    <div className="flex flex-col gap-0.5">
                        <div className="font-mono text-sm">{bus.licensePlate}</div>
                        <Badge variant="outline" className="gap-1 w-fit text-xs">
                            {getBusTypeIcon(bus.type)}
                            {busTypeLabels[bus.type]}
                        </Badge>
                    </div>
                );
            },
            meta: {
                label: "Bus Type",
                variant: "multiSelect",
                options: busTypeOptions,
                
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
                        {tripStatusLabels[status]}
                    </Badge>
                );
            },
            meta: {
                label: "Status",
                variant: "multiSelect",
                options: tripStatusOptions,
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
                                onClick={() => navigator.clipboard.writeText(trip.id)}
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
