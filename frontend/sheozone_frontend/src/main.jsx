import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

/*
o	Register Page (signup with email verification form)
o	Login Page (user/admin login form)
o	Password Reset Page(forgot password + new password form)
o	Error Page - 404
o	Product Listing Page (with search and filters)
o	Product Detail Page (with add to cart and reviews)
o	Shopping Cart Page (view/edit cart items)

o	Email Verification Page (confirmation page after signup)
o	Home Page (landing page with featured products)
o	Checkout Page (enter shipping/payment details)
o	Order History Page(view user's previous orders)
*/
