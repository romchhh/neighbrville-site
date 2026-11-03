import { DisableScrollSnap } from "@/components/DisableScrollSnap";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JoinEditClient } from "@/components/JoinEditClient";
import { buildPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ token: string }>;
};

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/join/edit",
    title: "Edit your waitlist details",
    description:
      "Update the NeighbrVille waitlist profile linked to your confirmation email.",
    noIndex: true,
  });
}

export default async function JoinEditPage({ params }: PageProps) {
  const { token } = await params;

  return (
    <>
      <DisableScrollSnap />
      <Header />
      <JoinEditClient token={token} />
      <Footer />
    </>
  );
}
