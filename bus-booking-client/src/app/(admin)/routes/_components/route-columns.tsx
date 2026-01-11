"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react";

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
import { Route } from "@/schemas";
import { formatPrice, formatDuration } from "@/lib/format";

export function getRouteColumns(): ColumnDef<Route>[] {
    return [
        {
            id: "code",
            accessorKey: "code",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Code" />
            ),
            cell: ({ row }) => (
                <Badge variant="outline" className="font-mono">
                    {row.getValue("code")}
                </Badge>
            ),
            meta: {
                label: "Code",
                variant: "text",
                placeholder: "Search by code...",
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            id: "name",
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Route Name" />
            ),
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue("name")}</div>
            ),
            meta: {
                label: "Name",
                variant: "text",
                placeholder: "Search routes...",
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            id: "distanceKm",
            accessorKey: "distanceKm",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Distance" />
            ),
            cell: ({ row }) => (
                <div className="text-muted-foreground">{row.original.distanceKm} km</div>
            ),
            enableSorting: true,
        },
        {
            id: "estimatedDurationMinutes",
            accessorKey: "estimatedDurationMinutes",
            header: "Duration",
            cell: ({ row }) => (
                <div className="text-muted-foreground">
                    {formatDuration(row.original.estimatedDurationMinutes)}
                </div>
            ),
            enableSorting: true,
        },
        {
            id: "basePrice",
            accessorKey: "basePrice",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Base Price" />
            ),
            cell: ({ row }) => (
                <div className="font-medium">{formatPrice(row.original.basePrice)}</div>
            ),
            enableSorting: true,
        },
        {
            id: "active",
            accessorKey: "active",
            accessorFn: (row) => row.active,
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Status" />
            ),
            cell: ({ row }) => {
                const isActive = row.original.active;
                return (
                    <Badge variant={isActive ? "default" : "secondary"}>
                        {isActive ? (
                            <>
                                <CheckCircle className="mr-1 size-3" />
                                Active
                            </>
                        ) : (
                            <>
                                <XCircle className="mr-1 size-3" />
                                Inactive
                            </>
                        )}
                    </Badge>
                );
            },
            meta: {
                label: "Status",
                variant: "select",
                options: [
                    { label: "Active", value: "true" },
                    { label: "Inactive", value: "false" },
                ],
            },
            enableColumnFilter: true,
            enableSorting: false,
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const route = row.original;

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
                                onClick={() => navigator.clipboard.writeText(route.id)}
                            >
                                Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>
                                {route.active ? "Disable" : "Enable"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
    ];
}
