import React, { useCallback, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider, useLang } from "./contexts/LanguageContext";
import { LoadErrorProvider } from "./contexts/LoadErrorContext";
import { usePageTitle } from "./hooks/usePageTitle";
import LoadErrorBanner from "./components/LoadErrorBanner/LoadErrorBanner";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
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
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

import "./App.css";

const HOME_SECTIONS = ["hero", "demoReel", "bestWork", "secaoAbout"];

const Home = () => {
  const { lang } = useLang();
  usePageTitle("home", lang);

  // Hero, DemoReel, BestWork e SecaoAbout buscam dado cada um por conta
  // própria (mantém o retry individual do LoadErrorContext em caso de
  // falha), mas antes disso a Home mostrava 4 spinners separados enquanto
  // isso acontecia. Aqui eles ficam montados (já buscando dado) só que
  // escondidos atrás de um único spinner de tela cheia até todos
  // terminarem — sucesso ou erro, o que importa é não ficar pendente pra
  // sempre (erro real já aparece pelo LoadErrorBanner separadamente).
  const [settled, setSettled] = useState({});
  const markSettled = useCallback((key) => {
    setSettled((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  }, []);
  const onHeroSettled = useCallback(() => markSettled("hero"), [markSettled]);
  const onDemoReelSettled = useCallback(() => markSettled("demoReel"), [markSettled]);
  const onBestWorkSettled = useCallback(() => markSettled("bestWork"), [markSettled]);
  const onSecaoAboutSettled = useCallback(() => markSettled("secaoAbout"), [markSettled]);

  const allSettled = HOME_SECTIONS.every((key) => settled[key]);

  return (
    <>
      {!allSettled && <LoadingSpinner />}
      <div style={{ display: allSettled ? undefined : "none" }}>
        <Hero onSettled={onHeroSettled} />
        <DemoReel onSettled={onDemoReelSettled} />
        <BestWork onSettled={onBestWorkSettled} />
        <SecaoAbout onSettled={onSecaoAboutSettled} />
        <Blog />
      </div>
    </>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <LoadErrorProvider>
        <HashRouter>
          <ScrollToTop />
          <LoadErrorBanner />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/work/:slug" element={<PortfolioPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </HashRouter>
      </LoadErrorProvider>
    </LanguageProvider>
  );
};

export default App;
