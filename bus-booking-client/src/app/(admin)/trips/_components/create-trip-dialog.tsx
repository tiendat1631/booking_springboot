// "use client";

// import * as React from "react";
// import { useRouter } from "next/navigation";
// import { Controller, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { format } from "date-fns";
// import { Plus, Loader2, CalendarIcon } from "lucide-react";
// import { toast } from "sonner";

// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog";
// import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { cn } from "@/lib/utils";
// import { generateTimeOptions } from "@/lib/format";
// import { createTripSchema, type CreateTripInput, type CreateTripFormInput } from "@/lib/validations";
// import { createTrip } from "@/actions";
// import type { Bus, Station } from "@/schemas";

// interface CreateTripDialogProps {
//     buses: Bus[];
//     stations: Station[];
// }

// export function CreateTripDialog({ buses, stations }: CreateTripDialogProps) {
//     const router = useRouter();
//     const [open, setOpen] = React.useState(false);
//     const [isPending, startTransition] = React.useTransition();
    
//     // Local state for date/time pickers
//     const [departureDate, setDepartureDate] = React.useState<Date | undefined>(undefined);
//     const [departureTime, setDepartureTime] = React.useState("08:00");
//     const [arrivalDate, setArrivalDate] = React.useState<Date | undefined>(undefined);
//     const [arrivalTime, setArrivalTime] = React.useState("18:00");

//     // Generate time options
//     const timeOptions = React.useMemo(() => generateTimeOptions(30), []);

//     const form = useForm<CreateTripFormInput>({
//         resolver: zodResolver(createTripSchema),
//         defaultValues: {
//             busId: "",
//             departureStationId: "",
//             destinationStationId: "",
//             departureTime: new Date(),
//             arrivalTime: new Date(),
//             price: 0,
//         },
//     });

//     // Sync departure date/time to form
//     React.useEffect(() => {
//         if (departureDate) {
//             const [hours, minutes] = departureTime.split(":").map(Number);
//             const combined = new Date(departureDate);
//             combined.setHours(hours || 0, minutes || 0, 0, 0);
//             form.setValue("departureTime", combined);
//         }
//     }, [departureDate, departureTime, form]);

//     // Sync arrival date/time to form
//     React.useEffect(() => {
//         if (arrivalDate) {
//             const [hours, minutes] = arrivalTime.split(":").map(Number);
//             const combined = new Date(arrivalDate);
//             combined.setHours(hours || 0, minutes || 0, 0, 0);
//             form.setValue("arrivalTime", combined);
//         }
//     }, [arrivalDate, arrivalTime, form]);

//     const onSubmit = (data: CreateTripInput) => {
//         startTransition(async () => {
//             const result = await createTrip(data);

//             if (result.success) {
//                 toast.success("Trip created successfully");
//                 form.reset();
//                 setDepartureDate(undefined);
//                 setArrivalDate(undefined);
//                 setDepartureTime("08:00");
//                 setArrivalTime("18:00");
//                 setOpen(false);
//                 router.refresh();
//             } else {
//                 toast.error(result.error ?? "Failed to create trip");
//             }
//         });
//     };

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//                 <Button>
//                     <Plus />
//                     Add Trip
//                 </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
//                 <DialogHeader>
//                     <DialogTitle>Add New Trip</DialogTitle>
//                     <DialogDescription>
//                         Create a new trip with the selected bus and route.
//                     </DialogDescription>
//                 </DialogHeader>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                     <FieldGroup>
//                         {/* Bus Selection */}
//                         <Controller
//                             name="busId"
//                             control={form.control}
//                             render={({ field, fieldState }) => (
//                                 <Field data-invalid={fieldState.invalid}>
//                                     <FieldLabel>Bus</FieldLabel>
//                                     <Select
//                                         value={field.value}
//                                         onValueChange={field.onChange}
//                                     >
//                                         <SelectTrigger aria-invalid={fieldState.invalid}>
//                                             <SelectValue placeholder="Select a bus" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {buses.map((bus) => (
//                                                 <SelectItem key={bus.id} value={bus.id}>
//                                                     {bus.licensePlate} - {bus.type} ({bus.totalSeats} seats)
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                     {fieldState.invalid && (
//                                         <FieldError errors={[fieldState.error]} />
//                                     )}
//                                 </Field>
//                             )}
//                         />

//                         {/* Stations */}
//                         <div className="grid grid-cols-2 gap-4">
//                             <Controller
//                                 name="departureStationId"
//                                 control={form.control}
//                                 render={({ field, fieldState }) => (
//                                     <Field data-invalid={fieldState.invalid}>
//                                         <FieldLabel>Departure Station</FieldLabel>
//                                         <Select
//                                             value={field.value}
//                                             onValueChange={field.onChange}
//                                         >
//                                             <SelectTrigger aria-invalid={fieldState.invalid}>
//                                                 <SelectValue placeholder="Select station" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {stations.map((station) => (
//                                                     <SelectItem key={station.id} value={station.id}>
//                                                         {station.name}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                         {fieldState.invalid && (
//                                             <FieldError errors={[fieldState.error]} />
//                                         )}
//                                     </Field>
//                                 )}
//                             />

//                             <Controller
//                                 name="destinationStationId"
//                                 control={form.control}
//                                 render={({ field, fieldState }) => (
//                                     <Field data-invalid={fieldState.invalid}>
//                                         <FieldLabel>Destination Station</FieldLabel>
//                                         <Select
//                                             value={field.value}
//                                             onValueChange={field.onChange}
//                                         >
//                                             <SelectTrigger aria-invalid={fieldState.invalid}>
//                                                 <SelectValue placeholder="Select station" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {stations.map((station) => (
//                                                     <SelectItem key={station.id} value={station.id}>
//                                                         {station.name}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                         {fieldState.invalid && (
//                                             <FieldError errors={[fieldState.error]} />
//                                         )}
//                                     </Field>
//                                 )}
//                             />
//                         </div>

//                         {/* Departure Date & Time */}
//                         <Controller
//                             name="departureTime"
//                             control={form.control}
//                             render={({ fieldState }) => (
//                                 <Field data-invalid={fieldState.invalid}>
//                                     <FieldLabel>Departure Date & Time</FieldLabel>
//                                     <div className="flex gap-2">
//                                         <Popover>
//                                             <PopoverTrigger asChild>
//                                                 <Button
//                                                     type="button"
//                                                     variant="outline"
//                                                     className={cn(
//                                                         "flex-1 justify-start text-left font-normal",
//                                                         !departureDate && "text-muted-foreground"
//                                                     )}
//                                                 >
//                                                     <CalendarIcon className="mr-2 h-4 w-4" />
//                                                     {departureDate ? format(departureDate, "dd/MM/yyyy") : "Select date"}
//                                                 </Button>
//                                             </PopoverTrigger>
//                                             <PopoverContent className="w-auto p-0" align="start">
//                                                 <Calendar
//                                                     mode="single"
//                                                     selected={departureDate}
//                                                     onSelect={setDepartureDate}
//                                                     disabled={(date) => {
//                                                         const today = new Date();
//                                                         today.setHours(0, 0, 0, 0);
//                                                         return date < today;
//                                                     }}
//                                                 />
//                                             </PopoverContent>
//                                         </Popover>
//                                         <Select value={departureTime} onValueChange={setDepartureTime}>
//                                             <SelectTrigger className="w-28">
//                                                 <SelectValue placeholder="Time" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {timeOptions.map((time) => (
//                                                     <SelectItem key={time} value={time}>
//                                                         {time}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     </div>
//                                     {fieldState.invalid && (
//                                         <FieldError errors={[fieldState.error]} />
//                                     )}
//                                 </Field>
//                             )}
//                         />

//                         {/* Arrival Date & Time */}
//                         <Controller
//                             name="arrivalTime"
//                             control={form.control}
//                             render={({ fieldState }) => (
//                                 <Field data-invalid={fieldState.invalid}>
//                                     <FieldLabel>Arrival Date & Time</FieldLabel>
//                                     <div className="flex gap-2">
//                                         <Popover>
//                                             <PopoverTrigger asChild>
//                                                 <Button
//                                                     type="button"
//                                                     variant="outline"
//                                                     className={cn(
//                                                         "flex-1 justify-start text-left font-normal",
//                                                         !arrivalDate && "text-muted-foreground"
//                                                     )}
//                                                 >
//                                                     <CalendarIcon className="mr-2 h-4 w-4" />
//                                                     {arrivalDate ? format(arrivalDate, "dd/MM/yyyy") : "Select date"}
//                                                 </Button>
//                                             </PopoverTrigger>
//                                             <PopoverContent className="w-auto p-0" align="start">
//                                                 <Calendar
//                                                     mode="single"
//                                                     selected={arrivalDate}
//                                                     onSelect={setArrivalDate}
//                                                     disabled={(date) => {
//                                                         const today = new Date();
//                                                         today.setHours(0, 0, 0, 0);
//                                                         if (date < today) return true;
//                                                         if (departureDate && date < departureDate) return true;
//                                                         return false;
//                                                     }}
//                                                 />
//                                             </PopoverContent>
//                                         </Popover>
//                                         <Select value={arrivalTime} onValueChange={setArrivalTime}>
//                                             <SelectTrigger className="w-28">
//                                                 <SelectValue placeholder="Time" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {timeOptions.map((time) => (
//                                                     <SelectItem key={time} value={time}>
//                                                         {time}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     </div>
//                                     {fieldState.invalid && (
//                                         <FieldError errors={[fieldState.error]} />
//                                     )}
//                                 </Field>
//                             )}
//                         />

//                         {/* Price */}
//                         <Controller
//                             name="price"
//                             control={form.control}
//                             render={({ field, fieldState }) => (
//                                 <Field data-invalid={fieldState.invalid}>
//                                     <FieldLabel htmlFor="trip-price">Price (VND)</FieldLabel>
//                                     <Input
//                                         {...field}
//                                         id="trip-price"
//                                         type="number"
//                                         placeholder="Enter price"
//                                         min={0}
//                                         step={1000}
//                                         onChange={(e) => field.onChange(e.target.value)}
//                                         aria-invalid={fieldState.invalid}
//                                     />
//                                     {fieldState.invalid && (
//                                         <FieldError errors={[fieldState.error]} />
//                                     )}
//                                 </Field>
//                             )}
//                         />
//                     </FieldGroup>

//                     <DialogFooter>
//                         <Button
//                             type="button"
//                             variant="outline"
//                             onClick={() => setOpen(false)}
//                         >
//                             Cancel
//                         </Button>
//                         <Button type="submit" disabled={isPending}>
//                             {isPending && <Loader2 className="animate-spin" />}
//                             Create Trip
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// }
