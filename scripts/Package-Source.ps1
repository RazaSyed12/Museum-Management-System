param([string]$OutputName = 'Museum-Management-System-source.zip')
$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Split-Path -Parent $PSScriptRoot))
if ([IO.Path]::GetFileName($OutputName) -ne $OutputName -or
    [IO.Path]::GetExtension($OutputName) -ne '.zip') {
    throw 'OutputName must be a ZIP filename without a directory.'
}
$archivePath = Join-Path $projectRoot $OutputName
if (Test-Path -LiteralPath $archivePath) {
    throw "Archive already exists: $archivePath. Choose a different OutputName."
}
$excludedDirectories = @('.git', 'node_modules', '.next', 'dist', 'build', 'out',
    'coverage', 'test-results', '.temp', '.branches', '.vercel', '.agents', '.codex')
function Get-SourceFiles([string]$Directory) {
    foreach ($entry in Get-ChildItem -Force -LiteralPath $Directory) {
        if ($entry.Attributes -band [IO.FileAttributes]::ReparsePoint) { continue }
        if ($entry.PSIsContainer) {
            if ($entry.Name -notin $excludedDirectories) { Get-SourceFiles $entry.FullName }
        } elseif (($entry.Name -notlike '.env*' -or $entry.Name -eq '.env.example') -and
            $entry.Name -notmatch '(?i)(\.log.*|\.tsbuildinfo|\.zip|\.bak|\.backup|\.backup\.local)$' -and
            $entry.Name -notin @('.DS_Store', 'Thumbs.db')) {
            $entry
        }
    }
}
$files = @(Get-SourceFiles $projectRoot)
$archive = [IO.Compression.ZipFile]::Open($archivePath, [IO.Compression.ZipArchiveMode]::Create)
try {
    foreach ($file in $files) {
        $relative = [IO.Path]::GetRelativePath($projectRoot, $file.FullName).Replace('\', '/')
        [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $file.FullName,
            "Museum-Management-System/$relative", [IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
} finally {
    $archive.Dispose()
}
$size = [math]::Round((Get-Item -LiteralPath $archivePath).Length / 1MB, 2)
Write-Output "Created $archivePath ($size MB, $($files.Count) files)."
