$port = 5000
Write-Host "Testing backend on port $port`n"

Write-Host "1) Check listener"
Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Format-Table -AutoSize

Write-Host "`n2) Ping /api/ping"
curl -v "http://localhost:$port/api/ping"

Write-Host "`n3) Register test user"
$email = "cli_test_$(Get-Date -UFormat %s)@example.com"
$bodyObj = @{ name = 'CLI Test'; email = $email; password = 'secret' }
$json = $bodyObj | ConvertTo-Json -Compress
Write-Host "Using email: $email"
Write-Host "Request body: $json"

curl -v -X POST "http://localhost:$port/api/auth/register" -H "Content-Type: application/json" -d $json

Write-Host "`n4) Login with same user"
$loginBody = @{ email = $email; password = 'secret' } | ConvertTo-Json -Compress
curl -v -X POST "http://localhost:$port/api/auth/login" -H "Content-Type: application/json" -d $loginBody
