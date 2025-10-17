"use client";

import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
  Image,
  BarChart,
  Smile,
  Calendar,
  MapPin,
} from "lucide-react";
import * as Avatar from "@radix-ui/react-avatar";

const Tweetcomposer = () => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const maxLength = 280;

  const handleTweetSubmit = async (e: any) => {
    e.preventDefault();
    if (!content.trim() || content.length > maxLength) return;
    // TODO: Submit tweet logic
    console.log("Tweet submitted:", content);
    setContent("");
  };

  const characterCount = content.length;
  const progress = Math.min((characterCount / maxLength) * 100, 100);
  const isOverLimit = characterCount > maxLength;
  const isNearLimit = characterCount > maxLength * 0.9;

  // Circle visual parameters
  const circleRadius = 10;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  if (!user) return null;

  return (
    <Card className="bg-black border-gray-800">
      <CardContent className="flex gap-3 p-4">
        {/* Avatar */}
        <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden">
          <Avatar.Image
            src={user.avatar}
            alt={user.displayName}
            className="w-full h-full object-cover"
          />
          <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-100">
            {user.displayName?.[0] || "U"}
          </Avatar.Fallback>
        </Avatar.Root>

        {/* Main content */}
        <div className="flex-1">
          <form onSubmit={handleTweetSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What is happening?!"
              className="w-full bg-transparent text-gray-100 text-lg resize-none outline-none placeholder-gray-500"
              rows={3}
            />

            {/* Everyone can reply */}
            <p className="text-sm text-blue-500 mt-2 font-medium">
              Everyone can reply
            </p>

            {/* Divider */}
            <div className="border-b border-gray-800 my-3"></div>

            {/* Bottom actions */}
            <div className="flex justify-between items-center">
              {/* Icon buttons */}
              <div className="flex gap-4 text-blue-500">
                <button type="button" className="hover:text-blue-400">
                  <Image className="w-5 h-5" />
                </button>
                <button type="button" className="hover:text-blue-400">
                  <BarChart className="w-5 h-5" />
                </button>
                <button type="button" className="hover:text-blue-400">
                  <Smile className="w-5 h-5" />
                </button>
                <button type="button" className="hover:text-blue-400">
                  <Calendar className="w-5 h-5" />
                </button>
                <button type="button" className="hover:text-blue-400">
                  <MapPin className="w-5 h-5" />
                </button>
              </div>

              {/* Progress circle + Post button */}
              <div className="flex items-center gap-3">
                {/* Circular progress indicator */}
                <div className="relative w-6 h-6">
                  <svg
                    className="transform -rotate-90"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    {/* Background circle */}
                    <circle
                      cx="12"
                      cy="12"
                      r={circleRadius}
                      stroke="gray"
                      strokeWidth="2"
                      fill="none"
                      className="opacity-30"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="12"
                      cy="12"
                      r={circleRadius}
                      stroke={
                        isOverLimit
                          ? "red"
                          : isNearLimit
                          ? "gold"
                          : "#1d9bf0"
                      }
                      strokeWidth="2.5"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Optional center dot if over limit */}
                  {isOverLimit && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={!content.trim() || isOverLimit}
                  className={`rounded-full px-4 py-1 font-semibold text-white ${
                    !content.trim() || isOverLimit
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  Post
                </Button>
              </div>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default Tweetcomposer;
