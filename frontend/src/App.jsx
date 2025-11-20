import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import UI from "./components/Cards";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/cards" element={<UI />} />
    </Routes>
  );
}

export default App;
