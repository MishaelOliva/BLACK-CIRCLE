$ErrorActionPreference = "Stop"

$root = "C:\STORY"
$jobRoot = Join-Path $root ".mcp\codex-image\episode-25-stylefix"
New-Item -ItemType Directory -Force -Path $jobRoot | Out-Null

$style = @"
ART STYLE SOURCE OF TRUTH: match Black Circle Episodes 1-24 assets in this repository.
Style must feel like existing Episode 1-24 covers/scenes: dark academy fantasy anime/manga key art, painterly high-contrast rendering, cool blue-black shadows, warm gold/green/blue/red magic circle accents, gothic academy stone and glass architecture, detailed but slightly gritty brush texture, dramatic luminous circular glyph geometry, cinematic depth, elegant Aurelis uniforms, sharp silhouettes, moody atmosphere.
Character continuity: Haru Aerlen has black hair, quiet introverted expression, dark Aurelis academy uniform, subtle hidden green circle glow at chest when visible, restrained power. Elira Vale has long blonde hair, golden eyes, elegant black-white academy uniform, dark crystal pendant at throat, composed and protective. Do not redesign them.
Output: wide 16:9 story-reader artwork. No text, no logos, no watermarks.
Avoid: modern glossy poster style, plastic 3D render, plain clean digital art, soft romance-poster style, chibi, western comic style, washed-out daylight, over-bright pastel palette, excessive smoothness, random glitter speckles, micro-dot noise, malformed hands, distorted faces.
"@

$items = @(
  @{
    Name = "cover"
    Dest = "assets\episodes\episode-25-cover.webp"
    Scene = "Episode 25 cover, Wounded City Protocol. Haru and Elira foreground inside old chapel Foundation chamber; behind them a ruined phantom city unfolds with witness rails, seven wounded markers, public observers, large circular glyphs overhead. Composition like prior Black Circle covers: dense gothic academy fantasy, dark dramatic frame, characters prominent, no title text."
  },
  @{
    Name = "01-protocol-opens"
    Dest = "assets\scenes\episode-25-01-protocol-opens-imagegen.webp"
    Scene = "Wounded City Protocol opens beneath old academy chapel at noon. Ancient stone Foundation chamber expands into impossible phantom city: broken streets, blank windows, leaning bell tower, silver-blue mist, witness rails, observers at perimeter. Establishing shot in same Episode 1-24 scene style."
  },
  @{
    Name = "02-seven-markers"
    Dest = "assets\scenes\episode-25-02-seven-markers-imagegen.webp"
    Scene = "Seven wounded markers stand at the center of ruined phantom city streets, each marker a human-height luminous rescue silhouette or ritual plinth in an arc. Broken stone, rail lights, distant academy observers, ethical trial tension."
  },
  @{
    Name = "03-public-witness-rails"
    Dest = "assets\scenes\episode-25-03-public-witness-rails-imagegen.webp"
    Scene = "Public witnesses gathered behind luminous rails: academy students, faculty, Valemere delegates, student recorders. They overlook the Wounded City chamber from a gothic balcony/rail. Formal accountability, political pressure, dark academy mood."
  },
  @{
    Name = "04-falling-stone"
    Dest = "assets\scenes\episode-25-04-falling-stone-imagegen.webp"
    Scene = "Leon notices a cracked stone hazard above a wounded marker. Heavy broken slab shifts overhead in ruined phantom street; Leon in dark academy uniform looks up with tense focus, magic marker below, seven-second danger readable."
  },
  @{
    Name = "05-pendant-black-gold"
    Dest = "assets\scenes\episode-25-05-pendant-black-gold-imagegen.webp"
    Scene = "Elira Vale close cinematic shot as her hidden dark crystal pendant flares black and gold during return hook attack. Long blonde hair, golden eyes, elegant black-white academy uniform, alarmed but composed. Haru's dark restrained presence near edge, Wounded City behind."
  },
  @{
    Name = "06-return-hook"
    Dest = "assets\scenes\episode-25-06-return-hook-imagegen.webp"
    Scene = "A black return hook drags the rescue route toward Cael and Elira. Dark curved magical hook and golden route-line cross broken Wounded City streets toward empty seventh marker; Elira resists with gold light, Haru reads the field nearby."
  },
  @{
    Name = "07-seventh-marker"
    Dest = "assets\scenes\episode-25-07-seventh-marker-imagegen.webp"
    Scene = "The seventh marker opens. Empty seventh rescue marker splits into dark violet-black void ring; Elira steps toward it to protect Cael, pendant glowing black and gold; Haru tense nearby, witness rails distant."
  },
  @{
    Name = "08-isolation-wound"
    Dest = "assets\scenes\episode-25-08-isolation-wound-imagegen.webp"
    Scene = "Oric realizes the seventh wound is isolation. Serious academy observer/examiner in dark formal uniform stands before seven markers; the seventh is separated by cold dark boundary, analytical shock on his face, ruined chamber behind."
  },
  @{
    Name = "09-quiet-corridor"
    Dest = "assets\scenes\episode-25-09-quiet-corridor-imagegen.webp"
    Scene = "Quiet corridor after Wounded City Protocol. Haru and Elira stand close in dim gothic academy stone corridor facing tomorrow's risk. Haru restrained and worried; Elira tired but steady with pendant visible. Intimate, tense, not romantic-poster."
  },
  @{
    Name = "wounded-city-protocol"
    Dest = "assets\scenes\episode-25-wounded-city-protocol-imagegen.webp"
    Scene = "Formal activity field opening: Foundation protocol announces rescue-priority rules. Broad ritual chamber with broken city streets, seven wounded markers, safe-zone glyphs, luminous witness autonomy rails, public witnesses and academy officials. Official rescue ethics and political leverage."
  }
)

foreach ($item in $items) {
  $outDir = Join-Path $jobRoot $item.Name
  Remove-Item -LiteralPath $outDir -Recurse -Force -ErrorAction SilentlyContinue
  New-Item -ItemType Directory -Force -Path $outDir | Out-Null
  $prompt = "$style`nSCENE: $($item.Scene)"
  powershell -ExecutionPolicy Bypass -File (Join-Path $root "tools\codex-image-generate.ps1") generate --out $outDir --timeout 420 $prompt | Write-Output
  $src = Join-Path $outDir "image-0001.png"
  if (-not (Test-Path -LiteralPath $src)) {
    throw "Missing generated image for $($item.Name): $src"
  }
  $dest = Join-Path $root $item.Dest
  magick $src -resize "1920x1080^" -gravity center -extent 1920x1080 -quality 94 $dest
  $size = magick identify -format "%wx%h" $dest
  Write-Output "Wrote $($item.Dest) $size"
}

node .\build-site.mjs
