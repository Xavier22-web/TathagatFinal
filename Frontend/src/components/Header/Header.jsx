import React, { useState, useEffect, useRef } from "react";
import {
  FaBars,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaInstagram,
  FaTelegramPlane,
  FaFacebookF,
  FaChevronDown,
} from "react-icons/fa";
import logo from "../../images/TGLogo.webp";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <header className="tg-header">
      <div className="tg-top-bar">
        <div className="tg-top-left mobile-hide">
          <div className="tg-contact-left">
            <FaPhoneAlt className="icon" /> 9205534439 |
            <FaEnvelope className="icon" /> info@tathagat.co.in
          </div>
        </div>

        <div className="tg-top-right tg-social-icons mobile-hide">
          <Link to="/faq"><FaWhatsapp className="icon fa-whatsapp" /></Link>
          <Link to="/success-stories"><FaInstagram className="icon fa-instagram" /></Link>
          <Link to="/course-purchase"><FaTelegramPlane className="icon fa-telegram-plane" /></Link>
          <Link to="/faq"><FaFacebookF className="icon fa-facebook-f" /></Link>
        </div>

        <div className="tg-top-center tg-top-links mobile-hide">
          <Link to="/Testimonial">Download CAT Syllabus & Strategy</Link>
          <Link to="/resource">Download VARC Cheat Sheet</Link>
          <Link to="/AboutUs">Download CAT Quant Formula PDF</Link>
          <Link to="/Tips">Free CAT Study Material!</Link>
          <Link to="/cat">Download CAT Quant Formula PDF</Link>
        </div>
      </div>

      <div className="tg-main-nav">
        <div className="tg-logo">
          <Link to="/">
            <img src={logo} alt="TathaGat Logo" />
          </Link>
        </div>

        {/* 🔴 HAMBURGER Removed for mobile */}
        {/* <div className={`tg-hamburger ${isMenuOpen ? "hide" : ""}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FaBars />
        </div> */}

        {/* 🔴 Navigation menu hidden in mobile */}
        <nav ref={navRef} className={`tg-nav-links ${isMenuOpen ? "open" : ""}`}>
          <Link to="/course-details" onClick={() => setIsMenuOpen(false)}>
            Courses <FaChevronDown className="dropdown-icon" />
          </Link>
          <Link to="/score-card" onClick={() => setIsMenuOpen(false)}>
            Results <FaChevronDown className="dropdown-icon" />
          </Link>
          <Link to="/team" onClick={() => setIsMenuOpen(false)}>Faculty</Link>
          <Link to="/resource" onClick={() => setIsMenuOpen(false)}>
            Resources <FaChevronDown className="dropdown-icon" />
          </Link>
          <Link to="/mock-test" onClick={() => setIsMenuOpen(false)}>
            Downloads <FaChevronDown className="dropdown-icon" />
          </Link>
          <Link to="/GetInTouch" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          <Link to="/ourBlog" onClick={() => setIsMenuOpen(false)}>Blogs</Link>
        </nav>

        {/* ✅ Always visible buttons on mobile and desktop */}
        <div className="tg-nav-actions">
          <Link to="/student/dashboard">
            <button className="btn white">Student LMS</button>
          </Link>
          <Link to="/image-gallery">
            <button className="btn white">Join Us Today</button>
          </Link>
          <Link to="/Login">
            <button className="btn orange">Log In</button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
