"use client";

import { useToast } from "@/hook/use-toast";
import { useRestrictionStatus } from "@/lib/context/RestrictionStatusContext";
import {
  RESTRICTED_LOCATION_TOAST,
  isRestrictionBlocked,
} from "@/lib/restrictions/presentation";
import type { RestrictionStatusParams } from "@/lib/services/state-restriction.service";

export function useCartRestrictionGuard() {
  const { toast } = useToast();
  const { checkRestriction, publishStatus } = useRestrictionStatus();

  const ensureCanOrder = async (params: RestrictionStatusParams) => {
    const status = await checkRestriction(params);

    if (isRestrictionBlocked(status)) {
      publishStatus(status, { showBanner: true });
      toast({
        title: "Location restricted",
        description: RESTRICTED_LOCATION_TOAST,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return { ensureCanOrder };
}
