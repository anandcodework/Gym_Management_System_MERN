import React from 'react';

const Review = ({ img, alt, name }) => {
  return (
    <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 duration-300 text-center gap-3">
      <img
        src={img}
        alt={alt}
        className="w-24 h-24 rounded-full object-cover mb-3 border-4 border-white shadow-md"
      />
      <h3 className="text-xl font-semibold text-white">{name}</h3>
      <p className="text-gray-200 text-sm font-normal leading-relaxed">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure ex quidem,
        mollitia minus velit laudantium aliquid? Ea tenetur amet deserunt.
      </p>
    </div>
  );
};

export default Review;
