import React, { useState } from "react";

const RoomImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Khai báo URL của Backend (phải khớp với cổng Backend của bạn)
  const BASE_URL = "http://127.0.0.1:8000";

  // Kiểm tra nếu images chưa có dữ liệu hoặc là mảng rỗng
  if (!images || images.length === 0) {
    return (
      <div className="image-slider">
        <div className="placeholder">Đang tải hình ảnh hoặc không có ảnh...</div>
      </div>
    );
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // 2. Logic xử lý URL ảnh
  const rawImagePath = images[currentIndex]?.image;
  
  // Nếu path đã có "http" thì dùng luôn, nếu không thì nối thêm BASE_URL
  const fullImageUrl = rawImagePath?.startsWith("http")
    ? rawImagePath
    : `${BASE_URL}${rawImagePath}`;

  return (
    <div className="image-slider">
      {/* Chỉ hiện nút điều hướng nếu có nhiều hơn 1 ảnh */}
      {images.length > 1 && (
        <button className="prev-btn" onClick={handlePrev}>&#10094;</button>
      )}
      
      {rawImagePath ? (
        <img
          src={fullImageUrl}
          alt={images[currentIndex]?.caption || `Room image ${currentIndex + 1}`}
          className="slider-image"
          // Xử lý trường hợp link ảnh đúng nhưng file trên server bị lỗi/xóa
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/600x400?text=Anh+bi+loi";
          }}
        />
      ) : (
        <div className="placeholder">Ảnh không tồn tại</div>
      )}

      {images.length > 1 && (
        <button className="next-btn" onClick={handleNext}>&#10095;</button>
      )}

      {/* Thêm số thứ tự ảnh cho chuyên nghiệp (Ví dụ: 1/5) */}
      <div className="image-counter">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default RoomImageSlider;