import { Navigation } from "@/components/Navigation";
import { PageShell } from "@/components/PageShell";
import { Footer } from "@/components/Footer";

// DRAFT — reviewable before publishing.
// Written from the operating facts known at build time. Every item marked
// [CONFIRM] needs a real value from Billy before this page goes live; per the
// intellectual-honesty constraint these gaps are left explicit rather than
// filled with plausible-sounding guesses.

const Terms = () => {
  return (
    <PageShell>
      <Navigation />
      <main className="container mx-auto px-4 py-8 sm:py-16 flex-1">
        <article className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 tracking-tight">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: [CONFIRM: publication date]</p>

          <div className="space-y-6 text-foreground/90 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">About these terms</h2>
              <p>
                These terms govern your use of Project Razor at www.project-razor.com, operated by
                [CONFIRM: operator legal name]. By using the site or creating an account, you agree to
                them. If you do not agree, please do not use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">What Project Razor is</h2>
              <p>
                Project Razor is an educational tool for learning to identify logical fallacies,
                cognitive biases, and bad-faith argumentation. It is provided for general educational
                purposes and does not take political positions; examples are used to teach reasoning, not
                to argue for or against any conclusion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">Your account</h2>
              <p>
                You are responsible for keeping your login credentials secure and for activity under your
                account. You must provide an email address you control, and you agree not to misuse the
                service, attempt to disrupt it, or access it in violation of applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">Content and intellectual property</h2>
              <p>
                The lessons, exercises, and other materials on Project Razor are owned by [CONFIRM:
                operator legal name] and are provided for your personal, non-commercial learning. You may
                not copy or redistribute them except as permitted by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">Availability and changes</h2>
              <p>
                The service is provided on an “as is” and “as available” basis. We may update, suspend, or
                discontinue features, and we may revise these terms; we will update the date above when we
                do. [CONFIRM: any limitation of liability and governing-law clause appropriate to the
                operating jurisdiction.]
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">Privacy</h2>
              <p>
                Our handling of your data is described in the Privacy Policy. Agreeing to these terms is
                not the same as consenting to optional analytics — that consent is requested separately
                and can be declined.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">Contact</h2>
              <p>Questions about these terms: [CONFIRM: contact email].</p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </PageShell>
  );
};

export default Terms;
