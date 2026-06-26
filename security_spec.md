# Security Specification

## Data Invariants
- `hospital_system_notifications`: Notifications must be created by the system or authorized users. Users can only read notifications where `userId` is `all` or their own `uid`, or `role` matches their role.

## Dirty Dozen Payloads (Examples)
1. Unauthorized User Creating Notification: `{ "userId": "user-A", "role": "admin", "titleEn": "Attack", "messageEn": "Hacked", "type": "critical" }` (Should fail for non-admins)

## Rules Test (firestore.rules.test.ts placeholder - logic defined in rules)
- Need to ensure only authorized users can read their own or public notifications.
