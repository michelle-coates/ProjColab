import { type FC, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { type ImprovementItem } from '@prisma/client';
import debounce from 'lodash/debounce';
import Link from 'next/link';

interface ImpactEffortMatrixProps {
  improvements: ImprovementItem[];
  onPositionUpdate?: (improvementId: string, x: number, y: number) => Promise<void>;
  onError?: (error: Error) => void;
}

const QUADRANT_LABELS = {
  quickWins: 'Quick Wins',
  bigBets: 'Big Bets',
  fillIns: 'Fill-ins',
  questionable: 'Questionable',
};

const KEYBOARD_STEP = 0.05; // 5% movement per key press

const ImpactEffortMatrix: FC<ImpactEffortMatrixProps> = ({
  improvements,
  onPositionUpdate,
  onError,
}) => {
  const matrixRef = useRef<SVGSVGElement>(null);
  const [selectedImprovement, setSelectedImprovement] = useState<string | null>(null);
  const [hoveredImprovement, setHoveredImprovement] = useState<string | null>(null);
  const [lastValidPositions, setLastValidPositions] = useState<Record<string, { x: number, y: number }>>({});

  // Cache improvement lookup
  const hoveredItem = useMemo(() => 
    improvements.find(i => i.id === hoveredImprovement),
    [improvements, hoveredImprovement]
  );

  // Debounced position update
  const debouncedUpdate = useMemo(
    () => debounce(async (id: string, x: number, y: number) => {
      try {
        if (onPositionUpdate) {
          await onPositionUpdate(id, x, y);
          // Update last valid position after successful update
          setLastValidPositions(prev => ({
            ...prev,
            [id]: { x, y }
          }));
        }
      } catch (error) {
        // Revert to last valid position
        const lastValid = lastValidPositions[id];
        if (lastValid && onError) {
          onError(error as Error);
          if (onPositionUpdate) {
            await onPositionUpdate(id, lastValid.x, lastValid.y);
          }
        }
      }
    }, 100),
    [onPositionUpdate, onError, lastValidPositions]
  );

  // Convert matrix position to SVG coordinates
  const getPointCoordinates = useCallback((improvement: ImprovementItem) => {
    const position = improvement.matrixPosition as { x: number; y: number } | null;
    if (!position) return { x: 50, y: 50 }; // Default center position
    return {
      x: position.x * 100, // Scale to SVG viewport
      y: 100 - position.y * 100, // Invert Y axis for SVG coordinate system
    };
  }, []);

  const handleKeyboardNavigation = useCallback((
    event: React.KeyboardEvent,
    improvementId: string
  ) => {
    const improvement = improvements.find(i => i.id === improvementId);
    if (!improvement?.matrixPosition) return;

    const { x: currentX, y: currentY } = improvement.matrixPosition as { x: number, y: number };

    let newX = currentX;
    let newY = currentY;

    switch (event.key) {
      case 'ArrowLeft':
        newX = Math.max(0, currentX - KEYBOARD_STEP);
        break;
      case 'ArrowRight':
        newX = Math.min(1, currentX + KEYBOARD_STEP);
        break;
      case 'ArrowUp':
        newY = Math.min(1, currentY + KEYBOARD_STEP);
        break;
      case 'ArrowDown':
        newY = Math.max(0, currentY - KEYBOARD_STEP);
        break;
      default:
        return;
    }

    event.preventDefault();
    debouncedUpdate(improvementId, newX, newY);
  }, [improvements, debouncedUpdate]);

  const handleDragStart = useCallback((improvementId: string) => {
    setSelectedImprovement(improvementId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setSelectedImprovement(null);
  }, []);

  const handleDrag = useCallback((event: React.MouseEvent) => {
    if (!selectedImprovement || !matrixRef.current) return;

    const rect = matrixRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = 1 - (event.clientY - rect.top) / rect.height; // Invert Y for business logic

    // Clamp values between 0 and 1
    const clampedX = Math.max(0, Math.min(1, x));
    const clampedY = Math.max(0, Math.min(1, y));

    debouncedUpdate(selectedImprovement, clampedX, clampedY);
  }, [selectedImprovement, debouncedUpdate]);

  // Effect to initialize lastValidPositions
  useEffect(() => {
    const positions: Record<string, { x: number, y: number }> = {};
    improvements.forEach(improvement => {
      if (improvement.matrixPosition) {
        positions[improvement.id] = improvement.matrixPosition as { x: number, y: number };
      }
    });
    setLastValidPositions(positions);
  }, [improvements]);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded text-sm text-blue-700">
        <h4 className="font-semibold mb-2">How to Get Items on the Matrix:</h4>
        <ol className="list-decimal list-inside space-y-2">
          <li className="font-medium">Go to the <Link href="/dashboard" className="underline">Dashboard</Link> to:</li>
          <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-blue-600">
            <li>Add new improvements using the form at the top</li>
            <li>View and manage your improvements list</li>
          </ul>
          <li className="font-medium">For each improvement, you need:</li>
          <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-blue-600">
            <li>An effort estimate (Small/Medium/Large)</li>
            <li>Complete impact assessment questions</li>
          </ul>
          <li>Once both effort and impact are set, items will appear here</li>
          <li>Drag points to fine-tune their positions</li>
        </ol>
      </div>
      <div className="relative max-w-xl aspect-square mx-auto" role="figure" aria-label="Impact vs Effort Matrix">
        <svg
          ref={matrixRef}
          viewBox="-20 -20 140 140"
          className="w-full h-full bg-white shadow-sm rounded"
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onMouseMove={handleDrag}
        >
        {/* Grid Lines */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgb(226 232 240)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="url(#grid)" className="stroke-gray-200 stroke-1" />
        <line x1="50" y1="0" x2="50" y2="100" className="stroke-gray-300 stroke-1" />
        <line x1="0" y1="50" x2="100" y2="50" className="stroke-gray-300 stroke-1" />

        {/* Axis Labels */}
        <text
          x="-12"
          y="50"
          className="text-[8px] font-medium fill-gray-700"
          dominantBaseline="middle"
          textAnchor="middle"
          transform="rotate(-90 -12 50)"
          role="text"
        >
          Impact
        </text>
        <text
          x="50"
          y="112"
          className="text-[8px] font-medium fill-gray-700"
          textAnchor="middle"
          dominantBaseline="middle"
          role="text"
        >
          Effort
        </text>

        {/* Quadrant Labels */}
        <g>
          {/* Quick Wins - Top Right */}
          <text x="110" y="-6" className="text-[7px] font-semibold fill-green-700" textAnchor="start" dominantBaseline="hanging" role="text">
            {QUADRANT_LABELS.quickWins}
          </text>
          
          {/* Big Bets - Bottom Right */}
          <text x="110" y="106" className="text-[7px] font-semibold fill-blue-700" textAnchor="start" dominantBaseline="text-after-edge" role="text">
            {QUADRANT_LABELS.bigBets}
          </text>
          
          {/* Fill-ins - Top Left */}
          <text x="-10" y="-6" className="text-[7px] font-semibold fill-yellow-700" textAnchor="end" dominantBaseline="hanging" role="text">
            {QUADRANT_LABELS.fillIns}
          </text>
          
          {/* Questionable - Bottom Left */}
          <text x="-10" y="106" className="text-[7px] font-semibold fill-red-700" textAnchor="end" dominantBaseline="text-after-edge" role="text">
            {QUADRANT_LABELS.questionable}
          </text>
        </g>

        {/* Plot Points */}
        {improvements.map((improvement) => {
          const { x, y } = getPointCoordinates(improvement);
          const isHighValue = y > 50 && x < 50; // Quick Wins quadrant

          return (
            <g
              key={improvement.id}
              transform={`translate(${x},${y})`}
              onMouseDown={() => handleDragStart(improvement.id)}
              onMouseEnter={() => setHoveredImprovement(improvement.id)}
              onMouseLeave={() => setHoveredImprovement(null)}
              onKeyDown={(e) => handleKeyboardNavigation(e, improvement.id)}
              tabIndex={0}
              role="button"
              aria-label={`${improvement.title} - Impact: ${Math.round(y)}%, Effort: ${Math.round(x)}%`}
              className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <circle
                r="3"
                className={`
                  ${isHighValue ? 'fill-green-600' : 'fill-blue-600'}
                  ${selectedImprovement === improvement.id ? 'stroke-1.5 stroke-black' : 'stroke-0.5 stroke-white'}
                  transition-all duration-200
                `}
              />
            </g>
          );
        })}
      </svg>

      {/* Hover Tooltip */}
      {hoveredItem && (
        <div
          className="absolute z-10 p-3 bg-white border border-gray-200 rounded shadow-lg max-w-xs"
          style={{
            left: `${getPointCoordinates(hoveredItem).x}%`,
            top: `${getPointCoordinates(hoveredItem).y}%`,
            transform: 'translate(-50%, -120%)',
          }}
          role="tooltip"
        >
          <h3 className="font-bold text-gray-900 mb-1">{hoveredItem.title}</h3>
          <p className="text-sm text-gray-600 leading-snug">{hoveredItem.description}</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default ImpactEffortMatrix;