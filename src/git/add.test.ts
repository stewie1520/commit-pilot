import { assertEquals, assertRejects } from "https://deno.land/std/testing/asserts.ts";
import { gitAdd } from "./add.ts";
import { execSync } from "node:child_process";

Deno.test({
  name: "gitAdd - should execute git add command successfully",
  async fn() {
    // Create a temporary test file
    const testFileName = "test-file.txt";
    await Deno.writeTextFile(testFileName, "test content");

    try {
      // Execute git add
      await gitAdd();

      // Check if the file was staged using git status
      const status = new TextDecoder().decode(
        execSync("git status --porcelain")
      );
      
      // The file should be staged (indicated by 'A' status)
      assertEquals(status.includes(`A  ${testFileName}`), true);
    } finally {
      // Cleanup: Remove the test file and unstage changes
      try {
        await Deno.remove(testFileName);
        execSync("git reset");
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  },
});

Deno.test({
  name: "gitAdd - should handle errors appropriately",
  async fn() {
    // Temporarily rename .git to simulate a non-git repository
    try {
      await Deno.rename(".git", ".git-temp");
      await assertRejects(
        async () => {
          await gitAdd();
        },
        Error,
        "fatal: not a git repository"
      );
    } finally {
      // Restore .git directory
      try {
        await Deno.rename(".git-temp", ".git");
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  },
});
