import { CreateOrderRequest } from "@/lib/api-contracts/order.contract";
import { AccessOrderPayload } from "@/lib/api-contracts/access-order.contract";
import { PatientInfo } from "@/lib/context/CheckoutContext";
import { SelectedLabCenter } from "@/types/lab-center";

type BuildCreateOrderRequestParams = {
  accessOrderPayload: AccessOrderPayload;
  getSubtotal: number;
  getTotal: number;
  labTestId: string;
  patientInfo: PatientInfo;
  processingFee: number;
  promoCode?: string | null;
  selectedLab: SelectedLabCenter | null;
};

export function buildCreateOrderRequest({
  accessOrderPayload,
  getSubtotal,
  getTotal,
  labTestId,
  patientInfo,
  processingFee,
  promoCode,
  selectedLab,
}: BuildCreateOrderRequestParams): CreateOrderRequest {
  return {
    userId: undefined,
    labTestId,
    labCenterId: selectedLab?.id,
    patient: {
      firstName: patientInfo.firstName,
      lastName: patientInfo.lastName,
      dob: patientInfo.dob,
      gender: patientInfo.gender as "Male" | "Female" | "Other",
    },
    subtotal: getSubtotal,
    processingFee,
    total: getTotal + processingFee,
    promoCode: promoCode || undefined,
    accessPayloadJson: accessOrderPayload,
  };
}
