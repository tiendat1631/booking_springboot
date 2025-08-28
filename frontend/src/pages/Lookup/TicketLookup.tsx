// import { lookupBooking } from "@/services/ticket/ticketServices";
// import { TicketInfo } from "@/services/ticket/types";
// import { useState } from "react";
// import TicketInvoice from "./partials/TicketInvoice";
// import Footer from "@/components/shared/Footer";
// const TicketLookup = () => {
//   const [phoneNum, setPhoneNum] = useState("");
//   const [ticketCode, setTicketCode] = useState("");

//   const [result, setResult] = useState<TicketInfo | null>(null);

//   const handleLookup = async () => {
//     const res = await lookupBooking({ ticketCode, phoneNum });
//     if (res.success) {
//       setResult(res.content);
//     } else {
//       console.error(res.error);
//     }
//   };

//   return (
//       <>
//         {/*<Header variant={"ticket-lockup"}/>*/}
//         <div className="flex flex-col ju items-center py-8">
//           <h1 className="text-green-800 mb-6 text-xl font-medium">
//             TRA CỨU THÔNG TIN ĐẶT VÉ
//           </h1>

//           <div className="flex flex-col items-center space-y-4 w-full max-w-md mx-auto">
//             <input
//                 value={phoneNum}
//                 onChange={(e) => setPhoneNum(e.target.value)}
//                 type="text"
//                 placeholder="Vui lòng nhập số điện thoại"
//                 className="w-full border rounded px-4 py-2"
//             />
//             <input
//                 value={ticketCode}
//                 onChange={(e) => setTicketCode(e.target.value)}
//                 type="text"
//                 placeholder="Vui lòng nhập mã vé"
//                 className="w-full border rounded px-4 py-2"
//             />
//             <button
//                 onClick={handleLookup}
//                 className="w-56 bg-red-100 text-red-500 px-4 py-2 rounded-2xl hover:bg-orange-500 hover:text-white transition-colors duration-200"
//             >
//               {" "}
//               Tra cứu
//             </button>
//           </div>

//           {result && <TicketInvoice data={result} />}
//         </div>
//         <Footer/>
//       </>

//   );
// };

// export default TicketLookup;
