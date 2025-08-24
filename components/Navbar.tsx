import React from "react";

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-[4rem] bg-white/95 backdrop-blur-sm text-black text-[30px] text-center pt-3 border-b-2 border-gray-200 z-[50] shadow-lg">
      <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
        🏀 Find your next Legend!
      </h1>
    </div>
  );
};

export default Navbar;
