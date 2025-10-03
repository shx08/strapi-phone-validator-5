module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
    // Make sure your artifact is valid BEFORE publishing
    ['@semantic-release/exec', { prepareCmd: 'npm run build && npm run verify' }],
    ['@semantic-release/npm', { npmPublish: true }],
    ['@semantic-release/git', { assets: ['package.json', 'CHANGELOG.md'] }],
    '@semantic-release/github',
  ],
};
