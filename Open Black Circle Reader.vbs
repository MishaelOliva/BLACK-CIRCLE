Set shell = CreateObject("WScript.Shell")
Set files = CreateObject("Scripting.FileSystemObject")
root = files.GetParentFolderName(WScript.ScriptFullName)
nodePath = "C:\Program Files\nodejs\node.exe"
If Not files.FileExists(nodePath) Then
  nodePath = "node"
End If

shell.CurrentDirectory = root
shell.Run """" & nodePath & """ """ & root & "\serve-reader.mjs""", 0, False
WScript.Sleep 900
shell.Run "http://127.0.0.1:4174/index.html", 1, False
