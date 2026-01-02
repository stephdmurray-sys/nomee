# QA Checklist: Imported Feedback Upload Flow

## Purpose
Verify that the imported feedback upload flow works correctly in production.

## How to Test
Add `?debug=1` to the upload page URL to see the debug panel with real-time validation checks.

## Checklist

### 1. Profile Resolution
- [ ] Logged-in user has a `profile_id` resolved and shown in logs
- [ ] Profile ID appears in debug panel when `?debug=1` is active
- [ ] If no profile exists, user is redirected to onboarding (does not crash)

### 2. Source Type Mapping
- [ ] Each dropdown choice maps to a valid backend enum:
  - Email → `Email`
  - LinkedIn → `LinkedIn`
  - Slack → `DM`
  - Microsoft Teams → `DM`
  - Text/SMS → `DM`
  - Social DM (Instagram/Facebook/TikTok) → `DM`
  - Review site (Google/Yelp) → `Review`
  - Other → `Other`
- [ ] Debug panel confirms "All 8 options map correctly"

### 3. Source Platform Preservation
- [ ] When user selects "Slack", the UI key "slack" is stored in component state
- [ ] The backend receives `sourceType: "DM"` (the valid enum)
- [ ] Source platform detail (e.g., "Slack" vs "Teams") is preserved in logs for future metadata

### 4. Upload Button State
- [ ] Upload button is **disabled** until a source is selected for each file
- [ ] Upload button shows "Upload N Files" when files are ready
- [ ] Upload button is disabled during upload (shows "Uploading..." with spinner)
- [ ] Upload button shows "All Saved" after successful uploads

### 5. Network Request Payload
- [ ] API payload includes only real schema fields:
  - `imageUrl` (string)
  - `imagePath` (string)
  - `profileId` (UUID)
  - `sourceType` (enum: Email | LinkedIn | DM | Review | Other)
- [ ] No invalid fields like `sourceUiKey`, `extraction_status`, `raw_image_path` are sent

### 6. Database Row Creation
- [ ] After upload, a row appears in `imported_feedback` table with:
  - Correct `profile_id`
  - Correct `raw_image_url`
  - Valid `source_type` enum
  - Proper default values for other columns
- [ ] Row can be queried in Supabase dashboard or via SQL

### 7. Error Handling
- [ ] Errors are **not swallowed**
- [ ] Console shows `[IMPORT_UPLOAD]` logs with full error details
- [ ] Server logs show structured error responses with `code`, `message`, `details`
- [ ] User sees friendly error messages (not raw database errors)
- [ ] Errors like "Profile not found" or "Invalid source" display correctly

### 8. Retry Functionality
- [ ] After an intentional failure (e.g., wrong source), clicking "Retry" works
- [ ] Retry resets the file status from `error_upload` to `pending`
- [ ] Retry re-uploads the file and creates a new database record
- [ ] No duplicate records are created on retry

### 9. Remove Functionality
- [ ] Clicking "Remove" on a pending file removes it from the queue
- [ ] Clicking "Remove" on a failed upload removes it from the UI
- [ ] No partial database records are left behind after removal
- [ ] File preview is properly cleaned up (no memory leaks)

### 10. End-to-End Flow
- [ ] User selects source → uploads file → sees "Saved" status → can review in dashboard
- [ ] Multiple files can be uploaded in sequence
- [ ] All files process successfully without conflicts
- [ ] User can navigate to review page and see extracted data

## Debug Commands

### Check Profile ID in Console
```javascript
// Open browser console on upload page
// Look for: [IMPORT_UPLOAD] Starting upload: { profileId: "..." }
```

### Check Enum Mapping
```javascript
// Debug panel shows: "All 8 options map correctly"
// Console logs show: backendEnum: "DM" for Slack/Teams/Text/Social DM
```

### Verify Payload Structure
```javascript
// Console shows: [IMPORT_UPLOAD] Sending payload to create-record:
// { imageUrl: "...", imagePath: "...", profileId: "...", sourceType: "DM" }
```

### Check Database After Upload
```sql
-- Run in Supabase SQL editor
SELECT id, profile_id, source_type, raw_image_url, created_at
FROM imported_feedback
ORDER BY created_at DESC
LIMIT 5;
```

## Expected Results

All checklist items should pass. If any fail:
1. Check browser console for `[IMPORT_UPLOAD]` error logs
2. Check server logs for structured error responses
3. Verify database schema matches expected fields
4. Confirm environment variables are set correctly

## Notes

- The debug panel appears only when `?debug=1` is in the URL
- All uploads log detailed information with `[IMPORT_UPLOAD]` prefix
- Source platform details (Slack vs Teams) are preserved in logs for future metadata expansion
- The system intentionally groups messaging platforms (Slack/Teams/Text/Social) under the "DM" enum
