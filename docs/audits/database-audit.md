# FiveInvitation Database Audit

## Objective

Perform a complete database and API audit.

Database:

Supabase PostgreSQL

Focus:

* Data integrity
* Query correctness
* API correctness
* Security
* Performance
* Scalability

Do not stop at analysis.

Provide detailed findings.

---

# PHASE 1 - DATABASE STRUCTURE

Analyze all tables.

Verify:

* Primary Keys
* Foreign Keys
* Indexes
* Constraints
* Relationships

Identify:

* Missing indexes
* Missing foreign keys
* Duplicate fields
* Unused columns
* Redundant tables

Generate ERD summary.

---

# PHASE 2 - DATA INTEGRITY

Verify:

* Referential integrity
* Theme references
* Invitation references
* User references
* Asset references

Identify:

* Orphan records
* Duplicate records
* Invalid references
* Null values where not expected

Generate cleanup recommendations.

---

# PHASE 3 - API AUDIT

Inspect all Supabase calls.

Analyze:

* Select queries
* Insert queries
* Update queries
* Delete queries
* Upsert queries

Verify:

* Correct table usage
* Correct field mapping
* Error handling
* Retry handling

Identify:

* Broken API calls
* Missing validation
* Unused queries
* Duplicate requests

---

# PHASE 4 - QUERY PERFORMANCE

Analyze all queries.

Identify:

* Full table scans
* Expensive joins
* Repeated queries
* N+1 query patterns
* Unnecessary fetches

Verify:

* Pagination
* Limits
* Filters

Generate optimization recommendations.

---

# PHASE 5 - STORAGE AUDIT

Analyze:

* Thumbnail uploads
* Gallery uploads
* Cover uploads
* Music uploads

Verify:

* Correct bucket usage
* Public URLs
* File references

Identify:

* Missing files
* Broken URLs
* Orphan storage files

---

# PHASE 6 - SECURITY AUDIT

Review:

* RLS Policies
* Public access
* Auth protection
* Admin protection

Verify:

* Anonymous access restrictions
* Upload restrictions
* Update restrictions
* Delete restrictions

Classify findings:

Critical
High
Medium
Low

---

# PHASE 7 - TRANSACTION FLOW AUDIT

Trace:

Create Invitation
↓
Save Database
↓
Upload Assets
↓
Generate Invitation
↓
Render Invitation

Verify:

* Data saved correctly
* Data loaded correctly
* Data rendered correctly

Identify mapping issues.

---

# PHASE 8 - ERROR HANDLING

Verify:

* try/catch usage
* Supabase error handling
* Upload failures
* Database failures

Ensure:

* User-friendly messages
* Logging exists
* Failures handled gracefully

---

# PHASE 9 - SCALABILITY REVIEW

Estimate:

100 invitations
1,000 invitations
10,000 invitations
100,000 invitations

Identify bottlenecks.

Review:

* Query strategy
* Storage strategy
* Asset loading

---

# PHASE 10 - FINAL REPORT

Generate:

Database Health Score
API Quality Score
Query Performance Score
Storage Score
Security Score
Scalability Score

For every finding provide:

* Description
* Impact
* Risk Level
* Recommended Fix

Finally answer:

1. Is the database design production-ready?
2. Are API calls implemented correctly?
3. Are queries efficient?
4. Are there security risks?
5. Will the application scale?
6. What should be fixed first?

Be brutally honest.
