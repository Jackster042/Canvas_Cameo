"use client";

// REACT
import { useCallback, useEffect, useState } from "react";

// UTILS
import { fetchWithAuth } from "@/services/base-service";

// STORE
import { useEditorStore } from "@/store";

// NEXT AUTH
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { uploadFileWithAuth } from "@/services/uplaod-service";

function UploadPanel() {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userUploads, setUserUploads] = useState<any[]>([]);

  const { canvas } = useEditorStore();
  const { data: session, status } = useSession();

  const ST = session?.idToken;

  const fetchUserUploads = useCallback(async () => {
    if (status === "authenticated" && !ST) return;

    try {
      setIsLoading(true);
      const data = await fetchWithAuth("/v1/media/get");
      console.log(data, "data from fetchUserUploads");

      setUserUploads(data?.data || []);
    } catch (err) {
      console.error(err, "Error from fetchUserUploads");
    } finally {
      setIsLoading(false);
    }
  }, [status, ST]);

  // HANDLE FILE UPLOAD
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.files, "files from handleFileUpload");
    const file = e.target.files?.[0];

    setIsUploading(true);

    try {
      if (!file) throw new Error("No file selected");

      const result = await uploadFileWithAuth(file);
      console.log(result, "result from handleFileUpload");

      setUserUploads((prev) => [result?.data, ...prev]);
    } catch (err) {
      console.error(err, "Error from handleFileUpload");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  console.log(userUploads, "userUploads from UploadPanel");

  // FETCH USER UPLOADS
  useEffect(() => {
    if (status === "authenticated") {
      fetchUserUploads();
    }
  }, [status, fetchUserUploads]); // TODO: CHECK THIS APPROACH WHERE WE PASS FUNCTION INTO DEP ARRAY

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="flex gap-2 ">
          <Label
            className={`w-full h-12 px-4 py-3 gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center justify-center cursor-pointer transition-colors
              ${isUploading ? "opacity-70 cursor-not-allowed" : ""}
              `}
          >
            <Upload className="w-4 h-4 mr-2" />
            <span className="font-medium">
              {isUploading ? "Uploading..." : "Upload files"}
            </span>
            <Input
              type="file"
              className="hidden"
              accept="image/*" // TODO: ??
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </Label>
        </div>
        <div className="mt-5">
          <h4 className="text-sm text-gray-500 mb-5">Your Uploads</h4>
          {isLoading ? (
            <div className="border p-6 flex items-center justify-center rounded-md">
              <Loader2 className="w-4 h-4" />
              <p className="font-bold text-sm">Loading you uploads ...</p>
            </div>
          ) : userUploads.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {userUploads.map((imageData) => (
                <div
                  key={imageData._id}
                  className="aspect-auto bg-gray-50 rounded-md overflow-hidden hover:opacity-85 transition-opacity relative group"
                >
                  <img
                    src={imageData.url}
                    alt={imageData || "image"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadPanel;
