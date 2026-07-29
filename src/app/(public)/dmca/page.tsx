import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA Policy | Desixyz",
  description: "Copyright and DMCA policy for Desixyz.",
};

export default function DMCAPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">DMCA Policy</h1>

      <div className="space-y-8 leading-8 text-muted-foreground">
        <p>
          Desixyz respects the intellectual property rights of others. If you
          believe that copyrighted material has been posted on our website
          without authorization, you may submit a DMCA notice.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Your Notice Should Include
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>Your full name and contact information.</li>
            <li>Description of the copyrighted work.</li>
            <li>URL of the allegedly infringing content.</li>
            <li>A statement made in good faith.</li>
            <li>A statement confirming the information is accurate.</li>
            <li>Your physical or electronic signature.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">
            Send Notices To
          </h2>

          <p>
            Email:{" "}
            <a
              href="mailto:dmca@desixyz.com"
              className="text-primary hover:underline"
            >
              dmca@desixyz.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}