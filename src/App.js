import { useState, useEffect } from "react";
import "./App.css";
import Card from "./Components/Card/Card";
import Cart from "./Components/Cart/Cart";
import logo from "./images/logo.png";
import cartLogo from "./images/cartLogo.png";
import notification from "./images/notification.png";
const { getData } = require("./db/db");
const foods = getData();

const tele = window.Telegram.WebApp;

function App() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    tele.ready();
  });

  const onAdd = (food) => {
    const exist = cartItems.find((x) => x.id === food.id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x.id === food.id ? { ...exist, quantity: exist.quantity + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...food, quantity: 1 }]);
    }
  };

  const onRemove = (food) => {
    const exist = cartItems.find((x) => x.id === food.id);
    if (exist.quantity === 1) {
      setCartItems(cartItems.filter((x) => x.id !== food.id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x.id === food.id ? { ...exist, quantity: exist.quantity - 1 } : x
        )
      );
    }
  };

  const onCheckout = () => {
    tele.MainButton.text = "Pay :)";
    tele.MainButton.show();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar__brand">
          <img src={logo} alt="Brand Logo" className="brand-logo" />
        </div>
        <div className="navbar__search">
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
          />
        </div>
        <div className="navbar__notification">
          <img src={notification} alt="Cart" className="cart-logo" />
        </div>
        <div className="navbar__cart">
          <img src={cartLogo} alt="Cart" className="cart-logo" />
        </div>
      </nav>
      <h1 className="heading">Featured Products</h1>
      <Cart cartItems={cartItems} onCheckout={onCheckout} />
      <div className="cards__container">
        {foods.map((food) => {
          return (
            <Card food={food} key={food.id} onAdd={onAdd} onRemove={onRemove} />
          );
        })}
      </div>
    </>
  );
}

export default App;
