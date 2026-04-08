#!/usr/bin/env node
/**
 * convert-agents.js
 *
 * Converts agent definitions from the agency-agents repo
 * (https://github.com/msitarzewski/agency-agents) into the ClawShell
 * agent-catalog.json format.
 *
 * Usage:
 *   node scripts/convert-agents.js [--repo /path/to/agency-agents] [--out ./agent-catalog.json]
 *
 * If --repo is not provided, the repo is cloned to a temp directory.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const AGENT_DIRS = [
  'academic', 'design', 'engineering', 'game-development',
  'marketing', 'paid-media', 'sales', 'product',
  'project-management', 'testing', 'support',
  'spatial-computing', 'specialized',
];

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: {}, body: content };

  const fm = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    fm[key] = val;
  }

  const body = content.slice(match[0].length).trim();
  return { frontmatter: fm, body };
}

function main() {
  const args = process.argv.slice(2);
  let repoPath = '';
  let outPath = path.resolve(__dirname, '..', 'agent-catalog.json');

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--repo' && args[i + 1]) {
      repoPath = args[++i];
    } else if (args[i] === '--out' && args[i + 1]) {
      outPath = args[++i];
    }
  }

  // Clone if needed
  let cleanup = false;
  if (!repoPath) {
    repoPath = execSync('mktemp -d', { encoding: 'utf8' }).trim();
    console.log(`Cloning agency-agents to ${repoPath}...`);
    execSync('git clone --depth 1 https://github.com/msitarzewski/agency-agents.git ' + repoPath, {
      stdio: 'inherit',
    });
    cleanup = true;
  }

  const agents = [];

  for (const dir of AGENT_DIRS) {
    const dirPath = path.join(repoPath, dir);
    if (!fs.existsSync(dirPath)) {
      console.log(`  Skipping ${dir}/ (not found)`);
      continue;
    }

    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md')).sort();
    console.log(`  ${dir}/: ${files.length} agents`);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const { frontmatter, body } = parseFrontmatter(content);

      if (!frontmatter.name) continue;

      const agentId = 'agency-' + slugify(frontmatter.name);
      const sourceFile = `${dir}/${file}`;

      agents.push({
        agentId,
        name: frontmatter.name,
        description: frontmatter.description || '',
        category: dir,
        sourceFile,
        emoji: frontmatter.emoji || '',
        vibe: frontmatter.vibe || '',
        color: frontmatter.color || '',
        tools: frontmatter.tools || '',
        author: {
          name: 'The Agency',
          url: 'https://github.com/msitarzewski/agency-agents',
        },
      });
    }
  }

  const catalog = {
    source: 'agency-agents',
    sourceUrl: 'https://github.com/msitarzewski/agency-agents',
    agents,
  };

  fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2) + '\n');
  console.log(`\nWrote ${agents.length} agents to ${outPath}`);

  if (cleanup) {
    execSync(`rm -rf ${repoPath}`);
    console.log('Cleaned up temp clone');
  }
}

main();
