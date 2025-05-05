"use client";

import { centerCanvas } from "@/fabric/fabric-utils";
import { create } from "zustand";

type Store = {
  canvas: any;
  setCanvas: (canvas: any) => void;
  designId: string | null;
  setDesignId: (id: string) => void;
  resetStore: () => void;
  isEditing: boolean;
  setIsEditing: (flag: boolean) => void;
  name: string;
  setName: (value: string) => void;
};

export const useEditorStore = create<Store>((set, get) => ({
  canvas: null,
  setCanvas: (canvas: any) => {
    set({ canvas });
    if (canvas) {
      centerCanvas(canvas);
    }
  },
  // DESIGN
  designId: null,
  setDesignId: (id: string) => set({ designId: id }),
  // EDITING
  isEditing: true,
  setIsEditing: (flag: boolean) => set({ isEditing: flag }),
  // SEARCH / INPUT
  name: "Untitled Design",
  setName: (value: string) => set({ name: value }),
  resetStore: () => {
    set({
      canvas: null,
      designId: null,
      isEditing: true,
      name: "Untitled Design",
    });
  },
}));
