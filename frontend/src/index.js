import React from "react";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { Header } from "./components/Header/index";
import { Register } from "./components/Register";
import { Signin } from "./components/SignIn";
import { Home } from "./pages/Home/index";
import { About } from "./pages/About/About";
import { Footer } from "./components/Footer/index";
import { Error } from "./components/Error";
import { DetailsApartment } from "./pages/DetailsApartment/index";
import { AuthProvider } from "./context/AuthProvider";
import { RequireAuth } from "./components/RequireAuth";
import { Unauthorized } from "./components/Unauthorized";
import { ListingForm } from "./components/ListingForm";
import { Vote } from "./pages/Vote";
import { HostCreateApt } from "./pages/HostCreateApt";
import { HostAllApt } from "./pages/HostAllApt";
import { HostModifyApt } from "./pages/HostModifyApt/index";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/Listing" element={<ListingForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route element={<RequireAuth allowedRoles={["user"]} />}>
            <Route path="/logement/:id" element={<DetailsApartment />} />
            <Route path="/logement/:id/like" element={<Vote />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={["host"]} />}>
            <Route
              path="/host-only/create-apartment"
              element={<HostCreateApt />}
            />
            <Route path="/host-only/read-apartment" element={<HostAllApt />} />
            <Route
              path="/host-only/modify-apartment/:id"
              element={<HostModifyApt />}
            />
          </Route>

          <Route path="*" element={<Error />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a fun/ction
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
