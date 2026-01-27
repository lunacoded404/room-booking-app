import React, { useContext } from "react";
import RoomImageSlider from "./RoomImageSlider";
import RoomInfo from "./RoomInfo";
import "./RoomDetails.css";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

const RoomCard = ({ room, selectedDateRange, onBookingSuccess }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

const handleBooking = async (roomId, userId, range) => {
  if (!user) return navigate("/auth");
  
  const baseURL = "http://127.0.0.1:8000";
  const roomUrl = `${baseURL}/rooms/${roomId}/`;
  const userUrl = `${baseURL}/users/${userId}/`;

  let start = new Date(range.startDate);
  let end = range.endDate ? new Date(range.endDate) : new Date(range.startDate);

  // Chuyển hàm này ra ngoài vòng lặp để code sạch hơn
  const formatDateSafe = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Vòng lặp chạy từ ngày bắt đầu đến ngày kết thúc
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    try {
      // TẠI ĐÂY: Sử dụng biến 'd' thay vì 'currentDate'
      const formattedDate = formatDateSafe(d); 

      const response = await fetch(`${baseURL}/occupied-dates/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${user.token}`,
        },
        body: JSON.stringify({
          room: roomUrl,
          user: userUrl,
          date: formattedDate, // Đã sửa thành formattedDate
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      console.log("Đặt thành công ngày:", formattedDate);
    } catch (error) {
      console.error("Error during booking:", error);
      alert("Lỗi: " + error.message);
      return; 
    }
  }
  
  onBookingSuccess();
  alert("Đặt phòng thành công!");
};

  return (
    <div className="room-card">
      <RoomImageSlider images={room.images} />
      <RoomInfo room={room} />
      {selectedDateRange && (
        <button
          className="book-room-button"
          onClick={() => handleBooking(room.id, user?.user?.id, selectedDateRange)}
          disabled={!selectedDateRange.startDate}
        >
          Book Room
        </button>
      )}
    </div>
  );
};

export default RoomCard;