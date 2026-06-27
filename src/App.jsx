import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import DemoReel from "./components/DemoReel/DemoReel";
import BestWork from "./components/BestWork/BestWork";
import SecaoAbout from "./components/SecaoAbout/SecaoAbout";
import Blog from "./components/Blog/Blog";
import Footer from "./components/Footer/Footer";
import AboutPage from "./pages/AboutPage/AboutPage";
import WorkPage from "./pages/WorkPage/WorkPage";

import "./App.css";

const Home = () => (
  <>
    <Hero />
    <DemoReel />
    <BestWork />
    <SecaoAbout />
    <Blog />
  </>
);

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/work" element={<WorkPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
