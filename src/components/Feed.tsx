"use client";

import React, { useState } from "react";
import TweetCard from "./TweetCard";

const Feed = () => {
  const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou");

  const tweets = [
    {
      id: 1,
      name: "Elon Musk",
      username: "@elonmusk",
      time: "2h",
      verified: true,
      content:
        "Just had an amazing conversation about the future of AI. The possibilities are endless!",
      likes: 1200,
      comments: 89,
      reposts: 324,
      avatar:
       "https://randomuser.me/api/portraits/men/45.jpg", // Business leader avatar
    },
    {
      id: 2,
      name: "Sarah Johnson",
      username: "@sarahtech",
      time: "4h",
      verified: true,
      content:
        "Working on some exciting new features for our app. Can’t wait to share what we’ve been building! 🚀",
      likes: 89,
      comments: 12,
      reposts: 23,
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&q=80", // Female tech avatar
    },
    {
      id: 3,
      name: "Alex Chen",
      username: "@designguru",
      time: "6h",
      verified: true,
      content:
        "The new design system is finally complete! It took 6 months but the results are incredible. Clean, consistent, and accessible.",
      image:
        "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=80",
      likes: 203,
      comments: 34,
      reposts: 57,
      avatar:
        "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=200&q=80", // Designer avatar
    },
    {
      id: 4,
      name: "Priya Singh",
      username: "@priyacodes",
      time: "8h",
      verified: false,
      content:
        "Just pushed a big update to our frontend repo! 💻 TypeScript + Next.js + shadcn/ui = perfection.",
      likes: 152,
      comments: 18,
      reposts: 42,
      avatar:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=200&q=80", // Developer avatar
    },
    {
      id: 5,
      name: "Michael Brown",
      username: "@mike_invests",
      time: "12h",
      verified: false,
      content:
        "Markets are wild today — stay calm, think long-term, and remember: volatility is opportunity 📈",
      likes: 87,
      comments: 9,
      reposts: 14,
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80", // Finance avatar
    },
  ];

  return (
    <div className="max-w-2xl mx-auto border-x border-gray-800 min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-800 bg-black/80 backdrop-blur-md">
        <h1 className="p-4 text-xl font-bold">Home</h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab("foryou")}
            className={`flex-1 text-center py-3 font-medium hover:bg-gray-900 transition ${
              activeTab === "foryou"
                ? "border-b-2 border-blue-500 text-white"
                : "text-gray-400"
            }`}
          >
            For you
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`flex-1 text-center py-3 font-medium hover:bg-gray-900 transition ${
              activeTab === "following"
                ? "border-b-2 border-blue-500 text-white"
                : "text-gray-400"
            }`}
          >
            Following
          </button>
        </div>
      </div>

      {/* Feed content */}
      <div>
        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
