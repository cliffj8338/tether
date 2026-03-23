import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Clock } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { getPostBySlug, formatDate, BLOG_CATEGORIES } from "@/lib/blog";
import { cn } from "@/lib/utils";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug || "");

  useSEO({
    title: post ? `${post.title} — Tether Blog` : "Post Not Found — Tether Blog",
    description: post?.excerpt || "Blog post not found.",
  });

  if (!post) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Post not found</h1>
          <p className="text-text-mid mb-6">The article you're looking for doesn't exist.</p>
          <Link href="/blog" className="text-primary font-semibold hover:underline">
            &larr; Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const cat = BLOG_CATEGORIES[post.category];

  return (
    <div className="overflow-hidden">
      <section className="bg-surface py-16 px-4 border-b border-border">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-8 hover:gap-3 transition-all">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className={cn("px-3 py-1 rounded-full text-xs font-bold", cat.color)}>{cat.label}</span>
              <span className="text-sm text-text-light">{formatDate(post.date)}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-text-mid text-sm">
              <span className="font-semibold">{post.author}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="prose prose-lg max-w-none"
          >
            {post.content.map((paragraph, i) => (
              <p key={i} className="text-text-mid leading-relaxed mb-6 text-lg">{paragraph}</p>
            ))}
          </motion.div>

          <div className="mt-16 pt-8 border-t border-border">
            <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
              <ArrowLeft className="w-4 h-4" /> More Articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
