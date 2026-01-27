import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import RoomCard from "./RoomDetails/RoomCard";
import "./BookingComponent.css";

const BookingComponent = ({ currentUser }) => {
  const [selectedDates, setSelectedDates] = useState({
    startDate: null,
    endDate: null,
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(currentUser);

  const [roomData, setRoomData] = useState([]);

  useEffect(() => {
    async function fetchRoomData() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/rooms/",
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch room data.");
        }

        const data = await response.json(); // Parse the JSON response

        console.log("Fetching successful:", data);
        setRoomData(data);
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    }
    fetchRoomData();
  }, []);

  const handleDateClick = (day, monthOffset = 0) => {
  const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + monthOffset,
      day,
      12, 0, 0 // Thêm 12 giờ trưa vào đây
    );

    if (!selectedDates.startDate || selectedDates.endDate) {
      // If no dates are selected or both are already set, reset to a single date
      setSelectedDates({ startDate: selectedDate, endDate: null });
    } else if (selectedDate.getTime() === selectedDates.startDate.getTime()) {
      // If clicking the same date again, treat as a single-day selection
      setSelectedDates({ startDate: selectedDate, endDate: selectedDate });
    } else {
      // Set the endDate if selecting a valid range
      if (selectedDate > selectedDates.startDate) {
        setSelectedDates({ ...selectedDates, endDate: selectedDate });
      } else {
        setSelectedDates({
          startDate: selectedDate,
          endDate: selectedDates.startDate,
        });
      }
    }

    setError(""); // Clear any error message on date selection
  };

  const handleMonthChange = (increment) => {
    const newDate = new Date(
      currentDate.setMonth(currentDate.getMonth() + increment)
    );
    setCurrentDate(new Date(newDate));
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const startOfMonth = new Date(year, month, 1).getDay();
    const daysInPreviousMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Add previous month days
    for (let i = startOfMonth - 1; i >= 0; i--) {
      days.push({ day: daysInPreviousMonth - i, monthOffset: -1 });
    }

    // Add current month days
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push({ day: i, monthOffset: 0 });
    }

    // Add next month days
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({ day: i, monthOffset: 1 });
    }

    return days;
  };

const isDateSelected = (day, monthOffset) => {
  // Đồng bộ mốc 12 giờ trưa để khớp với handleDateClick
  const date = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + monthOffset,
    day,
    12, 0, 0 
  );

  const { startDate, endDate } = selectedDates;
  const dateTime = date.getTime();

  if (!startDate) return false;

  const startTIme = startDate.getTime();

  // 1. Nếu chỉ mới chọn ngày bắt đầu
  if (!endDate) {
    return dateTime === startTIme;
  }

  const endTime = endDate.getTime();

  // 2. Nếu đã chọn cả khoảng (Highlight ngày đầu, ngày cuối và các ngày ở giữa)
  return dateTime >= startTIme && dateTime <= endTime;
};

  const days = generateCalendarDays();

const handleFilterRooms = () => {
if (!selectedDates.startDate) {
    setError("Please select a valid date.");
    setIsFiltered(false);
    return;
  }

  // Ép về giữa ngày để tránh lệch múi giờ nhảy ngày
  const startDate = new Date(selectedDates.startDate);
  startDate.setHours(12, 0, 0, 0); 

  const endDate = selectedDates.endDate 
    ? new Date(selectedDates.endDate) 
    : new Date(selectedDates.startDate);
  endDate.setHours(12, 0, 0, 0);

  const isDateInRange = (occupiedDateStr) => {
    // Lưu ý: occupiedDateStr từ server thường là "YYYY-MM-DD"
    // Khi parse trực tiếp, JS có thể coi nó là UTC
    const occupied = new Date(occupiedDateStr);
    occupied.setHours(12, 0, 0, 0); 
    
    return occupied.getTime() >= startDate.getTime() && occupied.getTime() <= endDate.getTime();
  };

  const availableRooms = roomData.filter((room) => {
    // 1. Dùng đúng tên 'occupied_dates' (khớp với Django Serializer)
    // 2. Thêm '|| []' để tránh lỗi nếu dữ liệu null/undefined
    const dates = room.occupied_dates || room.occupiedDates || []; 
    
    return dates.every((occ) => !isDateInRange(occ.date));
  });

  setFilteredRooms(availableRooms);
  setIsFiltered(true);
  setError("");
};

  return (
    <div className="booking-container">
      <div className="calendar-header">
        <button className="date-switcher" onClick={() => handleMonthChange(-1)}>
          <FaArrowLeft></FaArrowLeft>{" "}
        </button>
        <h2>
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button className="date-switcher" onClick={() => handleMonthChange(1)}>
          <FaArrowRight></FaArrowRight>
        </button>
      </div>

      <div className="calendar-days">
        {days.map(({ day, monthOffset }, index) => (
          <div
            key={index}
            className={`calendar-day ${
              isDateSelected(day, monthOffset) ? "selected" : ""
            } ${monthOffset !== 0 ? "overflow" : ""}`}
            onClick={() => handleDateClick(day, monthOffset)}
          >
            {day}
          </div>
        ))}
      </div>

      <button className="book-rooms-button" onClick={handleFilterRooms}>
        Book Rooms
      </button>

      {error && <div className="error-message">{error}</div>}

      <div className="filtered-rooms">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <RoomCard
              onBookingSuccess={() => {
                setSelectedDates({
                  startDate: null,
                  endDate: null,
                });
                setFilteredRooms([]);
                setSuccess("Booking Succesful!");
                setTimeout(() => {
                  setSuccess("");
                  setError("");
                }, 5000);
              }}
              key={room.id}
              room={room}
              selectedDateRange={selectedDates}
            />
          ))
        ) : isFiltered && selectedDates.startDate ? (
          <p>No available rooms for the selected dates.</p>
        ) : success != "" ? (
          <p>{success}</p>
        ) : error != "" ? (
          <p>{error}</p>
        ) : (
          <p>Please select a date for booking.</p>
        )}
      </div>
    </div>
  );
};

export default BookingComponent;