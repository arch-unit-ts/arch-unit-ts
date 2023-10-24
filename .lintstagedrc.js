module.exports = {
  '{src/**/,}*.{js,ts}': ['eslint --fix'],
  '{src/**/,}*.{md,json,yml,xml}': ['prettier --write'],
};
