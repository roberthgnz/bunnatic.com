import {notFound} from "next/navigation";
import BusinessLanding from "../_components/BusinessLanding";
import {getBusinessLandingBySlug} from "@/lib/businessLandingData";

type BusinessParams = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function NegocioLandingPage({params}: BusinessParams) {
  const {slug} = await params;
  const entry = getBusinessLandingBySlug(slug);

  if (!entry) {
    notFound();
  }

  return <BusinessLanding slug={entry.slug} copy={entry.copy} />;
}
