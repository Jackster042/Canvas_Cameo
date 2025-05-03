"use client";

import { centerCanvas } from "@/fabric/fabric-utils";
import { create } from "zustand";

type Store = {
  canvas: any;
  setCanvas: (canvas: any) => void;
  designId: string | null;
  setDesignId: (id: string) => void;
  resetStore: () => void;
};

export const useEditorStore = create<Store>((set, get) => ({
  canvas: null,
  setCanvas: (canvas: any) => {
    set({ canvas });
    if (canvas) {
      centerCanvas(canvas);
    }
  },
  designId: null,
  setDesignId: (id: string) => set({ designId: id }),
  resetStore: () => {
    set({
      canvas: null,
      designId: null,
    });
  },
}));
