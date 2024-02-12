// src/08-linked-list/index.test.ts

import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const elements = [1, 2, 3, 4, 5];
    const expectedLinkedList = {
      value: 1,
      next: {
        value: 2,
        next: {
          value: 3,
          next: {
            value: 4,
            next: {
              value: 5,
              next: null,
            },
          },
        },
      },
    };

    const result = generateLinkedList(elements);
    expect(result).toStrictEqual(expectedLinkedList);
  });

  test('should generate linked list from values 2', () => {
    const elements = [1, 2, 3, 4, 5];
    const result = generateLinkedList(elements);
    expect(result).toMatchSnapshot();
  });

  test('should generate empty linked list for empty input', () => {
    const elements: number[] = [];
    const expectedLinkedList = { value: null, next: null };

    const result = generateLinkedList(elements);
    expect(result).toStrictEqual(expectedLinkedList);
  });
});
