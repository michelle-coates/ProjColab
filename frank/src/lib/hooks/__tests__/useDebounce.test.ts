/**
 * Tests for useDebounce Hook
 * Story 1.12 - Task 9: Debouncing Tests (300ms)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDebounce, useDebouncedCallback } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useDebounce value hook', () => {
    it('should return initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('initial', 300));

      expect(result.current).toBe('initial');
    });

    it('should debounce value changes by 300ms', async () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'first' } }
      );

      expect(result.current).toBe('first');

      // Change value
      rerender({ value: 'second' });

      // Value should not change immediately
      expect(result.current).toBe('first');

      // Fast forward 299ms - still shouldn't change
      act(() => {
        vi.advanceTimersByTime(299);
      });
      expect(result.current).toBe('first');

      // Fast forward 1ms more (total 300ms) - now it should change
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current).toBe('second');
    });

    it('should reset timer on rapid changes', async () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'a' } }
      );

      // Rapid changes
      rerender({ value: 'b' });
      act(() => vi.advanceTimersByTime(100));

      rerender({ value: 'c' });
      act(() => vi.advanceTimersByTime(100));

      rerender({ value: 'd' });
      act(() => vi.advanceTimersByTime(100));

      // Should still be 'a' because timer keeps resetting
      expect(result.current).toBe('a');

      // After full 300ms from last change
      act(() => {
        vi.advanceTimersByTime(200);
      });

      // Should now be 'd'
      expect(result.current).toBe('d');
    });

    it('should cleanup timeout on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      const { unmount } = renderHook(() => useDebounce('value', 300));

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it('should handle custom delay values', async () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 500),
        { initialProps: { value: 'first' } }
      );

      rerender({ value: 'second' });

      act(() => {
        vi.advanceTimersByTime(499);
      });
      expect(result.current).toBe('first');

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current).toBe('second');
    });
  });

  describe('useDebouncedCallback hook', () => {
    it('should debounce callback execution by 300ms', async () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useDebouncedCallback(callback, 300));

      // Call multiple times rapidly
      act(() => {
        result.current('arg1');
        result.current('arg2');
        result.current('arg3');
      });

      // Callback should not be called immediately
      expect(callback).not.toHaveBeenCalled();

      // Fast forward 300ms
      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Callback should be called once with last arguments
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('arg3');
    });

    it('should reset timer on each call', async () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useDebouncedCallback(callback, 300));

      act(() => {
        result.current('first');
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      act(() => {
        result.current('second');
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Still shouldn't be called (timer was reset)
      expect(callback).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(200);
      });

      // Now should be called with 'second'
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('second');
    });

    it('should cleanup on unmount', () => {
      const callback = vi.fn();
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      const { result, unmount } = renderHook(() => useDebouncedCallback(callback, 300));

      act(() => {
        result.current('test');
      });

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();

      // Callback should not execute after unmount
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle multiple arguments', async () => {
      const callback = vi.fn((a: string, b: number, c: boolean) => {});
      const { result } = renderHook(() => useDebouncedCallback(callback, 300));

      act(() => {
        result.current('test', 42, true);
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(callback).toHaveBeenCalledWith('test', 42, true);
    });
  });

  describe('Real-world validation scenario', () => {
    it('should prevent excessive validation API calls during typing', async () => {
      const validateField = vi.fn();
      const { result } = renderHook(() => useDebouncedCallback(validateField, 300));

      // Simulate user typing "hello"
      const characters = ['h', 'e', 'l', 'l', 'o'];

      characters.forEach((char, index) => {
        act(() => {
          result.current(characters.slice(0, index + 1).join(''));
          vi.advanceTimersByTime(50); // 50ms between keystrokes
        });
      });

      // Validation should not be called during typing
      expect(validateField).not.toHaveBeenCalled();

      // Wait for debounce to complete
      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Should be called once with final value
      expect(validateField).toHaveBeenCalledTimes(1);
      expect(validateField).toHaveBeenCalledWith('hello');
    });

    it('should allow immediate validation calls after debounce period', async () => {
      const validateField = vi.fn();
      const { result } = renderHook(() => useDebouncedCallback(validateField, 300));

      // First input
      act(() => {
        result.current('first');
        vi.advanceTimersByTime(300);
      });

      expect(validateField).toHaveBeenCalledTimes(1);
      expect(validateField).toHaveBeenCalledWith('first');

      // Second input after delay
      act(() => {
        result.current('second');
        vi.advanceTimersByTime(300);
      });

      expect(validateField).toHaveBeenCalledTimes(2);
      expect(validateField).toHaveBeenCalledWith('second');
    });
  });
});
