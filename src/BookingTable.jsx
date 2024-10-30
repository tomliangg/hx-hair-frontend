import { format, getTime } from "date-fns";
import { useState, useEffect } from "react";
import classNames from "classnames";
import './table.css'

const BookingTable = () => {
    const currentDate = new Date();
    const [weekData, setWeekData] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        const fetchWeekData = async () => {
            const formattedDate = format(currentDate, 'yyyy-MM-dd');
            const response = await fetch(`/api/appointments/week/${formattedDate}`);

            if (!response.ok) {
                console.error("Error fetching appointment data:", response.status);
                // TODO: surface the error to users by using alert or toast
                return;
            }
            const data = await response.json();
            setWeekData(data);
        }

        fetchWeekData();
    }, [setWeekData]);

    const handleSlotClick = (timeslot) => {
        setSelectedSlot(timeslot);
    }

    const weekDays = weekData.map((day, dayIndex) => (
        <div key={dayIndex} className="day-column">
            <div className="day-header">{format(`${day.date}T00:00:00`, 'EEE, M/d')}</div>
            <div className="time-slots">
                {day.slots.map((slot, slotIndex) => (
                    <div 
                        key={slotIndex} 
                        className={classNames('time-slot', slot.available ? 'available' : 'booked', getTime(slot.time) === getTime(selectedSlot ?? new Date()) && 'selected')} 
                        onClick={() => {
                        handleSlotClick(slot.time)
                    }}>
                        {format(new Date(slot.time), 'h:mm a')}
                    </div>
                ))}
            </div>
        </div>
    ));

    return (
        <div className="booking-table">
            {weekDays}
        </div>
    )
}

export default BookingTable;