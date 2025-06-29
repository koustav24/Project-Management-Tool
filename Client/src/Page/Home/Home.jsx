import React from "react";
import Navbar from "./Navbar.jsx"
import HeroSection from "./HeroSection.jsx";
import Features from "./Features.jsx";
import ScoutSection from "./ScoutSection.jsx";
import FaqSection from "./FaqSection.jsx";
import Footer from "./Footer.jsx";

const Home = () => {
    return (
        <>
            <Navbar />
            <HeroSection />
            <Features />
            <ScoutSection/>
            <FaqSection/>
            <Footer/>
        </>
    );
};

export default Home;