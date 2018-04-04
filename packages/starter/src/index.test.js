import processor from '../lib/index';

describe('starter', () => {
  describe('processor', () => {
    it('solves simple problem', async () => {
      const result = await processor();
      expect(result[0]).toEqual([2.893098,3.510000,3.550000,3.490000,3.550000,3.038609,4333])
      expect(result[3410]).toEqual([7.73,3.510000,3.550000,3.490000,3.550000,3.038609,4333])
    });
  });
});