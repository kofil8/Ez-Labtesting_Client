"use client";

import { FindLabCenter, FindLabCenterV2 } from "@/components/lab-center";

export default function FindLabCenterPage() {
  const locatorV2Enabled =
    process.env.NEXT_PUBLIC_ENABLE_LOCATOR_V2 !== "false";

  return locatorV2Enabled ? <FindLabCenterV2 /> : <FindLabCenter />;
}
