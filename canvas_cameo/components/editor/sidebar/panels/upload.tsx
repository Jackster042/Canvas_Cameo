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
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {};

  // FETCH USER UPLOADS
  useEffect(() => {
    if (status === "authenticated") {
      fetchUserUploads();
    }
  }, [status, fetchUserUploads]); // TODO: CHECK THIS APPROACH WHERE WE PASS FUNCTION INTO DEP ARRAY

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-x-auto">
        <div className="flex gap-2 ">
          <Label>
            <Upload className="w-5 h-5 mr-2" />
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
      </div>
      <div className="pt-2">
        <h4 className="text-lg font-medium mb-4 text-gray-800 ml-4">
          Your Uploads
        </h4>
        <div className="space-x-4">
          {userUploads && userUploads.length > 0 ? (
            userUploads.map((upload) => (
              <div key={upload.id}>{upload.name}</div>
            ))
          ) : (
            <div>No uploads found</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadPanel;
