# Security Specification: Premium APK Platform

## 1. Data Invariants
1. A user can only submit payment requests where `userId == request.auth.uid`.
2. A user can NEVER approve their own payment request or set `status: 'approved'`. Only verified administrators can approve payment requests.
3. Purchases/Entitlements cannot be created or modified by regular users. Only administrators can issue purchase entitlements upon verifying bKash/Nagad transactions.
4. Download history and favorites belong to the creating user (`userId == request.auth.uid`). Users can only query their own download history and favorites.
5. Reviews can only be created by signed-in users with `userId == request.auth.uid`.
6. Apps, categories, banners, settings, and ads can only be created, updated, or deleted by authorized administrators (`abnormaleditz80@gmail.com` or admin record).
7. Only published apps (`isPublished == true`) are readable by public visitors. Unpublished apps are strictly admin-only.
8. Sensitive payment request details can only be read by the submitting user and the administrator.
9. Transaction IDs must be unique across approved payment requests to prevent replay attacks.
10. Users cannot elevate their own role to 'admin' in `/users/{userId}`.

## 2. The "Dirty Dozen" Threat Payloads (Must be Denied)
1. User attempts to create an entitlement directly in `/purchases` without admin approval.
2. User submits a payment request with `status: 'approved'` to bypass manual Send Money check.
3. User attempts to update a pending payment request's status to `approved`.
4. User tries to view another user's payment request in `/paymentRequests/{otherId}`.
5. User tries to view another user's download history in `/downloadHistory/{otherId}`.
6. User modifies `/users/{userId}` with `role: 'admin'`.
7. User attempts to modify or delete an app record in `/apps/{appId}`.
8. User creates an app with `isPublished: true` directly.
9. User modifies site settings to change bKash/Nagad recipient numbers.
10. Unauthenticated user attempts to write reviews or submit download records.
11. User attempts to inject script tags into ads via direct write to `/ads/{adId}`.
12. Attacker injects 500KB payload into review comments or document paths exceeding size limits.
