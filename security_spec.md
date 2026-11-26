# Firestore Security Specification — Harmonia Student House Jatinangor

## 1. Data Invariants
1. **Atomic Booking & Unit Lock**: A `bookings/{bookingId}` document MUST atomically correspond to a `unit_reservations/{unitCode}` lock created in the same batch (`existsAfter` + `getAfter` cross-check on `bookingId`, `unitCode`, and actor ID).
2. **PII Isolation**: `unit_reservations/{unitCode}` contains zero PII (no `fullName`, `whatsapp`, `email`), allowing public read of unit availability on the landing page siteplan. `bookings/{bookingId}` contains investor PII and read/list/update/delete access is strictly restricted to the verified document owner (`userId == request.auth.uid`) or verified admin (`el.property76@gmail.com` or `/admins/{uid}`).
3. **No Overwrite of Reserved Units**: `unit_reservations/{unitCode}` only permits `create` for unbooked units; updates and deletes are strictly restricted to admin (or verified owner cancellation).
4. **Strict Timestamps**: `createdAt` and `updatedAt` must equal `request.time`.
5. **Terminal State Lock**: Once a booking reaches `status == 'cancelled'`, no further client updates are permitted.

## 2. Adversarial Payloads (Must Return PERMISSION_DENIED)
1. **Unverified Email Spoof**: Create `/bookings/b1` with signed-in `email_verified: false` or spoofed `userId`.
2. **Identity Spoofing**: Create `/bookings/b1` as guest using a non-`guest_*` `userId` or mismatched `bookedByUid`.
3. **Shadow / Ghost Field Injection**: Create `/bookings/b1` containing extra key `isAdmin: true`.
4. **Status Skipping**: Create `/bookings/b1` with `status: 'confirmed'` as a non-admin user.
5. **Non-Atomic Orphaned Booking**: Create `/bookings/b1` without creating `/unit_reservations/{unitCode}` in the same batch.
6. **ID Poisoning**: Create `/bookings/invalid id with spaces` or 2KB ID string.
7. **Invalid Unit Code**: Create `/bookings/b1` with `unitCode: 'Z999'` outside the 107 siteplan units.
8. **Client Timestamp Forgery**: Create `/bookings/b1` with `createdAt` != `request.time`.
9. **PII Blanket Read / Scraping**: `list` or `get` on `/bookings` by an unauthenticated user or non-owner non-admin user.
10. **Terminal State Mutation**: Update a `/bookings/b1` document whose existing `status` is `'cancelled'`.
11. **PII Injection on Public Unit Reservation**: Create `/unit_reservations/A1` with extra `email` or `fullName` field.
12. **Reservation Hijack**: Update an existing `/unit_reservations/A1` as a non-admin user.
