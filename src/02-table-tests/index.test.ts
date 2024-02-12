// src/02-table-tests/index.test.ts

import { simpleCalculator, Action } from './index';

describe('simpleCalculator', () => {
  const testCases = [
    { a: 1, b: 2, action: Action.Add, expected: 3 },
    { a: 2, b: 2, action: Action.Add, expected: 4 },
    { a: 3, b: 2, action: Action.Add, expected: 5 },
    { a: 5, b: 3, action: Action.Subtract, expected: 2 },
    { a: 2, b: 3, action: Action.Multiply, expected: 6 },
    { a: 6, b: 3, action: Action.Divide, expected: 2 },
    { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
    { a: '2' as any, b: 3, action: Action.Add, expected: null },
    { a: 2, b: '3' as any, action: Action.Add, expected: null },
    { a: '2' as any, b: '3' as any, action: Action.Add, expected: null },
    { a: 2, b: 3, action: 'InvalidAction' as any, expected: null },
  ];

  test.each(testCases)(
    'given a = $a, b = $b, and action = $action, should return $expected',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );
});
