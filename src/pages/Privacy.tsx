import { Navigation } from "@/components/Navigation";
import { PageShell } from "@/components/PageShell";
import { Footer } from "@/components/Footer";
import { PrivacyBody, PRIVACY_TITLE } from "@/components/legal/LegalContent";

const Privacy = () => {
  return (
    <PageShell>
      <Navigation />
      <main className="container mx-auto px-4 py-8 sm:py-16 flex-1">
        <article className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 tracking-tight">{PRIVACY_TITLE}</h1>
          <PrivacyBody />
        </article>
      </main>
      <Footer />
    </PageShell>
  );
};

export default Privacy;
