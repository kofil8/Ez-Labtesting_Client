import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return {
    title: "Redirecting to Test Detail | Ez LabTesting",
    description: "Panel details now use the shared /tests/[id] route.",
    alternates: {
      canonical: `/tests/${id}`,
    },
  };
}

export default async function PanelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/tests/${id}`);
}
