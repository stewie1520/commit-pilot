import { exec } from 'node:child_process';

/**
 * @description git commit -m
 * 
 */
export const gitCommit = (message: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(`git commit -m "${message}"`, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr || error.message);
      }

      resolve('Changes committed successfully');
    });
  });
}
