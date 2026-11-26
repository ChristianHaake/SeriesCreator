import { execFileSync } from 'node:child_process';

const changes = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim();
if (changes) {
  throw new Error('Stage deployment requires a clean Git worktree. Commit or remove changes first.');
}
