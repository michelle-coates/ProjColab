# ProjColab

**A comprehensive software development methodology workspace powered by BMAD (Brainstorming Methods and Decision-making) and the BMM (BMAD Method Module)**

## 🎯 Overview

ProjColab is an integrated development workspace that combines AI-powered software development methodologies with a real-world project implementation. It demonstrates the complete lifecycle of modern software development from ideation through implementation, using specialized AI agents and structured workflows.

### What's Inside

- **BMAD/BMM Framework**: Revolutionary AI-assisted software development lifecycle management system
- **Frank Project**: AI-powered micro-improvement prioritization platform (reference implementation)
- **Complete Documentation**: From product briefs to technical specifications
- **Structured Workflows**: Analysis → Planning → Solutioning → Implementation

## 📁 Project Structure

```
ProjColab/
├── bmad/                    # BMAD Framework Core
│   ├── _cfg/               # Configuration and manifests
│   ├── bmm/                # BMM (BMAD Method Module)
│   └── core/               # Core BMAD agents, tasks, tools
│
├── frank/                   # Frank Application (T3 Stack)
│   ├── prisma/             # Database schema and migrations
│   ├── src/                # Next.js application source
│   └── public/             # Static assets
│
├── docs/                    # Project Documentation
│   ├── PRD.md              # Product Requirements Document
│   ├── architecture.md     # Technical Architecture
│   ├── product-brief-Frank-2025-11-01.md
│   ├── tech-spec-epic-1.md
│   ├── epics.md            # Epic breakdown
│   └── stories/            # User stories and context
│
└── sync.ps1 / sync.bat     # Git sync utilities
```

## 🚀 Key Components

### 1. BMAD Framework

The **Brainstorming Methods and Decision-making** framework provides:

- **Specialized AI Agents**: PM, Analyst, Architect, Developer, Scrum Master, Test Architect, UX Designer
- **Structured Workflows**: 4-phase development lifecycle
- **Scale-Adaptive Planning**: Automatically adjusts documentation based on project complexity (Levels 0-4)
- **Just-In-Time Design**: Create technical specs one epic at a time during implementation

#### BMM (BMAD Method Module)

The BMM orchestrates the complete development lifecycle:

**Phase 1: Analysis** (Optional)
- `brainstorm-project` - Project ideation
- `research` - Market/technical research  
- `product-brief` - Product strategy

**Phase 2: Planning** (Required)
- `prd` - Scale-adaptive project planning
- Routes to appropriate documentation based on complexity

**Phase 3: Solutioning** (Level 3-4 projects)
- `3-solutioning` - Architecture design
- `tech-spec` - Epic-specific technical specifications

**Phase 4: Implementation** (Iterative)
- `create-story` - Story drafting
- `story-ready` - Approve story for development
- `story-context` - Expertise injection
- `dev-story` - Implementation
- `story-done` - Mark story complete
- `code-review` - Quality validation
- `retrospective` - Continuous improvement

[Read the complete BMM Workflows Guide →](bmad/bmm/workflows/README.md)

### 2. Frank - Reference Implementation

**Frank** is an AI collaboration tool that transforms product decision-making through evidence-based prioritization.

**Technology Stack:**
- **Framework**: Next.js 15 (T3 Stack)
- **AI Integration**: Anthropic Claude 3.5 Sonnet
- **Database**: PostgreSQL + Prisma ORM
- **API**: tRPC (end-to-end type safety)
- **Auth**: NextAuth.js (Email, Google, GitHub)
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel

**Key Features:**
- AI-powered Socratic questioning for product decisions
- Evidence-based prioritization vs. subjective scoring
- Micro-improvement management (50+ small improvements)
- Team collaboration and real-time decision-making
- Strategic clustering and insight generation

[Read the Product Requirements →](docs/PRD.md)  
[Read the Technical Architecture →](docs/architecture.md)

## 🎓 Scale Levels (BMAD Methodology)

BMAD automatically adapts to project complexity:

| Level | Stories | Documentation | Use Case |
|-------|---------|---------------|----------|
| **Level 0** | 1 | Minimal | Single atomic change |
| **Level 1** | 1-10 | Lightweight | Small features, bug fixes |
| **Level 2** | 5-15 | Focused PRD | Medium features |
| **Level 3** | 12-40 | Full architecture | Major features, new products |
| **Level 4** | 40+ | Enterprise scale | Platform development |

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- PostgreSQL 16+
- Git
- VS Code (recommended) or Claude Desktop/Web

### Quick Start with BMAD

```bash
# 1. Clone the repository
git clone https://github.com/michelle-coates/ProjColab.git
cd ProjColab

# 2. Load the PM agent (drag and drop or @ the agent file in your AI assistant)
bmad/bmm/agents/pm.md

# 3. Start a workflow
# In your AI assistant, type: `*prd`
```

### Frank Development Setup

```bash
# Navigate to Frank project
cd frank

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Database setup
npx prisma db push
npx prisma generate

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see Frank in action.

## 📚 Documentation

### Product Documentation
- **[Product Brief](docs/product-brief-Frank-2025-11-01.md)**: Executive summary and market strategy
- **[PRD](docs/PRD.md)**: Comprehensive product requirements (Level 3)
- **[Epics Breakdown](docs/epics.md)**: Detailed epic and story planning
- **[UX Specifications](docs/ux-design-specification.md)**: Design system and interface guidelines

### Technical Documentation
- **[Architecture Document](docs/architecture.md)**: Complete technical architecture
- **[Tech Specs](docs/tech-spec-epic-1.md)**: Epic-specific technical specifications
- **[Authentication Setup](docs/AUTH_SETUP_GUIDE.md)**: NextAuth.js configuration guide

### Methodology Documentation
- **[BMM Workflows Guide](bmad/bmm/workflows/README.md)**: Complete workflow system documentation
- **[Test Architecture Guide](bmad/bmm/testarch/README.md)**: Quality assurance and testing strategy
- **[BMM README](bmad/bmm/README.md)**: Core BMM concepts and structure

## 🎮 Specialized Features

### Game Development (Optional)

The BMM includes optional game development specialists:
- **Game Designer** - Creative vision and game design documents (GDD)
- **Game Developer** - Game-specific implementation  
- **Game Architect** - Game systems and technical infrastructure

Game workflows include `brainstorm-game`, `game-brief`, and `gdd`.

### Test Architecture (TEA)

Comprehensive testing strategy across 9 workflows:
- Framework setup
- CI/CD integration
- Test design
- ATDD (Acceptance Test-Driven Development)
- Test automation
- Traceability
- NFR assessment
- Quality gates
- Test review

[Read the Test Architect Guide →](bmad/bmm/testarch/README.md)

## 🔄 Story State Machine

Stories flow through a 4-state lifecycle:

```
BACKLOG → TODO → IN PROGRESS → DONE
```

- **BACKLOG**: Ordered list of stories to be drafted
- **TODO**: Story ready for SM to draft (or drafted, awaiting approval)
- **IN PROGRESS**: Story approved for DEV to implement
- **DONE**: Completed stories with dates and points

Simple workflows (`story-ready`, `story-done`) advance the queue automatically.

## 🤝 Contributing

This is a personal development workspace demonstrating modern AI-assisted software development methodologies. Feel free to explore the structure and workflows as reference for your own projects.

## 📊 Current Project Status

**Frank Development Status**: Epic 1 - Foundation & Core Prioritization Engine

See [sprint-status.yaml](docs/sprint-status.yaml) for detailed sprint tracking.

## 🔑 Key Concepts

### Just-In-Time Design
Technical specifications are created one epic at a time during implementation, not all upfront, allowing for learning and adaptation.

### Context Injection
Story-specific technical guidance is generated dynamically, providing developers with exactly the expertise needed for each task.

### Human-AI Collaboration
Frank (the product) demonstrates AI as a collaboration enhancement rather than replacement - challenging assumptions through Socratic questioning while preserving user decision-making authority.

## 🎯 Best Practices

1. **Always start with workflows** - Let workflows guide your process
2. **Respect the scale** - Don't over-document small projects  
3. **Trust the process** - The methodology has been carefully designed
4. **Iterate and learn** - Use retrospectives to continuously improve

## 📝 License

This project is maintained by Michelle Coates as a demonstration of modern software development methodologies and AI-assisted development practices.

## 🔗 Related Resources

- [BMAD Framework Documentation](bmad/core/)
- [BMM Method Module](bmad/bmm/)
- [Frank Application](frank/)
- [Claude AI Integration](https://www.anthropic.com/claude)
- [T3 Stack](https://create.t3.gg/)

## 📮 Contact

**Michelle Coates**  
Senior Product Manager & Experienced Founder

---

*ProjColab - Where methodology meets implementation. Powered by BMAD and built with Frank.*
