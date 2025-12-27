import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LoginForm from "./components/LoginForm.jsx";
import SignUpForm from "./components/SignUpForm.jsx";
import MainPage from "./components/MainPage.jsx";
import ChillZone from "./components/ChillZone.jsx";
import NavBar from "./components/NavBar.jsx";
import Profile from "./components/Profile.jsx";
import StandartSofa from "./components/StandartSofa.jsx";
import CornerSofa from "./components/CornerSofa.jsx";
import Product from "./components/Product.jsx";
import ChairPoufs from "./components/ChairPoufs.jsx";
import ModuleSofa from "./components/ModuleSofa.jsx";
import TVStands from "./components/TVStands.jsx";
import CoffeeTable from "./components/CoffeeTable.jsx";
import Beds from "./components/Beds.jsx";
import Mattresses from "./components/Mattresses.jsx";
import Pillows from "./components/Pillows.jsx";
import BedsideTables from "./components/BedsideTables.jsx";
import Dressers from "./components/Dressers.jsx";
import VanityTables from "./components/VanityTables.jsx";
import Wardrobes from "./components/Wardrobes.jsx";
import Cart from "./components/Cart.jsx";
import Order from "./components/Order.jsx";
import AdminProducts from "./components/AdminProducts.jsx";






function AppContent() {
  const location = useLocation();

  // Сторінки, де Navbar НЕ повинен показуватись
  const hideNavOn = ["/", "/LoginForm", "/SignUpForm", "/Profile"];

  const hideNav = hideNavOn.includes(location.pathname);

  return (
    <div className="App">
      {/* показуємо Navbar тільки якщо URL НЕ входить у список */}
      {!hideNav && <NavBar />}

      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/loginForm" element={<LoginForm />} />
        <Route path="/signUpForm" element={<SignUpForm />} />
        <Route path="/MainPage" element={<MainPage />} />
        <Route path="/ChillZone" element={<ChillZone />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/StandartSofa" element={<StandartSofa />} />
        <Route path="/CornerSofa" element={<CornerSofa />} />
        <Route path="/Product/:id" element={<Product />} />
        <Route path="/ChairPoufs" element={<ChairPoufs />} />
        <Route path="/ModuleSofa" element={<ModuleSofa />} />
        <Route path="/TVStands" element={<TVStands />} />
        <Route path="/CoffeeTable" element={<CoffeeTable />} />
        <Route path="/Beds" element={<Beds />} />
        <Route path="/Mattresses" element={<Mattresses />} />
        <Route path="/Pillows" element={<Pillows />} />
        <Route path="/BedsideTables" element={<BedsideTables />} />
        <Route path="/Dressers" element={<Dressers />} />
        <Route path="/VanityTables" element={<VanityTables />} />
        <Route path="/Wardrobes" element={<Wardrobes />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Order" element={<Order />} />
        <Route path="/AdminProducts" element={<AdminProducts />} />


      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

