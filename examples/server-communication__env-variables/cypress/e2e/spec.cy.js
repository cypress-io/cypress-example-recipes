describe('Testing env var with cypress js', () => {
  it('Has my-var env in cypress config', () => {
    expect(Cypress.env('my-var')).equal('ok');
  });

  it('Has foo and bar variables in env', () => {
    expect(Cypress.env()).contain({
      FOO: '42',
      BAR: 'baz'
    });
  });

  it('Has username variables in env', () => {
    expect(Cypress.env('username')).to.equal('aTester');
  });

  context(
    'SUit env var',
    {
      env: {
        suiteApi: 'https://staging.dev',
        commonFlag: 'suite'
      }
    },
    () => {
      it('has suitable API var', () => {
        expect(Cypress.env('suiteApi')).equal('https://staging.dev');
      });

      it('Has foo and bar variables in env', () => {
        expect(Cypress.env()).contain({
          FOO: '42',
          BAR: 'baz'
        });
      });
    }
  );
});
