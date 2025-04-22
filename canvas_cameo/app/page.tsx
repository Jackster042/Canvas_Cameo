"use client";

import { signOut } from "next-auth/react";

export default function HomePage() {
  return (
    <>
      <div>
        <h1>Home Page</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-300 cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </>
  );
}
