# ProjColab UX Design Specification

_Created on November 1, 2025 by Michelle_
_Generated using BMad Method - Create UX Design Workflow v1.0_

---

## Executive Summary

**Project Understanding:** Frank is an AI collaboration tool that transforms product decision-making for early-stage companies by challenging assumptions through intelligent questioning rather than relying on subjective scoring methods. The platform operates at dual altitudes - Mini Frank for managing 50+ micro-improvements that fall through organizational cracks, and Frank Core for strategic prioritization.

**Target Users:** Resource-constrained product leaders including startup founders (Pre-Series A to Series B) and senior PMs leading small teams (2-5 people) who need to maximize limited development resources.

**Core Experience:** Evidence-based prioritization through conversational AI interrogation, pairwise ranking with contextual prompts, and strategic clustering to reveal improvement themes.

**Platform:** Web-first responsive application optimized for desktop/laptop workflow with tablet support, featuring chat-style conversational interface for AI interrogation with visual decision-making tools.

---

## 1. Design System Foundation

### 1.1 Design System Choice

**Selected Design System:** shadcn/ui (Modern, Tailwind-based)

**Rationale:** Frank's target users - startup founders and product managers - are accustomed to beautiful, streamlined UIs from tools like Notion, Linear, and modern SaaS applications. shadcn/ui provides the professional polish that builds trust with startup leaders while maintaining the modern, approachable aesthetic they expect.

**What shadcn/ui Provides:**
- 47+ professionally designed, accessible components
- Built on Radix UI primitives with WCAG 2.1 AA compliance
- Tailwind CSS foundation for consistent design tokens
- Customizable theme system for brand alignment
- Copy-paste component architecture for development efficiency

**Component Foundation:**
- **Conversational Interface:** Dialog, Sheet, Command components for AI interrogation
- **Decision-Making Tools:** Button hierarchies, Card layouts, Badge systems for evidence tracking
- **Data Visualization:** Chart components, Progress indicators, Tooltip overlays
- **Navigation:** Tabs, Breadcrumb, Navigation Menu for workflow progression
- **Forms & Input:** Input, Textarea, Select, Checkbox for evidence gathering

**Custom Components Needed:**
- Evidence confidence visualizer
- Pairwise comparison interface  
- Strategic clustering display
- Conversation bubble styling for AI interactions

**Accessibility Benefits:**
- Screen reader optimization built-in
- Keyboard navigation patterns established
- Color contrast compliance ensured
- Focus management handled automatically

**Brand Alignment:** The system's clean, modern aesthetic aligns with Frank's positioning as an intelligent, professional thinking partner - serious enough for strategic decisions, approachable enough for daily use.

---

## 2. Core User Experience

### 2.1 Defining Experience

**The Defining Frank Experience:** "Frank keeps your product honest" through conversational AI interrogation that challenges assumptions with targeted questions.

**Core User Action (Most Frequent):** Users engage in evidence-based conversations with Frank's AI, answering questions like "What evidence supports this assumption?" and "How will you measure success?" rather than providing subjective 1-5 ratings.

**Must Be Effortless:** The transition from gut-feel prioritization to evidence-based decision making should feel like chatting with an intelligent team member, not filling out forms.

**Most Critical to Get Right:** The AI interrogation quality - questions must feel insightful and helpful rather than robotic or pedantic. Users should finish conversations feeling more confident about their decisions, not frustrated by the process.

**Platform Strategy:** Web-first responsive application optimized for desktop/laptop workflow (primary use case) with tablet support for review and lightweight interactions. Chat-style conversational interface for AI interrogation combined with visual decision-making tools for pairwise ranking and matrix visualization.

**Desired Emotional Response:** Users should feel **emboldened and empowered** - like they've worked with a trusted advisor and mentor who helped them test their assumptions in the right way. They want guidance, not answers, and should come away confident that they didn't hand over decision-making but were equipped to make better decisions themselves.

**Key Emotional States:**
- **Empowered:** "I'm making better decisions with intelligent support"
- **Confident:** "My reasoning is solid and evidence-based" 
- **Collaborative:** "This feels like working with a thoughtful team member"
- **Intellectually Stimulated:** "The questions helped me think more clearly"
- **Relief:** "I'm not guessing anymore - I have a systematic approach"

**The Tellable Moment:** Users should feel compelled to share: "Frank helped me realize I was missing crucial evidence about our mobile navigation fix - turns out it was mentioned 15 times in support tickets this month. I felt so much more confident prioritizing it after that conversation."

**Inspiration Analysis - Tools That Get "Trusted Advisor" Right:**

**Current Tool Ecosystem:**
- **Docs/Brain:** Notion, Google Docs (thinking + recording + sharing)
- **Backlog:** Jira, Linear, Trello (ubiquity, team habit)
- **Collaboration:** Slack, Discord (speed, async)
- **Exploration:** FigJam, Miro (clarity, whiteboarding)
- **Planning:** ClickUp, Asana (cheap PM suites)

**Frank's Strategic Positioning:** Like Notion AI, Slack bots, or Figma plugins - Frank sits **on top** of existing workflows rather than replacing them. Users don't easily adopt new platforms, but they adopt intelligent layers that enhance what they already use.

**"Trusted Advisor" Pattern Analysis:**
- **ChatGPT (with system tone):** Conversational, Socratic when guided properly
- **Notion AI:** Synthesizes and suggests rather than just executing
- **Rewind.ai:** Surfaces insights with memory and context
- **Tldraw + AI:** Enables exploratory ideation

**Successful Guidance Tools:**
- **CoachAI:** Socratic questioning + accountability
- **Reflect/Mem:** AI prompts reflection rather than provides answers
- **Guidde:** Guides processes but doesn't make decisions
- **Synthesia:** Structured prompting templates

**Key UX Patterns That Work:**
- Challenge assumptions gently (not aggressively)
- Bring structured thinking to chaotic situations
- Help users form their own judgment
- Reduce cognitive load without removing agency
- Never dump answers blindly or make users feel passive

**Frank's Unique Niche:** "Your thinking sparring partner" for product strategy + cognitive assistance - not a task doer, but a thought sharpener. No existing tool owns this specific product prioritization + AI guidance combination.

### 2.2 Novel UX Patterns

**Frank's Novel UX Pattern: "AI Socratic Interrogation for Product Decisions"**

**Pattern Name:** Guided Evidence Discovery
**User Goal:** Make confident, evidence-based product prioritization decisions while retaining full decision-making authority
**Trigger:** User inputs a product improvement or decision that needs prioritization

**Interaction Flow:**
1. **Context Capture:** User describes improvement/decision in natural language
2. **Intelligent Questioning:** Frank generates targeted questions based on improvement type, effort level, and context
3. **Evidence Gathering:** User responds with concrete data, metrics, or observable evidence
4. **Assumption Challenging:** Frank identifies gaps or assumptions, prompts for validation
5. **Synthesis Support:** Frank helps user connect evidence to strategic outcomes without making the decision

**Visual Feedback:** 
- Conversational interface with thoughtful question bubbles
- Evidence collection that visually builds confidence scores
- Progress indicators showing reasoning completeness
- Visual synthesis of gathered evidence for decision support

**States:**
- **Discovery:** Open-ended questioning to understand context
- **Evidence-Gathering:** Targeted questions based on gaps identified
- **Assumption-Testing:** Socratic follow-ups to challenge weak reasoning
- **Synthesis:** Visual summary of evidence for user's final decision
- **Confidence:** User-driven decision with documented rationale

**Platform Considerations:**
- **Desktop:** Full conversational flow with rich evidence visualization
- **Mobile:** Quick evidence checks and follow-up questions
- **Tablet:** Review mode for decision synthesis and team sharing

**Accessibility:** 
- Keyboard navigation through conversation flow
- Screen reader support for question-answer progression
- Alternative input methods for evidence gathering

**Inspiration from Similar Patterns:**
- CoachAI's Socratic questioning approach
- Notion AI's synthesis without decision-making
- ChatGPT's conversational intelligence when properly guided

**Key Differentiator:** Unlike traditional AI tools that provide answers or traditional PM tools that require form-filling, Frank creates a structured conversation that builds evidence systematically while preserving user agency and decision ownership. The pattern feels like "thinking with a brilliant colleague" rather than "using a tool."

---

## 3. Visual Foundation

### 3.1 Color System

**Brand Foundation:** Frank's visual identity embodies "calm clarity" - spacious, low-noise design that creates breathing room for thinking. The aesthetic follows "Notion meets Linear with Stripe's restraint."

**Core Brand Palette:**
- **Soft Charcoal (#1D1F21):** Primary text - serious thinking
- **Warm White/Soft Gray (#F6F7F8):** Background - calm, open space  
- **Card Gray (#E4E7E9):** UI structure - quiet organization
- **Muted Sage/Teal (#76A99A):** Accent - growth + clarity
- **Success Highlight (#00C48C):** Sparingly used for key moments

**Quantitative Guidance:** 80% background neutral, 15% dark text, 5% accent + affordances

**Brand Personality in Color:**
- **Intelligent but not smug:** Sophisticated neutrals without sterile coldness
- **Candid and grounded:** Clean contrasts that support clear thinking
- **Warm and collaborative:** Soft sage accent that feels encouraging
- **Socratic and supportive:** Colors that recede to let content shine

**Typography System:**
- **Primary:** Inter - safe, clear, versatile for thinking interfaces
- **Style:** Sentence case, adequate line spacing, max 2 weights per screen
- **Tone:** Clean, confident, modern - human-centric not corporate

**Layout Foundation:**
- **Spacing System:** Wide margins, high whitespace for "space to think"
- **Layout Grid:** Single-column priority flow with card-based segmentation  
- **Corner Radius:** Soft rounded corners (4-6px) for approachable feel
- **Shadows:** Subtle only when functionally useful, never decorative

**Interaction Principles:**
- **Microinteractions:** "Clarity dawning, not fireworks" - gentle transitions
- **AI Feedback:** Soft pulse or tiny shimmer when processing, never spinning dots
- **Success States:** Smooth highlights, subtle confetti only at significant moments
- **Metaphors:** Spark/glimmer = insight, flow lines = clarity journey, stacked cards = structured thinking

**Visual Inspiration Alignment:**
- **Clarity:** Notion, Linear
- **Warmth:** Headspace, Calm  
- **Confidence:** Stripe
- **Focus:** Apple Notes, Craft
- **Thinking:** Muse App, tl;draw minimal mode

**Key Design Principle:** "Less noise. More knowing." - Everything signals "Think with me. We'll figure it out."

**Interactive Visualizations:**

- Color Theme Explorer: [ux-color-themes.html](./ux-color-themes.html)

---

## 4. Design Direction

### 4.1 Chosen Design Approach

**Selected Design Flow:** Progressive Disclosure from Guided to Power User

**Primary Direction:** Split Context Panel (#2) with Evidence Builder (#6) workflow, scaling to Power User Dense (#8) for experienced users.

**Design Philosophy:** "Learn → Build → Optimize" - Frank adapts its interface complexity to match user confidence and expertise.

**Layout Decisions:**
- **Navigation Pattern:** Context-aware panels that expand as users gain confidence
- **Content Structure:** Split-panel approach for learning, transitioning to comprehensive forms, scaling to multi-panel efficiency
- **Content Organization:** Evidence-focused cards with conversation support throughout all modes

**Hierarchy Decisions:**
- **Visual Density:** Starts spacious and contextual, becomes information-rich for power users
- **Header Emphasis:** Consistent conversation prominence with increasing data visibility
- **Content Focus:** Evidence-based decision making supported by AI guidance across all complexity levels

**Interaction Decisions:**
- **Primary Action Pattern:** Conversational flow with structured evidence building
- **Information Disclosure:** Progressive - from guided questioning to comprehensive data collection to rapid workflow
- **User Control:** Adaptive intelligence that recognizes user expertise and adjusts interface complexity

**Visual Style Decisions:**
- **Weight:** Balanced design that maintains Frank's "calm clarity" across all complexity levels
- **Depth Cues:** Subtle elevation with card-based organization for evidence and context
- **Border Style:** Soft, consistent with Frank's approachable personality

**User Journey Integration:**
1. **First-Time Users:** Split Context Panel (#2) - Learn Frank's questioning patterns with conversation + evidence side-by-side
2. **Building Confidence:** Evidence Builder (#6) - Systematic evidence gathering with AI guidance and structured forms
3. **Power Users:** Dense Interface (#8) - All context visible for rapid prioritization with persistent panels and quick actions

**Rationale:** This progressive disclosure approach matches Frank's core value proposition - growing user confidence in evidence-based decision making. Users start with guided learning, develop systematic thinking skills, and graduate to efficient power-user workflows while maintaining Frank's collaborative AI guidance throughout.

**Key Design Principles Applied:**
- **Calm Clarity:** Maintained across all complexity levels through consistent spacing and typography
- **Socratic Guidance:** AI conversation remains prominent but adapts to user expertise level  
- **Evidence-Focused:** All interfaces prioritize evidence quality and decision rationale over gut-feel scoring

**Interactive Mockups:**

- Design Direction Showcase: [ux-design-directions.html](./ux-design-directions.html)

---

## 5. User Journey Flows

### 5.1 Critical User Paths

**Journey 1: Solo Product Manager - First-Time Prioritization Session**

**User Goal:** Transform from gut-feel prioritization to evidence-based decision making while building confidence in Frank's approach

**Entry Point:** Frank dashboard with "Start New Session" - Split Context Panel interface for guided learning

**Flow Steps:**

**Step 1: Strategic Context Setup (30 seconds)**
- User sees: Welcome screen with 3 quick context questions
- User does: Selects business type (SaaS, marketplace, e-commerce) and enters 2-3 strategic objectives
- System responds: "Got it! I'll ask questions focused on [churn reduction] and [enterprise growth]"
- Frank's Intelligence: LLM primed with business context for relevant questioning

**Step 2: Feature Import & Quick Assessment (2-3 minutes)**
- User sees: Simple import interface - "Copy/paste your feature list or type them one by one"
- User does: Imports 8-12 micro-improvements from Notion/existing tools
- System responds: Frank presents 3 numbered starter questions based on strategic context
- Example Questions: "1. Which of these directly supports your churn reduction goal? 2. How often do users mention these in support tickets? 3. Which feels most urgent vs. most important?"

**Step 3: AI Interrogation & Evidence Discovery (5-7 minutes)**
- User sees: Split Context Panel - conversation on left, evidence building on right
- User does: Answers Frank's follow-up questions that probe gaps in initial responses
- System responds: Frank uses non-technical language for effort estimation, asks about frequency, user impact, strategic alignment
- **Critical Aha Moment:** Frank surfaces insight user hadn't considered (e.g., "Mobile users are 40% of your base but represent 60% of churn - that nav bug might be more critical than you realized")

**Step 4: Guided Pairwise Comparison (3-5 minutes)**
- User sees: Comparison interface with Frank's contextual questions
- User does: Makes 3-4 key comparisons (Frank's intelligent clustering reduces 12 items to essential decisions)
- System responds: Each comparison includes Frank's reasoning prompt: "Which removes a bigger blocker to your churn reduction goal?"
- Evidence Integration: Right panel shows accumulated evidence for each item being compared

**Step 5: Results & Confidence Building (1-2 minutes)**
- User sees: Impact vs Effort visualization with their decisions
- User does: Reviews prioritized list with documented rationale
- System responds: "You've identified 2 high-value, low-effort improvements with strong evidence. Here's your action plan..."
- Success State: User exports prioritized list to existing tools with decision rationale included

**Decision Points:**
- **Strategic Context Quality:** If objectives are vague, Frank asks clarifying questions before proceeding
- **Evidence Gaps:** If user lacks specific data, Frank guides them to find it or proceed with assumptions clearly marked
- **Complexity Level:** Frank adjusts questioning depth based on user's confidence signals

**Error States:**
- **No Clear Priorities:** Frank helps user break down complex items or suggests starting with fewer items
- **Conflicting Evidence:** Frank surfaces the conflict and helps user investigate further
- **Time Pressure:** Frank offers "Quick Mode" that focuses on highest-confidence decisions

**Success Criteria:**
- User experiences at least one insight they hadn't considered
- User feels more confident about their priority decisions
- User understands how evidence-based prioritization differs from gut-feel
- User wants to use Frank for future prioritization decisions

**Journey 2: Team Lead - Collaborative Prioritization (Scaling to Power User Dense)**

**User Goal:** Facilitate team consensus on priorities while leveraging diverse team expertise

**Flow Approach:** Asynchronous evidence gathering → Synchronous team decision session → Outcome tracking

**Key Steps:**
1. **Team Setup:** Lead creates shared workspace, invites team members
2. **Distributed Input:** Team members contribute improvements and context via Slack integration
3. **Evidence Building:** Domain experts provide specialized context (engineering effort, UX impact, business value)
4. **Facilitated Decision:** Team lead runs collaborative session using Frank's guided comparison tools
5. **Implementation Tracking:** Team assigns ownership and tracks outcomes for learning

**Journey 3: Startup Founder - Strategic Alignment Discovery**

**User Goal:** Discover how scattered micro-improvements connect to strategic business objectives

**Flow Approach:** Context loading → Theme discovery → Resource optimization → Strategic validation

**Key Steps:**
1. **Bulk Import:** Founder imports 31 improvements from multiple tools (Jira, Notion, Slack conversations)  
2. **Strategic Clustering:** Frank identifies themes and reveals hidden connections to business goals
3. **Resource Synergies:** Frank suggests bundling improvements with planned feature work
4. **Board Presentation:** Frank generates strategic rationale for resource allocation decisions
5. **Outcome Measurement:** Three-month retrospective showing business impact of prioritized improvements

---

## 6. Component Library

### 6.1 Component Strategy

**Foundation:** shadcn/ui components provide the base design system with professional polish and accessibility compliance. Custom components extend this foundation to support Frank's unique "AI Socratic Interrogation" pattern.

**Design System Components (shadcn/ui):**
- **Conversation Framework:** Dialog, Sheet, Command components for AI interrogation interface
- **Decision Tools:** Button hierarchies, Card layouts, Badge systems for evidence tracking and priority visualization
- **Data Input:** Input, Textarea, Select, Checkbox for evidence gathering and user responses
- **Navigation:** Tabs, Breadcrumb, Navigation Menu for workflow progression and session management
- **Feedback:** Progress indicators, Alert, Toast for system responses and validation states

**Custom Components for Frank's Evidence-Based Prioritization:**

**Component 1: Evidence Confidence Visualizer**

**Purpose:** Shows real-time evidence strength as users build their case, creating visual motivation to gather better data

**Anatomy:**
- **Evidence Quality Bar:** Horizontal progress indicator with confidence percentage (0-100%)
- **Evidence Source Labels:** Badges showing data sources (Analytics, Support Tickets, User Feedback, Assumptions)
- **Confidence Trend:** Subtle animation showing confidence increasing as evidence is added
- **Quality Indicators:** Color-coded strength levels (Red: Weak/Assumptions, Yellow: Some Evidence, Green: Strong Evidence)

**States:**
- **Default:** Empty state with gentle prompt "Start building evidence..."
- **Building:** Progressive fill with smooth animations as evidence is added
- **Strong Evidence:** Green completion state with confidence score 80%+
- **Weak Evidence:** Yellow/amber warning state when relying heavily on assumptions
- **Conflicting Evidence:** Orange state when evidence points in different directions
- **Loading:** Subtle pulse when Frank is analyzing evidence quality

**Variants:**
- **Compact:** Single progress bar for sidebar/mobile contexts
- **Detailed:** Full breakdown with evidence source analysis for Evidence Builder interface
- **Comparison:** Side-by-side confidence bars for pairwise comparison interface

**Behavior:**
- **Real-time Updates:** Confidence adjusts instantly as user provides evidence
- **Contextual Prompts:** When confidence is low, suggests specific evidence types to gather
- **Historical Memory:** Shows confidence trends over time for power users

**Accessibility:**
- **ARIA Role:** progressbar with current confidence percentage announced
- **Keyboard Navigation:** Tab to confidence details, space to expand evidence breakdown
- **Screen Reader:** "Evidence confidence: 75% strong, based on analytics data and user feedback"

**Component 2: Pairwise Comparison Interface**

**Purpose:** Facilitates guided decision-making between two improvements with Frank's contextual questioning

**Anatomy:**
- **Option Cards:** Two side-by-side cards displaying improvement details (title, impact, effort, evidence summary)
- **VS Divider:** Central element showing Frank's avatar with contextual question bubble
- **Choice Actions:** Primary buttons on each card for selection with confidence indicators
- **Evidence Preview:** Collapsible sections showing key evidence for each option
- **Progress Context:** Shows comparison progress (3 of 8) and session context

**States:**
- **Default:** Two options displayed with Frank's guiding question
- **Hover:** Option cards elevate slightly, choice buttons become more prominent
- **Selection:** Chosen card gets success styling, alternative fades with subtle animation
- **Thinking:** Frank's question area shows gentle thinking animation while processing choice
- **Next Transition:** Smooth transition to next comparison with new options sliding in
- **Completed:** Final state showing ranking built from comparisons

**Variants:**
- **Desktop:** Full side-by-side layout with detailed evidence sections
- **Tablet:** Stacked layout with swipe gestures for mobile-friendly comparison
- **Quick Mode:** Simplified cards for rapid decisions with essential information only
- **Deep Dive:** Expanded cards with full evidence breakdown for complex decisions

**Behavior:**
- **Intelligent Questioning:** Frank's questions adapt based on improvement types and strategic context
- **Evidence Integration:** Displays relevant evidence gathered from previous interrogation
- **Choice Persistence:** Remembers rationale for decisions and builds cumulative ranking
- **Smart Clustering:** Reduces total comparisons needed through algorithmic grouping

**Accessibility:**
- **ARIA Role:** radiogroup for option selection with clear labeling
- **Keyboard Navigation:** Arrow keys to navigate between options, space to select, enter to confirm
- **Screen Reader:** "Comparison 3 of 8: Mobile navigation fix versus data export feature. Frank asks: Which removes a bigger blocker to user success?"

**Component 3: Strategic Clustering Display**

**Purpose:** Visualizes how micro-improvements group into strategic themes, revealing hidden connections

**Anatomy:**
- **Theme Clusters:** Visual groupings of related improvements with theme labels
- **Connection Lines:** Subtle lines showing relationships between improvements and strategic objectives
- **Theme Headers:** Clear labels with improvement count and strategic alignment score
- **Cluster Cards:** Individual improvements within each theme with quick impact/effort indicators
- **Strategic Objectives:** Top-level goals that clusters connect to (reduce churn, grow enterprise, etc.)

**States:**
- **Default:** Organized clusters with clear theme separation
- **Hover:** Highlight cluster and show strategic connections
- **Expanded:** Detailed view of single cluster with full improvement details
- **Filtered:** Show only improvements related to specific strategic objective
- **Empty:** Gentle guidance when no clear themes emerge
- **Loading:** Progressive reveal as Frank analyzes improvement relationships

**Variants:**
- **Overview:** High-level theme view for dashboard presentation
- **Detailed:** Full breakdown for deep analysis and decision-making
- **Interactive:** Drag-and-drop for manual theme refinement
- **Mobile:** Accordion-style collapsed clusters for small screens

**Behavior:**
- **Auto-Clustering:** Frank automatically groups related improvements by similarity
- **Manual Override:** Users can drag improvements between clusters or create custom themes
- **Strategic Scoring:** Shows how well each cluster supports stated business objectives
- **Priority Weighting:** Visual emphasis on clusters with highest strategic value

**Accessibility:**
- **ARIA Role:** tree structure with expandable theme nodes
- **Keyboard Navigation:** Tab through themes, arrow keys within clusters, enter to expand
- **Screen Reader:** "Churn reduction theme contains 5 improvements with high strategic alignment"

**Component 4: AI Conversation Bubbles**

**Purpose:** Creates natural chat experience with Frank while maintaining professional credibility

**Anatomy:**
- **Frank Avatar:** Consistent "F" avatar with Frank's sage green branding
- **Message Bubble:** Chat-style bubble with Frank's personality elements
- **Insight Sparks:** Subtle animated indicators when Frank provides key insights
- **Thinking Indicators:** Gentle animation when Frank is processing responses
- **Action Prompts:** Inline buttons for common responses or guided next steps
- **Evidence Integration:** Ability to attach evidence or data to conversation context

**States:**
- **Default:** Standard conversation bubble with Frank's message
- **Insight:** Special styling with spark animation for key realizations
- **Question:** Clear styling that indicates Frank wants user response
- **Thinking:** Animated dots or pulse while Frank formulates response
- **Error:** Gentle handling when Frank can't process user input
- **Follow-up:** Connected bubble styling for multi-part Frank responses

**Variants:**
- **Standard:** Regular conversation message
- **Insight:** Special highlight for "aha moments" Frank surfaces
- **Question:** Clear prompting style for user input requests
- **System:** More subtle styling for process updates and transitions

**Behavior:**
- **Conversational Flow:** Natural progression with appropriate delays and transitions
- **Personality Consistency:** Maintains Frank's "intelligent but not smug" tone visually
- **Context Awareness:** References previous conversation and builds on established evidence
- **Adaptive Complexity:** Adjusts questioning depth based on user expertise signals

**Accessibility:**
- **ARIA Role:** log region for conversation history with proper message labeling
- **Keyboard Navigation:** Tab through action prompts, screen reader announces Frank's questions clearly
- **Screen Reader:** "Frank asks: What evidence shows this impacts user retention versus just being annoying?"

**Integration Strategy:**
All custom components work together in the progressive disclosure flow:
1. **Split Context Panel:** Evidence Visualizer + Conversation Bubbles
2. **Evidence Builder:** All components integrated for systematic evidence gathering
3. **Power User Dense:** Compact variants of all components for efficient workflow

**Development Notes:**
- Built on shadcn/ui foundation for consistency and accessibility
- Styled with Frank's brand palette (calm clarity with sage green accents)
- Responsive design supporting desktop-first with tablet/mobile adaptation
- Smooth animations that feel like "clarity dawning, not fireworks"

---

## 7. UX Pattern Decisions

### 7.1 Consistency Rules

**Critical UX Patterns for Frank's Evidence-Based Prioritization Experience**

**1. AI Interaction Patterns (Frank's Personality Consistency)**

**Questioning vs. Insight vs. System Response:**
- **Questions:** Frank's avatar with soft sage bubble, gentle prompt styling: "Let's unpack that assumption..."
- **Insights:** Spark animation + success green accent: "Strong evidence here! The 60% churn correlation is compelling."
- **System Updates:** Subtle gray styling for process updates: "Evidence confidence updated to 85%"
- **Thinking:** Gentle pulse animation, never spinning dots: "Frank is analyzing your response..."

**Conversation Flow Pattern:**
- **Socratic First:** Frank always asks before providing answers ("How do you know?" before "Here's what I think")
- **Context Building:** Frank references previous responses and builds cumulative understanding
- **Gentle Challenge:** Questions assumptions without being aggressive ("That could work — if your goal is retention. Is it?")
- **Evidence Focus:** Always connects questions back to evidence quality and decision confidence

**2. Evidence Gathering Patterns (Building Confidence Systematically)**

**Evidence Quality Progression:**
- **Initial State:** "What evidence supports this?" - Open exploration
- **Building State:** Real-time confidence visualization as data is added
- **Strong Evidence:** Visual confirmation with green success state and confidence score
- **Evidence Gaps:** Gentle prompting for missing data types without blocking progress
- **Conflicting Evidence:** Frank surfaces conflicts and helps user investigate further

**Evidence Source Hierarchy:**
- **Primary:** Analytics data, support tickets, user research (green badges)
- **Secondary:** Team feedback, competitive analysis, strategic alignment (yellow badges)  
- **Assumptions:** Clearly marked as assumptions requiring validation (orange badges)

**3. Decision Support Patterns (Maintaining User Agency)**

**Choice Presentation:**
- **Always Binary:** Pairwise comparisons only, never overwhelming lists of options
- **Contextual Questions:** Each decision includes Frank's targeted question based on strategic context
- **Evidence Integration:** Show relevant evidence for each option being compared
- **User Control:** Clear "Choose This" buttons - Frank never makes the decision

**Confidence Building:**
- **Progressive Ranking:** Decisions build cumulative ranking with clear rationale
- **Decision Ownership:** User's choice is prominent, Frank's guidance is supportive
- **Rationale Capture:** Every decision includes documented reasoning for future reference
- **Reversible Decisions:** Users can revisit and adjust rankings with Frank's help

**4. Feedback and Validation Patterns (Calm Clarity Communication)**

**Success Patterns:**
- **Insight Moments:** Spark animation with gentle success highlighting when Frank surfaces key insights
- **Evidence Strength:** Smooth confidence bar progression with encouraging micro-copy
- **Decision Completion:** Subtle success state without overwhelming celebration
- **Session Success:** Clear summary of evidence gathered and decisions made

**Guidance Patterns:**
- **Gentle Prompting:** Soft suggestions rather than demanding requirements
- **Progressive Disclosure:** More complex options revealed as user demonstrates readiness
- **Context-Aware Help:** Assistance appears based on user behavior, not arbitrary triggers
- **Never Blocking:** Users can proceed with incomplete evidence, clearly marked as assumptions

**5. Information Hierarchy Patterns (Supporting Clear Thinking)**

**Content Organization:**
- **Evidence First:** Always lead with data, then interpretation
- **Strategic Context:** Connect micro-improvements to stated business objectives
- **Effort Reality:** Present effort estimates in user-friendly language
- **Impact Clarity:** Distinguish between user impact, business impact, and strategic alignment

**Visual Priority:**
- **Frank's Questions:** Most prominent - the conversation drives everything
- **User Evidence:** Clear input areas with confidence visualization
- **Decision Options:** Balanced presentation without artificial emphasis
- **Supporting Context:** Available but secondary to main decision flow

**6. Transition and Flow Patterns (Maintaining Thinking Context)**

**Interface Progression:**
- **Split Context → Evidence Builder:** Triggered when user demonstrates understanding of Frank's approach
- **Evidence Builder → Power User:** Unlocked after successful completion of structured evidence sessions
- **Adaptive Intelligence:** Frank recognizes user expertise and adjusts complexity accordingly

**Session Continuity:**
- **Context Persistence:** Frank remembers previous sessions and builds on established patterns
- **Progressive Learning:** Interface adapts to user's demonstrated comfort with evidence-based thinking
- **Seamless Transitions:** Moving between interface levels feels natural, not jarring

**Implementation Guidelines:**

**Tone Consistency:**
- **Voice:** Calm senior PM with taste - intelligent but never smug
- **Prompting:** Curiosity-driven questions that sharpen thinking
- **Feedback:** Encouraging without false praise, honest without being harsh

**Visual Consistency:**
- **Colors:** 80% neutral background, 15% dark text, 5% sage accent for key actions
- **Animation:** "Clarity dawning" - gentle transitions and meaningful micro-interactions
- **Typography:** Clean, confident, adequate breathing room for thinking

**Behavioral Consistency:**
- **Predictable Intelligence:** Frank's responses feel thoughtful and consistent
- **Respectful Pacing:** Never rushing users through important decisions
- **Collaborative Authority:** Frank has expertise but users retain decision ownership

**Pattern Validation:**
Each pattern supports Frank's core value proposition: "Think with me. We'll figure it out." Users should feel empowered and equipped, never directed or replaced.

---

## 8. Responsive Design & Accessibility

### 8.1 Responsive Strategy

**Adaptive Interface Philosophy:** Frank's interface complexity adapts to both device capabilities and context of use, maintaining "space to think" across all platforms.

**Platform-Specific Design Approaches:**

**Desktop (Primary Platform):**
- **Resolution:** 1024px+ optimized for laptop/desktop workflow
- **Interface Mode:** Full progressive disclosure (Split Context → Evidence Builder → Power User Dense)
- **Layout:** Multi-panel layouts with rich context and comprehensive conversation flows
- **Interaction:** Keyboard shortcuts, hover states, detailed evidence visualization
- **Content Density:** Information-rich for deep analysis and systematic evidence building

**Tablet (Collaborative Review):**
- **Resolution:** 768px-1023px optimized for review and team collaboration
- **Interface Mode:** **Minimal Focus Mode** - distraction-free for clear thinking
- **Layout:** Single-column, centered content with generous touch targets
- **Interaction:** Touch-optimized with swipe gestures for pairwise comparisons
- **Content Density:** Focused on one decision at a time, simplified evidence display
- **Use Cases:** Team review sessions, presenting decisions to stakeholders, lightweight evidence gathering

**Mobile (Quick Updates):**
- **Resolution:** <768px for essential updates and review
- **Interface Mode:** **Minimal Focus Mode** - maximum simplicity
- **Layout:** Full-screen single task focus with minimal navigation
- **Interaction:** Touch-first with large tap targets and simple gestures
- **Content Density:** Essential information only, one question/decision at a time
- **Use Cases:** Quick evidence updates, reviewing decisions on-the-go, responding to Frank's questions

**Responsive Adaptation Patterns:**

**Navigation Transformation:**
- **Desktop:** Persistent sidebar navigation with full context panels
- **Tablet/Mobile:** Hidden navigation with focus on current task, breadcrumb for context
- **Transition:** Graceful collapse to minimal focus without losing session context

**Content Adaptation:**
- **Split Context Panel:** Collapses to single conversation view on tablet/mobile
- **Evidence Builder:** Transforms to step-by-step focused questions
- **Power User Dense:** Simplifies to essential actions and summary views
- **Pairwise Comparison:** Adapts to vertical stack with swipe gestures

**Interaction Model Changes:**
- **Desktop:** Hover states, keyboard navigation, multi-panel interaction
- **Tablet:** Touch targets 44px minimum, swipe for comparison, tap for selection
- **Mobile:** Single-touch actions, minimal text input, voice input consideration for future

**Accessibility Strategy:**

**WCAG 2.1 AA Compliance Target:**
- **Color Contrast:** 4.5:1 ratio for normal text, 3:1 for large text (Frank's palette already compliant)
- **Keyboard Navigation:** All interactive elements accessible via keyboard across all device sizes
- **Screen Reader Support:** Semantic HTML structure with proper ARIA labels for Frank's AI interactions
- **Focus Management:** Clear focus indicators and logical tab order, especially important for conversation flow

**Accessibility Features:**

**Conversation Interface:**
- **ARIA Labels:** Frank's questions clearly announced as "Frank asks:" followed by question content
- **Conversation History:** Proper heading structure and landmark regions for easy navigation
- **AI Responses:** Clear indication when Frank is "thinking" vs. providing insights
- **User Input:** Proper form labeling and error handling for evidence gathering

**Evidence Building:**
- **Progress Indicators:** Screen reader announcement of evidence confidence levels
- **Data Validation:** Clear error messages and correction guidance
- **Evidence Sources:** Proper labeling of data quality and source reliability

**Decision Making:**
- **Comparison Options:** Clear radio button groups with descriptive labels
- **Choice Confirmation:** Explicit confirmation patterns for important decisions
- **Decision History:** Accessible summary of choices made and rationale

**Touch Target Requirements:**
- **Minimum Size:** 44px × 44px for all interactive elements on touch devices
- **Spacing:** Adequate space between touch targets to prevent accidental activation
- **Gesture Support:** Simple swipe patterns for comparison, no complex multi-touch required

**Performance Considerations:**
- **Progressive Loading:** Essential content loads first, additional context loads progressively
- **Offline Capability:** Core conversation can continue with limited connectivity (sync when reconnected)
- **Reduced Motion:** Respects user preferences for reduced animation and transitions

**Device-Specific Enhancements:**

**Desktop Features:**
- **Keyboard Shortcuts:** Power user efficiency with quick actions
- **Multi-Window:** Support for multiple prioritization sessions
- **Copy/Paste:** Rich clipboard integration for evidence import

**Tablet Features:**
- **Presentation Mode:** Clean interface for sharing decisions with stakeholders
- **Collaboration:** Touch-friendly interface for group decision sessions
- **Apple Pencil/Stylus:** Annotation support for evidence and insights

**Mobile Features:**
- **Quick Capture:** Fast evidence input via camera or voice notes
- **Notification:** Gentle reminders for incomplete prioritization sessions
- **Offline Review:** Read-only access to previous decisions and insights

**Responsive Design Principles:**

**Content Strategy:**
- **Mobile First Content:** Core value (Frank's guidance) available on smallest screen
- **Progressive Enhancement:** Additional context and tools revealed on larger screens
- **Context Preservation:** Moving between devices maintains session continuity

**Visual Hierarchy:**
- **Single Column Priority:** Mobile/tablet focus on one primary action
- **Consistent Branding:** Frank's "calm clarity" maintained across all screen sizes
- **Adaptive Typography:** Text scales appropriately while maintaining readability

**Success Metrics:**
- **Task Completion:** 90%+ completion rate for prioritization sessions across all devices
- **Accessibility Compliance:** Automated and manual testing confirms WCAG 2.1 AA standards
- **Cross-Device Continuity:** Users can seamlessly switch devices during sessions

**Implementation Notes:**
- **Breakpoint Strategy:** 768px and 1024px breakpoints align with common device sizes
- **Testing Requirements:** Manual testing on actual devices, especially for touch interactions
- **Performance Budget:** Maintain sub-3-second load times on mobile networks

---

## 9. Implementation Guidance

### 9.1 Completion Summary

**🎉 Frank UX Design Specification Complete!**

**What We Created Together:**

- **Design System:** shadcn/ui foundation with 4 custom components optimized for evidence-based prioritization
- **Visual Foundation:** "Calm clarity" color theme with sage green accents, Inter typography, and 80/15/5 visual weight distribution
- **Design Direction:** Progressive disclosure flow from Split Context Panel → Evidence Builder → Power User Dense, adapting to user expertise
- **User Journeys:** Complete first-time user flow designed for "aha moments" through strategic context setup and AI interrogation
- **UX Patterns:** 6 critical consistency rules maintaining Frank's "trusted thinking partner" personality across all interfaces
- **Responsive Strategy:** Desktop-first with Minimal Focus Mode adaptation for tablet/mobile, preserving "space to think" principle
- **Accessibility:** WCAG 2.1 AA compliance with conversation-optimized screen reader support

**Your Deliverables:**
- **UX Design Document:** [ux-design-specification.md](./ux-design-specification.md)
- **Interactive Color Themes:** [ux-color-themes.html](./ux-color-themes.html)
- **Design Direction Mockups:** [ux-design-directions.html](./ux-design-directions.html)

**Key Design Innovations:**

**1. Novel UX Pattern - "AI Socratic Interrogation"**
Frank pioneered structured conversation that builds evidence systematically while preserving user agency. Unlike tools that provide answers or require form-filling, Frank creates guided discovery that feels collaborative.

**2. Progressive Disclosure Based on Confidence**
Interface complexity adapts to user expertise - from guided Split Context learning to efficient Power User workflows, maintaining Frank's supportive personality throughout.

**3. Evidence-First Visual Language**
Every interface element prioritizes evidence quality and decision rationale over subjective scoring, creating visual motivation for better thinking.

**4. Adaptive Intelligence Across Devices**
Minimal Focus Mode for mobile/tablet maintains Frank's core value while adapting to device constraints - proving that good UX scales down as well as up.

**Implementation Readiness:**

**For Designers:**
- Complete component specifications with states, variants, and accessibility requirements
- Brand guidelines integrated into every design decision with clear rationale
- Interactive mockups demonstrate exactly how Frank's personality translates to interface

**For Developers:**
- shadcn/ui foundation provides proven, accessible components
- Custom component specifications include technical requirements and integration patterns
- Responsive strategy with clear breakpoints and device-specific adaptations

**For Product Strategy:**
- User journey flows designed for measurable "aha moments" and confidence building
- UX patterns support Frank's differentiation as "thinking sparring partner"
- All design decisions connect directly to business objectives and user success metrics

**Next Steps & Implementation Priority:**

**Phase 1: Core Experience (MVP)**
1. Implement AI Conversation Bubbles with Frank's personality patterns
2. Build Evidence Confidence Visualizer for immediate user feedback
3. Create Split Context Panel interface for first-time user learning
4. Develop basic pairwise comparison with contextual questioning

**Phase 2: Advanced Features**
1. Complete Evidence Builder interface for systematic thinking
2. Implement Strategic Clustering Display for theme discovery  
3. Add Power User Dense interface for experienced PMs
4. Build responsive adaptations and Minimal Focus Mode

**Phase 3: Platform Optimization**
1. Advanced accessibility features and screen reader optimization
2. Performance optimization for mobile devices
3. Cross-device session continuity and sync
4. Enterprise-level features and integrations

**Success Validation:**

**User Experience Metrics:**
- **Confidence Building:** Users report increased decision confidence after Frank sessions
- **Evidence Quality:** Measurable improvement in evidence-based vs. assumption-based decisions  
- **Interface Progression:** Users naturally advance from Split Context to Power User interfaces
- **Insight Generation:** Consistent "aha moments" where Frank surfaces unexpected insights

**Technical Implementation Metrics:**
- **Accessibility Compliance:** 100% WCAG 2.1 AA compliance across all components
- **Performance Standards:** Sub-3-second load times maintaining Frank's calm clarity
- **Cross-Device Continuity:** Seamless experience progression across desktop, tablet, mobile
- **Component Reusability:** All custom components integrate cleanly with shadcn/ui foundation

**Strategic Business Alignment:**
This UX specification directly supports Frank's positioning as the first "thinking sparring partner" for product prioritization, differentiating from both automation-focused AI tools and manual PM platforms. The progressive disclosure approach builds user capability while maintaining Frank's collaborative advantage.

**Design Philosophy Validation:**
Every design decision reinforces Frank's core message: "Think with me. We'll figure it out." Users feel empowered and equipped, never directed or replaced, creating sustainable competitive advantage through genuine user empowerment.

---

## Appendix

### Related Documents

- Product Requirements: `{{prd_file}}`
- Product Brief: `{{brief_file}}`
- Brainstorming: `{{brainstorm_file}}`

### Core Interactive Deliverables

This UX Design Specification was created through visual collaboration:

- **Color Theme Visualizer**: {{color_themes_html}}
  - Interactive HTML showing all color theme options explored
  - Live UI component examples in each theme
  - Side-by-side comparison and semantic color usage

- **Design Direction Mockups**: {{design_directions_html}}
  - Interactive HTML with 6-8 complete design approaches
  - Full-screen mockups of key screens
  - Design philosophy and rationale for each direction

### Optional Enhancement Deliverables

_This section will be populated if additional UX artifacts are generated through follow-up workflows._

<!-- Additional deliverables added here by other workflows -->

### Next Steps & Follow-Up Workflows

This UX Design Specification can serve as input to:

- **Wireframe Generation Workflow** - Create detailed wireframes from user flows
- **Figma Design Workflow** - Generate Figma files via MCP integration
- **Interactive Prototype Workflow** - Build clickable HTML prototypes
- **Component Showcase Workflow** - Create interactive component library
- **AI Frontend Prompt Workflow** - Generate prompts for v0, Lovable, Bolt, etc.
- **Solution Architecture Workflow** - Define technical architecture with UX context

### Version History

| Date     | Version | Changes                         | Author        |
| -------- | ------- | ------------------------------- | ------------- |
| November 1, 2025 | 1.0     | Initial UX Design Specification | Michelle |

---

_This UX Design Specification was created through collaborative design facilitation, not template generation. All decisions were made with user input and are documented with rationale._