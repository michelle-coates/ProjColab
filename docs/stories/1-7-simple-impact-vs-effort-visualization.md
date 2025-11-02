# Story 1.7: Simple Impact vs Effort Visualization

As a product manager,
I want to see my prioritized improvements in a visual Impact vs Effort matrix,
So that I can quickly identify high-value, low-effort opportunities.

## Acceptance Criteria

1. 2x2 matrix visualization plotting improvements by Impact vs Effort
2. Interactive plot points showing improvement titles on hover
3. Clear quadrant labels: "Quick Wins," "Big Bets," "Fill-ins," "Questionable"
4. Ability to adjust improvement positioning by dragging plot points
5. Visual highlighting of "high value, low effort" recommendations

## Implementation Details

### Technical Requirements

- Frontend:
  - React component for 2x2 matrix visualization
  - Interactive SVG/Canvas implementation for plot points
  - Hover tooltips for improvement details
  - Drag-and-drop functionality for adjusting positions
  - Responsive design for various screen sizes
  - Quadrant styling and labeling
  - Highlight effects for recommended items

- Backend:
  - API endpoint for retrieving improvement data with impact/effort scores
  - Data model updates for storing matrix positions
  - Position update endpoints for drag-and-drop saves

### User Interface

1. Matrix Layout:
   - X-axis: Effort (Low to High)
   - Y-axis: Impact (Low to High)
   - Quadrant labels in corners
   - Grid lines for better visual reference
   - Zoom/pan controls (if needed for many items)

2. Plot Points:
   - Circular markers for each improvement
   - Size indicating confidence level (optional)
   - Color coding based on category
   - Hover state with full improvement details
   - Selected state when being dragged

3. Quadrant Styling:
   - "Quick Wins" (High Impact, Low Effort): Green background
   - "Big Bets" (High Impact, High Effort): Blue background
   - "Fill-ins" (Low Impact, Low Effort): Yellow background
   - "Questionable" (Low Impact, High Effort): Red background

4. Controls:
   - Filter controls for categories
   - Sort/group options
   - View options (size, color, labels)
   - Reset positions button
   - Save layout button

### Data Model Updates

```prisma
model Improvement {
  // Existing fields...
  matrixPosition Json? // Stores x,y coordinates
  impactScore   Float  // Calculated from comparisons
  effortLevel   String // S/M/L from previous story
}
```

### API Endpoints

1. GET /api/improvements/matrix
   - Returns improvements with position data
   - Includes impact scores and effort levels
   - Supports filtering and sorting

2. PUT /api/improvements/{id}/position
   - Updates matrix position for drag-and-drop
   - Validates position within bounds
   - Returns updated improvement

### Implementation Steps

1. Frontend Development:
   - Create Matrix component with SVG/Canvas rendering
   - Implement hover tooltips and drag-and-drop
   - Add quadrant styling and labels
   - Build control panel for filters/options

2. Backend Development:
   - Update data model for matrix positions
   - Implement position calculation logic
   - Create new API endpoints
   - Add position validation

3. Integration:
   - Connect Matrix component to API
   - Implement real-time updates
   - Add error handling
   - Optimize performance

4. Testing:
   - Unit tests for position calculations
   - Integration tests for drag-and-drop
   - Visual regression tests
   - Performance testing with large datasets

### Dependencies

- Story 1.4: Uses effort estimation data
- Story 1.5: Uses impact ranking data from comparisons

### Acceptance Testing

1. Matrix Rendering:
   - [x] Matrix displays with correct axes and labels
   - [x] Quadrants are visually distinct and labeled
   - [x] Grid lines provide clear reference points
   - [x] Responsive layout works on different screens

2. Plot Points:
   - [x] Each improvement appears as interactive point
   - [x] Hover shows complete improvement details
   - [x] Points are properly positioned by impact/effort
   - [x] Visual styling reflects improvement attributes

3. Drag and Drop:
   - [x] Points can be dragged to new positions
   - [x] Position updates save to backend
   - [x] Visual feedback during drag operation
   - [x] Invalid positions are prevented

4. Recommendations:
   - [x] "Quick Wins" quadrant items are highlighted
   - [x] Recommendations update with position changes
   - [x] Clear visual distinction for recommended items

## Implementation Status

✅ COMPLETED - November 2, 2025

All acceptance criteria have been met:
- 2x2 matrix visualization implemented with Impact vs Effort axes
- Interactive plot points with hover tooltips and evidence summary
- Clear quadrant labels for easy understanding
- Draggable plot points for position adjustment
- Visual highlighting of high-value/low-effort items in Quick Wins quadrant

Technical Implementation:
- Database schema updated with matrixPosition field
- Matrix tRPC router implemented with updatePosition and getMatrixData procedures
- Interactive visualization components created (ImpactEffortMatrix and MatrixControls)
- Real-time position updates and session persistence
- TypeScript compilation clean and components properly typed

### Security Considerations

- Validate matrix position updates
- Ensure proper user authorization
- Rate limit position update requests
- Sanitize improvement data in tooltips

### Performance Considerations

- Optimize matrix rendering for large datasets
- Implement virtual scrolling if needed
- Debounce position update requests
- Cache matrix data appropriately

### Analytics Integration

Track:
- Matrix view time
- Position adjustment frequency
- Quadrant distribution
- Recommendation clicks
- Filter usage patterns