# Security Audit

- Environment variables: Secure (Supabase URL/Key).
- Upload system: Requires strict MIME-type validation to prevent malicious file uploads on RSVP attachments.
- RLS (Row Level Security): Must ensure users can only edit their own orders.

Security Score: 85/100.