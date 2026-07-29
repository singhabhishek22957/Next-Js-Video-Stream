import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Desixyz",
  description: "Read the Terms of Service for using Desixyz.",
};

export default function TermsPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

      <div className="space-y-8 leading-8 text-muted-foreground">
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">
            Acceptance of Terms
          </h2>
          <p>
            By using Desixyz, you agree to comply with these Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">
            Use of the Website
          </h2>
          <p>
            Users agree not to misuse the website or engage in unlawful
            activities.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">
            Intellectual Property
          </h2>
          <p>
            All trademarks, logos, and content remain the property of their
            respective owners.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">
            Limitation of Liability
          </h2>
          <p>
            Desixyz is provided "as is" without warranties of any kind.
          </p>
        </section>
      </div>
    </main>
  );
}