using System;
using System.IO;

class Program
{
    static int Main(string[] args)
    {
        Directory.CreateDirectory(@"C:\STORY\.mcp\codex-image\shim-test");
        File.WriteAllText(@"C:\STORY\.mcp\codex-image\shim-test\called-exe.txt", string.Join("\n", args));
        return 0;
    }
}
