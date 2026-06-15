$ErrorActionPreference = "Stop"

$baseDir = "E:\project bersama\fiveinvitation"

Write-Host "Starting Project Cleanup..."

# 1. Clean up Docs
$retainedDocs = @(
    "theme-spec.md",
    "final-architecture-report.md",
    "wedding-invitation-master-prompt.md", # Need to check if I can delete this? Yes, user said only keep 6.
    "TEST.md",
    "code-cleanup-report.md"
)
# Actually, it's safer to specify exactly what to delete based on the report.
$docsToDelete = @(
    "docs\architecture\TEST.md",
    "docs\architecture\wedding-invitation-master-prompt.md",
    "docs\architecture\final-architecture-report.md",
    "docs\audits\code-cleanup-report.md",
    "docs\audits\documentation-migration.md",
    "docs\audits\json-parsing-bug-report.md",
    "docs\audits\luxury01-10-structural-analysis.md",
    "docs\audits\project-inventory.md",
    "docs\audits\theme-animation-audit.md",
    "docs\audits\theme-integrity-audit.md",
    "docs\audits\theme-inventory.md",
    "docs\audits\theme-registry-audit.md",
    "docs\audits\theme-similarity-report.md",
    "docs\audits\theme-uniqueness-audit.md",
    "docs\audits\theme_audit_report.md",
    "docs\database\database-audit-report.md",
    "docs\database\database-audit.md",
    "docs\database\MYSQL_MIGRATION_GUIDE.md",
    "docs\database\theme-sync-audit.md",
    "docs\database\theme-sync-report.md",
    "docs\deployment\deployment-readiness-report.md",
    "docs\deployment\deployment-readiness.md",
    "docs\deployment\DEPLOYMENT.md",
    "docs\performance\performance-audit-report.md",
    "docs\themes\PANDUAN_TEMA.md",
    "docs\themes\theme-analysis.md",
    "docs\themes\theme-dna.md"
)

foreach ($doc in $docsToDelete) {
    $path = Join-Path $baseDir $doc
    if (Test-Path $path) {
        Remove-Item -Path $path -Force
        Write-Host "Deleted: $doc"
    }
}

# 2. Clean up Themes
$themesDir = Join-Path $baseDir "src\themes"

$retainedThemes = @(
    "Luxury01.tsx",
    "Floral01.tsx",
    "Minimal01.tsx",
    "Islamic01.tsx",
    "Dark01.tsx",
    "CinematicTheme.tsx",
    "registry.tsx",
    "index.tsx",
    "MasterTheme.tsx"
)

$allThemeFiles = Get-ChildItem -Path $themesDir -Recurse -Filter *.tsx

foreach ($file in $allThemeFiles) {
    if ($retainedThemes -notcontains $file.Name) {
        Remove-Item -Path $file.FullName -Force
        Write-Host "Deleted Theme: $($file.Name)"
    }
}

# 3. Delete dead folders and floating components
$deadFolders = @(
    "src\themes\Elegance"
)

foreach ($folder in $deadFolders) {
    $path = Join-Path $baseDir $folder
    if (Test-Path $path) {
        Remove-Item -Path $path -Recurse -Force
        Write-Host "Deleted Folder: $folder"
    }
}

Write-Host "Cleanup completed successfully!"
