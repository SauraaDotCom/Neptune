"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import view from "@/assets/icons/view.png";
import search from "@/assets/icons/search.png";
import close from "@/assets/icons/close.png";

export default function SearchModal({ setSearchModalOpen }) {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    const cleanedValue = cleanInput(e.target.value);
    setInputValue(cleanedValue);
  };

  const cleanInput = (input) => {
    let cleaned = input.replace(/ /g, "-");
    cleaned = cleaned.replace(/[^a-zA-Z0-9-]/g, "");
    cleaned = cleaned.replace(/-+/g, "-");
    return cleaned;
  };
  return (
    <main className="flex h-screen w-screen fixed backdrop-blur-[1px] z-50 flex-col pt-[60px] items-center ">
      <div className="sm:w-[560px] w-11/12 dark:bg-black bg-white border-[1px] border-solid border-[#27272a] flex flex-col items-center justify-between">
        <div className="w-full flex flex-row items-center justify-between p-4">
          <div className="flex flex-row items-center p-2 w-full relative">
            <Image
              alt="search-icon"
              className="h-4 w-4 mr-4 absolute dark:invert-0 invert"
              src={search}
            />
            <input
              autoFocus
              type="text"
              maxLength={24}
              value={inputValue}
              onChange={handleChange}
              placeholder="Search For Your Spark"
              className="w-full pl-6 outline-none bg-transparent border-b-[1px] border-solid border-[#27272a]"
            />
          </div>
          <Image
            alt="close-icon"
            onClick={() => setSearchModalOpen(false)}
            className="h-8 w-8 p-2 cursor-pointer dark:invert-0 invert"
            src={close}
          />
        </div>

        <div className="h-full w-full flex flex-wrap ">
          <div className="hidden flex-row items-center justify-between p-6 w-full cursor-pointer dark:hover:bg-[#27272a] hover:bg-gray-200 border-t-[1px] border-solid border-[#27272a]">
            <span>search-matching-name</span>
            <Image
              alt="view-icon"
              className="h-4 w-4 dark:invert-0 invert"
              src={view}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
