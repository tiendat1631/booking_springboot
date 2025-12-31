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
import { Station, Province } from "@/schemas";


export function getStationColumns(provinces: Province[] = []): ColumnDef<Station>[] {
    const provinceOptions = provinces.map((p) => ({
        label: p.name,
        value: p.codename,
    }));

    return [
        {
            id: "name",
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Station Name" />
            ),
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue("name")}</div>
            ),
            meta: {
                label: "Name",
                variant: "text",
                placeholder: "Search stations...",
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            id: "province",
            accessorKey: "province",
            accessorFn: (row) => row.province.codename,
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Province" />
            ),
            cell: ({ row }) => (
                <div className="text-muted-foreground">{row.original.province.name}</div>
            ),
            meta: {
                label: "Province",
                variant: "multiSelect",
                options: provinceOptions,
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            id: "address",
            accessorKey: "address",
            header: "Address",
            cell: ({ row }) => (
                <div className="max-w-[200px] truncate text-muted-foreground">
                    {row.getValue("address")}
                </div>
            ),
            enableSorting: false,
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
                const station = row.original;

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
                                onClick={() => navigator.clipboard.writeText(station.id)}
                            >
                                Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>
                                {station.active ? "Disable" : "Enable"}
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
