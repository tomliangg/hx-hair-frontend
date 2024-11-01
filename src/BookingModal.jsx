import './modal.css'
import { useForm } from "react-hook-form";
import { format } from "date-fns";

export const BookingModal = ({
    open,
    setOpen,
    selectedSlot,
    setSelectedSlot,
    setCurrentDate,
}) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const closeModal = () => {
        setOpen(false);
    }

    const onSubmit = async (formData) => {
        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startTime: selectedSlot,
                    endTime: new Date(new Date(selectedSlot).getTime() + (30 * 60 * 1000)).toISOString(),
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                // TODO: use a toast to show the error message
                console.error("Booking error:", errorData.error || response.status);
                return;
            }

            // booking successful
            closeModal();
            setSelectedSlot(null);

            // update currentDate state so that BookingTable can refetch weekData
            setCurrentDate(new Date());

        } catch (err) {
            console.error("Booking error exception:", err)
        }
    }

    if (!open) {
        return null;
    }

    return (
        <div className="backdrop">
            <div className="modalContainer">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2>Confirm Booking</h2>
                    <p>Date: {format(new Date(selectedSlot), 'EEE, MMM d, yyyy')}</p>
                    <p>Time: {format(new Date(selectedSlot), 'h:mm a')}</p>
                    <input {...register("firstName", {
                        required: true,
                        pattern: /^[A-Za-z]+$/i
                    })} placeholder="First name" />
                    {errors?.firstName?.type === "required" && <p className="error">This field is required</p>}
                    {errors?.firstName?.type === "pattern" && <p className="error">Alphabetical characters only</p>}
                    <input {...register("lastName", {
                        required: true,
                        pattern: /^[A-Za-z]+$/i
                    })} placeholder="Last name" />
                    {errors?.lastName?.type === "required" && <p className="error">This field is required</p>}
                    <input {...register("email", {
                        required: true,
                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    })} placeholder="Email" />
                    {errors?.email?.type === "required" && <p className="error">This field is required</p>}

                    <input type="submit" />
                    <button onClick={closeModal} className="cancelBtn" type="button">Cancel</button>
                </form>
            </div>
        </div>
    )
}