"use client";
import React from "react";
import { useState } from "react";
import ReviewForm from "./ReviewForm";
import GuessYourLegend from "./GuessYourLegend";

const HomeContent = () => {
  const [page, setPage] = useState("form");

  const handlePageChange = (newPage: string) => {
    setPage(newPage);
  };

  return (
    <div className="flex flex-col w-full h-full gap-6">
      {/* Enhanced Navigation Buttons */}
      <div className="flex items-center justify-between transition duration-300 ease-in-out w-full h-[80px] sm:h-[120px] gap-4 p-2">
        <button
          onClick={() => handlePageChange("form")}
          className={`flex-1 h-full rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
            page === "form"
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 border-2 border-blue-400"
              : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg"
          } flex items-center justify-center text-lg sm:text-xl font-bold`}
        >
          <div className="flex flex-col items-center space-y-1">
            <span className="text-2xl sm:text-3xl">🔍</span>
            <span>Find Your Legend</span>
          </div>
        </button>

        <button
          onClick={() => handlePageChange("guess")}
          className={`flex-1 h-full rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
            page === "guess"
              ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 border-2 border-purple-400"
              : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg"
          } flex items-center justify-center text-lg sm:text-xl font-bold`}
        >
          <div className="flex flex-col items-center space-y-1">
            <span className="text-2xl sm:text-3xl">🎯</span>
            <span>Guess Your Legend</span>
          </div>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex items-center justify-center w-full h-full">
        {page === "form" ? <ReviewForm /> : <GuessYourLegend />}
      </div>
    </div>
  );
};

export default HomeContent;
