---
name: plan
description: Break down goals into tasks and iterative, self-contained steps
version: 1.0.0
author: Skill Harness
inputs:
  - name: goal
    type: string
    required: true
    description: What we're trying to achieve
  - name: context_paths
    type: string[]
    required: false
    description: Additional paths to read for context
outputs:
  format: structured
  schema:
    goal: string
    understanding: string
    constraints: array
    tasks:
      type: array
      items:
        type: object
        properties:
          title: string
          description: string
          dependencies: array
          estimatedComplexity: string
    currentStep:
      type: object
      properties:
        title: string
        description: string
        actions: array
        successCriteria: array
    nextSteps: array
tools:
  - read_file
  - list_directory
  - find_files
  - git_status
examples:
  - input: "implement user authentication"
    description: "Plans implementation of user auth system"
  - input: "refactor database layer"
    description: "Creates plan for refactoring database code"
---

# Plan Methodology

## Purpose
Break down work into iterative, self-contained steps that can be executed one at a time. This methodology helps transform vague goals into concrete, actionable tasks with clear success criteria.

## Core Principles

1. **Start with Understanding**: Before planning, deeply understand the goal and current state
2. **Iterative Steps**: Break work into steps that can be completed independently
3. **Self-Contained**: Each step should be testable and verifiable on its own
4. **Progressive Disclosure**: Present one step at a time to maintain focus
5. **Adapt as You Go**: Plans should evolve based on what's learned during execution

## Approach

### 1. Clarify the Goal

**What to do:**
- Restate the goal in your own words
- Identify what "done" looks like
- List any constraints or non-goals
- Understand the "why" behind the goal

**Questions to ask:**
- What problem are we solving?
- Who is this for?
- What are we NOT trying to do?
- Are there technical constraints (performance, compatibility, etc.)?
- Are there timeline constraints?

### 2. Understand Current State

**What to do:**
- Review relevant existing code and documentation
- Identify what's already in place that can be leveraged
- Find patterns or conventions to follow
- Locate related features for reference

**Tools to use:**
- `find_files` to locate relevant code
- `read_file` to understand existing implementations
- `git_status` to see what's currently in progress
- `list_directory` to understand project structure

### 3. Identify Major Tasks

**What to do:**
- Break the goal into 3-7 major tasks
- Order tasks by dependencies
- Identify which tasks can run in parallel
- Note any tasks that are research/exploration vs. implementation

**Task categories:**
- Research & Discovery
- Setup & Infrastructure
- Core Implementation
- Testing & Validation
- Documentation
- Deployment/Integration

### 4. Break Into Self-Contained Steps

**What to do:**
- For each task, identify the smallest meaningful unit of work
- Each step should:
  - Have clear input/output
  - Be testable independently
  - Take less than 4 hours ideally
  - Produce a working state (no broken builds)

**Step structure:**
- Title: Short, action-oriented (e.g., "Implement user model")
- Description: What will be done and why
- Actions: Specific files to create/modify
- Success Criteria: How to know it's done
- Dependencies: What must be complete first

### 5. Present the First Step

**What to do:**
- Present only the immediate next step
- Provide enough context to start work
- List specific files and changes needed
- Include success criteria

**Avoid:**
- Overwhelming with the entire plan upfront
- Being too prescriptive about implementation details
- Assuming knowledge that may not exist

## Context Loading

Before creating the plan, gather context:

1. **Project README**: Overall architecture and setup
2. **Documentation**: Technical decisions and patterns
3. **Existing Code**: Similar features or modules
4. **Git Status**: Current work in progress
5. **Configuration**: Build tools, dependencies, frameworks

Use tools to read these files:
```
read_file README.md
list_directory src/
find_files "**/*auth*"
git_status
```

## Output Format

Provide a structured JSON response with:

```json
{
  "goal": "Clear restatement of the goal",
  "understanding": "Your understanding of what needs to be done and why",
  "constraints": ["Constraint 1", "Constraint 2"],
  "tasks": [
    {
      "title": "Task name",
      "description": "What this task accomplishes",
      "dependencies": ["Other task titles this depends on"],
      "estimatedComplexity": "low | medium | high"
    }
  ],
  "currentStep": {
    "title": "First step title",
    "description": "Detailed description of the first step",
    "actions": [
      "Specific action 1",
      "Specific action 2"
    ],
    "successCriteria": [
      "How to verify this step is complete",
      "What should work after this step"
    ]
  },
  "nextSteps": [
    "Brief description of step 2",
    "Brief description of step 3"
  ]
}
```

## Example: Plan for "Add user authentication"

**Understanding**: The goal is to add user authentication to the application. This means users should be able to sign up, log in, and access protected routes.

**Constraints**:
- Must work with existing Express.js backend
- Should use JWT for stateless auth
- Need to integrate with existing database

**Tasks**:
1. **Setup authentication infrastructure** (low) - Install deps, configure middleware
2. **Implement user model and database schema** (medium) - Create user table, model, validations
3. **Build authentication endpoints** (medium) - Signup, login, logout routes
4. **Add authentication middleware** (low) - Protect routes, verify tokens
5. **Add frontend login/signup forms** (medium) - UI components, API integration
6. **Write tests** (medium) - Unit and integration tests
7. **Update documentation** (low) - API docs, setup instructions

**Current Step**: Setup authentication infrastructure
- Install required packages (bcrypt, jsonwebtoken, express-validator)
- Create auth middleware directory structure
- Add environment variables for JWT secret
- Configure token expiration settings

**Success Criteria**:
- Dependencies installed and in package.json
- Environment variables documented in .env.example
- Directory structure created (src/middleware/auth, src/utils/auth)
- Can import auth utilities without errors

## Tips for Great Plans

1. **Be Specific**: "Add validation" is vague. "Add email format validation to signup form" is specific.

2. **Consider Failure**: What could go wrong? Plan for error handling from the start.

3. **Think Testing**: How will each step be tested? Build this into the plan.

4. **Respect Existing Patterns**: Follow the project's established conventions and structure.

5. **Leave Breadcrumbs**: Each step should leave the codebase in a working state with clear next actions.

6. **Balance Detail**: Enough detail to start, not so much it becomes prescriptive.

## Iteration

After presenting the plan:
- Be ready to revise based on feedback
- Adapt when new information emerges
- Don't be afraid to split or merge steps
- Keep the focus on the current step while maintaining vision of the goal
