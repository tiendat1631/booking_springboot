package org.application.booking.presentation.DTO;

import lombok.Getter;
import lombok.Setter;
import org.application.booking.application.query.TripSpecification;
import org.application.booking.domain.aggregates.TripModel.Trip;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

@Getter
@Setter
public class SearchTripRequest {
    private String from;
    private String to;
    private LocalDateTime date;
    private int numberOfSeats;

    public Specification<Trip> toSpecification() {
        Specification<Trip> spec = Specification.where(null);

        from = Converter(from); //for testing only
        if (from != null && !from.isBlank()) {
            spec = spec.and(TripSpecification.fromLocation(from));
        }

        to = Converter(to);
        if (to != null && !to.isBlank()) {
            spec = spec.and(TripSpecification.toLocation(to));
        }
        if (date != null) {
            spec = spec.and(TripSpecification.hasDate(date));
        }
        if (numberOfSeats >0){
            spec = spec.and(TripSpecification.hasTicket(numberOfSeats));
        }
        return spec;
    }

    private String Converter(String id) {
        switch (id) {
            case "11": return "Cao Bằng";
            case "12": return "Lạng Sơn";
            case "14": return "Quảng Ninh";
            case "15": return "Hải Phòng";
            case "17": return "Thái Bình";
            case "18": return "Nam Định";
            case "19": return "Phú Thọ";
            case "20": return "Thái Nguyên";
            case "21": return "Yên Bái";
            case "22": return "Tuyên Quang";
            case "23": return "Hà Giang";
            case "24": return "Lào Cai";
            case "25": return "Lai Châu";
            case "26": return "Sơn La";
            case "27": return "Điện Biên";
            case "28": return "Hòa Bình";
            case "29": return "Hà Nội";
            case "34": return "Hải Dương";
            case "35": return "Ninh Bình";
            case "36": return "Thanh Hóa";
            case "37": return "Nghệ An";
            case "38": return "Hà Tĩnh";
            case "43": return "Đà Nẵng";
            case "44": return "Quảng Bình";
            case "45": return "Quảng Trị";
            case "46": return "Thừa Thiên Huế";
            case "47": return "Đắk Lắk";
            case "48": return "Đắk Nông";
            case "49": return "Lâm Đồng";
            case "50": return "HCM";
            case "60": return "Đồng Nai";
            case "61": return "Bình Dương";
            case "62": return "Long An";
            case "63": return "Tiền Giang";
            case "64": return "Vĩnh Long";
            case "65": return "Cần Thơ";
            case "66": return "Đồng Tháp";
            case "67": return "An Giang";
            case "68": return "Kiên Giang";
            case "69": return "Cà Mau";
            case "70": return "Tây Ninh";
            case "71": return "Bến Tre";
            case "72": return "Bà Rịa–Vũng Tàu";
            case "73": return "Quảng Bình";
            case "74": return "Quảng Trị";
            case "75": return "Thừa Thiên Huế";
            case "76": return "Quảng Ngãi";
            case "77": return "Bình Định";
            case "78": return "Phu Yen";
            case "79": return "Khánh Hòa";
            case "80": return "Cơ quan Trung Ương";
            case "81": return "Gia Lai";
            case "82": return "Kon Tum";
            case "83": return "Sóc Trăng";
            case "84": return "Trà Vinh";
            case "85": return "Ninh Thuận";
            case "86": return "Bình Thuận";
            case "88": return "Vĩnh Phúc";
            case "89": return "Hưng Yên";
            case "90": return "Hà Nam";
            case "91": return "Bạc Liêu";
            case "92": return "Quảng Nam";
            case "93": return "Bình Phước";
            case "94": return "Bạc Liêu";
            case "95": return "Hậu Giang";
            case "96": return "Bắc Kạn";
            case "97": return "Bắc Giang";
            case "98": return "Bắc Ninh";
            default: return "Không xác định";
        }
    }

}
