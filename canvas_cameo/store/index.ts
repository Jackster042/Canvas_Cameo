import { saveCanvasState, saveDesign } from "@/services/design-service";

import { centerCanvas } from "@/fabric/fabric-utils";
import { debounce } from "lodash";
import { create } from "zustand";

type Store = {
  canvas: any;
  setCanvas: (canvas: any) => void;
  designId: any;
  setDesignId: (id: string) => void;
  resetStore: () => void;
  isEditing: boolean;
  setIsEditing: (flag: boolean) => void;
  name: string;
  setName: (value: string) => void;
  showProperties: boolean;
  setShowProperties: (flag: boolean) => void;
  saveStatus: string;
  setSaveStatus: (status: string) => void;
  lastModified: number;
  isModified: boolean;
  markAsModified: () => void;
  saveToServer: () => Promise<any>;
  debouncedSaveToServer: () => Promise<any> | void;
  userSubscription: any;
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
  // PROPERTIES
  showProperties: false,
  setShowProperties: (flag: boolean) => set({ showProperties: flag }),
  // MODIFIED ITEM
  saveStatus: "saved",
  setSaveStatus: (status: string) => set({ saveStatus: status }),
  lastModified: Date.now(),
  isModified: false,

  markAsModified: () => {
    const designId = get().designId;

    if (designId) {
      set({
        lastModified: Date.now(),
        saveStatus: "Saving...",
        isModified: true,
      });

      get().debouncedSaveToServer(); //TODO: ADD LATER .W SAVE TO SERVER METHOD IN ZUSTAND
    } else {
      console.error("Design ID not found");
    }
  },

  // SAVE

  saveToServer: async () => {
    const designId = get().designId;
    const canvas = get().canvas;

    if (!designId || !canvas) {
      console.error("Design ID or canvas not found");
      return null;
    }

    try {
      const savedDesign = await saveCanvasState(canvas, designId, get().name);
      set({ saveStatus: "Saved", isModified: false });
      return savedDesign;
    } catch (err) {
      console.error(err, "Error from saveToServer");
      set({ saveStatus: "Error" });
      return null;
    }
  },

  debouncedSaveToServer: debounce(() => {
    get().saveToServer();
  }, 500),

  // SUBSCRIPTION
  userSubscription: null,
  setUserSubscription: (data: any) => set({ userSubscription: data }),

  // CLEANUP
  resetStore: () => {
    set({
      canvas: null,
      designId: null,
      isEditing: true,
      name: "Untitled Design",
      showProperties: false,
      setShowProperties: (flag: boolean) => set({ showProperties: flag }),
      saveStatus: "Saved",
      isModified: false,
      lastModified: Date.now(),
    });
  },
}));
