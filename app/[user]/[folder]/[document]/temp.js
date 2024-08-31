"use client";

import sanitizeHtml from "sanitize-html";
import ContentEditable from "react-contenteditable";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import neptune from "@/assets/logos/neptune.png";
import profile from "@/assets/icons/profile.png";
import clock from "@/assets/icons/clock.png";

import UserControlModal from "@/components/modals/user/UserControlModal";

export default function Document({ params }) {
  const [userControlModal, setUserControlModal] = useState(false);

  const [column, setColumn] = useState(10);
  const [row, setRow] = useState(50);

  useEffect(() => {
    const container = document.getElementById("container");

    for (let i = 1; i <= column * row; i++) {
      const newElement = document.createElement("div");
      newElement.className = "grid-item";
      newElement.innerText = "hello";

      container.appendChild(newElement);
    }

    const gridItems = document.querySelectorAll(".grid-item");
    gridItems.forEach((item, index) => {
      item.setAttribute("contenteditable", true);
      const rowIndex = Math.floor(index / column) + 1;
      if (index % column === 0) {
        item.innerHTML = rowIndex;
        item.setAttribute("contenteditable", false);
      }
    });
  }, []);

  const [content, setContent] = useState("");
  const [currentTime, setCurrentTime] = useState("00:00:00");

  const onContentChange = useCallback((evt) => {
    const sanitizeConf = {
      allowedTags: ["b", "i", "a", "p", "div", "br"],
      allowedAttributes: {
        a: ["href"],
        div: ["style", "class", "disabled", "contenteditable"],
      },
    };

    setContent(sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf));
  }, []);

  useEffect(() => {
    const startTime = () => {
      const today = new Date();
      let h = today.getHours();
      let m = today.getMinutes();
      let s = today.getSeconds();
      h = checkTime(h);
      m = checkTime(m);
      s = checkTime(s);
      let suf = h >= 12 ? "PM" : "AM";

      const clock = document.getElementById("clock");
      clock.textContent = h + ":" + m + ":" + s + " " + suf;
    };

    const checkTime = (i) => {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    };

    const intervalId = setInterval(startTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center relative">
      {userControlModal ? (
        <UserControlModal
          userInfo={params.user}
          setUserControlModal={setUserControlModal}
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
              className="hidden md:block"
              href={`/${encodeURIComponent(params.user)}`}
            >
              {params.user}
            </Link>
            <span className="mx-4 hidden md:block">{">"}</span>
            <Link
              className="hidden sm:block"
              href={`/${encodeURIComponent(params.user)}/${encodeURIComponent(
                params.folder
              )}`}
            >
              {params.folder}
            </Link>
            <span className="mx-4 hidden sm:block">{">"}</span>
            <span className="cursor-pointer">{params.document}</span>
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
          <div></div>

          <div className="w-full">
            <div className="flex flex-row items-center sm:justify-start justify-center p-6 w-full cursor-pointer dark:hover:bg-[#27272a] hover:bg-gray-200 border-t-[1px] border-solid border-[#27272a]">
              <Image
                alt="clock-icon"
                className="h-4 w-4 dark:invert-0 invert"
                src={clock}
              />
              <span id="clock" className="hidden ml-2 md:block">
                {currentTime}
              </span>
            </div>
          </div>
        </aside>

        <ContentEditable
          id="container"
          className={`w-full h-[calc(100vh-53px)] md:ml-60 ml-16 outline-none select-text text-clip overflow-scroll cursor-text grid grid-cols-[repeat(${column},_48px))] grid-rows-[repeat(${row},_48px)] gap-0`}
          onChange={onContentChange}
          onBlur={onContentChange}
          onKeyDown={(e) => {
            console.log(window.getSelection().anchorOffset == 0);
            if (
              (e.key == "Backspace" || e.key == "Delete") &&
              window.getSelection().anchorOffset == 0
            ) {
              e.preventDefault();
            }
            if (e.key == "Enter") {
              e.preventDefault();
            }
          }}
          html={content}
        />
      </div>
    </main>
  );
}
