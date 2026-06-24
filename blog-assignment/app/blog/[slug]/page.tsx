import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import Link from "next/link";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
  });
  return post;
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.description.slice(0, 160),
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 mb-6 transition"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </Link>

        {/* Card */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Image */}
          <div className="w-full aspect-video relative overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover rounded-t-2xl"
            />
          </div>

          {/* Content */}
          <div className="p-6 md:p-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {post.title}
            </h1>

            <p className="text-sm text-gray-400 mb-6">
              Published on{" "}
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
              {post.description}
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
