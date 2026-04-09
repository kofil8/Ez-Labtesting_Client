import { buildCreateOrderRequest } from "@/lib/checkout/build-create-order-request";
import { AccessOrderPayload } from "@/lib/api-contracts/access-order.contract";
import { PatientInfo } from "@/lib/context/CheckoutContext";
import { SelectedLabCenter } from "@/types/lab-center";
import { describe, expect, it } from "vitest";

const patientInfo: PatientInfo = {
  firstName: "Jamie",
  lastName: "Cole",
  dob: "1990-01-15",
  gender: "Female",
  email: "jamie@example.com",
  phone: "5551112222",
  address: "123 Main St",
  city: "Austin",
  state: "TX",
  zipCode: "78701",
};

const accessOrderPayload: AccessOrderPayload = {
  testCode: "CBC",
  collectionType: "PSC",
  patient: {
    firstName: "Jamie",
    lastName: "Cole",
    dateOfBirth: "01151990",
    gender: "F",
    phone: "5551112222",
    email: "jamie@example.com",
  },
};

const selectedLab: SelectedLabCenter = {
  id: "lab-123",
  name: "Downtown Lab",
  address: "123 Main St",
  latitude: 40,
  longitude: -73,
};

describe("buildCreateOrderRequest", () => {
  it("includes labCenterId when a lab has been selected", () => {
    const request = buildCreateOrderRequest({
      accessOrderPayload,
      getSubtotal: 99,
      getTotal: 99,
      labTestId: "test-1",
      patientInfo,
      processingFee: 2.5,
      selectedLab,
    });

    expect(request.labCenterId).toBe("lab-123");
    expect(request.total).toBe(101.5);
  });

  it("omits labCenterId when no lab has been selected", () => {
    const request = buildCreateOrderRequest({
      accessOrderPayload,
      getSubtotal: 99,
      getTotal: 99,
      labTestId: "test-1",
      patientInfo,
      processingFee: 2.5,
      selectedLab: null,
    });

    expect(request.labCenterId).toBeUndefined();
  });
});
