"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import share from "@/assets/icons/share.png";
import edit from "@/assets/icons/edit.png";
import dumpster from "@/assets/icons/delete.png";
import save from "@/assets/icons/save.png";
import newIcon from "@/assets/icons/new.png";
import close from "@/assets/icons/close.png";

export default function CreateModal({ createType, setCreateNewModal }) {
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
    <main className="flex h-screen w-screen fixed backdrop-blur-[1px] z-50 flex-col items-center justify-center">
      <div className="sm:w-[320px] w-11/12 dark:bg-black bg-white border-[1px] border-solid border-[#27272a] flex flex-col items-center justify-between">
        <div className="w-full flex flex-row items-center justify-between p-4 border-b-[1px] border-solid border-[#27272a]">
          <div className="flex flex-row items-center p-2">
            <Image
              alt="new-icon"
              className="h-6 w-6 mr-4 dark:invert-0 invert"
              src={newIcon}
            />
            <span>Create New {createType}</span>
          </div>
          <Image
            alt="close-icon"
            onClick={() => setCreateNewModal(false)}
            className="h-8 w-8 p-2 cursor-pointer dark:invert-0 invert"
            src={close}
          />
        </div>

        <div className="h-full w-full flex flex-wrap">
          <div className="flex flex-col p-6 py-12 w-full">
            <span className="text-[10px] text-gray-400 mb-2">
              {createType} Name
            </span>
            <div className="flex flex-row items-end justify-between w-full">
              <input
                id="name"
                autoFocus
                type="text"
                maxLength={24}
                value={inputValue}
                onChange={handleChange}
                placeholder="Give Me A Name"s
                className="w-2/3 outline-none lowercase bg-transparent border-b-[1px] border-solid border-[#27272a]"
              />
              <label for="name">
                <Image
                  alt="edit-icon"
                  className="h-3 w-3 cursor-pointer dark:invert-0 invert"
                  src={edit}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-row items-center justify-between border-t-[1px] border-solid border-[#27272a]">
          <div className="flex flex-row items-center justify-center p-6 w-1/2 cursor-pointer hover:bg-red-400 border-r-[1px] border-solid border-[#27272a]">
            <Image
              alt="delete-icon"
              className="h-4 w-4 mr-2 dark:invert-0 invert"
              src={dumpster}
            />
            <span>Delete</span>
          </div>
          <div className="flex flex-row items-center justify-center p-6 w-1/2 cursor-pointer hover:bg-green-400">
            <Image
              alt="save-icon"
              className="h-4 w-4 mr-2 dark:invert-0 invert"
              src={save}
            />
            <span>Save</span>
          </div>
        </div>
      </div>
    </main>
  );
}
