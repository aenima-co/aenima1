import React from "react";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import DemoReel from "./components/DemoReel/DemoReel";
import BestWork from "./components/BestWork/BestWork";
import "./App.css";

const App = () => {
  return (
    <>
      <Header />
      <Hero />
      <DemoReel />
      <BestWork />
    </>
  );
};

export default App;
