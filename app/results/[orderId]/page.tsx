import { redirect } from "next/navigation";

export default async function ResultViewerPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  redirect(`/dashboard/customer/results/${orderId}`);
}
