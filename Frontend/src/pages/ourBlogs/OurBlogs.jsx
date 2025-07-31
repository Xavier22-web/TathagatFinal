import React, { useState } from "react";
import "./ourBlog.css";
import ourBlogTwo from "../../images/ourBlogTwo.png";
import ourBlogThree from "../../images/ourBlogThree.png";
import ourBlogFour from "../../images/ourBlogFour.png";
import LazyImage from "../../components/LazyImage/LazyImage";
import FAQ from "../../components/FAQ/FAQ"
import { FaSearch } from "react-icons/fa";

import { FiArrowUpRight } from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";
import ourTeam from "../../images/contactTeams.png";
import { useNavigate } from "react-router-dom";




import blogImg1 from "../../images/BLOG.webp";
import blogImg2 from "../../images/BLOG1.webp";
import blogImg3 from "../../images/BLOG2.webp";
import blogImg4 from "../../images/BLOG3.webp";
import blogImg5 from "../../images/BLOG4.webp";
import blogImg6 from "../../images/BLOG5.webp";







const teamImages = [ourTeam, ourTeam, ourTeam];

const categories = [
  "All",
  "Top Blogs",
  "Topper's Journey",
  "MBA",
  "CAT",
  "IPMAT",
  "CUET",
  "INFO EXAM",
  // "B-SCHOOL"
];



const blogImages = [blogImg1, blogImg2, blogImg3, blogImg4, blogImg5, blogImg6];
const blogData = new Array(12).fill(0).map((_, i) => ({
  id: i + 1,
  title: `Blog Post ${i + 1}`,
  date: "Feb 24, 2025",
  image: blogImages[i % blogImages.length], // repeat images only if 12 > image count
}));


const OurBlogs = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 6;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogData.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(blogData.length / postsPerPage);

  const [index, setIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState(0);
  const next = () => setIndex((index + 1) % teamImages.length);
  const prev = () =>
    setIndex((index - 1 + teamImages.length) % teamImages.length);


  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };


  const navigate=useNavigate()
  return (
    <div>
      <section className="our-blog-section">
        <div className="overlay"></div>
        <div className="blog-contenting">
          <h1>Dive Deeper Into TathaGat</h1>
          <p>
            Stay updated with powerful tips, real stories, and expert advice on
           preparation,motivation and results. Explore articles designed to help
            you grow,and achicve.
          </p>
          <button className="enquire-btn"onClick={()=>navigate('/AboutUs')}>Know About Us</button>
        </div>
      </section>

      <div className="blog-filter-container">
        <div className="category-buttons">
          {categories.map((cat, i) => (
            <button key={i} className={`chip ${i === 0 ? "active" : ""}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search" />
        </div>
      </div>

      <section className="latest-post-wrapper">
        <h2 className="latest-title">Latest Posts</h2>

        <div className="latest-card">
          <LazyImage
            src={ourBlogTwo} // ← replace with your actual image
            alt="Blog Cover"
            className="post-image"
          />

          <div className="post-details">
            <h3 className="post-title">
              Top 5 Time Management Tips for CAT Aspirants
            </h3>
            <p className="post-desc">
              Managing time during preparation — and the exam itself — can make
              or break your score. Here are five tested techniques from toppers.
              The CAT exam isn’t merely a test of knowledge; it’s a test of
              speed, precision, and decision-making under pressure. Many
              aspirants, even those who are well-prepared, lose crucial marks
              simply because they mismanaged their time during mocks or on the
              actual day.
            </p>

            <div className="post-footer">
              <div className="author">
                <LazyImage
                  src={ourBlogThree}
                  alt="TG"
                  className="author-logo"
                />
                <div>
                  <p className="author-name">By Tathagat Faculty</p>
                  <p className="author-date">Published: April 10, 2025</p>
                </div>
              </div>

              <div className="arrow-icon">
                <FiArrowUpRight />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="blog-grid-wrapper">
  <div className="blog-scroll-container">
    {currentPosts.map((blog) => (
      <div className="tb-blog-card" key={blog.id}>
        <LazyImage src={blog.image} alt={blog.title} onClick={()=>navigate("/ourBlog")} />
        <div className="card-footer">
          <span className="date">
            <FaRegCalendarAlt className="icon" />
            {blog.date}
          </span>
          <h4 className="title">{blog.title}</h4>
          <div className="arrow">
            <FiArrowUpRight />
          </div>
        </div>
      </div>
    ))}
  </div>
</div>















      <div className="ts-blog-team-wrapper">
        {/* Left Side */}
        <div className="ts-blog-team-left">
          <h2 className="ts-blog-team-heading">
            Don't Just Dream It. Crack It <br />
            with Tathagat!
          </h2>
          <button className="ts-blog-contact-btn" onClick={()=>navigate("/GetInTouch")}>Contact Now</button>
        </div>

        {/* Right Side */}
        <div className="ts-blog-team-right">
          <div className="ts-blog-team-header">
            <span
              style={{ fontSize: "24px", fontWeight: "700", color: "black" }}
            >
              Meet the team
            </span>
            <button onClick={()=>navigate("/team")} className="ts-blog-view-all-btn">View all</button>
          </div>

          <div className="ts-blog-team-box">
            <button onClick={prev} className="ts-blog-arrow left">
              ←
            </button>
            <LazyImage
              src={teamImages[index]}
              alt="Team"
              effect="blur"
              className="ts-blog-team-image"
            />
            <button onClick={next} className="ts-blog-arrow right">
              →
            </button>
          </div>
        </div>
      </div>




<FAQ/>

    </div>
  );
};

export default OurBlogs;