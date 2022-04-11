module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    js: 'jest-esm-transformer'
  },
  haste: {
    enableSymlinks: true
  },
  testMatch: ['**/*.spec.js']
};
