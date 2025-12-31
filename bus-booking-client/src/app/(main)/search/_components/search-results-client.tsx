// "use client";

// import { useState, useEffect } from "react";
// import { Filter, X } from "lucide-react";
// import { TripCard } from "./trip-card";
// import { SearchFilters } from "./search-filters";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
// import type { TripSummary } from "@/type/trip.types";

// interface SearchResultsClientProps {
//     trips: TripSummary[];
//     passengers: number;
//     totalElements: number;
// }

// export function SearchResultsClient({ trips, passengers, totalElements }: SearchResultsClientProps) {
//     const [filteredTrips, setFilteredTrips] = useState<TripSummary[]>(trips);
//     const [isFiltersOpen, setIsFiltersOpen] = useState(false);

//     useEffect(() => {
//         setFilteredTrips(trips);
//     }, [trips]);

//     const hasFiltersApplied = filteredTrips.length !== trips.length;

//     return (
//         <div className="flex gap-6">
//             {/* Desktop Filter Sidebar */}
//             <aside className="w-56 shrink-0 hidden lg:block">
//                 <div className="sticky top-24">
//                     <SearchFilters trips={trips} onFilter={setFilteredTrips} />
//                 </div>
//             </aside>

//             {/* Results */}
//             <div className="flex-1 min-w-0">
//                 {/* Mobile Filter Button & Results Count */}
//                 <div className="flex items-center justify-between mb-4">
//                     <p className="text-muted-foreground text-sm">
//                         Showing <span className="font-medium text-foreground">{filteredTrips.length}</span> of {totalElements} trip(s)
//                         {hasFiltersApplied && (
//                             <span className="text-primary"> • Filtered</span>
//                         )}
//                     </p>
                    
//                     {/* Mobile Filter Button */}
//                     <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
//                         <SheetTrigger asChild>
//                             <Button variant="outline" size="sm" className="lg:hidden gap-2">
//                                 <Filter className="size-4" />
//                                 Filters
//                             </Button>
//                         </SheetTrigger>
//                         <SheetContent side="left" className="w-80">
//                             <SheetHeader>
//                                 <SheetTitle className="flex items-center gap-2">
//                                     <Filter className="size-4" />
//                                     Filters
//                                 </SheetTitle>
//                             </SheetHeader>
//                             <div className="mt-6 space-y-6 px-6">
//                                 <SearchFilters 
//                                     trips={trips} 
//                                     onFilter={(filtered) => setFilteredTrips(filtered)}
//                                     variant="plain"
//                                 />
//                             </div>
//                         </SheetContent>
//                     </Sheet>
//                 </div>
                
//                 {filteredTrips.length === 0 ? (
//                     <div className="text-center py-16 border rounded-xl bg-muted/20">
//                         <div className="text-muted-foreground mb-2">No trips match your filters.</div>
//                         <Button 
//                             variant="link" 
//                             className="text-primary"
//                             onClick={() => setFilteredTrips(trips)}
//                         >
//                             <X className="size-4 mr-1" />
//                             Clear all filters
//                         </Button>
//                     </div>
//                 ) : (
//                     <div className="space-y-4">
//                         {filteredTrips.map((trip) => (
//                             <TripCard key={trip.tripId} trip={trip} passengers={passengers} />
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
