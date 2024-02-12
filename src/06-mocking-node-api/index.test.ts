// src/06-mocking-node-api/index.test.ts

import {
  readFileAsynchronously,
  doStuffByTimeout,
  doStuffByInterval,
} from './index';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn(),
}));

describe('doStuffByTimeout', () => {
  let callback: jest.Mock;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    callback = jest.fn();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  // test('should set timeout with provided callback and timeout', () => {
  //   doStuffByTimeout(callback, 1000);
  //   expect(setTimeout).toHaveBeenCalledTimes(1);
  //   expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
  // });

  test('should call callback only after timeout', () => {
    doStuffByTimeout(callback, 1000);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  let callback: jest.Mock;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    callback = jest.fn();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  // test('should set interval with provided callback and timeout', () => {
  //   doStuffByInterval(callback, 1000);
  //   expect(setInterval).toHaveBeenCalledTimes(1);
  //   expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);
  // });

  test('should call callback multiple times after multiple intervals', () => {
    doStuffByInterval(callback, 1000);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
  const mockReadFile = readFile as jest.MockedFunction<typeof readFile>;
  const mockJoin = join as jest.MockedFunction<typeof join>;

  beforeEach(() => {
    mockExistsSync.mockClear();
    mockReadFile.mockClear();
    mockJoin.mockClear();
  });

  test('should call join with pathToFile', async () => {
    const pathToFile = 'test.txt';
    mockExistsSync.mockReturnValueOnce(true);
    mockReadFile.mockResolvedValueOnce(Buffer.from('test content'));
    mockJoin.mockReturnValueOnce('/path/to/test.txt');

    await readFileAsynchronously(pathToFile);

    expect(mockJoin).toHaveBeenCalledWith(expect.any(String), pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'test.txt';
    mockExistsSync.mockReturnValueOnce(false);

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'test.txt';
    mockExistsSync.mockReturnValueOnce(true);
    mockReadFile.mockResolvedValueOnce(Buffer.from('test content'));

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBe('test content');
  });
});
