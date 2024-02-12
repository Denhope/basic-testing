// src/04-test-class/index.test.ts

import {
  BankAccount,
  getBankAccount,
  TransferFailedError,
  SynchronizationFailedError,
  InsufficientFundsError,
} from './index';

describe('BankAccount', () => {
  let account: BankAccount;

  beforeEach(() => {
    account = getBankAccount(1000);
  });

  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(1000);
  });

  test('should deposit money', () => {
    account.deposit(500);
    expect(account.getBalance()).toBe(1500);
  });

  test('should withdraw money', () => {
    account.withdraw(500);
    expect(account.getBalance()).toBe(500);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(1500)).toThrow(InsufficientFundsError);
    expect(() => account.withdraw(1500)).toThrow(
      'Insufficient funds: cannot withdraw more than 1000',
    );
  });

  test('should transfer money to another account', () => {
    const toAccount = getBankAccount(500);
    account.transfer(500, toAccount);
    expect(account.getBalance()).toBe(500);
    expect(toAccount.getBalance()).toBe(1000);
  });

  test('should throw error when transferring more than balance', () => {
    const toAccount = getBankAccount(500);
    expect(() => account.transfer(1500, toAccount)).toThrow(
      InsufficientFundsError,
    );
    expect(() => account.transfer(1500, toAccount)).toThrow(
      'Insufficient funds: cannot withdraw more than 1000',
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(500, account)).toThrow(TransferFailedError);
    expect(() => account.transfer(500, account)).toThrow('Transfer failed');
  });

  // test('fetchBalance should return number in case if request did not failed', async () => {
  //   const balance = await account.fetchBalance();
  //   expect(typeof balance).toBe('number');
  // });

  test('should set new balance if fetchBalance returned number', async () => {
    // Mock fetchBalance to return a number
    const mockFetchBalance = jest.fn().mockResolvedValueOnce(750);
    account.fetchBalance = mockFetchBalance;

    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(750);
    expect(mockFetchBalance).toHaveBeenCalled();
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    // Mock fetchBalance to return null
    const mockFetchBalance = jest.fn().mockResolvedValueOnce(null);
    account.fetchBalance = mockFetchBalance;

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
    // await expect(account.synchronizeBalance()).rejects.toThrow(
    //   'Synchronization failed',
    // );
    expect(mockFetchBalance).toHaveBeenCalled();
  });
});
