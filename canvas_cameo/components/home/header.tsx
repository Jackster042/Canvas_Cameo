"use client";

import { LogOut, Search } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Header() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
  };
  return (
    <>
      <header className="h-16 border-b border-gray-200 backdrop-blur-sm bg-white/80 flex items-center px-6 fixed top-0 right-0 left-[72px] z-10">
        <div className="flex-1 max-w-2xl mx-auto relative">
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 h-5 text-gray-500" />
          <Input
            className="pl-10 py-6 border-gray-200 bg-gray-50 focus-visible:ring-purple-500 text-base"
            placeholder="Search your Projects and Canva's"
            aria-label="Search"
          />
        </div>

        <div className="flex items-center gap-5 ml-4">
          <div className="flex items-center gap-1 cursor-pointer">
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
                  <span className="text-sm font-medium hidden lg:block">
                    {session?.user?.name || "User"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 mt-1"
                sideOffset={8}
              >
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
        </div>
      </header>
    </>
  );
}
