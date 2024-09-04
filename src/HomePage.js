import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import img1 from "./image.jpg";
import stockVideo from './stock.mp4'; 
import predImage from './pred.png';
import secureImage from './secure.jpeg';
import timeImage from './time.png';
import predict from './predict-1.jpg';
import portfolio from './portfolio.png';
import dashboard from './dashboard.jpg';

function HomePage() {
	const [activeImage, setActiveImage] = useState(0);
	const [resetTimer, setResetTimer] = useState(false);

	const images = [
		{
			src: img1,
			text1: "Empowering you",
			text2: "with data-driven insights",
			text3: "We help managing money, provide stock insight.",
			links: [{ text: "Contact Us", to: "/contact" }],
		},
		{
			src: stockVideo, 
			isVideo: true,  
			text1: "StockInsight",
			text2: "Invest with insight.",
			text3: "We help managing money, provide stock insight.",
			links: [
				{ text: "Contact Us", to: "/contact" },
				{ text: "About Us", to: "/About" },
			],
		},
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveImage(
				(prevActiveImage) => (prevActiveImage + 1) % images.length
			);
		}, 5000);
		return () => clearInterval(interval);
	}, [images.length, resetTimer]);

	const handlePrev = () => {
		setActiveImage(
			(prevActiveImage) => (prevActiveImage - 1 + images.length) % images.length
		);
		setResetTimer((prev) => !prev);
	};

	const handleNext = () => {
		setActiveImage((prevActiveImage) => (prevActiveImage + 1) % images.length);
		setResetTimer((prev) => !prev);
	};

	return (
		<div className="main-body">
			<div className="carousel-container">
				{images.map((image, index) => (
					<div
						key={index}
						className={`image-container ${
							index === activeImage ? "active" : ""
						}`}
					>
						{image.isVideo ? (
							<video
								autoPlay
								muted
								loop
								className="slide-image"
								src={image.src}
							/>
						) : (
							<img
								src={image.src}
								alt={`Slide ${index + 1}`}
								className="slide-image"
							/>
						)}
						<div className="text-container">
							<p className="txt1">
								{image.text1} <br /> <span className="txt2">{image.text2}</span>
								<br />
								<span className="txt3">{image.text3}</span>
							</p>
							<div className="cont-button">
								{image.links.map((link, linkIndex) => (
									<Link key={linkIndex} to={link.to}>
										<button className="contact-button">{link.text}</button>
									</Link>
								))}
							</div>
						</div>
					</div>
				))}
				<button className="nav-button left" onClick={handlePrev}>
					&#10094;
				</button>
				<button className="nav-button right" onClick={handleNext}>
					&#10095;
				</button>
			</div>

			<div className="service-container">
				<div className="service-section predictions">
					<img src={predImage} alt="95% Accurate Predictions" />
					<p>95% ACCURATE PREDICTIONS</p>
					<p>Using our machine learning models we provide accurate stock predictions.</p>
				</div>
				<div className="service-section secure">
					<img src={secureImage} alt="Secure" />
					<p>SECURE</p>
					<p>We keep your information secure.</p>
				</div>
				<div className="service-section ontime">
					<img src={timeImage} alt="On Time Services" />
					<p>ON TIME SERVICES</p>
					<p>On-time services deliver accurate and up-to-date stock insights, helping you make informed investment decisions promptly.</p>
				</div>
				<div className="service-section professionals">
					<img src={`${process.env.PUBLIC_URL}/prof.jpg`} alt="Professionals" />
					<p>A TEAM OF PROFESSIONALS</p>
					<p>Highly trained technical staff at your service.</p>
				</div>
			</div>

			<div className="services-provide">
                <h2 className="services-heading">Services We Provide</h2>
                {/* <p className="services-subheading">COVERED IN THESE AREAS</p> */}
                <div className="services-container">
                    <Link to="/predict">
                        <div className="service-box">
                            <img src={predict} alt="predict" />
                            <h3>Predict Stock</h3>
                            <p>Utilize advanced forecasting techniques to predict stock market trends and assist investors with data-driven decisions.</p>
                        </div>
                    </Link>
                    <Link to="/portfolio">
                        <div className="service-box">
                            <img src={portfolio} alt="portfolio" />
                            <h3>Portfolio Management</h3>
                            <p>Optimize investment portfolios with strategic asset allocation and risk management tailored to individual financial goals.</p>
                        </div>
                    </Link>
                    <Link to="/dashboard">
                        <div className="service-box">
                            <img src={dashboard} alt="dashboard" />
                            <h3>Dashboard </h3>
                            <p>Monitor and analyze market data with interactive dashboards that provide insights and performance metrics for better decision-making.</p>
                        </div>
                    </Link>
                </div>
            </div>
		</div>
	);
}

export default HomePage;
