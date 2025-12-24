import { Navigation } from "@/components/Navigation";
import { Calendar, User } from "lucide-react";

const Blog = () => {
  const posts = [
    {
      title: "The Rise of Disinformation in the Digital Age",
      excerpt: "Exploring how social media algorithms amplify cognitive biases and make us more susceptible to manipulation.",
      date: "November 15, 2025",
      author: "Project Razor Team",
      category: "Analysis"
    },
    {
      title: "Case Study: The WMD Intelligence Failure",
      excerpt: "How confirmation bias and groupthink led to one of the most consequential intelligence failures in modern history.",
      date: "November 10, 2025",
      author: "Project Razor Team",
      category: "Case Study"
    },
    {
      title: "Spotting Gish Gallop in Political Debates",
      excerpt: "A practical guide to recognizing and responding to this overwhelming bad-faith tactic in real-time discussions.",
      date: "November 5, 2025",
      author: "Project Razor Team",
      category: "Tutorial"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 
            className="text-5xl font-bold text-foreground mb-4 opacity-0 animate-fade-up"
            style={{ animationDelay: "0ms" }}
          >
            Blog
          </h1>
          <p 
            className="text-xl text-muted-foreground mb-12 opacity-0 animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            Insights, case studies, and analysis on critical thinking and disinformation.
          </p>

          <div className="space-y-8">
            {posts.map((post, idx) => (
              <article 
                key={idx} 
                className="bg-card border border-border rounded-lg p-8 hover:border-primary transition-all duration-300 opacity-0 animate-fade-up hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
                style={{ animationDelay: `${200 + idx * 100}ms` }}
              >
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                  {post.category}
                </div>
                
                <h2 className="text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div 
            className="mt-12 text-center opacity-0 animate-fade-up"
            style={{ animationDelay: "500ms" }}
          >
            <p className="text-muted-foreground">
              More articles coming soon. Check back regularly for new content.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Blog;