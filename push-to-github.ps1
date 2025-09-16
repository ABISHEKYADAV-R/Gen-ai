Param(
  [string]$remoteUrl = ""
)

# Usage:
# 1) If you have GitHub CLI and want the script to create the repo automatically, leave $remoteUrl empty and ensure `gh` is logged in.
# 2) Or set $remoteUrl to "https://github.com/username/repo.git" before running.

Set-StrictMode -Version Latest

# ensure running in repository root
$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $root

# Initialize git repo if not present
if (-Not (Test-Path ".git")) {
  git init
  Write-Host "Initialized new git repository"
}

git add -A
git commit -m "chore: initial commit" -q 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "No changes to commit or commit failed (proceeding)..."
} else {
  Write-Host "Committed files"
}

if (-not [string]::IsNullOrWhiteSpace($remoteUrl)) {
  git remote remove origin 2>$null
  git remote add origin $remoteUrl
  Write-Host "Added remote origin: $remoteUrl"
} elseif (Get-Command gh -ErrorAction SilentlyContinue) {
  # create repo with GitHub CLI
  $repoName = Split-Path -Leaf (Get-Location)
  gh repo create $repoName --public --confirm
  $remoteUrl = (git remote get-url origin) 2>$null
  if (-not $remoteUrl) {
    Write-Host "Could not determine remote URL after gh repo create."
  } else {
    Write-Host "Created GitHub repo and set remote origin: $remoteUrl"
  }
} else {
  Write-Host "No remote provided and 'gh' not available. Please create a GitHub repo manually and set remoteUrl."
  Write-Host "Example: git remote add origin https://github.com/username/repo.git"
  exit 1
}

# Push to main (create branch if needed)
# prefer 'main'; adjust if you use 'master'
git branch --show-current 2>$null | Out-Null
$current = (git rev-parse --abbrev-ref HEAD) 2>$null
if (-not $current -or $current -eq 'HEAD') {
  git switch -c main
  Write-Host "Created and switched to branch 'main'"
}

git push -u origin main
if ($LASTEXITCODE -eq 0) {
  Write-Host "Pushed to origin main successfully."
} else {
  Write-Host "Push failed. Check remote URL and authentication."
}
