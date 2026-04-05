import ordersData from "@/data/orders.json";
import promoCodesData from "@/data/promo-codes.json";
import resultsData from "@/data/results.json";
import testsData from "@/data/tests.json";
import { Order } from "@/types/order";
import { Panel } from "@/types/panel";
import { PromoCode } from "@/types/promo-code";
import { Result } from "@/types/result";
import { Test } from "@/types/test";
import { User } from "@/types/user";

// Mock API functions that simulate async data fetching
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAllTests(): Promise<Test[]> {
  await delay(300);
  return testsData as Test[];
}

export async function getTestById(id: string): Promise<Test | null> {
  await delay(200);
  const tests = testsData as Test[];
  return tests.find((test) => test.id === id) || null;
}

export async function searchTests(
  query: string,
  category?: string,
  sortBy?: string,
): Promise<Test[]> {
  await delay(300);
  let tests = testsData as Test[];

  // Filter by search query
  if (query) {
    const lowerQuery = query.toLowerCase();
    tests = tests.filter(
      (test) =>
        test.testName.toLowerCase().includes(lowerQuery) ||
        test.description.toLowerCase().includes(lowerQuery) ||
        test.keywords?.some((k) => k.toLowerCase().includes(lowerQuery)),
    );
  }

  // Filter by category
  if (category && category !== "all") {
    tests = tests.filter((test) => test.category === category);
  }

  // Sort
  if (sortBy === "price-asc") {
    tests.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    tests.sort((a, b) => b.price - a.price);
  } else if (sortBy === "turnaround") {
    tests.sort((a, b) => a.turnaround - b.turnaround);
  }

  return tests;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  await delay(300);
  const orders = ordersData as Order[];
  return orders.filter((order) => order.userId === userId);
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  await delay(200);
  const orders = ordersData as Order[];
  return orders.find((order) => order.id === orderId) || null;
}

export async function getResultByOrderId(
  orderId: string,
): Promise<Result | null> {
  await delay(300);
  const results = resultsData as Result[];
  return results.find((result) => result.orderId === orderId) || null;
}

export async function getResultsByOrderId(orderId: string): Promise<Result[]> {
  await delay(300);
  const results = resultsData as Result[];
  return results.filter((result) => result.orderId === orderId);
}

export async function createOrder(orderData: Partial<Order>): Promise<Order> {
  await delay(500);
  const newOrder: Order = {
    id: `order-${Date.now()}`,
    userId: orderData.userId || "user-1",
    tests: orderData.tests || [],
    status: "pending",
    totalAmount: orderData.totalAmount || 0,
    createdAt: new Date().toISOString(),
    ...orderData,
  } as Order;

  // Persist to mock dataset so webhooks can reconcile against it during local testing
  try {
    const orders = ordersData as Order[];
    orders.push(newOrder);
  } catch (err) {
    // ignore - read-only environment
  }

  return newOrder;
}

export async function updateOrderById(
  orderId: string,
  updates: Partial<Order>,
): Promise<Order | null> {
  await delay(200);
  const orders = ordersData as Order[];
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) return null;

  const updated: Order = {
    ...orders[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Mutate the in-memory mock dataset so subsequent reads reflect the change
  orders[idx] = updated;

  return updated;
}

export async function validatePromoCode(
  code: string,
): Promise<{ valid: boolean; discount: number }> {
  await delay(400);
  const promoCode = (promoCodesData as PromoCode[]).find(
    (pc) => pc.code.toUpperCase() === code.toUpperCase() && pc.enabled,
  );

  if (!promoCode) {
    return { valid: false, discount: 0 };
  }

  // Check if promo code is still valid
  const now = new Date();
  const validFrom = new Date(promoCode.validFrom);
  const validUntil = new Date(promoCode.validUntil);

  if (now < validFrom || now > validUntil) {
    return { valid: false, discount: 0 };
  }

  // Check usage limit
  if (
    promoCode.usageLimit &&
    promoCode.usageCount &&
    promoCode.usageCount >= promoCode.usageLimit
  ) {
    return { valid: false, discount: 0 };
  }

  const discount =
    promoCode.discountType === "percentage"
      ? promoCode.discountValue / 100
      : promoCode.discountValue;

  return { valid: true, discount };
}

// Panel CRUD functions - Note: These are mock functions for development
// In production, use the server actions from app/actions/panels.ts instead
export async function getAllPanels(): Promise<Panel[]> {
  await delay(300);
  // Mock data for development - prefer using getPanels() from server actions
  return [];
}

export async function getPanelById(id: string): Promise<Panel | null> {
  await delay(200);
  // Use getPanelById() from server actions instead
  return null;
}

export async function createPanel(panelData: Partial<Panel>): Promise<Panel> {
  await delay(500);
  // Use createPanel() from server actions instead
  throw new Error("Use createPanel from app/actions/panels.ts");
}

export async function updatePanel(
  id: string,
  panelData: Partial<Panel>,
): Promise<Panel> {
  await delay(500);
  // Use updatePanel() from server actions instead
  throw new Error("Use updatePanel from app/actions/panels.ts");
}

export async function deletePanel(id: string): Promise<void> {
  await delay(500);
  // In real app, would call API to delete
}

// PromoCode CRUD functions
export async function getAllPromoCodes(): Promise<PromoCode[]> {
  await delay(300);
  return promoCodesData as PromoCode[];
}

export async function getPromoCodeById(id: string): Promise<PromoCode | null> {
  await delay(200);
  const promoCodes = promoCodesData as PromoCode[];
  return promoCodes.find((pc) => pc.id === id) || null;
}

export async function createPromoCode(
  promoCodeData: Partial<PromoCode>,
): Promise<PromoCode> {
  await delay(500);
  const newPromoCode: PromoCode = {
    id: `promo-${Date.now()}`,
    code: promoCodeData.code || "",
    description: promoCodeData.description,
    discountType: promoCodeData.discountType || "percentage",
    discountValue: promoCodeData.discountValue || 0,
    minPurchaseAmount: promoCodeData.minPurchaseAmount,
    maxDiscountAmount: promoCodeData.maxDiscountAmount,
    validFrom: promoCodeData.validFrom || new Date().toISOString(),
    validUntil: promoCodeData.validUntil || new Date().toISOString(),
    usageLimit: promoCodeData.usageLimit,
    usageCount: promoCodeData.usageCount || 0,
    enabled: promoCodeData.enabled !== undefined ? promoCodeData.enabled : true,
    applicableTo: promoCodeData.applicableTo || "all",
    ...promoCodeData,
  } as PromoCode;

  return newPromoCode;
}

export async function updatePromoCode(
  id: string,
  promoCodeData: Partial<PromoCode>,
): Promise<PromoCode> {
  await delay(500);
  const promoCodes = promoCodesData as PromoCode[];
  const existingPromoCode = promoCodes.find((pc) => pc.id === id);
  if (!existingPromoCode) {
    throw new Error("Promo code not found");
  }

  return { ...existingPromoCode, ...promoCodeData } as PromoCode;
}

export async function deletePromoCode(id: string): Promise<void> {
  await delay(500);
  // In real app, would call API to delete
}

// Test CRUD functions (enhanced)
export async function createTest(testData: Partial<Test>): Promise<Test> {
  await delay(500);
  const newTest: Test = {
    id: `test-${Date.now()}`,
    testName: testData.testName || "",
    description: testData.description || "",
    category: testData.category || "general",
    price: testData.price || 0,
    cptCodes: testData.cptCodes || [],
    labCode: testData.labCode || "",
    labName: testData.labName || "CPL",
    turnaround: testData.turnaround || 1,
    specimenType: testData.specimenType || "Blood",
    preparation: testData.preparation,
    keywords: testData.keywords,
    enabled: testData.enabled !== undefined ? testData.enabled : true,
    ...testData,
  } as Test;

  return newTest;
}

export async function updateTest(
  id: string,
  testData: Partial<Test>,
): Promise<Test> {
  await delay(500);
  const tests = testsData as Test[];
  const existingTest = tests.find((t) => t.id === id);
  if (!existingTest) {
    throw new Error("Test not found");
  }

  return { ...existingTest, ...testData } as Test;
}

export async function deleteTest(id: string): Promise<void> {
  await delay(500);
  // In real app, would call API to delete
}

// User CRUD functions
import { clientFetch, getApiUrl } from "./api-client";

interface GetUsersParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface UsersPaginatedResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getAllUsers(
  params?: GetUsersParams,
): Promise<UsersPaginatedResponse> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
  if (params?.role) queryParams.append("role", params.role);
  if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

  const url = getApiUrl(`/users?${queryParams.toString()}`);
  const response = await clientFetch(url);

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Failed to fetch users" }));
    throw new Error(errorData.message || "Failed to fetch users");
  }

  const result = await response.json();
  return {
    data: result.data || [],
    meta: result.meta || { total: 0, page: 1, limit: 10, totalPages: 0 },
  };
}

export async function getUserById(id: string): Promise<User | null> {
  const url = getApiUrl(`/users/${id}`);
  const response = await clientFetch(url);

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Failed to fetch user" }));
    return null;
  }

  const result = await response.json();
  return result.data || null;
}

export async function createUser(
  userData: Partial<User> & { password?: string },
): Promise<User> {
  const url = getApiUrl("/users");
  const response = await clientFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: userData.email,
      password: userData.password || "TempPass123!",
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phone || userData.phoneNumber,
      gender: userData.gender,
      bio: userData.bio,
      dateOfBirth: userData.dateOfBirth,
      address: userData.address,
      bloodType: userData.bloodType,
      allergies: userData.allergies,
      medicalConditions: userData.medicalConditions,
      medications: userData.medications,
      emergencyContactName: userData.emergencyContactName,
      emergencyContactPhone: userData.emergencyContactPhone,
      profileImage: userData.profileImage,
      isVerified: userData.isVerified,
      status: userData.status || "ACTIVE",
      role: userData.role?.toUpperCase() || "CUSTOMER",
    }),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Failed to create user" }));
    throw new Error(errorData.message || "Failed to create user");
  }

  const result = await response.json();
  return result.data;
}

export async function updateUser(
  id: string,
  userData: Partial<User>,
): Promise<User> {
  const url = getApiUrl(`/users/${id}`);
  const response = await clientFetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phone || userData.phoneNumber,
      gender: userData.gender,
      bio: userData.bio,
      dateOfBirth: userData.dateOfBirth,
      address: userData.address,
      bloodType: userData.bloodType,
      allergies: userData.allergies,
      medicalConditions: userData.medicalConditions,
      medications: userData.medications,
      emergencyContactName: userData.emergencyContactName,
      emergencyContactPhone: userData.emergencyContactPhone,
      profileImage: userData.profileImage,
      isVerified: userData.isVerified,
      status: userData.status,
      role: userData.role?.toUpperCase(),
      password: userData.password,
    }),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Failed to update user" }));
    throw new Error(errorData.message || "Failed to update user");
  }

  const result = await response.json();
  return result.data;
}

export async function deleteUser(id: string): Promise<void> {
  const url = getApiUrl(`/users/${id}`);
  const response = await clientFetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Failed to delete user" }));
    throw new Error(errorData.message || "Failed to delete user");
  }
}

// Order Management functions
export async function getAllOrders(): Promise<Order[]> {
  await delay(300);
  return ordersData as Order[];
}

export async function updateOrder(
  id: string,
  orderData: Partial<Order>,
): Promise<Order> {
  await delay(500);
  const orders = ordersData as Order[];
  const existingOrder = orders.find((o) => o.id === id);
  if (!existingOrder) {
    throw new Error("Order not found");
  }

  return {
    ...existingOrder,
    ...orderData,
    updatedAt: new Date().toISOString(),
  } as Order;
}

export async function deleteOrder(id: string): Promise<void> {
  await delay(500);
  // In real app, would call API to delete
}
