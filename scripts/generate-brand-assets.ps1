$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$assetsDirectory = Join-Path $PSScriptRoot '..\assets\images\brand'
New-Item -ItemType Directory -Force -Path $assetsDirectory | Out-Null

function New-RoundedRectanglePath {
  param([System.Drawing.RectangleF]$Rectangle, [float]$Radius)
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $diameter = $Radius * 2
  $path.AddArc($Rectangle.X, $Rectangle.Y, $diameter, $diameter, 180, 90)
  $path.AddArc($Rectangle.Right - $diameter, $Rectangle.Y, $diameter, $diameter, 270, 90)
  $path.AddArc($Rectangle.Right - $diameter, $Rectangle.Bottom - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($Rectangle.X, $Rectangle.Bottom - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function Draw-EosMark {
  param(
    [System.Drawing.Graphics]$Graphics,
    [float]$X,
    [float]$Y,
    [float]$Size,
    [bool]$DrawBackground
  )

  $blue = [System.Drawing.ColorTranslator]::FromHtml('#07599B')
  $electricBlue = [System.Drawing.ColorTranslator]::FromHtml('#087BCD')
  $lightBlue = [System.Drawing.ColorTranslator]::FromHtml('#1597EA')
  $orange = [System.Drawing.ColorTranslator]::FromHtml('#FF8500')

  if ($DrawBackground) {
    $backgroundPath = New-RoundedRectanglePath -Rectangle ([System.Drawing.RectangleF]::new($X, $Y, $Size, $Size)) -Radius ($Size * 0.18)
    $backgroundBrush = [System.Drawing.SolidBrush]::new($blue)
    $Graphics.FillPath($backgroundBrush, $backgroundPath)
    $backgroundBrush.Dispose()
    $backgroundPath.Dispose()
  }

  $circuitPen = [System.Drawing.Pen]::new($lightBlue, $Size * 0.025)
  $circuitPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $circuitPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $lines = @(
    [float[]]@(($X + $Size * 0.29), ($Y + $Size * 0.26), ($X + $Size * 0.50), ($Y + $Size * 0.47)),
    [float[]]@(($X + $Size * 0.37), ($Y + $Size * 0.18), ($X + $Size * 0.58), ($Y + $Size * 0.39)),
    [float[]]@(($X + $Size * 0.43), ($Y + $Size * 0.72), ($X + $Size * 0.63), ($Y + $Size * 0.52)),
    [float[]]@(($X + $Size * 0.50), ($Y + $Size * 0.80), ($X + $Size * 0.70), ($Y + $Size * 0.60))
  )
  foreach ($line in $lines) {
    $Graphics.DrawLine($circuitPen, $line[0], $line[1], $line[2], $line[3])
    $nodeBrush = [System.Drawing.SolidBrush]::new($lightBlue)
    $Graphics.FillEllipse($nodeBrush, $line[0] - $Size * 0.022, $line[1] - $Size * 0.022, $Size * 0.044, $Size * 0.044)
    $nodeBrush.Dispose()
  }
  $circuitPen.Dispose()

  $font = [System.Drawing.Font]::new('Arial', $Size * 0.34, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $blueBrush = [System.Drawing.SolidBrush]::new($(if ($DrawBackground) { $electricBlue } else { $blue }))
  $Graphics.DrawString('e', $font, $blueBrush, $X + $Size * 0.12, $Y + $Size * 0.32)
  $Graphics.DrawString('s', $font, $blueBrush, $X + $Size * 0.58, $Y + $Size * 0.32)

  $powerPen = [System.Drawing.Pen]::new($orange, $Size * 0.065)
  $powerPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $powerPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $Graphics.DrawArc($powerPen, $X + $Size * 0.34, $Y + $Size * 0.39, $Size * 0.32, $Size * 0.32, -45, 270)
  $Graphics.DrawLine($powerPen, $X + $Size * 0.50, $Y + $Size * 0.34, $X + $Size * 0.50, $Y + $Size * 0.52)

  $lightning = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new($X + $Size * 0.60, $Y + $Size * 0.16),
    [System.Drawing.PointF]::new($X + $Size * 0.78, $Y + $Size * 0.31),
    [System.Drawing.PointF]::new($X + $Size * 0.68, $Y + $Size * 0.31),
    [System.Drawing.PointF]::new($X + $Size * 0.78, $Y + $Size * 0.46),
    [System.Drawing.PointF]::new($X + $Size * 0.54, $Y + $Size * 0.33),
    [System.Drawing.PointF]::new($X + $Size * 0.64, $Y + $Size * 0.31)
  )
  $orangeBrush = [System.Drawing.SolidBrush]::new($orange)
  $Graphics.FillPolygon($orangeBrush, $lightning)

  $font.Dispose()
  $blueBrush.Dispose()
  $powerPen.Dispose()
  $orangeBrush.Dispose()
}

function Save-BrandImage {
  param([string]$FileName, [bool]$WithBackground)
  $bitmap = [System.Drawing.Bitmap]::new(1024, 1024, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $graphics.Clear([System.Drawing.Color]::Transparent)
  Draw-EosMark -Graphics $graphics -X 64 -Y 64 -Size 896 -DrawBackground $WithBackground
  $bitmap.Save((Join-Path $assetsDirectory $FileName), [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
}

Save-BrandImage -FileName 'eos-app-icon.png' -WithBackground $true
Save-BrandImage -FileName 'eos-symbol.png' -WithBackground $false
