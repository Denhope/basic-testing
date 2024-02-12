// src/07-mocking-lib-api/index.test.ts

import axios from 'axios';
import { throttledGetDataFromApi, THROTTLE_TIME } from './index';

jest.mock('axios');
jest.mock('lodash/throttle', () => jest.fn((fn) => fn));

describe('throttledGetDataFromApi', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(() => {
    jest.useFakeTimers();
    mockedAxios.create.mockReturnThis();
    mockedAxios.get.mockResolvedValue({ data: 'mocked data' }); // Mock the response data
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    const relativePath = '/posts';
    await throttledGetDataFromApi(relativePath);
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const relativePath = '/posts';
    await throttledGetDataFromApi(relativePath);
    expect(mockedAxios.get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const relativePath = '/posts';
    const result = await throttledGetDataFromApi(relativePath);
    expect(result).toEqual('mocked data');
  });

  test('should throttle requests', async () => {
    const relativePath = '/posts';
    await throttledGetDataFromApi(relativePath);
    await throttledGetDataFromApi(relativePath);
    jest.advanceTimersByTime(THROTTLE_TIME);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });
});
