"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Crown, Loader } from "lucide-react";
import { Button } from "../ui/button";

import { saveDesign } from "@/services/design-service";
import { getUserSubscription } from "@/services/subscription-service";
import { useEditorStore } from "@/store";
import { toast } from "sonner";

interface DesignData {
  name: string;
  canvasData: string | null;
  width: number;
  height: number;
  category: string;
}

function Banner() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userSubscription, userDesigns } = useEditorStore();

  console.log(userSubscription, "userSubscription");

  const handleCreateDesign = async () => {
    if (userDesigns.length >= 5 && !userSubscription?.isPremium) {
      toast.error(
        "You have reached the limit of 5 designs , Please upgrade your plan to create more",
        {
          duration: 3000,
        }
      );
      return;
    }
    if (loading) return;
    try {
      setLoading(true);

      const initialDesignData = {
        name: "New Design",
        canvasData: null,
        width: 825,
        height: 465,
        category: "youtube_thumbnail",
      };

      const newDesign = await saveDesign(initialDesignData, null);
      // console.log(newDesign, "newDesign");
      if (newDesign?.success) {
        router.push(`/editor/${newDesign?.data?._id}`);
        setLoading(false);
      } else {
        throw new Error(`Failed to create new design`);
      }
    } catch (err) {
      console.error(err, "error from HANDLE CRATE DESIGN");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-xl overflow-hidden bg-gradient-to-r from-[#00c4cc] via-[#8b3dff] to-[#5533ff] text-white sm:p-6 md:p-8 text-center">
        <div className="flex flex-col sm:flex-row justify-center items-center mb-2 sm:mb-4">
          <Crown className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-yellow-300" />
          <span className="text-3xl sm:ml-2 sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight">
            Create Innovative Designs
          </span>
        </div>

        <h2 className="text-sm sm:text-base md:text-lg font-bold mb-4 sm:mb-6 max-w-2xl mx-auto">
          Design eye-catching thumbnails that get more views
        </h2>

        {/* CTA */}
        <Button
          onClick={handleCreateDesign}
          className="text-[#8b3dff] bg-white hover:bg-gray-100 rounded-lg px-4 py-4 sm:px-6 sm:py-2.5 mb-2 cursor-pointer"
        >
          {loading ? <Loader className="animate-spin" /> : "Start Design"}
        </Button>
      </div>
    </>
  );
}

export default Banner;
