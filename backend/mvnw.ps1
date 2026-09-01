# Maven Wrapper PowerShell script
$basedir = $PSScriptRoot
$wrapperJar = Join-Path $basedir ".mvn/wrapper/maven-wrapper.jar"

if (-not (Test-Path $wrapperJar)) {
    Write-Host "Downloading Maven Wrapper..."
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    (New-Object Net.WebClient).DownloadFile('https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar', $wrapperJar)
}

$javaCmd = if ($env:JAVA_HOME) { Join-Path $env:JAVA_HOME "bin/java.exe" } else { "java" }

& $javaCmd "-Dmaven.multiModuleProjectDirectory=$basedir" -classpath $wrapperJar org.apache.maven.wrapper.MavenWrapperMain $args
