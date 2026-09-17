// Shared legal copy, rendered both by the standalone /privacy and /terms
// routes and by the modal opened from the signup form. Keeping a single source
// means the two never drift apart. Copy is placed verbatim from the approved
// drafts — do not reword here.

export const PRIVACY_TITLE = "Privacy Policy";
export const TERMS_TITLE = "Terms of Service";
export const LEGAL_LAST_UPDATED = "15 September 2026";

const sectionH2 = "text-xl font-bold text-foreground mb-2";
const bodyText = "text-foreground/90 leading-relaxed";

const Email = () => (
  <a href="mailto:lybi@tcd.ie" className="text-primary hover:underline">lybi@tcd.ie</a>
);

export const PrivacyBody = () => (
  <div className="space-y-6">
    <p className="text-sm text-muted-foreground">Last updated: {LEGAL_LAST_UPDATED}</p>

    <p className={bodyText}>
      This Privacy Policy explains how Project Razor (&ldquo;Project Razor&rdquo;, &ldquo;we&rdquo;,
      &ldquo;us&rdquo;) collects and uses your personal data. Project Razor is operated by an
      individual based in the United Kingdom. For any privacy question or request, contact <Email />.
    </p>

    <section>
      <h2 className={sectionH2}>Who this applies to</h2>
      <p className={bodyText}>
        Project Razor is intended for users aged 16 and over. We do not knowingly collect personal
        data from anyone under 16. If you believe someone under 16 has provided us data, contact us
        and we will delete it.
      </p>
    </section>

    <section>
      <h2 className={sectionH2}>What we collect</h2>
      <ul className={`list-disc pl-6 space-y-1 ${bodyText}`}>
        <li><strong>Account data:</strong> your email address and display name, when you create an account.</li>
        <li><strong>Learning data:</strong> your lesson progress, scores, and XP.</li>
        <li><strong>Usage data:</strong> basic analytics about how the app is used (for example, lessons started and completed), where you have consented to analytics.</li>
      </ul>
      <p className={`${bodyText} mt-2`}>
        We do not collect payment information, and we ask you not to enter sensitive personal
        information into lessons or free-text fields.
      </p>
    </section>

    <section>
      <h2 className={sectionH2}>How we use it</h2>
      <p className={bodyText}>
        To provide and maintain your account and learning progress, to send necessary service emails
        (such as email confirmation), and — with your consent — to understand how the app is used so
        we can improve it.
      </p>
    </section>

    <section>
      <h2 className={sectionH2}>Legal bases (UK GDPR)</h2>
      <p className={bodyText}>
        We process account and learning data to perform our agreement with you (providing the
        service). We process analytics data on the basis of your consent, which you can withdraw at
        any time.
      </p>
    </section>

    <section>
      <h2 className={sectionH2}>Service providers</h2>
      <p className={bodyText}>
        We use the following providers to run the service; your data may be processed by them on our
        behalf:
      </p>
      <ul className={`list-disc pl-6 space-y-1 mt-2 ${bodyText}`}>
        <li><strong>Supabase</strong> — authentication and database hosting.</li>
        <li><strong>Resend</strong> — sending service emails.</li>
        <li><strong>Vercel</strong> — application hosting.</li>
        <li><strong>Cloudflare (Turnstile)</strong> — bot and spam protection at signup.</li>
        <li><strong>PostHog</strong> — product analytics, only where you have consented.</li>
      </ul>
      <p className={`${bodyText} mt-2`}>We aim to use EU/UK data regions where offered.</p>
    </section>

    <section>
      <h2 className={sectionH2}>Cookies and local storage</h2>
      <p className={bodyText}>
        We use local browser storage to keep you signed in and to remember your progress. Where we
        use analytics, we ask for your consent first, and you can decline without losing access to
        the app.
      </p>
    </section>

    <section>
      <h2 className={sectionH2}>Retention and deletion</h2>
      <p className={bodyText}>
        We keep your data for as long as your account is active. You can ask us to delete your
        account and associated data at any time by emailing <Email />; we will action deletion within
        30 days.
      </p>
    </section>

    <section>
      <h2 className={sectionH2}>Your rights</h2>
      <p className={bodyText}>
        Under UK GDPR you have rights to access, correct, delete, or restrict processing of your
        personal data, and to withdraw consent. To exercise any of these, email <Email />. You also
        have the right to complain to the UK Information Commissioner&apos;s Office (ico.org.uk).
      </p>
    </section>

    <section>
      <h2 className={sectionH2}>Changes</h2>
      <p className={bodyText}>
        We may update this policy; material changes will be reflected by the &ldquo;last
        updated&rdquo; date above.
      </p>
    </section>

    <section>
      <h2 className={sectionH2}>Contact</h2>
      <p className={bodyText}><Email /></p>
    </section>
  </div>
);

export const TermsBody = () => (
  <div className="space-y-6">
    <p className="text-sm text-muted-foreground">Last updated: {LEGAL_LAST_UPDATED}</p>

    <p className={bodyText}>
      These Terms govern your use of Project Razor (&ldquo;Project Razor&rdquo;, &ldquo;we&rdquo;,
      &ldquo;us&rdquo;). By creating an account or using the app, you agree to these Terms. Project
      Razor is operated by an individual based in the United Kingdom. Contact: <Email />.
    </p>

    <section>
      <h2 className={sectionH2}>Eligibility</h2>
      <p className={bodyText}>You must be at least 16 years old to use Project Razor.</p>
    </section>

    <section>
      <h2 className={sectionH2}>Your account</h2>
      <p className={bodyText}>
        You are responsible for activity under your account and for keeping your login details
        secure. Please provide accurate information when signing up.
      </p>
    </section>

    <section>
      <h2 className={sectionH2}>Acceptable use</h2>
      <p className={bodyText}>
        Don&apos;t misuse the service. In particular, no attempting to break, overload,
        reverse-engineer, or gain unauthorised access to the app or to other users&apos; data, and no
        unlawful, abusive, or infringing use.
      </p>
    </section>

    <section>
      <h2 className={sectionH2}>Educational content — no warranty</h2>
      <p className={bodyText}>
        Project Razor is an educational tool to help you practise critical thinking. Its content is
        provided for general learning purposes only and is not professional, legal, medical, or
        financial advice. We do not guarantee that all content is complete, accurate, or up to date,
        and you should not rely on it as a substitute for professional judgement.
      </p>
    </section>

    <section>
      <h2 className={sectionH2}>Availability and &ldquo;as is&rdquo;</h2>
      <p className={bodyText}>
        The service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without
        warranties of any kind, express or implied. We do not guarantee that the app will be
        uninterrupted, error-free, or secure.
      </p>
    </section>

    <section>
      <h2 className={sectionH2}>Limitation of liability</h2>
      <p className={bodyText}>
        To the fullest extent permitted by law, we will not be liable for any indirect, incidental,
        or consequential losses, or for loss of data, profits, or goodwill, arising from your use of
        (or inability to use) the service. Nothing in these Terms excludes or limits liability that
        cannot be excluded or limited under applicable law.
      </p>
    </section>

    <section>
      <h2 className={sectionH2}>Intellectual property</h2>
      <p className={bodyText}>
        Project Razor and its content are owned by us or our licensors. You may use the app for your
        personal, non-commercial learning. You may not copy, redistribute, or resell the content
        without permission.
      </p>
    </section>

    <section>
      <h2 className={sectionH2}>Termination</h2>
      <p className={bodyText}>
        You may stop using the service and delete your account at any time. We may suspend or
        terminate access if you breach these Terms.
      </p>
    </section>

    <section>
      <h2 className={sectionH2}>Changes</h2>
      <p className={bodyText}>
        We may update these Terms; continued use after changes means you accept the updated Terms.
      </p>
    </section>

    <section>
      <h2 className={sectionH2}>Governing law</h2>
      <p className={bodyText}>
        These Terms are governed by the laws of England and Wales, and any disputes are subject to
        the courts of England and Wales.
      </p>
    </section>

    <section>
      <h2 className={sectionH2}>Contact</h2>
      <p className={bodyText}><Email /></p>
    </section>
  </div>
);
