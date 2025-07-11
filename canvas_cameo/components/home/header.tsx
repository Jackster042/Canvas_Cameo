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
import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "@/store";
import { debounce } from "lodash";
import { fetchWithAuth } from "@/services/base-service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Design {
  _id: string;
  name: string;
  category: string;
  updatedAt: string;
  // Add other properties as needed
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: Design[];
}

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const { setShowDesignsModal } = useEditorStore();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setIsSearching(true);

        // Using fetchWithAuth which returns Axios response
        const response = await fetchWithAuth(
          `/v1/designs/search?q=${encodeURIComponent(searchTerm)}`
        );

        // console.log(response, "response from search");
        // console.log(response?.data, "response data from search");

        if (response && response.data) {
          const apiResponse = response;

          console.log(apiResponse, "apiResponse from search");

          if (apiResponse.success && apiResponse.data) {
            setSearchResults(apiResponse.data);
          } else {
            console.warn("API returned success=false or missing data");
            setSearchResults([]);
          }
        } else {
          console.warn("Unexpected response format");
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
        toast.error("Search failed. Please try again.");
      } finally {
        setIsSearching(false);
      }
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const handleDesignSelect = (designId: string) => {
    setSearch("");
    setSearchResults([]);
    setShowDesignsModal(false);
    router.push(`/editor/${designId}`);
  };

  // console.log(searchResults, "searchResults");

  return (
    <header className="h-16 border-b border-gray-200 backdrop-blur-sm bg-white/80 flex items-center px-6 fixed top-0 right-0 left-[72px] z-10">
      <div className="flex-1 max-w-2xl mx-auto relative">
        <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 h-5 text-gray-500" />
        <Input
          className="pl-10 py-6 border-gray-200 bg-gray-50 focus-visible:ring-purple-500 text-base"
          placeholder="Search your Projects and Canva's"
          aria-label="Search"
          value={search}
          onChange={handleSearchChange}
        />

        {/* Search results dropdown */}
        {search && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md z-50 max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center text-gray-500">Searching...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((design) => (
                <div
                  key={design._id}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0"
                  onClick={() => handleDesignSelect(design._id)}
                >
                  <div className="font-medium">{design.name}</div>
                  <div className="text-sm text-gray-500">
                    {design.category} •{" "}
                    {new Date(design.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                {search.trim() ? "No designs found" : "Type to search"}
              </div>
            )}
          </div>
        )}
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
                <span className="text-sm font-medium hidden lg:block h-5">
                  {session?.user?.name || "User"}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 z-50 transition-all duration-150 ease-out animate-fade-in"
            >
              <DropdownMenuItem
                className="cursor-pointer"
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
  );
}
