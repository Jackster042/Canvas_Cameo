"use client";

import { CreditCard, FolderOpen, Home, Plus } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <>
      <aside className="w-[72px] bg-[#f8f8fc] border-r flex flex-col items-center py-4 fixed left-0 top-0 h-full z-20">
        <div className="flex flex-col items-center">
          <button className="w-12 h-12 bg-purple-600 cursor-pointer rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors duration-200">
            <Plus className="w-6 h-6 text-white" />
          </button>
          <div className="text-xs font-medium text-center mt-1 text-gray-700">
            Create
          </div>
        </div>

        {/* navigation */}
        <nav className="mt-8 flex flex-col items-center space-y-6 w-full">
          {[
            {
              label: "Home",
              icon: <Home className="w-6 h-6 text-gray-700" />,
              active: true,
            },
            {
              label: "Projects",
              icon: <FolderOpen className="w-6 h-6 text-gray-700" />,
              active: false,
            },
            {
              label: "Billing",
              icon: <CreditCard className="w-6 h-6 text-gray-700" />,
              active: false,
            },
          ].map((menuItem, index) => (
            <div key={index} className="flex flex-col items-center w-full">
              <Link
                href="#"
                className="w-full flex flex-col items-center py-2 text-gray-600 hover:bg-gray-100 hover:text-purple-600 rounded-full transition-colors duration-200"
              >
                <div className="relative">{menuItem.icon}</div>
                <span className="text-xs font-medium mt-1">
                  {menuItem.label}
                </span>
              </Link>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
