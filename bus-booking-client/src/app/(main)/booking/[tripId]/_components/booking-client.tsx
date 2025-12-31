// "use client";

// import { useState, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Armchair, Info, User, Phone, Mail, MessageSquare, Loader2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Separator } from "@/components/ui/separator";
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form";
// import { cn } from "@/lib/utils";
// import type { SeatInfo, SeatLayoutInfo } from "@/schemas";

// // Form validation schema
// const bookingFormSchema = z.object({
//     passengerName: z.string().min(1, "Passenger name is required"),
//     passengerPhone: z
//         .string()
//         .min(1, "Passenger phone is required")
//         .regex(/^(0|\+84)[0-9]{9,10}$/, "Invalid phone number format (e.g., 0912345678)"),
//     passengerEmail: z
//         .string()
//         .min(1, "Email is required")
//         .email("Invalid email format"),
//     notes: z.string().optional(),
// });

// type BookingFormValues = z.infer<typeof bookingFormSchema>;

// interface BookingClientProps {
//     tripId: string;
//     seats: SeatInfo[];
//     seatLayout: SeatLayoutInfo | null;
//     maxSeats: number;
//     basePrice: number;
// }

// function formatPrice(price: number): string {
//     return new Intl.NumberFormat("vi-VN", {
//         style: "currency",
//         currency: "VND",
//     }).format(price);
// }

// export function BookingClient({ tripId, seats, seatLayout, maxSeats, basePrice }: BookingClientProps) {
//     const router = useRouter();
//     const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const form = useForm<BookingFormValues>({
//         resolver: zodResolver(bookingFormSchema),
//         defaultValues: {
//             passengerName: "",
//             passengerPhone: "",
//             passengerEmail: "",
//             notes: "",
//         },
//     });

//     // Group seats by row for grid display
//     const seatGrid = useMemo(() => {
//         if (!seatLayout) return null;

//         const grid: (SeatInfo | null)[][] = [];
//         for (let row = 0; row < seatLayout.totalRows; row++) {
//             grid[row] = [];
//             for (let col = 0; col < seatLayout.totalColumns; col++) {
//                 // API returns 1-indexed row/col, so we need to add 1
//                 const seat = seats.find((s) => s.row === row + 1 && s.col === col + 1);
//                 grid[row][col] = seat || null;
//             }
//         }
//         return grid;
//     }, [seats, seatLayout]);

//     const handleSeatClick = (seatId: string, status: string) => {
//         if (status !== "AVAILABLE") return;

//         setSelectedSeats((prev) => {
//             if (prev.includes(seatId)) {
//                 return prev.filter((id) => id !== seatId);
//             }
//             // Don't allow selecting more than maxSeats
//             if (prev.length >= maxSeats) {
//                 return prev;
//             }
//             return [...prev, seatId];
//         });
//     };

//     const totalPrice = useMemo(() => {
//         return selectedSeats.reduce((total, seatId) => {
//             const seat = seats.find((s) => s.seatId === seatId);
//             return total + (seat?.price || basePrice);
//         }, 0);
//     }, [selectedSeats, seats, basePrice]);

//     const canSubmit = selectedSeats.length > 0 && selectedSeats.length <= maxSeats;

//     const onSubmit = async (data: BookingFormValues) => {
//         if (!canSubmit) return;

//         setIsSubmitting(true);
//         try {
//             const { createBooking } = await import("../_actions/create-booking");
            
//             const result = await createBooking({
//                 tripId,
//                 seatIds: selectedSeats,
//                 passengerName: data.passengerName,
//                 passengerPhone: data.passengerPhone,
//                 passengerEmail: data.passengerEmail,
//                 notes: data.notes,
//             });

//             if (result.success && result.data) {
//                 // Redirect to payment page with bookingId
//                 router.push(`/booking/${tripId}/payment?bookingId=${result.data.bookingId}`);
//             } else {
//                 // Handle error - could use toast here
//                 console.error("Booking failed:", result.error);
//                 form.setError("root", { message: result.error || "Failed to create booking" });
//             }
//         } catch (error) {
//             console.error("Booking failed:", error);
//             form.setError("root", { message: "An unexpected error occurred" });
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const getSeatStyle = (status: string, isSelected: boolean) => {
//         if (isSelected) {
//             return "bg-primary text-primary-foreground border-primary hover:bg-primary/90";
//         }
//         switch (status) {
//             case "AVAILABLE":
//                 return "bg-background border-border hover:border-primary hover:bg-primary/5 cursor-pointer";
//             case "BOOKED":
//             case "RESERVED":
//                 return "bg-muted text-muted-foreground border-muted cursor-not-allowed";
//             case "HELD":
//                 return "bg-yellow-100 border-yellow-300 text-yellow-700 cursor-not-allowed";
//             default:
//                 return "bg-muted border-muted cursor-not-allowed";
//         }
//     };

//     return (
//         <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                 {/* Error Message */}
//                 {form.formState.errors.root && (
//                     <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
//                         {form.formState.errors.root.message}
//                     </div>
//                 )}

//                 {/* Seat Selection Card */}
//                 <Card>
//                     <CardHeader>
//                         <CardTitle className="text-lg">Choose Your Seats</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-6">
//                         {/* Seat Grid */}
//                         {seatGrid ? (
//                             <div className="flex justify-center">
//                                 <div className="inline-block">
//                                     {/* Driver indicator */}
//                                     <div className="flex justify-end mb-4 pr-4">
//                                         <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                             <div className="w-8 h-6 rounded bg-muted border flex items-center justify-center">
//                                                 <Armchair className="size-4" />
//                                             </div>
//                                             <span>Driver</span>
//                                         </div>
//                                     </div>

//                                     {/* Seats */}
//                                     <div className="space-y-2">
//                                         {seatGrid.map((row, rowIndex) => (
//                                             <div key={rowIndex} className="flex gap-2 justify-center">
//                                                 {row.map((seat, colIndex) => {
//                                                     // Add aisle gap in the middle
//                                                     const hasAisle = seatLayout && colIndex === Math.floor(seatLayout.totalColumns / 2) - 1;
                                                    
//                                                     if (!seat) {
//                                                         return (
//                                                             <div key={`${rowIndex}-${colIndex}`} className="w-12 h-12">
//                                                                 {hasAisle && <div className="w-4" />}
//                                                             </div>
//                                                         );
//                                                     }

//                                                     const isSelected = selectedSeats.includes(seat.seatId);
                                                    
//                                                     return (
//                                                         <div key={seat.seatId} className="flex">
//                                                             <button
//                                                                 type="button"
//                                                                 onClick={() => handleSeatClick(seat.seatId, seat.status)}
//                                                                 disabled={seat.status !== "AVAILABLE"}
//                                                                 className={cn(
//                                                                     "w-12 h-12 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-medium transition-all",
//                                                                     getSeatStyle(seat.status, isSelected)
//                                                                 )}
//                                                             >
//                                                                 <Armchair className="size-4 mb-0.5" />
//                                                                 <span className="text-[10px]">{seat.seatId}</span>
//                                                             </button>
//                                                             {hasAisle && <div className="w-4" />}
//                                                         </div>
//                                                     );
//                                                 })}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         ) : (
//                             // Fallback to simple list if no layout
//                             <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
//                                 {seats.map((seat) => {
//                                     const isSelected = selectedSeats.includes(seat.seatId);
//                                     return (
//                                         <button
//                                             key={seat.seatId}
//                                             type="button"
//                                             onClick={() => handleSeatClick(seat.seatId, seat.status)}
//                                             disabled={seat.status !== "AVAILABLE"}
//                                             className={cn(
//                                                 "p-2 rounded-lg border text-xs font-medium transition-colors",
//                                                 getSeatStyle(seat.status, isSelected)
//                                             )}
//                                         >
//                                             {seat.seatId}
//                                         </button>
//                                     );
//                                 })}
//                             </div>
//                         )}

//                         {/* Seat Legend */}
//                         <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
//                             <div className="flex items-center gap-2">
//                                 <div className="w-6 h-6 rounded border-2 border-border bg-background" />
//                                 <span>Available</span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <div className="w-6 h-6 rounded border-2 border-primary bg-primary" />
//                                 <span>Selected</span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <div className="w-6 h-6 rounded border-2 border-muted bg-muted" />
//                                 <span>Booked</span>
//                             </div>
//                         </div>

//                         {/* Selected Seats Summary */}
//                         <SeatSummary
//                             selectedSeats={selectedSeats}
//                             totalPrice={totalPrice}
//                             maxSeats={maxSeats}
//                         />
//                     </CardContent>
//                 </Card>

//                 {/* Passenger Information Card */}
//                 <Card>
//                     <CardHeader>
//                         <CardTitle className="text-lg">Passenger Information</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                         <div className="grid sm:grid-cols-2 gap-4">
//                             <FormField
//                                 control={form.control}
//                                 name="passengerName"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel className="flex items-center gap-2">
//                                             <User className="size-4" />
//                                             Full Name *
//                                         </FormLabel>
//                                         <FormControl>
//                                             <Input placeholder="Nguyen Van A" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             <FormField
//                                 control={form.control}
//                                 name="passengerPhone"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel className="flex items-center gap-2">
//                                             <Phone className="size-4" />
//                                             Phone Number *
//                                         </FormLabel>
//                                         <FormControl>
//                                             <Input placeholder="0912345678" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>

//                         <FormField
//                             control={form.control}
//                             name="passengerEmail"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel className="flex items-center gap-2">
//                                         <Mail className="size-4" />
//                                         Email *
//                                     </FormLabel>
//                                     <FormControl>
//                                         <Input type="email" placeholder="email@example.com" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="notes"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel className="flex items-center gap-2">
//                                         <MessageSquare className="size-4" />
//                                         Notes (optional)
//                                     </FormLabel>
//                                     <FormControl>
//                                         <Textarea 
//                                             placeholder="Any special requests or notes..."
//                                             className="resize-none"
//                                             rows={3}
//                                             {...field} 
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <Separator />

//                         {/* Submit Section */}
//                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
//                             <div>
//                                 <div className="text-sm text-muted-foreground">Total Amount</div>
//                                 <div className="text-2xl font-bold text-primary">
//                                     {formatPrice(totalPrice)}
//                                 </div>
//                             </div>
//                             <Button 
//                                 type="submit" 
//                                 size="lg" 
//                                 className="min-w-[200px]"
//                                 disabled={!canSubmit || isSubmitting}
//                             >
//                                 {isSubmitting ? (
//                                     <>
//                                         <Loader2 className="mr-2 size-4 animate-spin" />
//                                         Processing...
//                                     </>
//                                 ) : (
//                                     `Continue to Payment`
//                                 )}
//                             </Button>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </form>
//         </Form>
//     );
// }

// // Seat Summary Component
// interface SeatSummaryProps {
//     selectedSeats: string[];
//     totalPrice: number;
//     maxSeats: number;
// }

// function SeatSummary({ selectedSeats, totalPrice, maxSeats }: SeatSummaryProps) {
//     const maxVisibleBadges = 8;
//     const visibleSeats = selectedSeats.slice(0, maxVisibleBadges);
//     const remainingCount = selectedSeats.length - maxVisibleBadges;

//     if (selectedSeats.length === 0) {
//         return (
//             <div className="border rounded-lg p-4 bg-muted/30 text-center text-muted-foreground">
//                 <Info className="size-5 mx-auto mb-2" />
//                 <p className="text-sm">Select up to {maxSeats} seat{maxSeats > 1 ? "s" : ""} to continue</p>
//             </div>
//         );
//     }

//     return (
//         <div className="border rounded-lg p-4 bg-muted/30">
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2 mb-2">
//                         <Info className="size-4 text-muted-foreground shrink-0" />
//                         <span className="text-sm font-medium">
//                             {selectedSeats.length} seat{selectedSeats.length !== 1 ? "s" : ""} selected (max {maxSeats})
//                         </span>
//                     </div>
//                     <div className="flex items-center gap-2 flex-wrap">
//                         <span className="text-sm text-muted-foreground shrink-0">Seats:</span>
//                         <div className="flex gap-1 flex-wrap">
//                             {visibleSeats.map((seatId) => (
//                                 <Badge key={seatId} variant="secondary" className="text-xs">
//                                     {seatId}
//                                 </Badge>
//                             ))}
//                             {remainingCount > 0 && (
//                                 <Badge variant="outline" className="text-xs">
//                                     +{remainingCount} more
//                                 </Badge>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 <div className="text-right shrink-0">
//                     <div className="text-sm text-muted-foreground">Subtotal</div>
//                     <div className="text-xl font-bold text-primary">
//                         {formatPrice(totalPrice)}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
