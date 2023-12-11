import { PackageMatcher, ResultMatcher } from '../../../../../../main/arch-unit/core/domain/PackageMatcher';
import { Optional } from '../../../../../../main/common/domain/Optional';

describe('PackageMatcher', () => {
  const listOfPackageName = [
    ['some.arbitrary.pkg', 'some.arbitrary.pkg', true],
    ['some.arbitrary.pkg', 'some.thing.different', false],
    ['some..pkg', 'some.arbitrary.pkg', true],
    ['some..middle..pkg', 'some.arbitrary.middle.more.pkg', true],
    ['*..pkg', 'some.arbitrary.pkg', true],
    ['some..*', 'some.arbitrary.pkg', true],
    ['*..pkg', 'some.arbitrary.pkg.toomuch', false],
    ['toomuch.some..*', 'some.arbitrary.pkg', false],
    ['*..wrong', 'some.arbitrary.pkg', false],
    ['some..*', 'wrong.arbitrary.pkg', false],
    ['..some', 'some', true],
    ['some..', 'some', true],
    ['*..some', 'some', false],
    ['some..*', 'some', false],
    ['..some', 'asome', false],
    ['some..', 'somea', false],
    ['*.*.*', 'wrong.arbitrary.pkg', true],
    ['*.*.*', 'wrong.arbitrary.pkg.toomuch', false],
    ['some.arbi*.pk*..', 'some.arbitrary.pkg.whatever', true],
    ['some.arbi*..', 'some.brbitrary.pkg', false],
    ['some.*rary.*kg..', 'some.arbitrary.pkg.whatever', true],
    ['some.*rary..', 'some.arbitrarz.pkg', false],
    ['some.pkg', 'someepkg', false],
    ['..pkg..', 'some.random.pkg.maybe.anywhere', true],
    ['..p..', 's.r.p.m.a', true],
    ['*..pkg..*', 'some.random.pkg.maybe.anywhere', true],
    ['*..p..*', 's.r.p.m.a', true],
    ['..[a|b|c].pk*..', 'some.a.pkg.whatever', true],
    ['..[b|c].pk*..', 'some.a.pkg.whatever', false],
    ['..[a|b*].pk*..', 'some.bitrary.pkg.whatever', true],
    ['..[a|b*].pk*..', 'some.a.pkg.whatever', true],
    ['..[a|b*].pk*..', 'some.arbitrary.pkg.whatever', false],
    ['..[*c*|*d*].pk*..', 'some.anydinside.pkg.whatever', true],
    ['..[*c*|*d*].pk*..', 'some.nofit.pkg.whatever', false],
  ];

  it.each(listOfPackageName)('should matcher %s on target %s be %s', (matcher: string, target: string, matches: boolean) => {
    expect(PackageMatcher.of(matcher).matches(target)).toEqual(matches);
  });

  const listOfCaptureGroup = [
    ['some.(*).pkg', 'some.arbitrary.pkg', 'arbitrary'],
    ['some.arb(*)ry.pkg', 'some.arbitrary.pkg', 'itra'],
    ['some.arb(*)ry.pkg', 'some.arbit.rary.pkg', null],
    ['some.(*).matches.(*).pkg', 'some.first.matches.second.pkg', 'first:second'],
    ['(*).(*).(*).(*)', 'a.b.c.d', 'a:b:c:d'],
    ['(*).matches.(*)', 'start.matches.end', 'start:end'],
    ['(*)', 'some', 'some'],
    ['some.(*).pkg', 'some.in.between.pkg', null],
    ['some.(**).pkg', 'some.in.between.pkg', 'in.between'],
    ['some.(**).pkg.(*)', 'some.in.between.pkg.addon', 'in.between:addon'],
    ['some(**)pkg', 'somerandom.in.between.longpkg', 'random.in.between.long'],
    ['some.(**).pkg', 'somer.in.between.pkg', null],
    ['some.(**).pkg', 'some.in.between.gpkg', null],
    ['so(*)me.(**)pkg.an(*).more', 'soinfme.in.between.gpkg.and.more', 'inf:in.between.g:d'],
    ['so(*)me.(**)pkg.an(*).more', 'soinfme.in.between.gpkg.an.more', null],
    ['so(**)me', 'some', null],
    ['so(*)me', 'some', null],
    ['(**)so', 'awe.some.aso', 'awe.some.a'],
    ['so(**)', 'soan.some.we', 'an.some.we'],
    ['..(a|b).pk*.(c|d)..', 'some.a.pkg.d.whatever', 'a:d'],
    ['..(a|b).[p|*g].(c|d)..', 'some.a.pkg.d.whatever', 'a:d'],
    ['..[a|b|c].pk*.(c|d)..', 'some.c.pkg.d.whatever', 'd'],
    ['..(a|b*|cd).pk*.(**).end', 'some.bitrary.pkg.in.between.end', 'bitrary:in.between'],
    ['..(a.b|c.d).pk*', 'some.a.b.pkg', 'a.b'],
    ['..[application|domain.*|infrastructure].(*)..', 'com.example.application.a.http', 'a'],
    ['..[application|domain.*|infrastructure].(*)..', 'com.example.domain.api.a', 'a'],
    ['..[application|domain.*|infrastructure].(*)..', 'com.example.domain.logic.a', 'a'],
    ['..[application|domain.*|infrastructure].(*)..', 'com.example.infrastructure.a.file', 'a'],
  ];

  it.each(listOfCaptureGroup)(
    'should matcher %s on target %s get capture groups %s',
    (matcher: string, target: string, groupString: string) => {
      expect(PackageMatcher.of(matcher).match(target).isPresent()).toEqual(groupString != null);

      const groupsToCompare: string[] = groupString != null ? groupString.split(':') : [];
      for (let i = 0; i < groupsToCompare.length; i++) {
        expect(
          PackageMatcher.of(matcher)
            .match(target)
            .orElseThrow()
            .getGroup(i + 1)
        ).toEqual(groupsToCompare[i]);
      }
    }
  );

  it.each(['...', '....', '.....'])('should not build with more than two dots : %s', dots => {
    expect(() => PackageMatcher.of(dots + 'packageName..')).toThrow("Package Identifier may not contain more than two '.' in a row");
  });

  it.each(['**', '***'])('should not build with more than one star out of parenthesis on %s', stars => {
    expect(() => PackageMatcher.of(stars + 'packageName.(**)')).toThrow("Package Identifier may not contain more than one '*' in a row");
  });

  it('should reject capturing with two dots', () => {
    expect(() => PackageMatcher.of('some.(..).package')).toThrow(
      'Package Identifier does not support capturing via (..), use (**) instead'
    );
  });

  it('should reject non alternating alternatives', () => {
    expect(() => PackageMatcher.of('some.[nonalternating].package')).toThrow(
      "Package Identifier does not allow alternation brackets '[]' without specifying any alternative via '|' inside"
    );
  });

  it('should reject toplevel alternations', () => {
    expect(() => PackageMatcher.of('some.pkg|other.pkg')).toThrow("Package Identifier only supports '|' inside of '[]' or '()'");
  });

  it('should build', () => {
    expect(() => PackageMatcher.of('some.[pkg|other].pkg')).not.toThrow();
  });

  it.each([
    'some.(pkg.(other).pkg)..',
    'some.(pkg.[a|b].pkg)..',
    'some.[pkg.[a|b].pkg]..',
    'some.[pkg.(a|b).pkg]..',
    'some.[inside.(pkg).it|other.(pkg).it].pkg',
    'some.[inside.[a|b].it|other].pkg',
  ])('should reject nesting of groups %s', packageIdentifier => {
    expect(() => PackageMatcher.of(packageIdentifier)).toThrow(
      "Package Identifier does not support nesting '()' or '[]' within other '()' or '[]'"
    );
  });

  it('should reject illegal characters', () => {
    const illegalPackageIdentifier: string = `some${PackageMatcher.TWO_STAR_REGEX_MARKER}package`;

    expect(() => PackageMatcher.of(illegalPackageIdentifier)).toThrow(
      `Package Identifier ${illegalPackageIdentifier} may only consist of valid typescript identifier parts or the symbols '.)(*'`
    );
  });

  it('should transform match to groups', () => {
    const result: Optional<ResultMatcher> = PackageMatcher.of('com.(*)..service.(**)').match('com.mycompany.some.service.special.name');
    expect(result.map(ResultMatcher.TO_GROUPS).orElseThrow()).toEqual(['mycompany', 'special.name']);
  });

  it('should transform mismatch to absent', () => {
    const result: Optional<ResultMatcher> = PackageMatcher.of('com.(*)..').match('mycompany');

    expect(result.isEmpty()).toEqual(true);
  });
});
