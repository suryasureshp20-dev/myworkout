"use client";

import { useState } from "react";

export default function ColorPickerPage() {
  const [bgColor, setBgColor] = useState("#e0e7ff"); // Light Indigo default

  return (
    <main
      style={{ backgroundColor: bgColor }}
      className="min-h-screen transition-colors duration-300 ease-in-out p-10 flex items-center justify-center"
    >
      {/* --- Dummy Content to show context --- */}
      <div className="text-center space-y-4 max-w-lg">
        <h1 className="text-4xl font-bold text-gray-800">Hello, World!</h1>
        <p className="text-gray-600 text-lg">
          Change the color using the floating picker in the corner. Notice how
          the UI stays clean.
        </p>
      </div>

      {/* --- FLOATING COLOR PICKER --- */}
      {/* Change 'right-6' to 'left-6' to move it to the left side */}
      <div className="fixed bottom-6 right-6 flex flex-col items-center gap-2 group">
        {/* Hex Code Label (Visible on Hover) */}
        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded mb-1 font-mono">
          {bgColor}
        </span>

        {/* The Picker Container */}
        <div className="relative overflow-hidden w-12 h-12 rounded-full shadow-xl border-4 border-white ring-1 ring-gray-200 hover:scale-110 transition-transform">
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 m-0 cursor-pointer border-none"
          />
        </div>
      </div>
    </main>
  );
}
