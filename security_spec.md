# Security Specification & Test Matrix

## 1. Data Invariants
- `projects`: Accessible for reading publicly if `public == true` or `status == "published"`. All writes (create, update, delete) allowed for admin or general operational synchronization.
- `bookings`: Anyone (public clients on any device) can create a new booking request. List/read/update/delete reserved for viewing or managing bookings.
- `messages`: Anyone (public clients on any device) can submit a contact message. List/read/update/delete reserved for viewing or managing messages.
- `categories`: Public read access for browsing categories. Write access for managing categories.
- `testimonials`: Public read access.
- `content`: Public read access for main website settings.

## 2. Dirty Dozen Security Payloads Test Matrix
1. Identity Spoofing in Projects
2. Malformed Document IDs
3. Denial of Wallet via Unbounded Payload Strings (>1MB)
4. Unverified Role Escalation
5. Unauthenticated Booking Overwrite
6. Deleting System Content without Authority
7. Invalid Status Enums Injection
8. Malformed Email Injection in Bookings
9. Missing Required Fields in Project Creation
10. Unbounded Array Injection in Tags
11. PII Harvesting via Unrestricted List Queries
12. Timestamp Tampering
