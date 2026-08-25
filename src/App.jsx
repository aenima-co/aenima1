import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider, useLang } from "./contexts/LanguageContext";
import { usePageTitle } from "./hooks/usePageTitle";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import DemoReel from "./components/DemoReel/DemoReel";
import BestWork from "./components/BestWork/BestWork";
import SecaoAbout from "./components/SecaoAbout/SecaoAbout";
import Blog from "./components/Blog/Blog";
import Footer from "./components/Footer/Footer";
import AboutPage from "./pages/AboutPage/AboutPage";
import WorkPage from "./pages/WorkPage/WorkPage";
import PortfolioPage from "./pages/PortfolioPage/PortfolioPage";
import BlogPage from "./pages/BlogPage/BlogPage";
import ContactPage from "./pages/ContactPage/ContactPage";

import "./App.css";

const Home = () => {
  const { lang } = useLang();
  usePageTitle("home", lang);
  return (
    <>
      <Hero />
      <DemoReel />
      <BestWork />
      <SecaoAbout />
      <Blog />
    </>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <HashRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:slug" element={<PortfolioPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        <Footer />
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;
