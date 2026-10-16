import { InlineMarkdown } from "@/components/InlineMarkdown";
import type { WarzonePost } from "@/data/courseData";

/* The source, context and social post shown above an In the Wild or Gauntlet
   question. Shared so both stages present posts identically. */
export const PostHeader = ({ post }: { post: WarzonePost }) => (
  <>
    <p className="text-xs text-muted-foreground italic mb-3 sm:mb-4">Source: {post.source}</p>

    <div className="rounded-xl bg-muted/30 border border-border p-4 sm:p-6 mb-3 sm:mb-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">Context</p>
      <p className="text-foreground/90 text-sm sm:text-base leading-relaxed"><InlineMarkdown text={post.context} /></p>
    </div>

    <div className="rounded-xl bg-card border border-border p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
          <span className="text-xs font-bold text-primary">{post.username[0]}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{post.username}</p>
          <p className="text-xs text-muted-foreground">{post.platform}</p>
        </div>
      </div>
      <p className="text-foreground text-sm sm:text-base leading-relaxed italic">&ldquo;<InlineMarkdown text={post.comment} />&rdquo;</p>
    </div>
  </>
);

export const PostCounter = ({ counter }: { counter: string | null }) =>
  counter ? (
    <div className="border-l-2 border-primary/50 bg-primary/5 rounded-r px-4 py-3">
      <p className="text-xs text-primary/70 font-medium uppercase tracking-wider mb-1">Counter:</p>
      <p className="text-foreground/80 italic text-base leading-relaxed">&ldquo;<InlineMarkdown text={counter} />&rdquo;</p>
    </div>
  ) : null;
