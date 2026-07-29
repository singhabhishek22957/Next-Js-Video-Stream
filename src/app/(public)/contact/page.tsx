import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Desixyz",
  description: "Contact the Desixyz support team.",
};

export default function ContactPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>

      <div className="space-y-5 text-muted-foreground leading-8">
        <p>
          We'd love to hear from you. If you have any questions, suggestions,
          technical issues, or copyright concerns, feel free to contact us.
        </p>

        <p>
          <strong>Email:</strong>{" "}
          <a
            href="mailto:support@desixyz.com"
            className="text-primary hover:underline"
          >
            support@desixyz.com
          </a>
        </p>

        <p>
          We aim to respond to all inquiries as quickly as possible.
        </p>
      </div>
    </main>
  );
}