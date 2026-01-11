"use client";

import { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import { TripCard } from "./trip-card";
import { SearchFilters } from "./search-filters";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Trip } from "@/schemas/trip.schema";

interface SearchResultsClientProps {
    trips: Trip[];
    passengers: number;
    totalElements: number;
}

export function SearchResultsClient({ trips, passengers, totalElements }: SearchResultsClientProps) {
    const [filteredTrips, setFilteredTrips] = useState<Trip[]>(trips);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    useEffect(() => {
        setFilteredTrips(trips);
    }, [trips]);

    const hasFiltersApplied = filteredTrips.length !== trips.length;

    return (
        <div className="flex gap-6">
            {/* Desktop Filter Sidebar */}
            <aside className="w-56 shrink-0 hidden lg:block">
                <div className="sticky top-24">
                    <SearchFilters trips={trips} onFilter={setFilteredTrips} />
                </div>
            </aside>

            {/* Results */}
            <div className="flex-1 min-w-0">
                {/* Mobile Filter Button & Results Count */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-muted-foreground text-sm">
                        Hiển thị <span className="font-medium text-foreground">{filteredTrips.length}</span> trên {totalElements} kết quả
                        {hasFiltersApplied && (
                            <span className="text-primary"> • Đã lọc</span>
                        )}
                    </p>
                    
                    {/* Mobile Filter Button */}
                    <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="lg:hidden gap-2">
                                <Filter className="size-4" />
                                Bộ lọc
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-80">
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-2">
                                    <Filter className="size-4" />
                                    Bộ lọc
                                </SheetTitle>
                            </SheetHeader>
                            <div className="mt-6 space-y-6 px-6">
                                <SearchFilters 
                                    trips={trips} 
                                    onFilter={(filtered) => setFilteredTrips(filtered)}
                                    variant="plain"
                                />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
                
                {filteredTrips.length === 0 ? (
                    <div className="text-center py-16 border rounded-xl bg-muted/20">
                        <div className="text-muted-foreground mb-2">Không tìm thấy chuyến nào phù hợp.</div>
                        <Button 
                            variant="link" 
                            className="text-primary"
                            onClick={() => setFilteredTrips(trips)}
                        >
                            <X className="size-4 mr-1" />
                            Xóa bộ lọc
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredTrips.map((trip) => (
                            // Sử dụng trip.id thay vì trip.tripId
                            <TripCard key={trip.tripId} trip={trip} passengers={passengers} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}