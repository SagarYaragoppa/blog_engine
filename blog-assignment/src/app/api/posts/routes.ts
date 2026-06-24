import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/slug";

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();

    const {
      title,
      image,
      description,
    } = body;

    const slug = generateSlug(title);

    const post = await prisma.post.create({
      data: {
        title,
        image,
        description,
        slug,
      },
    });

    return NextResponse.json(
      post,
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}