"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Armchair, User, Phone, Mail, MessageSquare, Info } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { createBookingSchema, type CreateBookingInput } from "@/lib/validations";
import { createBooking } from "@/actions";
import type { SeatInfo, SeatLayoutInfo } from "@/schemas";

interface BookingClientProps {
    tripId: string;
    seats: SeatInfo[];
    seatLayout: SeatLayoutInfo | null;
    maxSeats: number;
    basePrice: number;
    onSeatChange?: (selectedSeats: string[], totalPrice: number) => void;
}

export function SeatBookingForm ({ 
    tripId, 
    seats, 
    seatLayout, 
    maxSeats, 
    basePrice,
    onSeatChange 
}: BookingClientProps) {
    const router = useRouter();
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    const form = useForm<CreateBookingInput>({
        resolver: zodResolver(createBookingSchema),
        defaultValues: {
            tripId,
            seatIds: [],
            passengerName: "",
            passengerPhone: "",
            passengerEmail: "",
            notes: "",
        },
    });

    // Group seats by row for grid display
    const seatGrid = useMemo(() => {
        if (!seatLayout) return null;

        const grid: (SeatInfo | null)[][] = [];
        for (let row = 0; row < seatLayout.totalRows; row++) {
            grid[row] = [];
            for (let col = 0; col < seatLayout.totalColumns; col++) {
                const seat = seats.find((s) => s.row === row + 1 && s.col === col + 1);
                grid[row][col] = seat || null;
            }
        }
        return grid;
    }, [seats, seatLayout]);

    const totalPrice = useMemo(() => {
        return selectedSeats.reduce((total, seatId) => {
            const seat = seats.find((s) => s.seatId === seatId);
            return total + (seat?.price || basePrice);
        }, 0);
    }, [selectedSeats, seats, basePrice]);

    // Notify parent when seats change (using useEffect to avoid setState during render)
    useEffect(() => {
        onSeatChange?.(selectedSeats, totalPrice);
    }, [selectedSeats, totalPrice, onSeatChange]);

    const handleSeatClick = (seatId: string, status: string) => {
        if (status !== "AVAILABLE") return;

        setSelectedSeats((prev) => {
            let newSeats: string[];
            if (prev.includes(seatId)) {
                newSeats = prev.filter((id) => id !== seatId);
            } else if (prev.length >= maxSeats) {
                newSeats = prev;
            } else {
                newSeats = [...prev, seatId];
            }
            form.setValue("seatIds", newSeats);
            return newSeats;
        });
    };

    const canSubmit = selectedSeats.length > 0 && selectedSeats.length <= maxSeats;

    const onSubmit = (data: CreateBookingInput) => {
        if (!canSubmit) return;

        startTransition(async () => {
            const result = await createBooking({
                ...data,
                tripId,
                seatIds: selectedSeats,
            });

            if (result.success && result.data) {
                toast.success("Đặt vé thành công!");
                router.push(`/booking/${tripId}/payment?bookingId=${result.data.bookingId}`);
            } else {
                toast.error("Đặt vé thất bại");
            }
        });
    };

    const getSeatStyle = (status: string, isSelected: boolean) => {
        if (isSelected) {
            return "bg-primary text-primary-foreground border-primary hover:bg-primary/90";
        }
        switch (status) {
            case "AVAILABLE":
                return "bg-background border-border hover:border-primary hover:bg-primary/5 cursor-pointer";
            case "BOOKED":
            case "RESERVED":
                return "bg-muted text-muted-foreground border-muted cursor-not-allowed";
            case "HELD":
                return "bg-yellow-100 border-yellow-300 text-yellow-700 cursor-not-allowed";
            default:
                return "bg-muted border-muted cursor-not-allowed";
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Seat Selection Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Chọn ghế ngồi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Seat Grid */}
                    {seatGrid ? (
                        <div className="flex justify-center">
                            <div className="inline-block">
                                {/* Driver indicator */}
                                <div className="flex justify-end mb-4 pr-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="w-8 h-6 rounded bg-muted border flex items-center justify-center">
                                            <Armchair className="size-4" />
                                        </div>
                                        <span>Tài xế</span>
                                    </div>
                                </div>

                                {/* Seats */}
                                <div className="space-y-2">
                                    {seatGrid.map((row, rowIndex) => (
                                        <div key={rowIndex} className="flex gap-2 justify-center">
                                            {row.map((seat, colIndex) => {
                                                const hasAisle = seatLayout && colIndex === Math.floor(seatLayout.totalColumns / 2) - 1;
                                                
                                                if (!seat) {
                                                    return (
                                                        <div key={`${rowIndex}-${colIndex}`} className="w-12 h-12">
                                                            {hasAisle && <div className="w-4" />}
                                                        </div>
                                                    );
                                                }

                                                const isSelected = selectedSeats.includes(seat.seatId);
                                                
                                                return (
                                                    <div key={seat.seatId} className="flex">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSeatClick(seat.seatId, seat.status)}
                                                            disabled={seat.status !== "AVAILABLE"}
                                                            className={cn(
                                                                "w-12 h-12 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-medium transition-all",
                                                                getSeatStyle(seat.status, isSelected)
                                                            )}
                                                        >
                                                            <Armchair className="size-4 mb-0.5" />
                                                            <span className="text-[10px]">{seat.seatId}</span>
                                                        </button>
                                                        {hasAisle && <div className="w-4" />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                            {seats.map((seat) => {
                                const isSelected = selectedSeats.includes(seat.seatId);
                                return (
                                    <button
                                        key={seat.seatId}
                                        type="button"
                                        onClick={() => handleSeatClick(seat.seatId, seat.status)}
                                        disabled={seat.status !== "AVAILABLE"}
                                        className={cn(
                                            "p-2 rounded-lg border text-xs font-medium transition-colors",
                                            getSeatStyle(seat.status, isSelected)
                                        )}
                                    >
                                        {seat.seatId}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Seat Legend */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded border-2 border-border bg-background" />
                            <span>Trống</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded border-2 border-primary bg-primary" />
                            <span>Đang chọn</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded border-2 border-muted bg-muted" />
                            <span>Đã đặt</span>
                        </div>
                    </div>

                    {/* Selected Seats Info */}
                    {selectedSeats.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap p-3 bg-primary/5 rounded-lg">
                            <span className="text-sm font-medium">Ghế đã chọn:</span>
                            {selectedSeats.map((seatId) => (
                                <Badge key={seatId} variant="secondary">
                                    {seatId}
                                </Badge>
                            ))}
                        </div>
                    )}
                    
                    {selectedSeats.length === 0 && (
                        <div className="text-center text-muted-foreground p-4 border rounded-lg bg-muted/30">
                            <Info className="size-5 mx-auto mb-2" />
                            <p className="text-sm">Chọn tối đa {maxSeats} ghế để tiếp tục</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Passenger Information Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Thông tin hành khách</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FieldGroup>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Controller
                                name="passengerName"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="passenger-name" className="flex items-center gap-2">
                                            <User className="size-4" />
                                            Họ và tên *
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="passenger-name"
                                            placeholder="Nguyen Van A"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="passengerPhone"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="passenger-phone" className="flex items-center gap-2">
                                            <Phone className="size-4" />
                                            Số điện thoại *
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="passenger-phone"
                                            placeholder="0912345678"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </div>

                        <Controller
                            name="passengerEmail"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="passenger-email" className="flex items-center gap-2">
                                        <Mail className="size-4" />
                                        Email *
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        type="email"
                                        id="passenger-email"
                                        placeholder="email@example.com"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="notes"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="notes" className="flex items-center gap-2">
                                        <MessageSquare className="size-4" />
                                        Ghi chú (tùy chọn)
                                    </FieldLabel>
                                    <Textarea
                                        {...field}
                                        id="notes"
                                        placeholder="Yêu cầu đặc biệt..."
                                        className="resize-none"
                                        rows={3}
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <Separator />

                    {/* Submit Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                        <div>
                            <div className="text-sm text-muted-foreground">Tổng tiền</div>
                            <div className="text-2xl font-bold text-primary">
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(totalPrice)}
                            </div>
                        </div>
                        <Button 
                            type="submit" 
                            size="lg" 
                            className="min-w-[200px]"
                            disabled={!canSubmit || isPending}
                        >
                            {isPending && <Spinner className="mr-2" />}
                            Tiếp tục thanh toán
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
