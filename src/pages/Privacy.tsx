import { Navigation } from "@/components/Navigation";
import { PageShell } from "@/components/PageShell";
import { Footer } from "@/components/Footer";

// DRAFT — reviewable before publishing.
// Written from the operating facts known at build time. Every item marked
// [CONFIRM] needs a real value from Billy before this page goes live; per the
// intellectual-honesty constraint these gaps are left explicit rather than
// filled with plausible-sounding guesses.

const Privacy = () => {
  return (
    <PageShell>
      <Navigation />
      <main className="container mx-auto px-4 py-8 sm:py-16 flex-1">
        <article className="max-w-2xl mx-auto prose-invert">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: [CONFIRM: publication date]</p>

          <div className="space-y-6 text-foreground/90 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">Who we are</h2>
              <p>
                Project Razor is a critical-thinking training website at www.project-razor.com. It is
                operated by [CONFIRM: operator legal name]. If you have any questions about this policy
                or your data, contact us at [CONFIRM: contact email].
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">What we collect</h2>
              <p>When you create an account we store:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Your email address, used to sign you in and send account emails.</li>
                <li>A display name you choose.</li>
                <li>
                  Your learning progress — which lessons you have completed, your scores, XP, streaks,
                  and activity dates.
                </li>
              </ul>
              <p className="mt-2">
                Your password is handled by our authentication provider and stored only in hashed form;
                we never see or store it in plain text. Before you create an account, lesson progress is
                kept locally in your browser and is not sent to us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">Analytics</h2>
              <p>
                If you consent, we use PostHog to understand how people move through the course so we can
                improve it. We record only a small set of named product events (for example, starting a
                lesson or completing signup). We do not use session recording, and we do not use broad
                automatic event capture. Analytics does not run and no analytics events are sent unless
                you have given consent, which you are asked for separately from agreeing to these terms.
                You can decline and still use Project Razor.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">Service providers</h2>
              <p>We rely on the following providers to run the service:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Supabase — account authentication and database (stores the account data above).</li>
                <li>Resend — sending transactional email such as confirmation and password-reset links.</li>
                <li>PostHog — product analytics, only with your consent as described above.</li>
                <li>Vercel — website hosting.</li>
                <li>Cloudflare Turnstile — bot protection on sign-in and sign-up, when enabled.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">How long we keep your data</h2>
              <p>[CONFIRM: retention period and the process for deleting an account and its data.]</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">Your rights</h2>
              <p>
                Depending on where you live, you may have rights to access, correct, or delete your
                personal data, and to withdraw analytics consent at any time. To exercise these rights,
                contact us at [CONFIRM: contact email]. [CONFIRM: governing jurisdiction / applicable
                data-protection law.]
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">Children</h2>
              <p>[CONFIRM: intended audience and any minimum age requirement.]</p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </PageShell>
  );
};

export default Privacy;
