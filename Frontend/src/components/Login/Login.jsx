import React, { useState, useEffect, useRef } from "react";
import "./Login.css";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TGLOGO from "../../images/tgLOGO.png";

const Login = ({ onClose, setUser }) => {
  const [step, setStep] = useState("choice");
  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""]);
  const [phone, setPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState(["", "", "", "", "", ""]);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const navigate = useNavigate();

  const emailOtpRefs = useRef([]);
  const phoneOtpRefs = useRef([]);

  // Helper function to handle post-login redirect
  const handlePostLoginRedirect = (serverRedirectTo) => {
    // Check for pending course enrollment
    const pendingCourse = localStorage.getItem('pendingCourse');
    const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');

    if (pendingCourse) {
      const course = JSON.parse(pendingCourse);
      localStorage.removeItem('pendingCourse'); // Clean up
      navigate('/course-purchase', {
        state: {
          ...course,
          price: course.price || 30000,
          oldPrice: course.oldPrice || 120000,
          features: [
            'Complete CAT preparation material',
            'Live interactive classes',
            'Mock tests and practice sets',
            'Doubt clearing sessions',
            'Performance analysis',
            'Study materials download'
          ]
        }
      });
    } else if (redirectAfterLogin) {
      localStorage.removeItem('redirectAfterLogin'); // Clean up
      navigate(redirectAfterLogin);
    } else {
      navigate(serverRedirectTo || "/user-details");
    }
  };

  const sendOtpEmail = async () => {
    try {
      await axios.post("/api/auth/email/send-email", {
        email,
      });
      setStep("verify_email");

      // ✅ Show success toast
      setToastMessage("📩 OTP sent successfully!");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("Error sending email OTP", err);
      setOtpError("Failed to send OTP. Try again.");
      setTimeout(() => setOtpError(""), 3000);
    }
  };

  const verifyOtpEmail = async () => {
    const otpCode = emailOtp.join("");

    try {
      const response = await axios.post(
        "/api/auth/email/verify",
        { email, otpCode }
      );

      // ✅ Save token and user
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setUser(response.data.user); // Optional: for context/state

      // ✅ Show success toast instead of box
      setToastMessage("✅ OTP verified successfully!");

      // ✅ Redirect after short delay
      setTimeout(() => {
        setToastMessage("");
        handlePostLoginRedirect(response.data.redirectTo);
      }, 2000);
    } catch (err) {
      setOtpError("❌ Invalid OTP. Please try again.");
      setTimeout(() => setOtpError(""), 3000);
    }
  };

  const sendOtpPhone = async () => {
    try {
      await axios.post("/api/auth/phone/send-otp", {
        phoneNumber: phone,
      });
      setStep("verify_phone");

      // ✅ Show toast
      setToastMessage("📩 OTP sent successfully!");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("Error sending SMS OTP", err);
      setOtpError("Failed to send OTP. Try again.");
      setTimeout(() => setOtpError(""), 3000);
    }
  };

  const verifyOtpPhone = async () => {
    const otpCode = phoneOtp.join("");
    try {
      const response = await axios.post(
        "/api/auth/phone/mobileVerify-otp",
        { phoneNumber: phone, otpCode }
      );

      // ✅ Save token and user
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setUser(response.data.user); // Optional: for context/state

      // ✅ Show success toast instead of box
      setToastMessage("✅ OTP verified successfully!");

      // ✅ Redirect after short delay
      setTimeout(() => {
        setToastMessage("");
        handlePostLoginRedirect(response.data.redirectTo);
      }, 2000);
    } catch (err) {
      setOtpError("❌ Invalid OTP. Please try again.");
      setTimeout(() => setOtpError(""), 3000);
    }
  };

  const handleOtpChange = (value, index, type) => {
    const otp = type === "email" ? [...emailOtp] : [...phoneOtp];
    otp[index] = value;

    if (type === "email") setEmailOtp(otp);
    else setPhoneOtp(otp);

    const refs = type === "email" ? emailOtpRefs : phoneOtpRefs;
    if (value && index < 5) refs.current[index + 1].focus();
  };

  return (
   <div className="tllogin-fullscreen-wrapper">
  <div className="tllogin-popup" onClick={(e) => e.stopPropagation()}>
    
    {/* ✅ Toast Messages Top pe (Inside popup) */}
    {otpError && (
      <div className="toast-top">
        <span>{otpError}</span>
        <button className="toast-close-btn" onClick={() => setOtpError("")}>
          ��
        </button>
      </div>
    )}
    {toastMessage && (
      <div className="toast-top success">{toastMessage}</div>
    )}

    <div className="tllogin-left-panel">
      <div className="tllogin-logo">
        <img src={TGLOGO} alt="TathaGat Logo" />
        <p className="tllogin-tagline">
          Access Your Personalized <br />
          <strong>Dashboard</strong> –{" "}
          <span>
            Where Preparation
            <br />
            Meets Performance.
          </span>
        </p>
      </div>
    </div>

    <div className="tllogin-right-panel">
      <div className="tllogin-box">
        {step !== "choice" && (
          <div className="tllogin-back-icon" onClick={() => setStep("choice")}>
            <FaArrowLeft /> Back
          </div>
        )}

        {step === "choice" && (
          <>
            <div className="tllogin-lock-icon">🔒</div>
            <h2>Welcome to TathaGat</h2>
            <p>Let's get started</p>
            <button className="tllogin-btn" onClick={() => setStep("phone")}>
              Login with phone number
            </button>
            <button className="tllogin-btn" onClick={() => setStep("email")}>
              Login with email
            </button>
          </>
        )}

        {step === "email" && (
          <>
            <h2>Login via Email</h2>
            <input
              type="email"
              placeholder="Enter your email"
              className="tlotp-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="tllogin-btn" onClick={sendOtpEmail}>
              Send OTP
            </button>
          </>
        )}

        {step === "verify_email" && (
          <>
            <div className="tllogin-lock-icon">📩</div>
            <h2>Check your email</h2>
            <p>
              Enter the code sent to <strong>{email}</strong>
            </p>
            <div className="tlotp-boxes">
              {emailOtp.map((d, i) => (
                <input
                  key={i}
                  maxLength="1"
                  className="tlotp-digit"
                  value={d}
                  onChange={(e) =>
                    handleOtpChange(e.target.value, i, "email")
                  }
                  ref={(ref) => (emailOtpRefs.current[i] = ref)}
                />
              ))}
            </div>
            <button className="tllogin-btn" onClick={verifyOtpEmail}>
              Verify
            </button>
            <p className="tlresend-text">
              Didn't receive the code?{" "}
              <span className="tlresend-link" onClick={sendOtpEmail}>
                Resend
              </span>
            </p>
          </>
        )}

        {step === "phone" && (
          <>
            <h2>Login via Phone</h2>
            <input
              type="text"
              placeholder="Enter your phone number"
              className="tlotp-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button className="tllogin-btn" onClick={sendOtpPhone}>
              Send OTP
            </button>
          </>
        )}

        {step === "verify_phone" && (
          <div className="login-otp-verification-box">
            <div className="login-otp-icon">
              <span role="img" aria-label="lock">🔐</span>
            </div>
            <h3>We just sent an SMS</h3>
            <p>
              Enter the security code we sent to
              <br />
              <strong>+91 {phone}</strong>
            </p>

            <div className="tlotp-boxes">
              {phoneOtp.map((d, i) => (
                <input
                  key={i}
                  maxLength="1"
                  className="tlotp-digit tlotp-square"
                  value={d}
                  onChange={(e) =>
                    handleOtpChange(e.target.value, i, "phone")
                  }
                  ref={(ref) => (phoneOtpRefs.current[i] = ref)}
                />
              ))}
            </div>

            <button className="tllogin-btn" onClick={verifyOtpPhone}>
              Verify
            </button>
            <p className="tlresend-text">
              Didn't receive the code?{" "}
              <span className="tlresend-link" onClick={sendOtpPhone}>
                Resend
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
</div>

  );
};

export default Login;
