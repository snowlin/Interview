import { describe, it, expect, beforeEach } from 'vitest';
import { useMilesEngine } from './useMilesEngine';

describe('useMilesEngine', () => {
  let engine: ReturnType<typeof useMilesEngine>;

  beforeEach(() => {
    engine = useMilesEngine();
  });

  it('1. restaurant 50 SAR -> 150 miles', () => {
    engine.addTransaction({
      amount: 50,
      merchantType: 'restaurant',
      paymentMethod: 'visa'
    });
    
    expect(engine.ledger.value).toHaveLength(1);
    expect(engine.ledger.value[0].miles).toBe(150);
  });

  it('2. < 10 SAR -> 0 miles', () => {
    engine.addTransaction({
      amount: 9.99,
      merchantType: 'supermarket',
      paymentMethod: 'cash'
    });
    
    expect(engine.ledger.value[0].miles).toBe(0);
  });

  it('3. undoLast() 后 ledger 恢复正确', () => {
    engine.addTransaction({ amount: 100, merchantType: 'pharmacy', paymentMethod: 'mada' });
    engine.addTransaction({ amount: 200, merchantType: 'entertainment', paymentMethod: 'visa' });
    
    expect(engine.ledger.value).toHaveLength(2);
    
    engine.undoLast();
    expect(engine.ledger.value).toHaveLength(1);
    expect(engine.ledger.value[0].amount).toBe(100);
    expect(engine.canRedo.value).toBe(true);
  });

  it('4. total net profit 汇总正确', () => {
    engine.addTransaction({ amount: 50, merchantType: 'restaurant', paymentMethod: 'visa' });
    engine.addTransaction({ amount: 100, merchantType: 'supermarket', paymentMethod: 'mada' });

    const firstRevenue = 50 * 0.15 + 50 * 0.15;
    const firstMiles = 50 * 3;
    const firstMilesCost = firstMiles * 0.0756;
    const firstProfit = firstRevenue - firstMilesCost;

    const secondRevenue = 100 * 0.15 + 100 * 0.15 + (100 * 1.15) * 0.01;
    const secondMiles = 100 * 1;
    const secondMilesCost = secondMiles * 0.0756;
    const secondProfit = secondRevenue - secondMilesCost;

    const expected = Math.round((firstProfit + secondProfit) * 100) / 100;
    expect(engine.netProfit.value).toBe(expected);
  });

  it('5. >= 500 SAR 时 miles 乘 1.5', () => {
    engine.addTransaction({ amount: 500, merchantType: 'supermarket', paymentMethod: 'cash' });
    // base = 500 * 1 = 500, * 1.5 = 750
    expect(engine.ledger.value[0].miles).toBe(750);
  });

  it('6. mada 额外收入正确', () => {
    engine.addTransaction({ amount: 100, merchantType: 'pharmacy', paymentMethod: 'mada' });
    
    const entry = engine.ledger.value[0];
    const customerPaid = 100 * 1.15; // 115
    const madaRev = customerPaid * 0.01; // 1.15
    expect(entry.madaRevenue).toBe(Math.round(madaRev * 100) / 100);
  });

  it('7. 亏损交易 isLoss 和 lossReason 正确', () => {
    engine.addTransaction({ amount: 1000, merchantType: 'restaurant', paymentMethod: 'visa' });
    
    const entry = engine.ledger.value[0];
    expect(entry.isLoss).toBe(true);
    expect(entry.lossReason).toBe("bonus_miles_loss");
  });

  it('8. redoLast() 正确恢复', () => {
    engine.addTransaction({ amount: 100, merchantType: 'restaurant', paymentMethod: 'visa' });
    engine.undoLast();
    expect(engine.ledger.value).toHaveLength(0);
    
    engine.redoLast();
    expect(engine.ledger.value).toHaveLength(1);
    expect(engine.ledger.value[0].amount).toBe(100);
  });

  it('9. 新增交易后清空 redo 栈', () => {
    engine.addTransaction({ amount: 100, merchantType: 'restaurant', paymentMethod: 'visa' });
    engine.undoLast();
    expect(engine.canRedo.value).toBe(true);
    
    engine.addTransaction({ amount: 200, merchantType: 'supermarket', paymentMethod: 'cash' });
    expect(engine.canRedo.value).toBe(false);
  });
});
