"use client";

import React from "react";
import { useEditorStore } from "@/store";
import DesignList from "./design-list";

function RecentDesigns() {
  const { userDesigns, userDesignsLoading } = useEditorStore();

  // const designs = Array(6)
  //   .fill(null)
  //   .map((_, i) => ({
  //     id: i,
  //     title: `Design${i + 1}`,
  //     thumbnail: "/placeholder-design.svg",
  //   }));
  // console.log(userDesigns, "userDesigns");
  return (
    <>
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Designs</h2>
        <DesignList
          listOfDesigns={
            userDesigns && userDesigns.length > 0 ? userDesigns.slice(0, 5) : []
          }
          isLoading={userDesignsLoading}
          isModalView={false}
        />
      </div>
    </>
  );
}

export default RecentDesigns;
