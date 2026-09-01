@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Batch Script for Windows (handles spaces in path)
@REM ----------------------------------------------------------------------------
@IF "%DEBUG%" == "" @ECHO OFF
@SETLOCAL EnableExtensions EnableDelayedExpansion

set "DIR=%~dp0"
set "MAVEN_PROJECTBASEDIR=%DIR%"
set "WRAPPER_JAR=%DIR%.mvn\wrapper\maven-wrapper.jar"

set "JAVA_EXE=java"
if defined JAVA_HOME (
    set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
)

"%JAVA_EXE%" -Dmaven.multiModuleProjectDirectory="%MAVEN_PROJECTBASEDIR%" -classpath "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
if ERRORLEVEL 1 goto error
goto end

:error
exit /b 1

:end
exit /b 0
