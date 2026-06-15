# Storage Audit Plan

Supabase Storage likely contains orphaned thumbnails from the 114 deleted themes.

Recommendation: Run an automated script to list all files in the `theme-thumbnails` bucket, cross-reference them with the 6 retained themes, and delete the rest.