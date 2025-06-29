"use client";

import React from "react";
import { useRouter } from "next/navigation";

import DesignPreview from "./design-preview";
import { Trash2 } from "lucide-react";
import { deleteDesign } from "@/services/design-service";

function DesignList({ listOfDesigns: listOfDesigns }: any) {
  const router = useRouter();

  const handleDeleteDesign = async (e: any, designId: string) => {
    e.stopPropagation();
    const response = await deleteDesign(designId);
    if (response.success) window.location.reload();
  };

  return (
    <>
      <div className="grid grid-col-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {!listOfDesigns.length && (
          <h1 className="text-center text-2xl font-bold">No designs found</h1>
        )}
        {listOfDesigns.map((design: any) => (
          <div
            key={design._id}
            className="group cursor-pointer"
            onClick={() => router.push(`/editor/${design._id}`)}
          >
            <div className="w-[300px] h-[300px] rounded-lg mb-2 overflow-hidden transition-shadow group-hover:shadow-md">
              {design?.canvasData && (
                <DesignPreview key={design._id} design={design} />
              )}
            </div>
            <div className="flex justify-around">
              <p className="text-sm font-bold truncate">{design.name}</p>
              <Trash2
                onClick={(e) => {
                  handleDeleteDesign(e, design._id);
                }}
                className="w-5 h-5 text-red-600"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default DesignList;
