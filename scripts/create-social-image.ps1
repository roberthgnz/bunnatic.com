# Original typographic brand artwork; no source image is modified.
Add-Type -AssemblyName System.Drawing
$bitmap = [System.Drawing.Bitmap]::new(1200, 630)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = 'AntiAlias'
$graphics.TextRenderingHint = 'AntiAliasGridFit'
$graphics.Clear([System.Drawing.Color]::FromArgb(11, 11, 11))
$white = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
$muted = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(175, 175, 170))
$brand = [System.Drawing.Font]::new('Segoe UI', 30, [System.Drawing.FontStyle]::Bold)
$headline = [System.Drawing.Font]::new('Segoe UI', 58, [System.Drawing.FontStyle]::Bold)
$small = [System.Drawing.Font]::new('Segoe UI', 22)
$graphics.DrawString('Locavo', $brand, $white, 72, 52)
$graphics.DrawLine([System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(70, 70, 70)), 72, 145, 1128, 145)
$graphics.DrawString('La web de tu negocio,', $headline, $white, 66, 210)
$graphics.DrawString('con ayuda de la IA.', $headline, $white, 66, 310)
$graphics.DrawString('Servicios, horarios y contacto en un mismo sitio.', $small, $muted, 72, 505)
$target = Join-Path $PSScriptRoot '../public/social/locavo.png'
[System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($target)) | Out-Null
$bitmap.Save($target, [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bitmap.Dispose()
$brand.Dispose()
$headline.Dispose()
$small.Dispose()
$white.Dispose()
$muted.Dispose()
Write-Output 'Created public/social/locavo.png (1200x630)'
