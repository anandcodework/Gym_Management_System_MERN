import React, { useEffect } from 'react';
import { Review, Heading } from "./";
import { review1, review2, review3, review4 } from "../images";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Reviews = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: -100,
      easing: 'ease-in-back',
    });
  }, []);

  const reviews = [
    { img: review1, name: "Kyle" },
    { img: review2, name: "River" },
    { img: review3, name: "Akon" },
    { img: review4, name: "Arnold" }
  ];

  return (
    <section className="relative pt-10">
      <Heading name="Our Reviews" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              data-aos="fade-zoom-in"
              data-aos-delay={`${index * 300}`}
              className="transform transition duration-500 hover:scale-105"
            >
              <Review
                img={review.img}
                alt={`Review by ${review.name}`}
                name={review.name}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-blue-800 to-rose-300 opacity-80 pointer-events-none z-[-1]" />
    </section>
  );
};

export default Reviews;
