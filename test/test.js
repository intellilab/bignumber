const assert = require('assert');
const BigNumber = require('..');

describe('BigNumber', () => {
  describe('equal', () => {
    const a = new BigNumber(1);
    const b = new BigNumber(1);
    const c = new BigNumber({digits: [1, 2], zeros: 2});
    const d = new BigNumber({digits: [1, 2], zeros: 2});
    it('should be true for equivalent values', () => {
      assert.ok(a.equalTo(b));
      assert.ok(a.equalTo(1));
      assert.ok(c.equalTo(d));
      assert.ok(c.equalTo({digits: [1, 2], zeros: 2}));
    });
    it('should be false for unequivalent values', () => {
      assert.ok(!a.equalTo(c));
      assert.ok(!b.equalTo(d));
    });
  });

  describe('add', () => {
    const a = new BigNumber(1);
    const b = new BigNumber(2);
    const c = new BigNumber({digits: [1, 2]});
    const d = new BigNumber({digits: [3, 4]});
    it('should add two numbers', () => {
      assert.ok(a.add(b).equalTo(3));
      assert.ok(a.add(2).equalTo(3));
      assert.ok(c.add(d).equalTo({digits: [4, 6]}));
      assert.ok(a.add(c).equalTo({digits: [2, 2]}));
    });
  });

  describe('multiply', () => {
    const a = new BigNumber(2);
    const b = new BigNumber(10);
    it('should multiply two numbers', () => {
      assert.ok(a.multiply(b).equalTo(20));
      assert.ok(a.multiply(10).equalTo(20));
    });
    it('should support large numbers', () => {
      var r = new BigNumber(1);
      for (let i = 2; i <= 100; i ++) r = r.multiply(i);
      assert.equal(r.toString(), '93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000');
    });
  });

  describe('pow', () => {
    const a = new BigNumber(2);
    const b = new BigNumber(22);
    it('should support 0', () => {
      assert.ok(a.pow(0).equalTo(1));
    });
    it('should calculate pow', () => {
      assert.ok(a.pow(10).equalTo(1024));
      assert.equal(b.pow(100).toString(), '174690015040882455988354400790170000897162886859579152352704471899874163427116241050767381769631464055938734482112142486751362076901376');
    });
  });
});
