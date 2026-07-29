import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Desixyz",
  description: "Read the Desixyz Privacy Policy.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="space-y-8 leading-8 text-muted-foreground">
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">
            Information We Collect
          </h2>
          <p>
            We may collect information such as browser type, device
            information, IP address, and usage statistics to improve our
            services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">
            Cookies
          </h2>
          <p>
            Cookies may be used to improve website functionality and provide a
            better browsing experience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">
            Third-Party Services
          </h2>
          <p>
            We may use trusted third-party services such as analytics providers
            to understand website performance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">
            Data Security
          </h2>
          <p>
            We take reasonable measures to protect your information from
            unauthorized access.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">
            Contact
          </h2>
          <p>Email: support@desixyz.com</p>
        </section>
      </div>
    </main>
  );
}