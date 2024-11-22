import nikeImg from "../images/nike.webp";
import shoe1Img from "../images/shoe1.jpeg";
import dressImg from "../images/dress.webp";
import jewel2Img from "../images/jewel2.jpeg";
import phoneImg from "../images/phone.jpeg";
import shirtsImg from "../images/shirts.webp";
import sneakerImg from "../images/sneaker.webp";

export function getData() {
  return [
    { title: "Nike", price: 17.99, Image: nikeImg, id: 1 },
    { title: "Shoes", price: 15, Image: shoe1Img, id: 2 },
    { title: "Woman dress", price: 3.5, Image: dressImg, id: 3 },
    { title: "Jewelery", price: 13.99, Image: jewel2Img, id: 4 },
    { title: "iphone", price: 2.5, Image: phoneImg, id: 5 },
    { title: "Shirts", price: 0.99, Image: shirtsImg, id: 6 },
    { title: "Sneaker", price: 2.99, Image: sneakerImg, id: 7 },
  ];
}
