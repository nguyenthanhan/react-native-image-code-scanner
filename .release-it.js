module.exports = {
  git: {
    commitMessage: 'chore: release ${version}',
    tagName: 'v${version}',
  },
  npm: {
    publish: false,
  },
  github: {
    release: false,
  },
  plugins: {
    '@release-it/conventional-changelog': {
      preset: {
        name: 'angular',
      },
      infile: 'CHANGELOG.md',
    },
  },
};
