"use client";

import { useState } from "react";
import Link from "next/link";

import { CreditCard, FolderOpen, Home, Plus } from "lucide-react";
import { saveDesign } from "@/services/design-service";
import { useRouter } from "next/navigation";
import { useEditorStore } from "@/store";

interface DesignData {
  name: string;
  canvasData: string | null;
  width: number;
  height: number;
  category: string;
}

export default function Sidebar() {
  const router = useRouter();
  const { setShowPremiumModal } = useEditorStore();

  const handleCreateDesign = async () => {
    try {
      const initialDesign = {
        name: "New Design",
        canvasData: null,
        width: 825,
        height: 465,
        category: "youtube_thumbnail",
      };

      const newDesign = await saveDesign(initialDesign, null);

      if (newDesign?.success) {
        router.push(`/editor/${newDesign?.data?._id}`);
      } else {
        throw new Error(`Failed to create new design`);
      }
    } catch (err) {
      console.error(err, "Error from SIDEBAR CREATE DESIGN");
    }
  };

  return (
    <>
      <aside className="w-[72px] bg-[#f8f8fc] border-r flex flex-col items-center py-4 fixed left-0 top-0 h-full z-20">
        <div className="flex flex-col items-center">
          <button
            onClick={handleCreateDesign}
            className="w-12 h-12 bg-purple-600 cursor-pointer rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors duration-200"
          >
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
            <div
              onClick={
                menuItem.label === "Billing"
                  ? () => setShowPremiumModal(true)
                  : undefined
              }
              key={index}
              className="flex flex-col items-center w-full cursor-pointer"
            >
              <div className="w-full flex flex-col items-center py-2 text-gray-600 hover:bg-gray-100 hover:text-purple-600 rounded-full transition-colors duration-200">
                <div className="relative">{menuItem.icon}</div>
                <span className="text-xs font-medium mt-1">
                  {menuItem.label}
                </span>
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
