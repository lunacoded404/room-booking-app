import React, { useContext, useEffect, useState } from "react";
import "./AuthForm.css";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
const AuthForm = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
async function handleLogin() {
  console.log("Logging In", formData);
  try {
    const response = await fetch("http://127.0.0.1:8000/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        username: formData.email, // Gửi email làm username
      }),
    });

    const data = await response.json(); // Luôn lấy data để xem lỗi

    if (!response.ok) {
      console.error("Chi tiết lỗi Login:", data);
      // Hiển thị thông báo cụ thể cho người dùng
      alert("Đăng nhập thất bại: " + (data.non_field_errors || "Sai email hoặc mật khẩu!"));
      throw new Error("Login failed");
    }

    console.log("Login successful:", data);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    navigate("/");
  } catch (error) {
    console.error("Error during login:", error);
  }
}
async function handleRegister() {
    console.log("Registering", formData);
    try {
        const response = await fetch("http://127.0.0.1:8000/register/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
                username: formData.email,
                full_name: formData.name,
            }),
        });

        const data = await response.json(); // Luôn parse JSON để xem phản hồi

        if (!response.ok) {
            // ĐÂY LÀ DÒNG QUAN TRỌNG NHẤT
            console.error("Server báo lỗi cụ thể:", data); 
            // Nó sẽ hiện ra kiểu: { email: ["Email already exists"], password: ["Too short"] }
            alert("Lỗi: " + JSON.stringify(data)); 
            return;
        }

        console.log("Register successful:", data);
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        navigate("/");
    } catch (error) {
        console.error("Lỗi kết nối hoặc lỗi logic:", error);
    }
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await handleLogin();
    } else {
      await handleRegister();
    }
  };
  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
    setFormData({ email: "", password: "", name: "" }); // Clear form data when switching
  };
  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login to Your Account" : "Create an Account"}</h2>
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isLogin ? "Log In" : "Sign Up"}</button>
      </form>
      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button className="switcher" onClick={toggleAuthMode}>
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;