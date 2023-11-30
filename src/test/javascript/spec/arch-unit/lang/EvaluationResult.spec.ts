import { EvaluationResultFixture } from './EvaluationResultFixture';

describe('EvaluationResult', () => {
  describe('violationReport', () => {
    it('Should get violation report ', () => {
      expect(EvaluationResultFixture.evaluationResult().violationReport()).toEqual('description violation 1\ndescription violation 2');
    });
  });
  describe('hasErrors', () => {
    it('Should return true when evaluation has violations ', () => {
      expect(EvaluationResultFixture.evaluationResult().hasErrors()).toEqual(true);
    });

    it('Should return false when evaluation has no violations ', () => {
      expect(EvaluationResultFixture.emptyEvaluationResult().hasErrors()).toEqual(false);
    });
  });
});
