"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Save, SaveOff, Star, Upload } from "lucide-react";
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
import { useCallback, useEffect, useState } from "react";
import ExportModal from "../export";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { saveDesign } from "@/services/design-service";
import { set } from "lodash";

function Header() {
  const {
    isEditing,
    setIsEditing,
    name,
    setName,
    canvas,
    saveStatus,
    markAsModified,
    designId,
    userDesigns,
    userSubscription,
    setShowPremiumModal,
  } = useEditorStore();
  const [showExportModal, setShowExportModal] = useState(false);
  const { data: session } = useSession();

  const [localName, setLocalName] = useState(name);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const debounceSave = useCallback(
    (newName: string) => {
      if (debounceTimer) clearTimeout(debounceTimer);

      const timer = setTimeout(() => {
        setName(newName);
        markAsModified();
        if (designId) {
          saveDesign({ name: newName }, designId);
        }
      }, 1000);

      setDebounceTimer(timer);
    },
    [debounceTimer, setName, markAsModified, designId, saveDesign]
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setLocalName(newName);
    debounceSave(newName);
  };

  const handleLogout = async () => {
    await signOut();
  };

  useEffect(() => {
    setLocalName(name);
  }, [name]);

  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [debounceTimer]);

  useEffect(() => {
    if (!canvas) return;
    canvas.selection = isEditing;
    canvas.getObjects().forEach((obj: any) => {
      obj.selectable = isEditing;
      obj.evented = isEditing;
    });
  }, [isEditing]);

  useEffect(() => {
    if (!canvas || !designId) return;
    markAsModified();
  }, [name, canvas, designId]);

  const handleExport = () => {
    console.log(userDesigns, " userDesigns");
    console.log(userSubscription, " userSubscription");
    if (userDesigns?.length >= 5 && !userSubscription.isPremium) {
      toast.error("Please upgrade to premium!", {
        description: "You need to upgrade to premium to create more designs",
      });

      return;
    }
    setShowExportModal(true);
  };
  return (
    <header className="header-gradient header flex items-center justify-between px-4 h-14">
      <div className="flex space-x-2 items-center">
        <Link href="/">
          <Image
            src="https://static.canva.com/web/images/856bac30504ecac8dbd38dbee61de1f1.svg"
            alt="canvas cameo"
            width={70}
            height={30}
            priority
          />
        </Link>
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
          {saveStatus === "Saving..." ? (
            <SaveOff className="w-5 h-5 cursor-pointer animate-spin" />
          ) : (
            <Save className="w-5 h-5 cursor-pointer" />
          )}
        </button>
        <button className="header-button ml-3 relative" title="Upload">
          <Upload onClick={handleExport} className="w-5 h-5 cursor-pointer" />
        </button>
      </div>

      <div className="flex-1 flex justify-center max-w-md">
        <Input
          className="w-full"
          value={localName}
          onChange={handleNameChange}
        />
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setShowPremiumModal(true)}
          className="upgrade-button flex items-center bg-white/10 hover:bg-white/20 text-white rounded-md h-9 px-3 transition-colors "
        >
          <Star className="mr-1 w-4 h-4 text-yellow-400" />
          <span>
            {!userSubscription?.isPremium
              ? "Upgrade to Premium"
              : "Premium Member"}
          </span>
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
