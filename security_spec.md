# Security Specification - Kayan Clinical Quality Portal

## 1. Data Invariants
- A `SavedRecord` must have a `staffId` matching the authenticated user's UID (unless admin).
- A `RosterWish` must have an `employeeId` matching the authenticated user's UID.
- `AppUser` documents in `hospital_staff_registry` can only be created by the user themselves (initial registration) with a 'pending' status, but only admins can approve or change roles.
- `SystemLog` and `AuditLog` are append-only for users; only admins can view or manage them.
- Access to sensitive clinical data is generally restricted to active staff members.

## 2. The "Dirty Dozen" Payloads
1. **Identity Spoofing**: Attempt to create a `SavedRecord` with a `staffId` belonging to another user.
2. **Privilege Escalation**: Attempt to update own `AppUser` document to set `role` to 'admin'.
3. **Ghost Update**: Attempt to update a `SavedRecord` with an extra field `isApproved: true` not in schema.
4. **ID Poisoning**: Attempt to create a document with a 2KB long junk string as ID.
5. **PII Leak**: Attempt to read the entire `hospital_staff_registry` collection as a non-authenticated user.
6. **State Shortcut**: Attempt to update a `RosterWish` status from 'pending' to 'approved' as a regular staff member.
7. **Orphaned Write**: Attempt to create a `RosterWish` for a non-existent dayKey.
8. **Resource Exhaustion**: Attempt to write a 1MB string into a `notes` field.
9. **Timestamp Manipulation**: Attempt to set a future `createdAt` timestamp manually.
10. **Admin Bypass**: Attempt to delete an `AuditLog` as a regular user.
11. **Cross-Tenant Access**: (If multi-tenant) Attempt to read records from another department/organization.
12. **Unverified Write**: Attempt to write data while `email_verified` is false.

## 3. Data Relationships
- Users (`hospital_staff_registry`) define roles and permissions.
- Clinical records and audits belong to the hospital and are authored by staff.
- Notifications are targeted at specific users or departments.
