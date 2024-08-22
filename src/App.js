// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";  
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";
import CurrencyConverter from "./CurrencyConverter";
import HomePage from "./HomePage";
import Predict from "./Predict";
import Portfolio from "./Portfolio";
import StockInfo from "./StockInfo";
import Dashboard from "./Dashboard";
import Footer from "./Footer";

function App() {
    return (
        <Router>
            <div className="app">
                <Header />
                <main className="app-header">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/currency-converter" element={<CurrencyConverter />} />
                        <Route path="/predict" element={<Predict />} />
                        <Route path="/portfolio" element={<Portfolio />} />
                        <Route path="/stockinfo" element={<StockInfo />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
