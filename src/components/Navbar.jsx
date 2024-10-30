import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-slate-950 p-5 fixed top-0 w-full z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold">TKMCE</span>
          <span className="text-cyan-500 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mx-1">EMS</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="text-white bg-slate-700 hover:bg-gray-800 focus:bg-gray-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl px-3 py-2 text-center mb-2"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;