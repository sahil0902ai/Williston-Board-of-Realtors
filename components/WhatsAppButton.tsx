"use client";

import Link from "next/link";
import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";

export default function WhatsAppButton() {
  const [isWaHovered, setIsWaHovered] = useState(false);
  const [isTgHovered, setIsTgHovered] = useState(false);

  return (
    <div className="fixed bottom-20 md:bottom-6 left-6 z-[997] flex flex-col items-start gap-4">
      {/* Telegram */}
      <Link
        href="https://t.me/willistonboardofrealtors"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center bg-[#0088cc] text-white rounded-full shadow-lg transition duration-300 ease-in-out relative group overflow-hidden ${
          isTgHovered ? "w-44 md:w-48 px-4" : "w-12 h-12 md:w-14 md:h-14"
        }`}
        onMouseEnter={() => setIsTgHovered(true)}
        onMouseLeave={() => setIsTgHovered(false)}
        style={{ height: "3rem" }}
        title="Chat on Telegram"
      >
        <div
          className={`flex items-center justify-center min-w-[3rem] h-[3rem] ${isTgHovered ? "" : "-ml-1"} transition duration-300`}
        >
          <Send
            size={22}
            className={
              isTgHovered ? "md:w-5 md:h-5 mr-2" : "w-4 h-4 md:w-5 md:h-5"
            }
          />
        </div>

        <div
          className={`whitespace-nowrap font-medium text-xs md:text-sm transition duration-300 ${
            isTgHovered ? "opacity-100" : "opacity-0 w-0"
          }`}
        >
          Chat on Telegram
        </div>
      </Link>

      {/* WhatsApp */}
      <Link
        href="https://wa.me/17130000000"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center bg-[#25D366] text-white rounded-full shadow-lg transition duration-300 ease-in-out relative group overflow-hidden ${
          isWaHovered ? "w-48 md:w-52 px-4" : "w-12 h-12 md:w-14 md:h-14"
        }`}
        onMouseEnter={() => setIsWaHovered(true)}
        onMouseLeave={() => setIsWaHovered(false)}
        style={{ height: "3rem" }}
        title="Chat on WhatsApp"
      >
        <div className="absolute top-0 right-0 p-1 -mt-1 -mr-1">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-[#25D366]"></span>
          </span>
        </div>

        <div
          className={`flex items-center justify-center min-w-[3rem] h-[3rem] transition duration-300`}
        >
          <MessageCircle
            size={24}
            className={
              isWaHovered ? "md:w-6 md:h-6 mr-2" : "w-5 h-5 md:w-6 md:h-6"
            }
          />
        </div>

        <div
          className={`whitespace-nowrap font-medium text-xs md:text-sm transition duration-300 ${
            isWaHovered ? "opacity-100" : "opacity-0 w-0"
          }`}
        >
          Chat on WhatsApp
        </div>
      </Link>
    </div>
  );
}
