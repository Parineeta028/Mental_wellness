
import React from "react";
import background from "../assets/backLoggo.png"; // use the new background

const BackgroundLogo = () => {
  return (
    <div
      className="fixed inset-0 z-0 bg-cover bg-center opacity-20 pointer-events-none"
      style={{ backgroundImage: `url(${background})` }}
    />
  );
};

export default BackgroundLogo;
