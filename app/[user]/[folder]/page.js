"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

import file from "@/assets/icons/file.png";
import neptune from "@/assets/logos/neptune.png";
import profile from "@/assets/icons/profile.png";
import menu from "@/assets/icons/menu-small.png";
import search from "@/assets/icons/search.png";
import filter from "@/assets/icons/filter-sort.png";
import create from "@/assets/icons/add-file.png";
import clock from "@/assets/icons/clock.png";

import FileInfoModal from "@/components/modals/file/FileInfoModal";
import UserControlModal from "@/components/modals/user/UserControlModal";
import SearchModal from "@/components/modals/search/SearchModal";
import CreateModal from "@/components/modals/create/CreateModal";

export default function Folder({ params }) {
  const notify = () => toast("Feature Not Yet Released");

  const [createNewModal, setCreateNewModal] = useState(false);
  const [userControlModal, setUserControlModal] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [fileInfoModalOpen, setFileInfoModalOpen] = useState(false);
  const [activeOpenFileIndex, setActiveOpenFileIndex] = useState(0);

  const filesData = [
    { name: "file-one" },
    { name: "file-two" },
    { name: "file-three" },
    { name: "file-four" },
  ];

  const [currentTime, setCurrentTime] = useState("00:00:00");

  const startTime = () => {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);
    let suf = h > 12 ? "PM" : "AM";
    setCurrentTime(h + ":" + m + ":" + s + " " + suf);
  };

  const checkTime = (i) => {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  };

  setTimeout(startTime, 1000);
  return (
    <main className="flex flex-col items-center relative">
      {fileInfoModalOpen ? (
        <FileInfoModal
          fileData={filesData[activeOpenFileIndex]}
          setFileInfoModalOpen={setFileInfoModalOpen}
        />
      ) : (
        <></>
      )}
      {userControlModal ? (
        <UserControlModal
          userInfo={params.user}
          setUserControlModal={setUserControlModal}
        />
      ) : (
        <></>
      )}
      {searchModalOpen ? (
        <SearchModal setSearchModalOpen={setSearchModalOpen} />
      ) : (
        <></>
      )}
      {createNewModal ? (
        <CreateModal
          createType={"File"}
          setCreateNewModal={setCreateNewModal}
        />
      ) : (
        <></>
      )}

      <header className="fixed top-0 z-10 flex flex-row items-center border-b-[1px] border-solid border-[#27272a] text-[12px] w-full dark:bg-black bg-white">
        <Link
          href="/"
          className="md:w-[240px] md:min-w-[240px] min-w-[64px] w-[64px] py-4 border-r-[1px] border-solid border-[#27272a] flex flex-row items-center md:justify-start justify-center"
        >
          <Image alt="mars-logo" className="h-5 w-5 md:ml-6" src={neptune} />
          <span className="hidden md:block ml-2">Neptune</span>
        </Link>
        <div className="w-full p-4 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            <Link
              className="hidden sm:block"
              href={`/${encodeURIComponent(params.user)}`}
            >
              {params.user}
            </Link>
            <span className="mx-4 hidden sm:block">{" > "}</span>
            <Link
              href={`/${encodeURIComponent(params.user)}/${encodeURIComponent(
                params.folder
              )}`}
            >
              {params.folder}
            </Link>
          </div>

          <Image
            onClick={() => {
              setUserControlModal(true);
            }}
            alt="profile-icon"
            className="h-5 w-5 cursor-pointer dark:invert-0 invert"
            src={profile}
          />
        </div>
      </header>

      <div className="flex flex-row items-center w-full relative mt-[53px]">
        <aside className="fixed top-[53px] left-0 h-[calc(100vh-53px)] md:w-60 w-16 flex flex-col items-center justify-between border-r-[1px] border-solid border-[#27272a]">
          <div className="w-full">
            <div
              onClick={() => {
                setSearchModalOpen(true);
              }}
              className="flex flex-row items-center sm:justify-start justify-center p-6 w-full cursor-pointer dark:hover:bg-[#27272a] hover:bg-gray-200 border-b-[1px] border-solid border-[#27272a]"
            >
              <Image
                alt="search-icon"
                className="h-4 w-4 dark:invert-0 invert"
                src={search}
              />
              <span className="hidden ml-2 md:block">Find A File</span>
            </div>
            <div
              onClick={notify}
              className="flex flex-row items-center sm:justify-start justify-center p-6 w-full cursor-pointer dark:hover:bg-[#27272a] hover:bg-gray-200 border-b-[1px] border-solid border-[#27272a]"
            >
              <Image
                alt="filter-icon"
                className="h-4 w-4 dark:invert-0 invert"
                src={filter}
              />
              <span className="hidden ml-2 md:block">Filter & Sort</span>
            </div>
            <div
              onClick={() => {
                setCreateNewModal(true);
              }}
              className="flex flex-row items-center sm:justify-start justify-center p-6 w-full cursor-pointer dark:hover:bg-[#27272a] hover:bg-gray-200 border-b-[1px] border-solid border-[#27272a]"
            >
              <Image
                alt="create-icon"
                className="h-4 w-4 dark:invert-0 invert"
                src={create}
              />
              <span className="hidden ml-2 md:block">Create Folder</span>
            </div>
          </div>

          <div className="w-full">
            <div className="flex flex-row items-center sm:justify-start justify-center p-6 w-full cursor-pointer dark:hover:bg-[#27272a] hover:bg-gray-200 border-t-[1px] border-solid border-[#27272a]">
              <Image
                alt="clock-icon"
                className="h-4 w-4 dark:invert-0 invert"
                src={clock}
              />
              <span className="hidden ml-2 md:block">{currentTime}</span>
            </div>
          </div>
        </aside>

        <div className="h-full w-full flex flex-wrap p-4 gap-3 md:ml-60 ml-16">
          {filesData.map((fileData, index) => {
            return (
              <Link
                key={index}
                href={`/${encodeURIComponent(params.user)}/${encodeURIComponent(
                  params.folder
                )}/${encodeURIComponent(fileData.name)}`}
                className="xl:w-[calc(20%-10px)] lg:w-[calc(25%-9px)] sm:w-[calc(33%-7px)] w-full h-72 items-center justify-between border-[1px] border-solid border-[#27272a]"
              >
                <div className="h-3/4 w-full border-b-[1px] border-solid border-[#27272a] p-4 relative">
                  <Image
                    alt="menu-icon"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveOpenFileIndex(index);
                      setFileInfoModalOpen(true);
                    }}
                    className="h-10 w-6 absolute right-0 top-0 p-2 opacity-90 dark:invert-0 invert"
                    src={menu}
                  />
                </div>
                <div className="h-1/4 w-full flex flex-row items-center p-4">
                  <Image
                    alt="file-icon"
                    className="h-4 w-4 mr-4 dark:invert-0 invert"
                    src={file}
                  />
                  <span className="truncate">{fileData.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
