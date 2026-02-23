"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";


export const Navbar = () => {

    const [openMenu, setOpenMenu] = useState(false);


  return (
    <nav className="w-full h-16 flex items-center justify-between px-4 bg-gray-800 text-white">
      <div className="flex items-center gap-2">
       
        <span className="font-bold text-lg">Education for Unpreviledged</span>
      </div>
      <div className="hidden md:flex items-center gap-4">
        <Link href="/" className="hover:text-gray-400">Home</Link>
        <Link href="/about" className="hover:text-gray-400">About</Link>
        <Link href="/contact" className="hover:text-gray-400">Contact</Link>
      </div>
      <div className="md:hidden">
        <button onClick={() => setOpenMenu(!openMenu)} className="focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </div>
      {openMenu && (
        <div className="absolute top-16 left-0 w-full bg-gray-800 text-white flex flex-col items-center gap-4 py-4 md:hidden">
          <Link href="/" className="hover:text-gray-400" onClick={() => setOpenMenu(false)}>Home</Link>
          <Link href="/about" className="hover:text-gray-400" onClick={() => setOpenMenu(false)}>About</Link>
          <Link href="/contact" className="hover:text-gray-400" onClick={() => setOpenMenu(false)}>Contact</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
