"use client";

import Banner from "@/components/home/banner";
import Header from "@/components/home/header";
import Sidebar from "@/components/home/sidebar";

export default function HomePage() {
  return (
    <>
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-[72px]">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 pt-20">
            <Banner />
          </main>
        </div>
      </div>
    </>
  );
}
