// app/page.tsx
"use client";

import { useState } from "react";
import { pinata } from "@/utils/config";

export default function Home() {
  const [file, setFile] = useState<File>();
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>("");

  const uploadFile = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }

    try {
      setUploading(true);

      // Get signed URL from API
      const urlRequest = await fetch("/api/url");
      const urlResponse = await urlRequest.json();

      // Upload file using signed URL
      const upload = await pinata.upload.public.file(file).url(urlResponse.url);

      console.log("Upload response:", upload);

      // Extract CID
      const cid = upload.cid;

      // Build a public gateway URL
      const publicUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;

      setFileUrl(publicUrl);
      setUploading(false);
    } catch (e) {
      console.error(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target?.files?.[0]);
  };

  return (
    <main className="w-full min-h-screen m-auto flex flex-col justify-center items-center gap-4">
      <input type="file" onChange={handleChange} />
      <button
        type="button"
        disabled={uploading}
        onClick={uploadFile}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {fileUrl && (
        <div className="mt-4 text-center">
          <p className="text-green-600">✅ File uploaded successfully!</p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline"
          >
            View File
          </a>
        </div>
      )}
    </main>
  );
}
