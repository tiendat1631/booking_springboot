import { useState, useMemo } from "react";
import { TripResponse } from "@/services/trip/types";
import TripCard from "./tripCard";
import { Bus, Clock, CreditCard, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Hàm tiện ích xác định khung giờ
const getTimeSlot = (time: string) => {
    const hour = new Date(time).getHours();
    if (hour >= 5 && hour < 12) return "morning";   // 5h - 12h
    if (hour >= 12 && hour < 18) return "afternoon"; // 12h - 18h
    if (hour >= 18 && hour < 23) return "evening";   // 18h - 23h
    return "night";                                  // 23h - 5h
};

type TripListProps = {
    trips: TripResponse[];
};

export const TripList = ({ trips }: TripListProps) => {
    const [timeFilter, setTimeFilter] = useState("all");
    const [busTypeFilter, setBusTypeFilter] = useState("all");
    const [priceFilter, setPriceFilter] = useState("all");
    const [sortBy, setSortBy] = useState("time");
    // const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Get unique bus types from trips
    const busTypes = useMemo(() => {
        const types = [...new Set(trips.map(trip => trip.bus.type))];
        return ["all", ...types];
    }, [trips]);

    // Filter and sort trips
    const filteredAndSortedTrips = useMemo(() => {
        let filtered = trips.filter((trip) => {
            const matchesTime = timeFilter === "all" || getTimeSlot(trip.departureTime) === timeFilter;
            const matchesBus = busTypeFilter === "all" || trip.bus.type === busTypeFilter;

            let matchesPrice = true;
            if (priceFilter !== "all") {
                const price = trip.ticketPrice;
                switch (priceFilter) {
                    case "under-300k":
                        matchesPrice = price < 300000;
                        break;
                    case "300k-500k":
                        matchesPrice = price >= 300000 && price <= 500000;
                        break;
                    case "500k-1m":
                        matchesPrice = price > 500000 && price <= 1000000;
                        break;
                    case "over-1m":
                        matchesPrice = price > 1000000;
                        break;
                }
            }

            return matchesTime && matchesBus && matchesPrice;
        });

        // Sort results
        switch (sortBy) {
            case "time":
                return filtered.sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime());
            case "price-low":
                return filtered.sort((a, b) => a.ticketPrice - b.ticketPrice);
            case "price-high":
                return filtered.sort((a, b) => b.ticketPrice - a.ticketPrice);
            case "seats":
                return filtered.sort((a, b) => b.tickets.length - a.tickets.length);
            default:
                return filtered;
        }
    }, [trips, timeFilter, busTypeFilter, priceFilter, sortBy]);

    const clearFilters = () => {
        setTimeFilter("all");
        setBusTypeFilter("all");
        setPriceFilter("all");
    };

    // const activeFiltersCount = [timeFilter, busTypeFilter, priceFilter].filter(f => f !== "all").length;

    return (
        <div className="w-full max-w-7xl mx-auto flex gap-6 p-3">
            {/* Filter Panel */}
            <div className="w-72 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-6">
                <div className="flex flex-col gap-4">
                    {/* Time Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Clock className="w-4 h-4 inline mr-2" />
                            Khung giờ khởi hành
                        </label>
                        <Select value={timeFilter} onValueChange={setTimeFilter}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn khung giờ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả khung giờ</SelectItem>
                                <SelectItem value="morning">Buổi sáng (05:00 - 12:00)</SelectItem>
                                <SelectItem value="afternoon">Buổi chiều (12:00 - 18:00)</SelectItem>
                                <SelectItem value="evening">Buổi tối (18:00 - 23:00)</SelectItem>
                                <SelectItem value="night">Ban đêm (23:00 - 05:00)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Bus Type Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Bus className="w-4 h-4 inline mr-2" />
                            Loại xe
                        </label>
                        <Select value={busTypeFilter} onValueChange={setBusTypeFilter}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn loại xe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả loại xe</SelectItem>
                                {busTypes.filter((type) => type !== "all").map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Price Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <CreditCard className="w-4 h-4 inline mr-2" />
                            Khoảng giá
                        </label>
                        <Select value={priceFilter} onValueChange={setPriceFilter}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn khoảng giá" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả mức giá</SelectItem>
                                <SelectItem value="under-300k">Dưới 300K</SelectItem>
                                <SelectItem value="300k-500k">300K - 500K</SelectItem>
                                <SelectItem value="500k-1m">500K - 1M</SelectItem>
                                <SelectItem value="over-1m">Trên 1M</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="flex-1">
                {filteredAndSortedTrips.length > 0 ? (
                    <>
                        {/* Results summary */}
                        <span>
                            Hiển thị {filteredAndSortedTrips.length} chuyến xe
                        </span>

                        {/* Trip cards */}
                        {filteredAndSortedTrips.map((trip) => (
                            <TripCard key={trip.id} trip={trip} />
                        ))}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                            Không tìm thấy chuyến xe nào
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                        </p>
                        <button
                            onClick={clearFilters}
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                            Xóa tất cả bộ lọc
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}