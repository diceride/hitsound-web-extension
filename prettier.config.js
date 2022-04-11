module.exports = {
  proseWrap: 'always',
  endOfLine: 'lf',
  singleQuote: true,
  trailingComma: 'none',
  htmlWhitespaceSensitivity: 'css',
  overrides: [
    {
      files: '*.md',
      options: {
        proseWrap: 'never'
      }
    }
  ]
};
