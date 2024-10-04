import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { Header } from "./components/Header/index";
import { Home } from "./pages/Home/index";
import { About } from "./pages/About/About";
import { Footer } from "./components/Footer/index";
import { Error } from "./components/Error";
import { DetailsApartmentDisplay } from "./pages/DetailsApartmentDisplay/index";
//element={<DetailsApartmentDisplay}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/logement/:id" element={<DetailsApartmentDisplay />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a fun/ction
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
