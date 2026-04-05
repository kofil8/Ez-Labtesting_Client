/\*\*

- API Contracts Documentation
-
- This folder defines the shape of data exchanged between frontend and backend.
- These are TypeScript interfaces and types - NO implementation logic.
-
- ✅ What's included:
- - Type definitions for requests and responses
- - Enum values for status and error codes
- - Generic API client for making typed requests
-
- ❌ What's NOT included:
- - Stripe API calls
- - Database queries
- - Business logic
- - Authentication logic
-
- ## File Structure
-
- ├── order.contract.ts Order creation interfaces
- ├── payment.contract.ts Payment intent interfaces
- ├── order-status.contract.ts Order status tracking interfaces
- ├── error.contract.ts Standard error response format
- ├── endpoints.ts API endpoint URLs (single source of truth)
- ├── index.ts Export point (import from here)
- └── README.md This file
-
- ## Usage in Frontend
-
- Instead of importing individual files, import from index:
-
- ```typescript

  ```
- import {
- CreateOrderRequest,
- CreatePaymentIntentRequest,
- OrderStatusResponse,
- ApiErrorResponse,
- API_ENDPOINTS,
- } from "@/lib/api-contracts";
- ```

  ```
-
- ## API Flow
-
- ```

  ```
- 1.  User fills checkout form
- └─> Frontend: CreateOrderRequest
-
- 2.  POST /api/orders/create
- └─> Backend: CreateOrderResponse (with orderId)
-
- 3.  Frontend creates Stripe payment intent
- └─> POST /api/payments/create-intent
- └─> Backend: CreatePaymentIntentResponse (with clientSecret)
-
- 4.  Frontend confirms payment with Stripe
- └─> POST /api/payments/confirm
- └─> Backend: ConfirmPaymentResponse
-
- 5.  Frontend checks order status
- └─> GET /api/orders/{orderId}/status
- └─> Backend: OrderStatusResponse
- ```

  ```
-
- ## Order Status Lifecycle
-
- ```

  ```
- PENDING_PAYMENT
- ↓ (user pays)
- PAID
- ↓ (order sent to lab)
- LAB_ORDER_PLACED
- ↓ (lab processing)
- IN_PROCESSING
- ↓ (results ready)
- COMPLETED
-
- (at any point) → FAILED or CANCELLED
- ```

  ```
-
- ## Error Handling
-
- All endpoints return ApiErrorResponse on failure:
-
- ```typescript

  ```
- {
- code: "PAYMENT_FAILED",
- message: "User-friendly error message",
- details: { stripe_error: "..." },
- timestamp: "2026-02-01T10:30:00Z",
- requestId: "req_12345"
- }
- ```

  ```
-
- ## Integration Points
-
- ### Frontend Pages
- - `/checkout` - Uses CreateOrderRequest
- - `/payment` - Uses CreatePaymentIntentRequest, ConfirmPaymentRequest
- - `/order-status` - Uses OrderStatusResponse
-
- ### Backend Endpoints (to be implemented)
- - POST /api/orders/create
- - GET /api/orders/{orderId}/status
- - POST /api/payments/create-intent
- - POST /api/payments/confirm
-
- ## Backend Alignment
-
- Backend must implement these exact interfaces. They can add internal fields,
- but the contract responses must match these types.
-
- Use these contracts in:
- - Backend response DTO classes
- - Backend validation schemas
- - Documentation and API specs
-
- ## Future Expansion
-
- When adding Stripe or ACCESS Lab integration:
- 1.  Contracts stay in this folder (unchanged)
- 2.  Implementation lives in backend
- 3.  Frontend uses same types
      \*/
