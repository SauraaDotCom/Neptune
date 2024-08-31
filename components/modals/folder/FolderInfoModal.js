"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import share from "@/assets/icons/share.png";
import edit from "@/assets/icons/edit.png";
import dumpster from "@/assets/icons/delete.png";
import save from "@/assets/icons/save.png";
import folder from "@/assets/icons/folder.png";
import close from "@/assets/icons/close.png";

export default function FolderInfoModal({
  setFolderInfoModalOpen,
  folderData,
}) {
  const [inputValue, setInputValue] = useState(folderData.name);

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
      <div className="sm:w-[560px] w-11/12 dark:bg-black bg-white border-[1px] border-solid border-[#27272a] flex flex-col items-center justify-between">
        <div className="w-full flex flex-row items-center justify-between p-4 border-b-[1px] border-solid border-[#27272a]">
          <div className="flex flex-row items-center p-2">
            <Image
              alt="folder-icon"
              className="h-4 w-4 mr-4 dark:invert-0 invert"
              src={folder}
            />
            <span>{folderData.name}</span>
          </div>
          <Image
            alt="close-icon"
            onClick={() => setFolderInfoModalOpen(false)}
            className="h-8 w-8 p-2 cursor-pointer dark:invert-0 invert"
            src={close}
          />
        </div>

        <div className="h-full w-full flex flex-wrap ">
          <div className="flex flex-col p-6 sm:w-1/2 w-full">
            <span className="text-[10px] text-gray-400">Folder Name</span>
            <div className="w-full flex flex-row items-end">
              <input
                id="name"
                type="text"
                maxLength={24}
                value={inputValue}
                onChange={handleChange}
                defaultValue={folderData.name}
                className="w-full outline-none lowercase bg-transparent"
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
          <div className="flex flex-col p-6 sm:w-1/2 w-full">
            <span className="text-[10px] text-gray-400">Files Count</span>
            <span className="outline-none">4-files</span>
          </div>
          <div className="flex flex-col p-6 sm:w-1/2 w-full">
            <span className="text-[10px] text-gray-400">Created On</span>
            <span className="outline-none">12-11-2024</span>
          </div>
          <div className="flex flex-col p-6 sm:w-1/2 w-full">
            <span className="text-[10px] text-gray-400">Created By</span>
            <span className="outline-none">ojas-rajankar (you)</span>
          </div>
          <div className="flex flex-col p-6 sm:w-1/2 w-full">
            <span className="text-[10px] text-gray-400">Shared Status</span>
            <span className="outline-none">not-shared</span>
          </div>
          <div className="flex flex-col p-6 sm:w-1/2 w-full">
            <span className="text-[10px] text-gray-400">Access Status</span>
            <span className="outline-none">not-shared</span>
          </div>
        </div>

        <div className="w-full flex flex-row items-center justify-between border-t-[1px] border-solid border-[#27272a]">
          <div className="flex flex-row items-center justify-center p-6 w-1/3 cursor-pointer hover:bg-red-400">
            <Image
              alt="delete-icon"
              className="h-4 w-4 mr-2 dark:invert-0 invert"
              src={dumpster}
            />
            <span>Delete</span>
          </div>
          <div className="flex flex-row items-center justify-center p-6 w-1/3 cursor-pointer dark:hover:bg-[#27272a] hover:bg-gray-200 border-x-[1px] border-solid border-[#27272a]">
            <Image
              alt="share-icon"
              className="h-4 w-4 mr-2 dark:invert-0 invert"
              src={share}
            />
            <span>Share</span>
          </div>
          <div className="flex flex-row items-center justify-center p-6 w-1/3 cursor-pointer hover:bg-green-400">
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
