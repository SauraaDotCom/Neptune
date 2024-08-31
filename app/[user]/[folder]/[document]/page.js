"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import bold from "@/assets/icons/bold.png";
import italic from "@/assets/icons/italic.png";
import underline from "@/assets/icons/underline.png";
import addColumnLeft from "@/assets/icons/add-column-left.png";
import addColumnRight from "@/assets/icons/add-column-right.png";
import addRowUp from "@/assets/icons/add-row-up.png";
import addRowDown from "@/assets/icons/add-row-down.png";
import neptuneLogo from "@/assets/logos/neptune.png";
import profileIcon from "@/assets/icons/profile.png";
import clockIcon from "@/assets/icons/clock.png";

import UserControlModal from "@/components/modals/user/UserControlModal";

export default function Document({ params }) {
  const [userControlModal, setUserControlModal] = useState(false);
  const [content, setContent] = useState("");
  const [column, setColumn] = useState(50);
  const [row, setRow] = useState(50);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [currentColumnIndex, setCurrentColumnIndex] = useState(0);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });

  const getColumnLabel = (index) => {
    let label = "";
    while (index >= 0) {
      label = String.fromCharCode((index % 26) + 65) + label;
      index = Math.floor(index / 26) - 1;
    }
    return label;
  };

  useEffect(() => {
    if (!content) {
      const container = document.getElementById("container");
      const gridItems = [];

      for (let i = 0; i < column * row; i++) {
        const newElement = document.createElement("div");
        newElement.className = "grid-item";

        const rowIndex = Math.floor(i / column);
        const columnIndex = i % column;

        if (rowIndex === 0 && columnIndex > 0) {
          newElement.textContent = getColumnLabel(columnIndex - 1);
          newElement.classList.add("column-header");
        } else if (columnIndex === 0 && rowIndex > 0) {
          newElement.textContent = rowIndex;
          newElement.classList.add("row-header");
        } else if (rowIndex === 0 && columnIndex === 0) {
          newElement.classList.add("corner");
          newElement.setAttribute("contenteditable", false);
          newElement.innerText = "#";
        }

        gridItems.push(newElement);
      }

      container.replaceChildren(...gridItems);
      setContent(container.innerHTML);
    }

    const gridItems = document.querySelectorAll(".grid-item");
    gridItems.forEach((item, index) => {
      item.setAttribute("contenteditable", true);

      item.addEventListener("focus", () => {
        setCurrentNodeIndex(index);
        setCurrentRowIndex(Math.floor(index / column));
        setCurrentColumnIndex(index % column);
        item.classList.add("highlighted");
        gridItems[index % column].classList.add("highlighted-position");
        gridItems[Math.floor(index / column) * column].classList.add(
          "highlighted-position"
        );
      });

      item.addEventListener("blur", () => {
        item.classList.remove("highlighted");
        gridItems[index % column].classList.remove("highlighted-position");
        gridItems[Math.floor(index / column) * column].classList.remove(
          "highlighted-position"
        );
      });

      item.addEventListener("mousedown", (event) => {
        if (event.shiftKey) {
          setStartPoint({ x: Math.floor(index / column), y: index % column });
        }
      });

      item.addEventListener("mouseup", (event) => {
        if (event.shiftKey) {
          setEndPoint({ x: Math.floor(index / column), y: index % column });
        }
      });

      item.addEventListener("keydown", (event) => {
        handleArrowNavigation(event, index);
      });

      if (
        item.classList.contains("column-header") ||
        item.classList.contains("row-header") ||
        item.classList.contains("corner")
      ) {
        item.setAttribute("contenteditable", false);
      }
    });
  }, [content, column, row]);

  const toggleClass = (style) => {
    const gridItems = Array.from(document.querySelectorAll(".grid-item"));
    if (gridItems[currentNodeIndex].classList.contains(style)) {
      gridItems[currentNodeIndex].classList.remove(style);
    } else {
      gridItems[currentNodeIndex].classList.add(style);
    }
  };

  const addColumn = (direction) => {
    let insertIndex =
      direction == "Left" ? currentColumnIndex : currentColumnIndex + 1;
    if (currentColumnIndex > 0) {
      const gridContainer = document.querySelector("#container");
      const gridItems = Array.from(document.querySelectorAll(".grid-item"));
      const totalRows = Math.ceil(gridItems.length / column);
      setColumn((prevColumn) => prevColumn + 1);

      for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
        const insertPosition = rowIndex * (column + 1) + insertIndex;

        const newItem = document.createElement("div");
        newItem.classList.add("grid-item");
        newItem.setAttribute("contenteditable", true);

        gridContainer.insertBefore(newItem, gridItems[insertPosition]);
        gridItems.splice(insertPosition, 0, newItem);
      }

      resetHeaders(gridContainer, totalRows, column + 1);
      setContent(gridContainer.innerHTML);
    }
  };

  const addRow = (direction) => {
    let insertIndex =
      direction == "Up" ? currentRowIndex + 1 : currentRowIndex + 2;
    const gridContainer = document.querySelector("#container");
    const gridItems = Array.from(document.querySelectorAll(".grid-item"));

    const totalRows = Math.ceil(gridItems.length / column);
    const totalColumns = column;

    setRow((prevRow) => prevRow + 1);

    for (let colIndex = 0; colIndex < totalColumns; colIndex++) {
      const insertPosition = insertIndex * totalColumns + colIndex;

      let previousInnerHTML = "";
      let previousClasslist = "";
      if (insertIndex > 1) {
        const previousItemIndex = insertPosition - totalColumns;
        previousInnerHTML = gridItems[previousItemIndex].innerHTML;
        previousClasslist = Array.from(gridItems[previousItemIndex].classList);
        gridItems[previousItemIndex].innerHTML = "";
        gridItems[previousItemIndex].classList = "grid-item";
      }

      const newItem = document.createElement("div");
      newItem.classList.add("grid-item");
      newItem.setAttribute("contenteditable", true);

      if (colIndex === 0) {
        newItem.innerHTML = insertIndex;
        newItem.setAttribute("contenteditable", false);
        newItem.classList.add("row-header");
      } else {
        newItem.innerHTML = previousInnerHTML;
        newItem.classList.add(...previousClasslist);
      }

      gridContainer.insertBefore(newItem, gridItems[insertPosition]);
      gridItems.splice(insertPosition, 0, newItem);
    }

    resetHeaders(gridContainer, totalRows + 1, totalColumns);
    setContent(gridContainer.innerHTML);
  };

  const resetHeaders = (gridContainer, totalRows, totalColumns) => {
    const gridItems = Array.from(gridContainer.children);
    for (let colIndex = 0; colIndex < totalColumns; colIndex++) {
      const headerIndex = colIndex;
      gridItems[headerIndex].innerHTML = getColumnLabel(colIndex - 1);
      gridItems[headerIndex].setAttribute("contenteditable", false);
      gridItems[headerIndex].classList.add("column-header");
    }
    for (let rowIndex = 1; rowIndex < totalRows; rowIndex++) {
      const headerIndex = rowIndex * totalColumns;
      gridItems[headerIndex].innerHTML = rowIndex;
      gridItems[headerIndex].setAttribute("contenteditable", false);
      gridItems[headerIndex].classList.add("row-header");
    }
    gridItems[0].innerHTML = "#";
    gridItems[0].setAttribute("contenteditable", false);
  };

  useEffect(() => {
    const startTime = () => {
      const today = new Date();
      const h = today.getHours();
      const m = today.getMinutes();
      const s = today.getSeconds();
      const formattedTime = `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}:${s.toString().padStart(2, "0")} ${
        h >= 12 ? "PM" : "AM"
      }`;

      const clockElement = document.getElementById("clock");
      clockElement.textContent = formattedTime;
    };

    const intervalId = setInterval(startTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleArrowNavigation = (event, index) => {
    const gridContainer = document.querySelector("#container");
    const gridItems = Array.from(gridContainer.children);

    const key = event.key;

    switch (key) {
      case "Enter":
        break;
      case "ArrowUp":
        if (index > column) {
          const nodeToFocus = index - column;
          const cellToFocus = gridItems[nodeToFocus];
          cellToFocus.focus();
        }
        break;
      case "ArrowDown":
        if (index < row * column - column) {
          const nodeToFocus = index + column;
          const cellToFocus = gridItems[nodeToFocus];
          cellToFocus.focus();
        }
        break;
      case "ArrowLeft":
        if (index > 1) {
          const nodeToFocus = index - 1;
          const cellToFocus = gridItems[nodeToFocus];
          cellToFocus.focus();
        }
        break;
      case "ArrowRight":
        if (index < Math.floor(index / column) * column + column) {
          const nodeToFocus = index + 1;
          const cellToFocus = gridItems[nodeToFocus];
          cellToFocus.focus();
        }
        break;
      default:
        return;
    }

    event.preventDefault();
  };

  return (
    <main className="flex min-h-screen flex-col items-center relative">
      {userControlModal && (
        <UserControlModal
          userInfo={params.user}
          setUserControlModal={setUserControlModal}
        />
      )}

      <header className="fixed top-0 z-10 flex flex-row items-center border-b-[1px] border-solid border-[#27272a] text-[12px] w-full dark:bg-black bg-white">
        <Link
          href="/"
          className="md:w-[240px] md:min-w-[240px] min-w-[64px] w-[64px] py-4 border-r-[1px] border-solid border-[#27272a] flex flex-row items-center md:justify-start justify-center"
        >
          <Image
            alt="mars-logo"
            className="h-5 w-5 md:ml-6"
            src={neptuneLogo}
          />
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
            onClick={() => setUserControlModal(true)}
            alt="profile-icon"
            className="h-5 w-5 cursor-pointer dark:invert-0 invert"
            src={profileIcon}
          />
        </div>
      </header>

      <div className="flex flex-row items-center w-full relative mt-[53px]">
        <aside className="fixed top-[53px] left-0 h-[calc(100vh-53px)] md:w-60 w-16 flex flex-col items-center justify-between border-r-[1px] border-solid border-[#27272a]">
          <div className="w-full text-[10px] text-gray-400">
            <div className="w-full px-6 py-2 border-b-[1px] border-solid border-[#27272a] hidden md:block">
              <span>Edit Font Style</span>
            </div>
            <div className="flex flex-col items-center md:flex-row justify-center w-full">
              <div
                onClick={() => {
                  toggleClass("bold");
                }}
                className="flex flex-col items-center justify-center px-6 py-4 w-full md:w-1/3 cursor-pointer dark:hover:bg-[#27272a] hover:bg-gray-200 border-b-[1px] border-solid border-[#27272a]"
              >
                <Image
                  alt="add-row-icon"
                  className="h-4 w-4 dark:invert-0 invert"
                  src={bold}
                />
                <span className="hidden mt-1 md:block">Bold</span>
              </div>
              <div
                onClick={() => {
                  toggleClass("italic");
                }}
                className="flex flex-col items-center justify-center px-6 py-4 w-full md:w-1/3 cursor-pointer dark:hover:bg-[#27272a] hover:bg-gray-200 md:border-l-[1px] md:border-r-[1px] border-b-[1px] border-solid border-[#27272a]"
              >
                <Image
                  alt="add-row-icon"
                  className="h-4 w-4 dark:invert-0 invert"
                  src={italic}
                />
                <span className="hidden mt-1 md:block">Italic</span>
              </div>
              <div
                onClick={() => {
                  toggleClass("underline");
                }}
                className="flex flex-col items-center justify-center px-6 py-4 w-full md:w-1/3 cursor-pointer dark:hover:bg-[#27272a] hover:bg-gray-200 border-b-[1px] border-solid border-[#27272a]"
              >
                <Image
                  alt="add-column-icon"
                  className="h-4 w-4 dark:invert-0 invert"
                  src={underline}
                />
                <span className="hidden mt-1 md:block">Underline</span>
              </div>
            </div>

            <div className="w-full px-6 py-2 border-b-[1px] border-solid border-[#27272a] hidden md:block">
              <span>Add Columns/Rows</span>
            </div>
            <div className="flex flex-col items-center md:flex-row justify-center w-full">
              <div
                onClick={() => {
                  addRow("Up");
                }}
                className="flex flex-row items-center justify-center md:justify-start px-6 py-4 w-full md:w-1/2 cursor-pointer dark:hover:bg-[#27272a] hover:bg-gray-200 md:border-r-[1px] border-b-[1px] border-solid border-[#27272a]"
              >
                <Image
                  alt="add-row-icon"
                  className="h-4 w-4 dark:invert-0 invert"
                  src={addRowUp}
                />
                <span className="hidden ml-2 md:block">Above</span>
              </div>
              <div
                onClick={() => {
                  addRow("Down");
                }}
                className="flex flex-row items-center justify-center md:justify-start px-6 py-4 w-full md:w-1/2 cursor-pointer dark:hover:bg-[#27272a] hover:bg-gray-200 border-b-[1px] border-solid border-[#27272a]"
              >
                <Image
                  alt="add-row-icon"
                  className="h-4 w-4 dark:invert-0 invert"
                  src={addRowDown}
                />
                <span className="hidden ml-2 md:block">Below</span>
              </div>
            </div>
            <div className="flex flex-col items-center md:flex-row justify-center w-full">
              <div
                onClick={() => {
                  addColumn("Left");
                }}
                className="flex flex-row items-center justify-center md:justify-start px-6 py-4 w-full md:w-1/2 cursor-pointer dark:hover:bg-[#27272a] hover:bg-gray-200 md:border-r-[1px] border-b-[1px] border-solid border-[#27272a]"
              >
                <Image
                  alt="add-column-icon"
                  className="h-4 w-4 dark:invert-0 invert"
                  src={addColumnLeft}
                />
                <span className="hidden ml-2 md:block">Left</span>
              </div>
              <div
                onClick={() => {
                  addColumn("Right");
                }}
                className="flex flex-row items-center justify-center md:justify-start px-6 py-4 w-full md:w-1/2 cursor-pointer dark:hover:bg-[#27272a] hover:bg-gray-200 border-b-[1px] border-solid border-[#27272a]"
              >
                <Image
                  alt="add-column-icon"
                  className="h-4 w-4 dark:invert-0 invert"
                  src={addColumnRight}
                />
                <span className="hidden ml-2 md:block">Right</span>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="flex flex-row items-center sm:justify-start justify-center p-6 w-full cursor-pointer dark:hover:bg-[#27272a] hover:bg-gray-200 border-t-[1px] border-solid border-[#27272a]">
              <Image
                alt="clock-icon"
                className="h-4 w-4 dark:invert-0 invert"
                src={clockIcon}
              />
              <span id="clock" className="hidden ml-2 md:block"></span>
            </div>
          </div>
        </aside>

        <div
          id="container"
          className="grid-container h-[calc(100vh-53px)] select-all md:ml-60 ml-16 overflow-scroll grid"
          style={{
            gridTemplateColumns: `48px repeat(${column - 1}, 96px)`,
            gridTemplateRows: `40px repeat(${row - 1}, 40px)`,
          }}
        ></div>
      </div>
    </main>
  );
}
