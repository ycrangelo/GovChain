// app/api/url/route.ts
import { NextResponse } from "next/server";
import { pinata } from "@/utils/config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const url = await pinata.upload.public.createSignedURL({
      expires: 30, // Signed URL expires in 30s
    });
    return NextResponse.json({ url: url }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ text: "Error creating upload URL" }, { status: 500 });
  }
}
