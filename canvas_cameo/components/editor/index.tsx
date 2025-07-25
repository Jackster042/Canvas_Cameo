"use client";

// LIBRARIES
import { useState } from "react";
import { useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// COMPONENTS
import Canvas from "./canvas";
import Header from "./header/index";
import Sidebar from "./sidebar";

// STORE
import { useEditorStore } from "@/store";

// SERVICES
import { getUserDesignsByID } from "@/services/design-service";
import Properties from "./properties";
import SubscriptionModal from "../subcscription/premium-modal";

function MainEditor() {
  const params = useParams();
  const router = useRouter();
  const designId = params.slug;

  const [isLoading, setIsLoading] = useState(!!designId);
  const [loadAttempted, setLoadAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    canvas,
    setDesignId,
    resetStore,
    name,
    setName,
    setShowProperties,
    showProperties,
    isEditing,
    setShowPremiumModal,
    showPremiumModal,
  } = useEditorStore();

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
  const loadDesign = useCallback(async () => {
    if (!canvas || !designId || loadAttempted) return;

    try {
      setIsLoading(true);
      setLoadAttempted(true);

      const response = await getUserDesignsByID(designId as string);
      console.log(response, "response from LOAD DESIGN");

      const design = response?.data;
      if (design) {
        // TODO: UPDATE NAME
        setName(design.name);

        // SET DESIGN ID JUST IN CASE AFTER LOADING DATA
        setDesignId(designId as string);
        // TODO: CONTINUE HERE. . .
        try {
          if (design.canvasData) {
            console.log("Canvas data found.");

            canvas.clear();
            if (design.width && design.height) {
              canvas.setDimensions({
                width: design.width,
                height: design.height,
              });
            }

            // PARSE THE CANVAS DATA
            const canvasData =
              typeof design.canvasData === "string"
                ? JSON.parse(design.canvasData)
                : design.canvasData;

            // CHECK IF THERE ARE OBJECTS
            const hasObjects =
              canvasData.objects && canvasData.objects.length > 0;

            // CHECK IF THERE IS A BACKGROUND COLOR
            if (canvasData.background) {
              canvasData.backgroundCOlor = canvasData.background;
            } else {
              canvasData.backgroundColor = "#ffffff";
            }

            // IF THERE ARE NO OBJECTS, RENDER THE CANVAS
            if (!hasObjects) {
              canvas.renderAll();
              return true;
            }

            // LOAD THE CANVAS DATA
            canvas
              .loadFromJSON(design.canvasData)
              .then((canvas: any) => canvas.requestRenderAll());
          } else {
            console.log("No Canvas data.");
            console.log("no design found");
            canvas.clear();
            canvas.setWidth(design.width);
            canvas.setHeight(design.height);
            canvas.backgroundColor = "#ffffff";

            canvas.renderAll();
          }
        } catch (err) {
          console.error(err, "failed to load design");
          setError("Failed to load design");
        } finally {
          setIsLoading(false);
        }
      }
    } catch (err) {
      console.error(err, "failed to load design");
      setError("Failed to load design");
      setIsLoading(false);
    }
  }, [canvas, designId, loadAttempted, setDesignId]);

  useEffect(() => {
    if (canvas && designId && !loadAttempted) {
      loadDesign();
    } else if (!designId) {
      router.push("/");
    }
  }, [canvas, designId, loadAttempted, loadDesign, router]);

  // ACTIVE SELECTION PROPERTY
  useEffect(() => {
    if (!canvas) return;
    const handleSelectionCreated = () => {
      const activeObject = canvas.getActiveObject();
      console.log(activeObject, "active object");

      if (activeObject) {
        setShowProperties(true);
      }
    };

    const handleSelectionCleared = () => {
      console.log("selection cleared");
      setShowProperties(false);
    };

    canvas.on("selection:created", handleSelectionCreated);
    canvas.on("selection:updated", handleSelectionCreated);
    canvas.on("selection:cleared", handleSelectionCleared);

    return () => {
      canvas.off("selection:created", handleSelectionCreated);
      canvas.off("selection:updated", handleSelectionCreated);
      canvas.off("selection:cleared", handleSelectionCleared);
    };
  }, [canvas]);

  useEffect(() => {
    document.documentElement.style.overflowY = "auto"; // or "hidden"
    return () => {
      document.documentElement.style.overflowY = "scroll"; // reset when leaving
    };
  }, []);

  return (
    <div className="flex flex-col overflow-hidden overflow-y-hidden h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {isEditing && <Sidebar />}
        <div className="flex flex-1 overflow-hidden relative">
          <main className="flex flex-1 justify-center items-center overflow-hidden bg-[#f0f0f0]">
            <Canvas />
          </main>
        </div>
      </div>
      {/* PROPERTIES */}
      {showProperties && isEditing && <Properties />}
      <SubscriptionModal
        isOpen={showPremiumModal}
        onClose={setShowPremiumModal}
      />
    </div>
  );
}

export default MainEditor;
