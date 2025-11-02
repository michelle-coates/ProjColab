import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import ImpactEffortMatrix from '../ImpactEffortMatrix';

// Use type from the component instead of Prisma client
type Improvement = {
  id: string;
  title: string;
  description: string;
  category: string;
  effortLevel: string;
  matrixPosition: { x: number; y: number } | null;
  impactScore: number;
};

import { act } from '@testing-library/react';

// Remove global timer mocks to avoid conflicts
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  try {
    vi.runOnlyPendingTimers();
  } catch (e) {
    // Ignore errors if timers are already cleared
  }
  vi.useRealTimers();
});

const mockImprovements = [
  {
    id: '1',
    title: 'Test Improvement 1',
    description: 'Description 1',
    category: 'TEST',
    effortLevel: 'SMALL',
    matrixPosition: { x: 0.2, y: 0.8 },
    impactScore: 0.8,
  },
  {
    id: '2',
    title: 'Test Improvement 2',
    description: 'Description 2',
    category: 'TEST',
    effortLevel: 'MEDIUM',
    matrixPosition: { x: 0.7, y: 0.3 },
    impactScore: 0.3,
  },
];

describe('ImpactEffortMatrix', () => {
  it('renders all improvements as plot points', () => {
    render(<ImpactEffortMatrix improvements={mockImprovements} />);
    const points = screen.getAllByRole('button', { name: /Test Improvement/ });
    expect(points).toHaveLength(2);
  });

  it('shows tooltip on hover', async () => {
    render(<ImpactEffortMatrix improvements={mockImprovements} />);
    const point = screen.getByRole('button', { name: /Test Improvement 1/ });
    
    await act(async () => {
      fireEvent.mouseEnter(point);
    });
    
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    
    await act(async () => {
      fireEvent.mouseLeave(point);
    });
    
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('handles position updates via keyboard', async () => {
    const onPositionUpdate = vi.fn().mockResolvedValue(undefined);
    render(
      <ImpactEffortMatrix 
        improvements={mockImprovements}
        onPositionUpdate={onPositionUpdate}
      />
    );

    const point = screen.getByRole('button', { name: /Test Improvement 1/ });
    
    await act(async () => {
      point.focus();
    });
    
    // Test each arrow key
    for (const key of ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft']) {
      await act(async () => {
        fireEvent.keyDown(point, { key });
        await vi.advanceTimersByTime(100);
      });

      expect(onPositionUpdate).toHaveBeenLastCalledWith(
        '1',
        expect.any(Number),
        expect.any(Number)
      );
    }
  });

  it('prevents keyboard navigation outside matrix bounds', async () => {
    const onPositionUpdate = vi.fn().mockResolvedValue(undefined);
    render(
      <ImpactEffortMatrix 
        improvements={[{
          ...mockImprovements[0],
          matrixPosition: { x: 0, y: 0 }
        }]}
        onPositionUpdate={onPositionUpdate}
      />
    );

    const point = screen.getByRole('button', { name: /Test Improvement 1/ });
    await act(async () => {
      point.focus();
      
      // Try to move left and down from (0,0)
      fireEvent.keyDown(point, { key: 'ArrowLeft' });
      await vi.advanceTimersByTime(100);
      
      fireEvent.keyDown(point, { key: 'ArrowDown' });
      await vi.advanceTimersByTime(100);
    });
    
    // Should have only been called with clamped values
    expect(onPositionUpdate).toHaveBeenLastCalledWith(
      '1',
      0, // x coordinate
      0  // y coordinate
    );
  });

  it('handles position updates via drag', async () => {
    const onPositionUpdate = vi.fn().mockResolvedValue(undefined);
    const { container } = render(
      <ImpactEffortMatrix 
        improvements={mockImprovements}
        onPositionUpdate={onPositionUpdate}
      />
    );

    // Mock SVG dimensions
    const svg = container.querySelector('svg')!;
    const svgRect = { width: 100, height: 100, left: 0, top: 0, right: 100, bottom: 100, x: 0, y: 0 } as DOMRect;
    vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue(svgRect);

    const point = screen.getByRole('button', { name: /Test Improvement 1/ });
    point.getBoundingClientRect = () => svgRect;

    // Trigger the drag sequence
    await act(async () => {
      // Start drag with mousedown
      fireEvent.mouseDown(point);
      await vi.advanceTimersByTime(10);

      // Move point
      fireEvent.mouseMove(svg, { 
        clientX: 50,
        clientY: 50
      });
      await vi.advanceTimersByTime(100); // Wait for debounce

      // End drag
      fireEvent.mouseUp(point);
      await vi.advanceTimersByTime(10);
    });

    // Should have called position update
    expect(onPositionUpdate).toHaveBeenCalledWith(
      mockImprovements[0]!.id,
      expect.any(Number),
      expect.any(Number)
    );

    // Get actual values passed
    const lastCall = onPositionUpdate.mock.lastCall;
    expect(lastCall![1]).toBeCloseTo(0.5, 1); // x coordinate, allow small error
    expect(lastCall![2]).toBeCloseTo(0.5, 1); // y coordinate, allow small error
  });

  it('displays quadrant labels with correct roles', () => {
    render(<ImpactEffortMatrix improvements={mockImprovements} />);
    
    const labels = ['Quick Wins', 'Big Bets', 'Fill-ins', 'Questionable'];
    labels.forEach(label => {
      const element = screen.getByText(label);
      expect(element).toBeInTheDocument();
      expect(element).toHaveAttribute('role', 'text');
    });
  });

  it('maintains last valid positions on error', async () => {
    // Set up mock functions
    const onPositionUpdate = vi.fn();
    const onError = vi.fn();

    // First call succeeds
    onPositionUpdate.mockImplementationOnce(async () => { await vi.advanceTimersByTime(10); });

    // Second call fails
    onPositionUpdate.mockImplementationOnce(async () => {
      await vi.advanceTimersByTime(10);
      throw new Error('Update failed');
    });

    // Third call (revert) succeeds
    onPositionUpdate.mockImplementationOnce(async () => { await vi.advanceTimersByTime(10); });
    
    const { container } = render(
      <ImpactEffortMatrix 
        improvements={mockImprovements}
        onPositionUpdate={onPositionUpdate}
        onError={onError}
      />
    );

    // Mock SVG dimensions to make coordinate math easy
    const point = screen.getByRole('button', { name: /Test Improvement 1/ });
    const svg = container.querySelector('svg')!;
    const svgRect = { width: 100, height: 100, left: 0, top: 0, right: 100, bottom: 100, x: 0, y: 0 } as DOMRect;
    vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue(svgRect);
    point.getBoundingClientRect = () => svgRect;

    // First drag to establish valid position (0.5, 0.5)
    // Note: Y coordinate is inverted, so clientY of 50 becomes 0.5
    await act(async () => {
      fireEvent.mouseDown(point);
      await vi.advanceTimersByTime(10);

      fireEvent.mouseMove(svg, { clientX: 50, clientY: 50 });
      await vi.advanceTimersByTime(100); // Wait for debounce

      fireEvent.mouseUp(point);
      await vi.advanceTimersByTime(100); // Wait for update to complete
    });

    // Second drag attempt that should fail (0.75, 0.25)
    // Note: For Y coordinate, moving to clientY of 75 means moving down,
    // which maps to 0.25 in our component's coordinate system
    await act(async () => {
      fireEvent.mouseDown(point);
      await vi.advanceTimersByTime(10);

      fireEvent.mouseMove(svg, { clientX: 75, clientY: 75 });
      await vi.advanceTimersByTime(100); // Wait for debounce

      fireEvent.mouseUp(point);
      await vi.advanceTimersByTime(200); // Wait for error handling and revert
    });

    // Verify the sequence of events
    expect(onPositionUpdate).toHaveBeenCalledTimes(3);
    const calls = onPositionUpdate.mock.calls;
    
    // Ensure we have all the expected calls
    expect(calls.length).toBe(3);
    
    // First update should be at (0.5, 0.5)
    expect(calls[0]![0]).toBe(mockImprovements[0]!.id);
    expect(calls[0]![1]).toBeCloseTo(0.5, 1); // x = 50/100
    expect(calls[0]![2]).toBeCloseTo(0.5, 1); // y = 1 - (50/100)
    
    // Second update should be at (0.75, 0.25)
    expect(calls[1]![0]).toBe(mockImprovements[0]!.id);
    expect(calls[1]![1]).toBeCloseTo(0.75, 1); // x = 75/100
    expect(calls[1]![2]).toBeCloseTo(0.25, 1); // y = 1 - (75/100)

    // Third update (revert) should return to first position
    expect(calls[2]![0]).toBe(mockImprovements[0]!.id);
    expect(calls[2]![1]).toBeCloseTo(0.5, 1);
    expect(calls[2]![2]).toBeCloseTo(0.5, 1);

    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });

  it('handles focus management correctly', async () => {
    render(<ImpactEffortMatrix improvements={mockImprovements} />);
    
    const points = screen.getAllByRole('button');
    for (const point of points) {
      await act(async () => {
        point.focus();
      });
      expect(point).toHaveFocus();
      expect(point).toHaveClass('focus:ring-2');
    }
  });

  it('provides meaningful ARIA labels', () => {
    render(<ImpactEffortMatrix improvements={mockImprovements} />);
    
    const point = screen.getByRole('button', { name: /Test Improvement 1/ });
    expect(point).toHaveAccessibleName(/Impact:.+Effort/);
  });

  it('updates debounced position after delay', async () => {
    const onPositionUpdate = vi.fn().mockResolvedValue(undefined);
    
    render(
      <ImpactEffortMatrix 
        improvements={mockImprovements}
        onPositionUpdate={onPositionUpdate}
      />
    );

    const point = screen.getByRole('button', { name: /Test Improvement 1/ });
    
    // Trigger multiple quick updates within act
    await act(async () => {
      fireEvent.keyDown(point, { key: 'ArrowRight' });
      fireEvent.keyDown(point, { key: 'ArrowRight' });
      fireEvent.keyDown(point, { key: 'ArrowRight' });
      
      // Should not have called update yet
      expect(onPositionUpdate).not.toHaveBeenCalled();

      // Fast forward past debounce delay
      await vi.advanceTimersByTime(100);
    });

    // Should have only called once with last value
    expect(onPositionUpdate).toHaveBeenCalledTimes(1);
  });
});