param(
  [switch]$SkipChecks
)

$ErrorActionPreference = 'Stop'

function Write-Note {
  param([string]$Message)
  Write-Host "[bootstrap] $Message"
}

function Test-Tool {
  param([string]$Name)
  return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Get-ToolPath {
  param([string[]]$Names)

  foreach ($name in $Names) {
    $command = Get-Command $name -ErrorAction SilentlyContinue
    if ($command -and $command.Path) {
      return $command.Path
    }
  }

  $roots = @(
    (Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages'),
    (Join-Path $env:LOCALAPPDATA 'Microsoft\WindowsApps'),
    (Join-Path $env:ProgramFiles 'Tesseract-OCR'),
    (Join-Path $env:ProgramFiles 'ffmpeg'),
    (Join-Path $env:ProgramFiles 'SQLite'),
    (Join-Path $env:ProgramFiles 'Python313')
  ) | Where-Object { $_ -and (Test-Path -LiteralPath $_) }

  foreach ($root in $roots) {
    foreach ($name in $Names) {
      $found = Get-ChildItem -LiteralPath $root -Recurse -Filter $name -ErrorAction SilentlyContinue | Select-Object -First 1
      if ($found) {
        return $found.FullName
      }
    }
  }

  return $null
}

function Install-WingetPackage {
  param([string]$Id)

  & winget install --id $Id --exact --accept-package-agreements --accept-source-agreements --disable-interactivity
  if ($LASTEXITCODE -ne 0) {
    $existing = winget list --id $Id --exact 2>$null
    if ($existing -match [regex]::Escape($Id)) {
      Write-Note "$Id already installed."
      return
    }
    throw "winget failed while installing $Id."
  }
}

function Install-ChocoPackage {
  param([string]$Id)

  & choco install $Id -y --no-progress
  if ($LASTEXITCODE -ne 0) {
    throw "choco failed while installing $Id."
  }
}

function Install-ManagedTool {
  param(
    [string]$Name,
    [string[]]$Commands,
    [string]$WingetId,
    [string]$ChocoId
  )

  $path = Get-ToolPath -Names $Commands
  if ($path) {
    Write-Note "$Name already present at $path"
    return
  }

  Write-Note "Installing $Name."

  if (Test-Tool 'winget') {
    Install-WingetPackage -Id $WingetId
  }
  elseif (Test-Tool 'choco') {
    Install-ChocoPackage -Id $ChocoId
  }
  else {
    throw "Neither winget nor choco is available. Install $Name manually, then rerun bootstrap."
  }

  $installedPath = Get-ToolPath -Names $Commands
  if ($installedPath) {
    Write-Note "$Name installed at $installedPath"
  }
  else {
    Write-Note "$Name install attempted, but executable was not found on PATH yet."
  }
}

function Install-ManagedTools {
  $tools = @(
    @{
      Name = 'Git'
      Commands = @('git.exe')
      WingetId = 'Git.Git'
      ChocoId = 'git'
    },
    @{
      Name = 'ripgrep'
      Commands = @('rg.exe')
      WingetId = 'BurntSushi.ripgrep.MSVC'
      ChocoId = 'ripgrep'
    },
    @{
      Name = 'fd'
      Commands = @('fd.exe', 'fdfind.exe')
      WingetId = 'sharkdp.fd'
      ChocoId = 'fd'
    },
    @{
      Name = 'jq'
      Commands = @('jq.exe')
      WingetId = 'jqlang.jq'
      ChocoId = 'jq'
    },
    @{
      Name = 'yq'
      Commands = @('yq.exe')
      WingetId = 'MikeFarah.yq'
      ChocoId = 'yq'
    },
    @{
      Name = '7-Zip'
      Commands = @('7z.exe', '7za.exe', '7zz.exe')
      WingetId = '7zip.7zip'
      ChocoId = '7zip'
    },
    @{
      Name = 'Tesseract OCR'
      Commands = @('tesseract.exe')
      WingetId = 'UB-Mannheim.TesseractOCR'
      ChocoId = 'tesseract'
    },
    @{
      Name = 'ImageMagick'
      Commands = @('magick.exe')
      WingetId = 'ImageMagick.ImageMagick'
      ChocoId = 'imagemagick'
    },
    @{
      Name = 'FFmpeg'
      Commands = @('ffmpeg.exe')
      WingetId = 'Gyan.FFmpeg'
      ChocoId = 'ffmpeg'
    },
    @{
      Name = 'Python 3'
      Commands = @('python.exe', 'py.exe')
      WingetId = 'Python.Python.3.13'
      ChocoId = 'python'
    },
    @{
      Name = 'GitHub CLI'
      Commands = @('gh.exe')
      WingetId = 'GitHub.cli'
      ChocoId = 'gh'
    },
    @{
      Name = 'SQLite'
      Commands = @('sqlite3.exe')
      WingetId = 'SQLite.SQLite'
      ChocoId = 'sqlite'
    }
  )

  foreach ($tool in $tools) {
    Install-ManagedTool @tool
  }
}

function Find-NodePath {
  $candidateCommands = @('node', 'node.exe')
  foreach ($candidate in $candidateCommands) {
    $command = Get-Command $candidate -ErrorAction SilentlyContinue
    if ($command) {
      return $command.Path
    }
  }

  $candidatePaths = @(
    (Join-Path $env:ProgramFiles 'nodejs\node.exe'),
    (Join-Path ${env:ProgramFiles(x86)} 'nodejs\node.exe')
  ) | Where-Object { $_ -and (Test-Path $_) }

  return $candidatePaths | Select-Object -First 1
}

function Find-NpmPath {
  $candidateCommands = @('npm', 'npm.cmd')
  foreach ($candidate in $candidateCommands) {
    $command = Get-Command $candidate -ErrorAction SilentlyContinue
    if ($command) {
      return $command.Path
    }
  }

  $candidatePaths = @(
    (Join-Path $env:ProgramFiles 'nodejs\npm.cmd'),
    (Join-Path ${env:ProgramFiles(x86)} 'nodejs\npm.cmd')
  ) | Where-Object { $_ -and (Test-Path $_) }

  return $candidatePaths | Select-Object -First 1
}

function Get-MachineFingerprint {
  $raw = @(
    $env:COMPUTERNAME,
    $env:PROCESSOR_IDENTIFIER,
    $env:PROCESSOR_ARCHITECTURE,
    $env:ProgramFiles
  ) -join '|'
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($raw)
  $hash = [System.Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
  return ([BitConverter]::ToString($hash)).Replace('-', '').ToLowerInvariant()
}

function Get-MachineStatePath {
  param([string]$Root)
  return (Join-Path $Root '.mcp\machine-state.json')
}

function Test-FreshMachineTransfer {
  param([string]$Root)

  $statePath = Get-MachineStatePath -Root $Root
  $fingerprint = Get-MachineFingerprint

  if (-not (Test-Path -LiteralPath $statePath)) {
    return $true
  }

  try {
    $state = Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json
    return ($state.machineFingerprint -ne $fingerprint)
  }
  catch {
    return $true
  }
}

function Save-MachineState {
  param([string]$Root)

  $statePath = Get-MachineStatePath -Root $Root
  $stateDir = Split-Path -Parent $statePath
  if (-not (Test-Path -LiteralPath $stateDir)) {
    New-Item -ItemType Directory -Path $stateDir -Force | Out-Null
  }

  @{
    machineFingerprint = Get-MachineFingerprint
    bootstrappedAt = (Get-Date).ToUniversalTime().ToString('o')
    computerName = $env:COMPUTERNAME
  } | Out-Null

  $json = "{`n`t""machineFingerprint"": ""$(Get-MachineFingerprint)"",`n`t""computerName"": ""$env:COMPUTERNAME"",`n`t""bootstrappedAt"": ""$((Get-Date).ToUniversalTime().ToString('o'))""`n}`n"
  $encoding = [System.Text.UTF8Encoding]::new($false)
  [System.IO.File]::WriteAllText($statePath, $json, $encoding)
}

function Initialize-ProtocolExecutables {
  param(
    [string]$Root,
    [bool]$RunFreshSetup
  )

  $executables = @('rtk.exe', 'codex-image.exe')
  foreach ($exe in $executables) {
    $path = Join-Path $Root $exe
    if (-not (Test-Path -LiteralPath $path)) {
      Write-Note "$exe missing; skipping executable setup."
      continue
    }

    $zone = Get-Item -LiteralPath $path -Stream Zone.Identifier -ErrorAction SilentlyContinue
    if ($zone) {
      Write-Note "Unblocking $exe."
      Unblock-File -LiteralPath $path
    }

    Write-Note "Checking $exe version."
    & $path --version | Out-Host
    if ($LASTEXITCODE -ne 0) {
      throw "$exe version check failed."
    }
  }

  if ($RunFreshSetup) {
    $rtk = Join-Path $Root 'rtk.exe'
    $codexImage = Join-Path $Root 'codex-image.exe'

    if (Test-Path -LiteralPath $rtk) {
      Write-Note 'Running rtk Codex setup.'
      & $rtk init -g --codex
      if ($LASTEXITCODE -ne 0) {
        throw 'rtk Codex setup failed.'
      }
    }

    if (Test-Path -LiteralPath $codexImage) {
      Write-Note 'Installing codex-image Codex skill.'
      & $codexImage skill install --tool codex --scope project --yes
      if ($LASTEXITCODE -ne 0) {
        throw 'codex-image skill install failed.'
      }
    }
  }
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$freshMachineTransfer = Test-FreshMachineTransfer -Root $root
if ($freshMachineTransfer) {
  Write-Note 'Fresh machine or transferred protocol folder detected; running full setup.'
}
else {
  Write-Note 'Existing machine setup detected; running normal bootstrap.'
}

$nodePath = Find-NodePath
$npmPath = Find-NpmPath

if (-not $nodePath -or -not $npmPath) {
  Write-Note 'Node.js/npm were not found. Trying to install Node.js LTS for this machine.'

  if (Test-Tool 'winget') {
    & winget install --id OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
  }
  elseif (Test-Tool 'choco') {
    & choco install nodejs-lts -y
  }
  else {
    throw 'Neither winget nor choco is available. Install Node.js LTS manually, then rerun bootstrap.'
  }

  $nodePath = Find-NodePath
  $npmPath = Find-NpmPath
}

if (-not $nodePath -or -not $npmPath) {
  throw 'Node.js/npm are still unavailable after installation. Open a new terminal and rerun bootstrap.'
}

Write-Note "Using Node at $nodePath"
Write-Note "Using npm at $npmPath"

Write-Note 'Installing missing helper apps.'
Install-ManagedTools

Initialize-ProtocolExecutables -Root $root -RunFreshSetup:$freshMachineTransfer

if (Test-Path (Join-Path $root 'package.json')) {
  Write-Note 'Installing project dependencies.'
  & $npmPath install
  if ($LASTEXITCODE -ne 0) {
    throw 'npm install failed.'
  }

  if (-not $SkipChecks) {
    Write-Note 'Running protocol checks.'
    & $npmPath run check
    if ($LASTEXITCODE -ne 0) {
      throw 'npm run check failed.'
    }
  }

  Save-MachineState -Root $root
}
else {
  Write-Note 'No package.json found in the current folder, so dependency installation was skipped.'
}
