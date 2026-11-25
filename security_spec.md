# Firestore Security Specification — Harmonia Student House Jatinangor

## 1. Data Invariants
1. **Atomic Booking & Unit Lock**: A `bookings/{bookingId}` document created by an authenticated, email-verified user MUST atomically correspond to a `unit_reservations/{unitCode}` lock created in the same batch (`existsAfter`).
2. **PII Isolation**: `unit_reservations/{unitCode}` contains zero PII (no `fullName`, `whatsapp`, `email`), allowing public read of unit availability on the landing page siteplan. `bookings/{bookingId}` contains investor PII and is strictly restricted to the document owner (`userId == request.auth.uid`) or a verified admin (`el.property76@gmail.com` or `/admins/{uid}`).
3. **Immutable Ownership & Identity**: `userId`, `unitCode`, `bookingCode`, and `createdAt` cannot be modified after creation.
4. **Strict Timestamps**: `createdAt` and `updatedAt` must equal `request.time`.
5. **Terminal State Lock**: Once a booking reaches `status == 'cancelled'`, no further client updates are permitted.

## 2. The "Dirty Dozen" Adversarial Payloads (Must Return PERMISSION_DENIED)
1. **Unauthenticated Booking Create**: Create `/bookings/b1` with `request.auth == null`.
2. **Unverified Email Spoof**: Create `/bookings/b1` with `email_verified: false`.
3. **Identity Spoofing**: Create `/bookings/b1` where `userId != request.auth.uid`.
4. **Shadow / Ghost Field Injection**: Create `/bookings/b1` containing extra key `isAdmin: true`.
5. **Status Skipping**: Create `/bookings/b1` with `status: 'confirmed'` as a non-admin user.
6. **Non-Atomic Orphaned Booking**: Create `/bookings/b1` without creating `/unit_reservations/{unitCode}` in the same batch.
7. **ID Poisoning**: Create `/bookings/invalid id with spaces` or 2KB ID string.
8. **Invalid Unit Code**: Create `/bookings/b1` with `unitCode: 'Z999'` outside the 107 siteplan units.
9. **Client Timestamp Forgery**: Create `/bookings/b1` with `createdAt` != `request.time`.
10. **PII Blanket Read / Scraping**: `list` or `get` on `/bookings` by a signed-in non-owner non-admin user.
11. **Terminal State Mutation**: Update a `/bookings/b1` document whose existing `status` is `'cancelled'`.
12. **PII Injection on Public Unit Reservation**: Create `/unit_reservations/A1` with extra `email` or `fullName` field.
