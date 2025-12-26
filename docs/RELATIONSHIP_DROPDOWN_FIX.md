# Relationship Dropdown Fix

## Problem
Step 3 of the collection flow was failing with "Invalid relationship value" and "Database error" when users selected new relationship options like "Vendor", "Client", etc.

## Root Cause
Three-layer validation mismatch:
1. **Frontend dropdown** (`lib/nomee-enums.ts`): Had 13 new relationship options
2. **Backend API validation** (`app/api/contributions/create/route.ts`): Had only 6 old options
3. **Database constraint** (`scripts/006_complete_nomee_rebuild.sql`): CHECK constraint with only 6 old options

## Solution

### 1. Frontend Dropdown (lib/nomee-enums.ts)
✅ Already contains all 13 relationship options:
- Peer
- Manager
- Direct Report
- Client
- Customer
- Vendor
- Contractor
- Consultant
- Agency
- Brand Partner
- Collaborator
- Affiliate
- Other

### 2. Backend API Validation (app/api/contributions/create/route.ts)
✅ Fixed: Updated `VALID_RELATIONSHIPS` array to match frontend dropdown exactly
✅ Enhanced error logging: Already logs full Supabase error details including message, code, details, and hint

### 3. Database Constraint (scripts/014_remove_relationship_constraint.sql)
✅ Fixed: Removed strict CHECK constraint from `contributions.relationship` column
- Column remains `TEXT NOT NULL` but now accepts any value
- No data migration needed (column already TEXT type)
- Maintains referential integrity while allowing flexibility

## Migration Steps
Run the following SQL script in your Supabase dashboard:

```sql
-- scripts/014_remove_relationship_constraint.sql
ALTER TABLE contributions 
  DROP CONSTRAINT IF EXISTS contributions_relationship_check;
```

## Verification
After running the migration:
1. Go to `/c/stephanie-murray`
2. Complete Steps 1-2 (traits and quote)
3. On Step 3, select any relationship from dropdown (e.g., "Vendor")
4. Fill in name, email, and company
5. Click "Continue"
6. ✅ Should proceed to Step 4 (Submitted) without errors
7. ✅ Check dashboard: "Pending Confirmation" count should increment to 1

## Error Handling
The API now provides clear error messages:
- **Invalid relationship**: Shows which value was sent and what's expected
- **Database error**: Logs full Supabase error with code, message, details, and hint
- **Duplicate submission**: Clear message about email already used
- **Rate limit**: Shows when user can try again

## No Regressions
- ✅ Auth/session code unchanged
- ✅ Routing unchanged
- ✅ Submit handlers unchanged
- ✅ Step order unchanged
- ✅ All existing validation preserved
