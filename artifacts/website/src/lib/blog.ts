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
    slug: "safe-messaging-for-kids",
    title: "What Safe Messaging for Kids Actually Looks Like",
    excerpt: "Every major platform says they care about child safety. But none of them were designed for children in the first place. Tether starts from a different premise: what if the platform itself was the safety layer?",
    date: "2026-03-15",
    author: "Tether Team",
    category: "safety",
    readTime: "6 min read",
    content: [
      "Every major platform says they care about child safety. But none of them were designed for children in the first place. They were designed for adults, and child safety features were bolted on after the fact — after the growth, after the engagement metrics, after the ad revenue model was locked in.",
      "This creates a fundamental design conflict. The platform's business model depends on maximizing time-on-app and engagement. Child safety depends on limiting exposure, moderating content, and giving parents visibility. These goals are structurally opposed.",
      "Tether starts from a different premise: what if the platform itself was the safety layer? Not a filter on top of an unsafe platform, but a platform where safety is the architecture.",
      "In practice, this means every message passes through a two-stage content analysis pipeline before it reaches the recipient. The first stage is pattern-based — instant detection of explicit content, threats, and known harmful patterns. The second stage uses Claude AI to analyze context, tone, and conversational dynamics that pattern matching misses: subtle manipulation, social pressure, grooming behaviors.",
      "But safe messaging isn't just about blocking bad content. It's about creating a communication environment where children can develop healthy digital habits. Tether's Trust Loop provides that environment — a graduated system where children earn more communication freedom by demonstrating responsible behavior over time.",
      "The child sees a messaging app. The parent sees a supervision tool. The AI sees every conversation through a safety lens. And the platform makes money from subscriptions, not ads — so there's no incentive to maximize engagement at the expense of safety.",
      "This is what safe messaging for kids actually looks like: not a parental control app layered on top of an unsafe platform, but a platform built from the ground up with children as the primary user and safety as the primary design constraint.",
    ],
  },
  {
    slug: "graduated-trust-digital-parenting",
    title: "Graduated Trust: A New Framework for Digital Parenting",
    excerpt: "Most parental controls are binary: on or off, allowed or blocked. Real-world parenting doesn't work that way. Trust is earned incrementally — and digital parenting should mirror that reality.",
    date: "2026-03-10",
    author: "Tether Team",
    category: "parenting",
    readTime: "7 min read",
    content: [
      "Most parental controls are binary: on or off, allowed or blocked. Real-world parenting doesn't work that way. A parent doesn't hand a 10-year-old the keys to the car. They start with supervised practice, build trust through experience, and gradually extend freedom. Trust is earned incrementally — and digital parenting should mirror that reality.",
      "We call this framework graduated trust. It's the principle behind Tether's five-level Trust Loop, but it's also a broader philosophy for how families can approach digital communication with their children.",
      "At the most supervised level, parents see all messages in real time. The child communicates, but with full transparency. This isn't surveillance — it's the digital equivalent of a child playing in the front yard while a parent watches from the porch. The child has freedom of movement. The parent has line of sight.",
      "As the child demonstrates responsible communication — kindness, honesty, appropriate boundaries — the parent can move them to the next trust level. Each level reduces the parent's direct visibility while maintaining safety protections. By the highest level, the parent receives only critical safety alerts. The child has earned genuine autonomy.",
      "The key insight is that progression is not automatic. A parent controls when their child advances. The system provides data — positive interactions, flagged moments, consistency metrics — and the parent makes the decision. The child knows what they're working toward, which changes the dynamic entirely.",
      "Instead of children trying to circumvent controls, they're working to earn more freedom. Instead of parents feeling like surveillance operators, they're coaches guiding development. The platform facilitates the relationship rather than straining it.",
      "Graduated trust isn't a feature. It's a philosophy — one that treats children as developing humans who need structure, guidance, and the opportunity to earn independence. It's the way good parenting already works in the physical world. Tether simply applies it to the digital one.",
    ],
  },
  {
    slug: "why-monitoring-apps-fail",
    title: "Why Monitoring Apps Fail — And What Should Replace Them",
    excerpt: "The parental monitoring industry is built on a flawed premise: that parents should spy on their children's digital lives. The data shows these apps don't work — and often make things worse.",
    date: "2026-03-05",
    author: "Tether Team",
    category: "safety",
    readTime: "7 min read",
    content: [
      "The parental monitoring industry is built on a flawed premise: that parents should spy on their children's digital lives. Install an app. Read their texts. Track their location. Block the apps you don't approve of. The data shows these tools don't work — and often make things worse.",
      "Research consistently shows that covert monitoring damages the parent-child relationship. When children discover they're being surveilled — and they almost always do — the result is eroded trust, increased secrecy, and the adoption of workarounds. Children create secondary accounts. They use friends' devices. They learn to communicate in ways the monitoring app can't detect.",
      "The fundamental problem is the adversarial model. Monitoring apps frame the parent-child relationship as enforcer vs. evader. The parent is the warden. The child is the inmate. This is not a foundation for healthy development — it's a recipe for the exact behaviors parents are trying to prevent.",
      "Even when monitoring apps work as intended, they create a false sense of security. A parent sees their child's text messages and assumes they have visibility into their digital life. But children communicate across dozens of platforms — and monitoring apps can only see a fraction of that activity. The parent relaxes. The child knows which channels are watched and which aren't.",
      "Blocking apps doesn't work either. Digital communication is a necessary skill. Children who are prevented from developing that skill in a supervised environment will develop it in an unsupervised one. The question isn't whether children will communicate digitally — it's whether they'll learn to do it responsibly.",
      "What should replace monitoring apps? A platform designed for children from the ground up — one where the supervision is transparent, the child participates willingly, and trust is built over time rather than assumed or imposed. A platform where the parent's role is coach, not spy.",
      "This is the premise behind Tether. Not monitoring — supervising. Not blocking — graduating. Not spying — partnering. The distinction matters because the approach determines the outcome. Monitoring produces evasion. Supervision produces responsibility.",
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
