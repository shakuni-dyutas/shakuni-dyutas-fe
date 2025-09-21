const issueScopeRule = (parsed, when = 'always', value = '^#\\d+$') => {
  const { scope } = parsed;

  if (!scope) {
    return [false, 'scope is required'];
  }

  const regex = typeof value === 'string' ? new RegExp(value) : value;
  const matches = regex.test(scope);
  const pass = when === 'never' ? !matches : matches;

  return [pass, `scope must ${when === 'never' ? 'not ' : ''}match pattern ${regex}`];
};

module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'scope-issue-pattern': issueScopeRule,
      },
    },
  ],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'refactor',
        'fix',
        'chore',
        'docs',
        'style',
        'test',
        'ci',
        'build',
        'release',
        'perf',
        'revert',
        'wip',
        'hotfix',
        'comment',
      ],
    ],
    'scope-empty': [2, 'never'],
    'scope-issue-pattern': [2, 'always', '^#\\d+$'],
    'subject-empty': [2, 'never'],
  },
};
