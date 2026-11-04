import Link from "next/link";

import { DisableScrollSnap } from "@/components/DisableScrollSnap";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { confirmEmailByToken } from "@/lib/registrations";
import { buildPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ token: string }>;
};

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/join/confirm",
    title: "Confirm your email",
    description: "Confirm the email address linked to your NeighbrVille waitlist signup.",
    noIndex: true,
  });
}

export default async function JoinConfirmPage({ params }: PageProps) {
  const { token } = await params;
  const result = confirmEmailByToken(token);

  const title = !result.ok
    ? "Link not found"
    : result.alreadyConfirmed
      ? "Email already confirmed"
      : "Email confirmed";

  const body = !result.ok
    ? "This confirmation link is invalid or expired. If you still need help, reply to your waitlist email."
    : result.alreadyConfirmed
      ? `Thanks — ${result.email} was already confirmed. You're all set on the waitlist.`
      : `Thanks — ${result.email} is now confirmed. We'll keep you posted as NeighbrVille grows.`;

  return (
    <>
      <DisableScrollSnap />
      <Header />
      <main className="min-h-dvh overflow-x-clip bg-chocolate text-cream">
        <section className="page-shell page-x flex flex-col items-center justify-center py-20 text-center lg:min-h-[70svh] lg:py-28">
          <p className="font-inter text-[11px] font-medium uppercase tracking-[0.16em] text-cream/70">
            Waitlist
          </p>
          <h1 className="mt-5 max-w-[14ch] font-playfair text-[clamp(2.2rem,8vw,3.75rem)] font-normal uppercase leading-[0.9] tracking-[-0.045em]">
            {title}
          </h1>
          <p className="mt-6 max-w-[36ch] font-inter text-[15px] leading-[1.45] text-cream/85">
            {body}
          </p>
          <Link
            href="/#join"
            className="mt-10 bg-cream px-6 py-3.5 font-inter text-[14px] font-medium leading-none text-chocolate transition-opacity hover:opacity-90"
          >
            Back to NeighbrVille
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
