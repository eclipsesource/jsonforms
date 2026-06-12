import { describe, expect, test } from 'vitest';
import { setValue, touch } from '../src';

describe('command creators', () => {
  test('setValue creates a plain serializable command', () => {
    expect(setValue('/name', 'Ada')).toEqual({
      type: 'set-value',
      path: '/name',
      value: 'Ada',
    });
  });

  test('setValue records provenance when given', () => {
    expect(setValue('/name', 'Ada', '#/0/0')).toEqual({
      type: 'set-value',
      path: '/name',
      value: 'Ada',
      sourceNodeId: '#/0/0',
    });
  });

  test('touch records provenance when given', () => {
    expect(touch('#/0/0')).toEqual({ type: 'touch', nodeId: '#/0/0' });
    expect(touch('#/0/0', '#/0/0')).toEqual({
      type: 'touch',
      nodeId: '#/0/0',
      sourceNodeId: '#/0/0',
    });
  });
});
