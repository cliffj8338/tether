import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, BookOpen } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { BLOG_POSTS, BLOG_CATEGORIES, formatDate } from "@/lib/blog";
import { cn } from "@/lib/utils";

export default function Blog() {
  useSEO({ title: "Tether Blog — Digital Safety & Supervised Messaging", description: "Insights on digital safety, supervised messaging, faith-aligned technology, and building trust with kids in a connected world." });

  return (
    <div className="overflow-hidden">
      <section className="bg-surface py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-primary font-bold text-sm mb-6 border border-border">
              <BookOpen className="w-4 h-4" /> Blog
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Thinking about kids & technology</h1>
            <p className="text-xl text-text-mid leading-relaxed max-w-2xl mx-auto">
              Research, product thinking, and honest perspectives on raising kids in a connected world.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {BLOG_POSTS.map((post, i) => {
              const cat = BLOG_CATEGORIES[post.category];
              return (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="group p-8 rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={cn("px-3 py-1 rounded-full text-xs font-bold", cat.color)}>{cat.label}</span>
                        <span className="text-sm text-text-light">{formatDate(post.date)}</span>
                        <span className="text-sm text-text-light">{post.readTime}</span>
                      </div>
                      <h2 className="text-2xl font-display font-bold mb-3 group-hover:text-primary transition-colors">{post.title}</h2>
                      <p className="text-text-mid leading-relaxed mb-4">{post.excerpt}</p>
                      <span className="inline-flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                        Read more <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
