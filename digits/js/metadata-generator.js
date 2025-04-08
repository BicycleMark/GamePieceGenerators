#!/usr/bin/env node

/**
 * Metadata Generator for 7-Segment LED Display Generator
 * 
 * This script generates metadata for the 7-Segment LED Display Generator,
 * including Git repository information and file checksums.
 * 
 * Usage:
 *   node metadata-generator.js
 * 
 * Output:
 *   metadata.json - Contains Git repository information and other metadata
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

// Function to execute Git commands
function execGitCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error(`Error executing Git command: ${command}`, error);
    return "";
  }
}

// Function to calculate SHA-256 checksum of a file
function calculateChecksum(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  } catch (error) {
    console.error(`Error calculating checksum for ${filePath}:`, error);
    return "";
  }
}

// Function to get Git repository information
function getGitRepositoryInfo() {
  console.log('Getting Git repository information...');
  
  try {
    const repoUrl = execGitCommand('git config --get remote.origin.url');
    const branch = execGitCommand('git branch --show-current');
    const commitId = execGitCommand('git rev-parse HEAD');
    const commitMessage = execGitCommand('git log -1 --pretty=%B');
    const commitDate = execGitCommand('git log -1 --pretty=%aI');
    const tags = execGitCommand('git tag --points-at HEAD').split('\n').filter(Boolean);
    
    // Get recent commits (last 3)
    const recentCommitsRaw = execGitCommand('git log -3 --pretty="%H|%s|%aI"');
    const recentCommits = recentCommitsRaw.split('\n').filter(Boolean).map(line => {
      const [id, message, date] = line.split('|');
      return { id, message, date };
    });
    
    return {
      url: repoUrl,
      branch,
      commit: {
        id: commitId,
        message: commitMessage,
        date: commitDate
      },
      tags,
      recentCommits
    };
  } catch (error) {
    console.error('Error getting Git repository information:', error);
    return { error: "Failed to get Git repository information" };
  }
}

// Function to get user information from Git configuration
function getUserInfo() {
  console.log('Getting user information from Git configuration...');
  
  try {
    const name = execGitCommand('git config user.name');
    const email = execGitCommand('git config user.email');
    
    return {
      name,
      email
    };
  } catch (error) {
    console.error('Error getting user information:', error);
    return { error: "Failed to get user information" };
  }
}

// Function to get environment information
function getEnvironmentInfo() {
  console.log('Getting environment information...');
  
  try {
    const os = process.platform;
    const nodeVersion = process.version;
    
    // Check for Apple Silicon on macOS
    let cpuArchitecture = process.arch;
    let isAppleSilicon = false;
    
    if (os === 'darwin') {
      try {
        // Execute command to check for Apple Silicon
        const cpuType = execSync('sysctl -n machdep.cpu.brand_string', { encoding: 'utf8' }).trim();
        isAppleSilicon = cpuType.includes('Apple');
        if (isAppleSilicon) {
          cpuArchitecture = 'Apple Silicon';
        }
      } catch (error) {
        console.error('Error detecting CPU architecture:', error);
      }
    }
    
    return {
      os,
      nodeVersion,
      cpuArchitecture,
      isAppleSilicon,
      appVersion: "1.0.0", // Application version
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting environment information:', error);
    return { error: "Failed to get environment information" };
  }
}

// Function to calculate file checksums
function getFileChecksums(directory, filePattern) {
  console.log('Calculating file checksums...');
  
  try {
    const files = fs.readdirSync(directory).filter(file => {
      return file.match(filePattern);
    });
    
    const checksums = {};
    for (const file of files) {
      const filePath = path.join(directory, file);
      checksums[file] = calculateChecksum(filePath);
    }
    
    return {
      checksumAlgorithm: "SHA-256",
      files: checksums
    };
  } catch (error) {
    console.error('Error calculating file checksums:', error);
    return { error: "Failed to calculate file checksums" };
  }
}

// Main function
async function main() {
  console.log('Generating metadata...');
  
  const metadata = {
    timestamp: new Date().toISOString(),
    repository: getGitRepositoryInfo(),
    user: getUserInfo(),
    environment: getEnvironmentInfo(),
    // File checksums will be added when files are generated
  };
  
  // Write metadata to file
  fs.writeFileSync('metadata.json', JSON.stringify(metadata, null, 2));
  
  console.log('Metadata generated successfully!');
}

// Run the main function
main().catch(error => {
  console.error('Error generating metadata:', error);
  process.exit(1);
});
