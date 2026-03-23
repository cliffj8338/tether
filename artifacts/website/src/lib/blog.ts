export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: "product" | "parenting" | "safety" | "faith" | "schools";
  readTime: string;
  content: string[];
}

export const BLOG_CATEGORIES: Record<string, { label: string; color: string }> = {
  product: { label: "Product", color: "bg-primary/10 text-primary" },
  parenting: { label: "Parenting", color: "bg-accent/10 text-accent" },
  safety: { label: "Digital Safety", color: "bg-alert-3/10 text-alert-3" },
  faith: { label: "Faith & Values", color: "bg-faith-gold/10 text-faith-gold" },
  schools: { label: "For Schools", color: "bg-primary/10 text-primary" },
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "why-we-built-tether",
    title: "Why We Built Tether",
    excerpt: "Every app on the market asks the same question: how do we make kids safer online? We started with a different question: what if a child's first messaging experience was supervised by design — not retrofitted with parental controls after the fact?",
    date: "2026-03-15",
    author: "Tether Team",
    category: "product",
    readTime: "5 min read",
    content: [
      "Every app on the market asks the same question: how do we make kids safer online? We started with a different question: what if a child's first messaging experience was supervised by design — not retrofitted with parental controls after the fact?",
      "The parental control industry is built on a flawed premise. It assumes children will use the same platforms as adults, and that parents need tools to restrict what those platforms allow. This creates an adversarial relationship between parent and child — the parent becomes the enforcer, the child becomes the evader.",
      "Tether is built on a different premise: children deserve their own communication platform, one where supervision is the architecture — not a feature that can be toggled off.",
      "We call this the Trust Loop. The child communicates. The AI evaluates. The parent is informed. Trust is earned. The loop repeats. Over time, the child earns more autonomy — not by circumventing controls, but by demonstrating trustworthiness.",
      "This isn't a theoretical framework. It's the way good parenting already works in the physical world. A parent doesn't give a 10-year-old the keys to the car. They start with supervised practice, build trust through experience, and gradually extend freedom. Tether applies this same logic to digital communication.",
      "We're not anti-technology. We're not anti-social media. We believe children need to learn how to communicate digitally — but they need to learn in an environment designed for learning, not one designed for engagement metrics.",
      "Tether is the first app that should come before all the others. The training wheels. The supervised practice. The foundation on which a child builds the skills they'll need when they're ready for the open internet.",
    ],
  },
  {
    slug: "trust-loop-explained",
    title: "The Trust Loop: How Tether Builds Digital Responsibility",
    excerpt: "Most parental controls are binary: on or off, allowed or blocked. Tether's Trust Loop is a graduated system that mirrors how real-world trust works between parents and children.",
    date: "2026-03-10",
    author: "Tether Team",
    category: "parenting",
    readTime: "7 min read",
    content: [
      "Most parental controls are binary: on or off, allowed or blocked. Tether's Trust Loop is a graduated system that mirrors how real-world trust works between parents and children.",
      "In the physical world, trust is built incrementally. A child earns the right to walk to school alone by first walking with a parent. They earn later curfews by consistently coming home on time. Each demonstration of responsibility leads to a small expansion of freedom.",
      "The Trust Loop applies this principle to digital communication through five levels. At Level 1, parents see all messages in real time. At Level 5, parents receive only critical safety alerts. The child progresses by demonstrating responsible communication over time.",
      "The key insight is that progression is not automatic. A parent controls when their child moves to the next level. The system provides data — positive interactions, flagged moments, consistency metrics — and the parent makes the decision. The child knows exactly what they're working toward.",
      "This changes the dynamic entirely. Instead of children trying to evade controls, they're working to earn more freedom. Instead of parents feeling like surveillance operators, they're coaches guiding development. The platform facilitates the relationship rather than straining it.",
      "We've seen early testing families report that children actively ask about their trust level — not to complain, but to understand what they need to do to earn more independence. That's the Trust Loop working as designed.",
      "The Trust Loop is not a gamification of surveillance. It's a structured approach to the same trust-building process that every family already practices — just applied to an environment where most families currently have no structure at all.",
    ],
  },
  {
    slug: "what-schools-actually-need",
    title: "What Schools Actually Need from Digital Safety",
    excerpt: "Schools don't want to monitor student messages. They want documented proof they were aware of safety events. Tether gives them exactly that — and nothing more.",
    date: "2026-03-05",
    author: "Tether Team",
    category: "schools",
    readTime: "6 min read",
    content: [
      "Schools don't want to monitor student messages. They want documented proof they were aware of safety events. Tether gives them exactly that — and nothing more.",
      "Talk to any school administrator about digital safety and you'll hear the same frustration: they're held responsible for what happens between students on digital platforms, but they have no visibility into those interactions and no appetite to become data custodians.",
      "The solutions on the market ask schools to either monitor student devices (creating massive FERPA and COPPA implications) or ignore digital communication entirely (creating liability when incidents occur). Neither option is acceptable.",
      "Tether offers a third path. Schools receive event-level notifications — a timestamp and severity level — when a serious safety event occurs between students who have opted into the school's notification network. Parents opt in. Schools receive awareness. Nobody reads messages.",
      "This matters for two reasons. First, it gives schools a documented safety record. When questions arise about what the school knew and when, there's a timestamped log showing exactly when they were notified and what actions were taken. This is the duty-of-care evidence that administrators have been asking for.",
      "Second, it keeps the school out of the data custody business entirely. No student messages are stored on school systems. No content is shared with administrators. The school's role is awareness and response — not surveillance.",
      "We're working with a founding group of schools ahead of our 2026 launch. If your school or district is interested in being part of that group, we'd love to hear from you.",
    ],
  },
  {
    slug: "faith-mode-why-it-matters",
    title: "Faith Mode: Why Values-Aligned Moderation Matters",
    excerpt: "Faith Mode is not a content filter with a Christian label. It's a fundamentally different approach to AI moderation — one that understands the difference between safety and values.",
    date: "2026-02-28",
    author: "Tether Team",
    category: "faith",
    readTime: "6 min read",
    content: [
      "Faith Mode is not a content filter with a Christian label. It's a fundamentally different approach to AI moderation — one that understands the difference between safety and values.",
      "Standard content moderation catches threats, bullying, exploitation, and other clearly harmful content. Faith Mode does all of that — and adds a values layer on top. It recognizes when conversations drift toward gossip, dishonesty, disrespect for authority, or pride. Not as safety violations, but as values-relevant moments that a parent might want to know about.",
      "This distinction matters. A child gossiping about a classmate is not a safety event. But for a family that teaches against gossip as a matter of faith, it's a values event. Standard moderation ignores it. Faith Mode flags it softly — giving the parent an opportunity to have a conversation, not an alarm to respond to.",
      "The AI moderation in Faith Mode is trained to understand these nuances within the Protestant and Evangelical Christian tradition specifically. We made this choice deliberately. Rather than trying to build a generic 'religious mode' that serves no tradition well, we built deeply for one tradition and built it well.",
      "Scripture prompts appear in conversations — not as interruptions, but as a gentle presence. A verse about kindness after a positive interaction. A prompt about forgiveness after a disagreement. The digital space mirrors what families teach at home and what churches reinforce on Sunday morning.",
      "Faith Mode is not a marketing feature. It's the reason the company exists. It was built by a founder whose faith is central to his family's daily life — a father who wanted his own children to have a digital space that reflected the values they practice at home and at church.",
      "For families who share these values, Faith Mode means Tether isn't just a safe messaging app. It's a values-aligned messaging app — one where the digital space reinforces rather than undermines what parents are teaching.",
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
