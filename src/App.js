import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import Header from "./Header";  
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";
import CurrencyConverter from "./CurrencyConverter";
import HomePage from "./HomePage";

function App() {
	const [stock, setStock] = useState("");
	const [result, setResult] = useState(null);

	const handleChange = (e) => {
		setStock(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("http://localhost:5000/predict", {stock});
			setResult(response.data);
		} catch (error) {
			console.error("There was an error fetching the data", error);
		}
	};
	return (
		<Router>
			<div className="app">
				<Header />
				<header className="app-header">
					<Routes>
						<Route
							exact
							path="/"
							element={
								<HomePage
									
								/>
							}
						/>
						<Route path="/about" element={<AboutPage />} />
						<Route path="/contact" element={<ContactPage />} />
						<Route path="/currency-converter" element={<CurrencyConverter />} />
					</Routes>
				</header>
			</div>
		</Router>
	);
}

export default App;
