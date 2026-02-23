"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";


export const Navbar = () => {

    const [openMenu, setOpenMenu] = useState(false);


  return (
    <nav className="flex justify-between items-center py-4">
        {/* Left Side */}
      <div className="flex-3/5 flex items-center gap-12.5">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/renthomeLogo.png"
              alt="Logo"
              width={80}
              height={40}
            ></Image>
            <span className="text-2xl font-medium hidden lg:block">
              RentHomeBD
            </span>
          </Link>
        </div>
        <div className="items-center gap-10 hidden md:flex">
          <Link
            href="/"
            className="transition-all duration-300 ease-in hover:scale-105"
          >
            Home
          </Link>
          <Link
            href="/"
            className="transition-all duration-300 ease-in hover:scale-105"
          >
            About
          </Link>
          <Link
            href="/"
            className="transition-all duration-300 ease-in hover:scale-105"
          >
            Contact
          </Link>
          <Link
            href="/"
            className="transition-all duration-300 ease-in hover:scale-105"
          >
            Agents
          </Link>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-2/5  md:bg-[#fcf5f3] h-100% p-5 items-center justify-end flex gap-7">
        <div className="hidden md:flex justify-end items-center gap-10">
          <Link
            href="/"
            className="text-gray-900 transition-all duration-300 ease-in hover:scale-105"
          >
            Login
          </Link>
          <Link
            href="/"
            className="bg-yellow-200 py-2 px-4 border border-yellow-300 hover:bg-yellow-300 text-gray-900 transition-all duration-300 ease-in hover:scale-105"
          >
            Sign Up
          </Link>
        </div>
        <div className="z-999">
        <Image src="/menu.png" alt="Menu Icon" width={36} height={36} className="sm:hidden cursor-pointer" onClick={() => setOpenMenu((prev) => !prev)}></Image>
        </div>
        <div className={`absolute bg-black sm:hidden text-white text-lg h-screen w-[50%] top-0 transition-all duration-300 flex flex-col items-center justify-center gap-15 ${openMenu ? 'right-0' : 'right-[-50%]'}`}>
            <Link
            href="/"
            className="transition-all duration-300 ease-in hover:scale-105"
          >
            Home
          </Link>
          <Link
            href="/"
            className="transition-all duration-300 ease-in hover:scale-105"
          >
            About
          </Link>
          <Link
            href="/"
            className="transition-all duration-300 ease-in hover:scale-105"
          >
            Contact
          </Link>
          <Link
            href="/"
            className="transition-all duration-300 ease-in hover:scale-105"
          >
            Agents
          </Link>
          <Link
            href="/"
            className="transition-all duration-300 ease-in hover:scale-105"
          >
            Login
          </Link>
          <Link
            href="/"
            className="transition-all duration-300 ease-in hover:scale-105"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
