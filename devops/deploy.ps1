<#
.SYNOPSIS
    Builds the site and deploys it to production (S3 + CloudFront).

.DESCRIPTION
    1. Reads the target bucket and CloudFront distribution from the local Terraform state.
    2. Runs npm ci, lint and a prod build (static export to ./out).
    3. Asks for confirmation, uploads ./out to S3 and invalidates the CloudFront cache.

    Uses the default AWS credential chain (default CLI profile or AWS_* environment variables).
    See "Production deploy (AWS)" in CLAUDE.md.

.PARAMETER Force
    Skip the confirmation prompt.

.EXAMPLE
    ./devops/deploy.ps1
#>
[CmdletBinding()]
param(
    [switch]$Force
)

$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent $PSScriptRoot
$TerraformDir = Join-Path $PSScriptRoot "terraform"
$OutDir = Join-Path $RepoRoot "out"

# Runs a native command and stops the script if it exits with a non-zero code.
function Invoke-Native {
    param([Parameter(Mandatory)][string]$Command, [string[]]$Arguments = @())
    & $Command @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "'$Command $($Arguments -join ' ')' failed with exit code $LASTEXITCODE."
    }
}

function Write-Step([string]$Message) {
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

# --- Preflight --------------------------------------------------------------------------------

Write-Step "Checking prerequisites"
foreach ($tool in "aws", "npm", "terraform") {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
        throw "'$tool' was not found on PATH."
    }
}

if (Get-Command git -ErrorAction SilentlyContinue) {
    $dirty = git -C $RepoRoot status --porcelain
    if ($dirty) {
        Write-Warning "There are uncommitted changes; they will be included in this deploy."
    }
}

$Bucket = (& terraform "-chdir=$TerraformDir" output -raw bucket_name)
if ($LASTEXITCODE -ne 0 -or -not $Bucket) {
    throw "Could not read 'bucket_name' from Terraform. Has the infrastructure been applied (see CLAUDE.md)?"
}
$DistributionId = (& terraform "-chdir=$TerraformDir" output -raw distribution_id)
if ($LASTEXITCODE -ne 0 -or -not $DistributionId) {
    throw "Could not read 'distribution_id' from Terraform. Has the infrastructure been applied (see CLAUDE.md)?"
}

# --- Build ------------------------------------------------------------------------------------

Push-Location $RepoRoot
$previousEnvironment = $env:NEXT_PUBLIC_ENVIRONMENT
try {
    Write-Step "Installing dependencies"
    Invoke-Native npm "ci"

    Write-Step "Linting"
    Invoke-Native npm "run", "lint"

    Write-Step "Building (NEXT_PUBLIC_ENVIRONMENT=prod)"
    $env:NEXT_PUBLIC_ENVIRONMENT = "prod"
    Invoke-Native npm "run", "build"
}
finally {
    $env:NEXT_PUBLIC_ENVIRONMENT = $previousEnvironment
    Pop-Location
}

# --- Confirm ----------------------------------------------------------------------------------

Write-Host ""
Write-Host "Bucket:       s3://$Bucket"
Write-Host "Distribution: $DistributionId"
if (-not $Force) {
    $answer = Read-Host "Deploy to PRODUCTION? (y/N)"
    if ($answer -notmatch "^(y|yes)$") {
        Write-Host "Aborted."
        exit 1
    }
}

# --- Upload -----------------------------------------------------------------------------------

# Hashed build assets never change under the same name, so browsers may cache them forever.
Write-Step "Uploading _next/static (immutable)"
Invoke-Native aws "s3", "sync", (Join-Path $OutDir "_next/static"), "s3://$Bucket/_next/static", `
    "--delete", "--cache-control", "public, max-age=31536000, immutable"

# Everything else (HTML, robots.txt, sitemap.xml, images, videos) keeps a short browser cache.
Write-Step "Uploading everything else"
Invoke-Native aws "s3", "sync", $OutDir, "s3://$Bucket", `
    "--delete", "--exclude", "_next/static/*", "--cache-control", "public, max-age=300"

# The generated OG image has no file extension, so the CLI can't guess its Content-Type and some
# link-preview crawlers (e.g. WhatsApp) ignore it. Re-upload it with the right type.
$ogImage = Join-Path $OutDir "opengraph-image"
if (Test-Path $ogImage) {
    Write-Step "Fixing Content-Type of opengraph-image"
    Invoke-Native aws "s3", "cp", $ogImage, "s3://$Bucket/opengraph-image", `
        "--content-type", "image/png", "--cache-control", "public, max-age=300"
}

# --- Invalidate -------------------------------------------------------------------------------

Write-Step "Invalidating CloudFront cache"
$invalidationId = (& aws cloudfront create-invalidation --distribution-id $DistributionId --paths "/*" `
        --query "Invalidation.Id" --output text)
if ($LASTEXITCODE -ne 0) {
    throw "CloudFront invalidation failed."
}

Write-Host ""
Write-Host "Deployed. Invalidation $invalidationId is in progress (usually takes a minute or two)." -ForegroundColor Green
Write-Host "https://aviveditorial.com.br"
