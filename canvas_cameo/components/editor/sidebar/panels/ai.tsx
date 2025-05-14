"use client";

import { useEditorStore } from "@/store";
import { Loader, Loader2, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { generateImageFromAI } from "@/services/uplaod-service";
import { addImageToCanvas } from "@/fabric/fabric-utils";

function AIPanel() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null as any);

  const { canvas } = useEditorStore();

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    setGeneratedContent(null);
    setUploadSuccess(false);

    try {
      await generateImage(prompt);
    } catch (err) {
      console.error(err, "Error from handleGenerate");
    } finally {
      setIsLoading(false);
    }
  };

  const generateImage = async (prompt: string) => {
    try {
      const response = await generateImageFromAI(prompt);
      console.log(response, "response from generateImage");

      if (response && response?.data?.url)
        setGeneratedContent(response?.data?.url);
    } catch (err) {
      console.error(err, "Error from generateImage");
      throw new Error("Error from generateImage");
    }
  };

  const handleAiImageToCanvas = async () => {
    if (!canvas && !generatedContent) return;
    addImageToCanvas({ canvas, imageUrl: generatedContent });
  };

  // console.log(generatedContent, "generatedContent");

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-2 mb-2">
          <Wand2 className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-semibold">AI Image Generator</h2>
        </div>
        <div className="space-y-2">
          <Textarea
            placeholder="Enter a prompt to generate an image"
            value={prompt}
            onChange={handlePromptChange}
            className="resize-none min-h-[200px]"
            disabled={isLoading}
          />
          <Button
            onClick={() => handleGenerate(prompt)}
            disabled={!prompt.trim() || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating ...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate your image
              </>
            )}
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="border rounded-md bg-gray-50 p-6 flex-col items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-purple-500 mb-3" />
          <p className="text-sm text-center text-gray-600">
            Creating your image ...
          </p>
        </div>
      )}

      {generatedContent && !isLoading && (
        <div className="space-y-2">
          <div className="border rounded-md overflow-hidden">
            <img src={generatedContent} className="w-full h-auto" />
          </div>
          <div>
            <Button
              onClick={handleAiImageToCanvas}
              className={"flex-1"}
              variant={uploadSuccess ? "outline" : "default"}
              disabled={isUploading}
            >
              Add To Canvas
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIPanel;
