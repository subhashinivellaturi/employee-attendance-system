# Smoke test for attendance backend
$ErrorActionPreference = 'Stop'

$foundPort = $null
for ($p=5000; $p -le 5010; $p++) {
  try { $code = (& curl.exe -s -o NUL -w "%{http_code}" "http://localhost:$p/api/ping") } catch { $code = '' }
  if ($code -eq '200') { $foundPort = $p; break }
}
if (-not $foundPort) { Write-Host 'No backend found on ports 5000..5010'; exit 1 }
Write-Host "Found backend on port $foundPort`n"

$email = "smoke_test_$(Get-Date -UFormat %s)@example.local"
$payload = @{ name='Smoke Tester'; email=$email; password='smokepass'; role='employee' }
Write-Host "Registering user: $email"

try {
  $reg = Invoke-RestMethod -Uri "http://localhost:$foundPort/api/auth/register" -Method Post -ContentType 'application/json' -Body ($payload | ConvertTo-Json -Compress)
  Write-Host "Register response:`n" ($reg | ConvertTo-Json -Depth 5)
} catch {
  Write-Host "Register failed:`n" $_.Exception.Message
  if ($_.Exception.Response) { $r=$_.Exception.Response.GetResponseStream(); $reader=New-Object System.IO.StreamReader($r); Write-Host "Body:`n$($reader.ReadToEnd())" }
  exit 1
}

Write-Host "Logging in..."
try {
  $login = Invoke-RestMethod -Uri "http://localhost:$foundPort/api/auth/login" -Method Post -ContentType 'application/json' -Body ((@{ email=$email; password='smokepass' }) | ConvertTo-Json -Compress)
  Write-Host "Login response:`n" ($login | ConvertTo-Json -Depth 5)
  $token = $login.token
} catch {
  Write-Host "Login failed:`n" $_.Exception.Message
  if ($_.Exception.Response) { $r=$_.Exception.Response.GetResponseStream(); $reader=New-Object System.IO.StreamReader($r); Write-Host "Body:`n$($reader.ReadToEnd())" }
  exit 1
}

$headers = @{ Authorization = "Bearer $token" }

# Series of protected calls
Write-Host "\nGET /api/attendance/today"
try { $today = Invoke-RestMethod -Uri "http://localhost:$foundPort/api/attendance/today" -Method Get -Headers $headers; Write-Host ($today | ConvertTo-Json -Depth 5) } catch { Write-Host "Failed: $_" }

Write-Host "\nPOST /api/attendance/checkin"
try { $ci = Invoke-RestMethod -Uri "http://localhost:$foundPort/api/attendance/checkin" -Method Post -Headers $headers; Write-Host ($ci | ConvertTo-Json -Depth 5) } catch { Write-Host "Failed: $_" }

Write-Host "\nGET /api/attendance/today (after checkin)"
try { $today2 = Invoke-RestMethod -Uri "http://localhost:$foundPort/api/attendance/today" -Method Get -Headers $headers; Write-Host ($today2 | ConvertTo-Json -Depth 5) } catch { Write-Host "Failed: $_" }

Start-Sleep -Seconds 1

Write-Host "\nPOST /api/attendance/checkout"
try { $co = Invoke-RestMethod -Uri "http://localhost:$foundPort/api/attendance/checkout" -Method Post -Headers $headers; Write-Host ($co | ConvertTo-Json -Depth 5) } catch { Write-Host "Failed: $_" }

Write-Host "\nGET /api/dashboard/employee"
try { $dash = Invoke-RestMethod -Uri "http://localhost:$foundPort/api/dashboard/employee" -Method Get -Headers $headers; Write-Host ($dash | ConvertTo-Json -Depth 5) } catch { Write-Host "Failed: $_" }

Write-Host "\nGET /api/attendance/export (CSV)"
try { $csv = & curl.exe -s -H "Authorization: Bearer $token" "http://localhost:$foundPort/api/attendance/export"; if ($csv) { $s=$csv; if ($s.Length -gt 800) { $s = $s.Substring(0,800) + '...' } ; Write-Host $s } else { Write-Host 'No CSV returned' } } catch { Write-Host "Export failed: $_" }

Write-Host "\nSmoke tests finished."