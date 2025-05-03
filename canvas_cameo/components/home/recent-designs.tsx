"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getUserDesigns } from "@/services/design-service";

function RecentDesigns() {
  const [userDesigns, setUserDesigns] = useState<any[]>([]);
  const router = useRouter();

  async function fetchDesigns() {
    const result = await getUserDesigns();
    // console.log(result, "result from USER DESIGNS");
    if (result?.success) setUserDesigns(result?.data);
  }

  useEffect(() => {
    fetchDesigns();
  }, []);

  // const designs = Array(6)
  //   .fill(null)
  //   .map((_, i) => ({
  //     id: i,
  //     title: `Design${i + 1}`,
  //     thumbnail: "/placeholder-design.svg",
  //   }));
  console.log(userDesigns, "userDesigns");
  return (
    <>
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Designs</h2>
        <div className="grid grid-col-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {!userDesigns.length && (
            <h1 className="text-center text-2xl font-bold">No designs found</h1>
          )}
          {userDesigns.map((design) => (
            <div key={design._id} className="group cursor-pointer">
              <div
                onClick={() => router.push(`/editor/${design._id}`)}
                className="aspect-video bg-gray-100 rounded-lg mb-2 overflow-hidden transition-shadow group-hover:shadow-md"
              />
              <p className="text-sm font-bold truncate text-center">
                {design.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default RecentDesigns;
