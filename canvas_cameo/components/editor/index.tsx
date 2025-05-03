"use client";

import { useEffect } from "react";
// LIBRARIES
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

// COMPONENTS
import Canvas from "./canvas";
import Header from "./header/index";
import Sidebar from "./sidebar";

// STORE
import { useEditorStore } from "@/store";

function MainEditor() {
  const params = useParams();
  const router = useRouter();
  const designId = params.slug;

  const [isLoading, setIsLoading] = useState(!!designId);
  const [loadAttempted, setLoadAttempted] = useState(false);
  const [error, setError] = useState(null);

  const { canvas, setDesignId, resetStore } = useEditorStore();

  useEffect(() => {
    // reset the store
    resetStore();

    // set design id
    if (designId) {
      setDesignId(designId as string);
    }

    return () => {
      resetStore();
    };
  }, []);

  useEffect(() => {
    setLoadAttempted(false);
    setError(null);
  }, [designId]);

  useEffect(() => {
    if (isLoading && !canvas && designId) {
      const timer = setTimeout(() => {
        if (isLoading) {
          console.log("Canvas timeout");
          setIsLoading(false);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, canvas, designId]);

  useEffect(() => {
    if (canvas) console.log("canvas is avaliable in editor");
  }, [canvas]);

  // LOAD THE DESIGN

  return (
    <div className="flex flex-col overflow-hidden h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 overflow-hidden relative">
          <main className="flex flex-1 justify-center items-center overflow-hidden bg-[#f0f0f0]">
            <Canvas />
          </main>
        </div>
      </div>
    </div>
  );
}

export default MainEditor;
