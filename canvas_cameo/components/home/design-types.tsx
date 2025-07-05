import React, { useState } from "react";
import { designTypes } from "@/config";
import { Loader } from "lucide-react";
import { useEditorStore } from "@/store";
import { toast } from "sonner";
import { saveDesign } from "@/services/design-service";
import { useRouter } from "next/navigation";

function DesignTypes() {
  const [currentSelectedType, setCurrentSelectedType] = useState(-1);
  const [loading, setLoading] = useState(false);

  const { userDesigns, userSubscription } = useEditorStore();
  const router = useRouter();

  const handleCreateDesign = async (getCurrentType: any, index: number) => {
    setCurrentSelectedType(index);
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
        name: getCurrentType.label,
        canvasData: null,
        width: getCurrentType.width,
        height: getCurrentType.height,
        category: getCurrentType.label,
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
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 mt-12 justify-center">
      {designTypes.map((type, index) => (
        <div
          onClick={() => handleCreateDesign(type, index)}
          key={index}
          className="flex cursor-pointer flex-col items-center"
        >
          <div
            className={`${type.bgColor} w-14 h-14 rounded-full flex items-center justify-center mb-2`}
          >
            {type.icon}
          </div>
          <span className="text-xs items-center flex gap-2 text-center">
            {loading && currentSelectedType === index && (
              <Loader className="w-3 h-3" />
            )}
            {type.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default DesignTypes;
