# Room Booking Application 

Ứng dụng quản lý và đặt phòng trực tuyến được xây dựng với kiến trúc Full-stack. 
Dự án bao gồm hệ thống quản lý phòng cho Admin và giao diện đặt phòng tiện lợi cho người dùng.

---

## I. Cách chạy ứng dụng ở local

Dự án này bao gồm hai phần chính. Bạn cần chạy cả hai server song song để ứng dụng hoạt động hoàn chỉnh.

### 1. Backend (Django REST Framework)
Đảm bảo bạn đã cài đặt Python (phiên bản 3.x).

```bash
1. Di chuyển vào thư mục dự án (chứa file manage.py)
cd room-booking-app\Backend\Booking_Backend

2. Tạo môi trường ảo
python -m venv env

3. Kích hoạt môi trường ảo
# Windows:
.\env\Scripts\activate
# macOS/Linux:
source env/bin/activate

4. Cài đặt các thư viện cần thiết
pip install -r requirements.txt

6. Khởi chạy server backend
python manage.py runserver
```
> [!NOTE]
> **Backend URL: http://127.0.0.1:8000/
>

> [!IMPORTANT]
> **Admin account:**
> * username: admin
> * password: admin123
> * admin URL: http://127.0.0.1:8000/admin/

### 2. Frontend (React + Vite)
```bash
1. Di chuyển vào thư mục Frontend
cd Frontend\Booking-App

2. Cài đặt các gói thư viện (node_modules)
npm install

3. Chạy ứng dụng ở chế độ phát triển
npm run dev
```
> [!NOTE]
> **Frontend URL: http://localhost:5173/
