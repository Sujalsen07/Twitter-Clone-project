"use client";

import React from "react";
import { MessageCircle, Repeat2, Heart, Upload } from "lucide-react";
import * as Avatar from "@radix-ui/react-avatar"; // Import Radix Avatar

interface Tweet {
  id: number;
  name: string;
  username: string;
  time: string;
  content: string;
  avatar: string;
  verified?: boolean;
  image?: string;
  likes: number;
  comments: number;
  reposts: number;
}

const TwitterCard = ({ tweet }: { tweet: Tweet }) => {
  return (
    <div className="border-b border-gray-800 p-4 hover:bg-gray-900 transition">
      <div className="flex gap-3">
        {/* Radix Avatar */}
        <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden">
          <Avatar.Image
            src={tweet.avatar}
            alt={tweet.name}
            className="w-full h-full object-cover"
          />
          <Avatar.Fallback
            className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-100"
            delayMs={600}
          >
            {tweet.name[0]}
          </Avatar.Fallback>
        </Avatar.Root>

        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-1 text-sm">
            <span className="font-semibold">{tweet.name}</span>
            {tweet.verified && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#1d9bf0"
                viewBox="0 0 24 24"
                strokeWidth="0"
                stroke="none"
                className="w-4 h-4"
              >
                <path d="M22.25 12c0 5.65-4.6 10.25-10.25 10.25S1.75 17.65 1.75 12 6.35 1.75 12 1.75 22.25 6.35 22.25 12Zm-12.3 3.55 6.37-6.38a.75.75 0 1 0-1.06-1.06l-5.31 5.31-2.12-2.12a.75.75 0 1 0-1.06 1.06l2.65 2.65c.3.3.77.3 1.06 0Z" />
              </svg>
            )}
            <span className="text-gray-500">{tweet.username}</span>
            <span className="text-gray-500">· {tweet.time}</span>
          </div>

          {/* Content */}
          <p className="mt-1 text-gray-100 text-[15px] leading-snug">
            {tweet.content}
          </p>

          {/* Optional image */}
          {tweet.image && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-gray-800">
              <img src={tweet.image} alt="tweet media" className="w-full" />
            </div>
          )}

          {/* Icons */}
          <div className="flex justify-between text-gray-500 mt-3 max-w-md">
            <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{tweet.comments}</span>
            </div>
            <div className="flex items-center gap-2 hover:text-green-500 cursor-pointer">
              <Repeat2 className="w-4 h-4" />
              <span className="text-sm">{tweet.reposts}</span>
            </div>
            <div className="flex items-center gap-2 hover:text-red-500 cursor-pointer">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{tweet.likes}</span>
            </div>
            <div className="hover:text-blue-400 cursor-pointer">
              <Upload className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitterCard;
