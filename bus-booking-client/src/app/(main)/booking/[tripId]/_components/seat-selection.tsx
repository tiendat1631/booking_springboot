// "use client";

// import { useState, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { Armchair, Info } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";
// import type { SeatInfo, SeatLayoutInfo } from "@/type/trip.types";

// interface SeatSelectionProps {
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

// export function SeatSelection({ tripId, seats, seatLayout, maxSeats, basePrice }: SeatSelectionProps) {
//     const router = useRouter();
//     const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

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

//     const handleContinue = () => {
//         if (selectedSeats.length === 0 || selectedSeats.length > maxSeats) return;
        
//         const params = new URLSearchParams();
//         params.set("seats", selectedSeats.join(","));
//         router.push(`/booking/${tripId}/confirm?${params.toString()}`);
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

//     if (!seatGrid) {
//         // Fallback to simple list if no layout
//         return (
//             <div className="space-y-4">
//                 <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
//                     {seats.map((seat) => {
//                         const isSelected = selectedSeats.includes(seat.seatId);
//                         return (
//                             <button
//                                 key={seat.seatId}
//                                 onClick={() => handleSeatClick(seat.seatId, seat.status)}
//                                 disabled={seat.status !== "AVAILABLE"}
//                                 className={cn(
//                                     "p-2 rounded-lg border text-xs font-medium transition-colors",
//                                     getSeatStyle(seat.status, isSelected)
//                                 )}
//                             >
//                                 {seat.seatId}
//                             </button>
//                         );
//                     })}
//                 </div>
//                 <SeatLegend />
//                 <SeatSummary
//                     selectedSeats={selectedSeats}
//                     seats={seats}
//                     totalPrice={totalPrice}
//                     maxSeats={maxSeats}
//                     onContinue={handleContinue}
//                 />
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6">
//             {/* Seat Grid */}
//             <div className="flex justify-center">
//                 <div className="inline-block">
//                     {/* Driver indicator */}
//                     <div className="flex justify-end mb-4 pr-4">
//                         <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                             <div className="w-8 h-6 rounded bg-muted border flex items-center justify-center">
//                                 <Armchair className="size-4" />
//                             </div>
//                             <span>Driver</span>
//                         </div>
//                     </div>

//                     {/* Seats */}
//                     <div className="space-y-2">
//                         {seatGrid.map((row, rowIndex) => (
//                             <div key={rowIndex} className="flex gap-2 justify-center">
//                                 {row.map((seat, colIndex) => {
//                                     // Add aisle gap in the middle
//                                     const hasAisle = seatLayout && colIndex === Math.floor(seatLayout.totalColumns / 2) - 1;
                                    
//                                     if (!seat) {
//                                         return (
//                                             <div key={`${rowIndex}-${colIndex}`} className="w-12 h-12">
//                                                 {hasAisle && <div className="w-4" />}
//                                             </div>
//                                         );
//                                     }

//                                     const isSelected = selectedSeats.includes(seat.seatId);
                                    
//                                     return (
//                                         <div key={seat.seatId} className="flex">
//                                             <button
//                                                 onClick={() => handleSeatClick(seat.seatId, seat.status)}
//                                                 disabled={seat.status !== "AVAILABLE"}
//                                                 className={cn(
//                                                     "w-12 h-12 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-medium transition-all",
//                                                     getSeatStyle(seat.status, isSelected)
//                                                 )}
//                                             >
//                                                 <Armchair className="size-4 mb-0.5" />
//                                                 <span className="text-[10px]">{seat.seatId}</span>
//                                             </button>
//                                             {hasAisle && <div className="w-4" />}
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             <SeatLegend />
//             <SeatSummary
//                 selectedSeats={selectedSeats}
//                 seats={seats}
//                 totalPrice={totalPrice}
//                 maxSeats={maxSeats}
//                 onContinue={handleContinue}
//             />
//         </div>
//     );
// }

// function SeatLegend() {
//     return (
//         <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
//             <div className="flex items-center gap-2">
//                 <div className="w-6 h-6 rounded border-2 border-border bg-background" />
//                 <span>Available</span>
//             </div>
//             <div className="flex items-center gap-2">
//                 <div className="w-6 h-6 rounded border-2 border-primary bg-primary" />
//                 <span>Selected</span>
//             </div>
//             <div className="flex items-center gap-2">
//                 <div className="w-6 h-6 rounded border-2 border-muted bg-muted" />
//                 <span>Booked</span>
//             </div>
//         </div>
//     );
// }

// interface SeatSummaryProps {
//     selectedSeats: string[];
//     seats: SeatInfo[];
//     totalPrice: number;
//     maxSeats: number;
//     onContinue: () => void;
// }

// function SeatSummary({ selectedSeats, seats, totalPrice, maxSeats, onContinue }: SeatSummaryProps) {
//     const canContinue = selectedSeats.length > 0 && selectedSeats.length <= maxSeats;
//     const maxVisibleBadges = 8;
//     const visibleSeats = selectedSeats.slice(0, maxVisibleBadges);
//     const remainingCount = selectedSeats.length - maxVisibleBadges;

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
//                     {selectedSeats.length > 0 && (
//                         <div className="flex items-center gap-2 flex-wrap">
//                             <span className="text-sm text-muted-foreground shrink-0">Seats:</span>
//                             <div className="flex gap-1 flex-wrap">
//                                 {visibleSeats.map((seatId) => (
//                                     <Badge key={seatId} variant="secondary" className="text-xs">
//                                         {seatId}
//                                     </Badge>
//                                 ))}
//                                 {remainingCount > 0 && (
//                                     <Badge variant="outline" className="text-xs">
//                                         +{remainingCount} more
//                                     </Badge>
//                                 )}
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 <div className="flex items-center gap-4 shrink-0">
//                     <div className="text-right">
//                         <div className="text-sm text-muted-foreground">Total</div>
//                         <div className="text-xl font-bold text-primary">
//                             {formatPrice(totalPrice)}
//                         </div>
//                     </div>
//                     <Button 
//                         size="lg" 
//                         onClick={onContinue}
//                         disabled={!canContinue}
//                     >
//                         Continue
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// }
