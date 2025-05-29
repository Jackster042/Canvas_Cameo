"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Save, Star, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, Eye, MenuIcon, Pencil } from "lucide-react";
import { useEditorStore } from "@/store";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ExportModal from "../export";

function Header() {
  const { isEditing, setIsEditing, name, setName, canvas } = useEditorStore();
  const [showExportModal, setShowExportModal] = useState(false);
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
  };

  useEffect(() => {
    if (!canvas) return;
    canvas.selection = isEditing;
    canvas.getObjects().forEach((obj: any) => {
      obj.selectable = isEditing;
      obj.evented = isEditing;
    });
  }, [isEditing]);

  return (
    <header className="header-gradient header flex items-center justify-between px-4 h-14">
      <div className="flex space-x-2 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="header-button flex items-center text-white">
              <span>{isEditing ? "Editing" : "Viewing"}</span>
              <ChevronDownIcon className="ml-1 w-2 h-2" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => setIsEditing(true)}
              className="cursor-pointer"
            >
              <Pencil className="w-4 h-4 mr-2" />
              <span>Editing</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsEditing(false)}
              className="cursor-pointer"
            >
              <Eye className="w-4 h-4 mr-2" />
              <span>Viewing</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* SAVE BUTTON */}
        <button className="header-button ml-3 relative" title="Save">
          <Save className="w-5 h-5 cursor-pointer" />
        </button>
        <button className="header-button ml-3 relative" title="Save">
          <Upload
            onClick={() => setShowExportModal(true)}
            className="w-5 h-5 cursor-pointer"
          />
        </button>
      </div>

      <div className="flex-1 flex justify-center max-w-md">
        <Input
          className="w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-3">
        <button className="upgrade-button flex items-center bg-white/10 hover:bg-white/20 text-white rounded-md h-9 px-3 transition-colors ">
          <Star className="mr-1 w-4 h-4 text-yellow-400" />
          <span>Upgrade your plan</span>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center space-x-2 focus:outline-none focus:ring-0"
              aria-label="User menu"
            >
              <Avatar>
                <AvatarImage src={session?.user?.image || "./cat.png"} />
                <AvatarFallback>
                  {session?.user?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1" sideOffset={8}>
            <DropdownMenuItem
              className="cursor-pointer focus:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="font-medium">Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* RENDER EXPORT MODAL */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </header>
  );
}

export default Header;
