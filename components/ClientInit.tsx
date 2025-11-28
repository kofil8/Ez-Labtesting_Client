"use client";

import { useFirebasePush } from "@/hook/useFirebasePush";

export function ClientInit() {
  useFirebasePush();
  return null;
}
