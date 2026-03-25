---
title: "Optimizing React Rendering at Scale"
date: "2025-10-11"
readTime: "5 min"
tags: ["React", "Performance", "Profiling"]
excerpt: "Practical techniques we used to cut re-renders by 70% in a complex analytics dashboard — from memo strategies to state architecture redesign."
---

Our analytics dashboard had a problem. With 200+ components on screen, every state change triggered a cascade of re-renders that made the UI feel sluggish. The React Profiler showed renders taking 80ms+ — way above the 16ms budget for 60fps.

## Profiling First

Before optimizing anything, we profiled. React DevTools Profiler revealed the culprits:

1. **Context consumers** re-rendering on every unrelated state change
2. **Inline object/function props** creating new references every render
3. **Large list components** without virtualization

## The Fixes

### 1. Split Contexts by Concern

Our `DashboardContext` held everything — filters, user preferences, data, UI state. Every update to any field re-rendered every consumer.

```typescript
// Before: one giant context
const DashboardContext = createContext<{
  filters: Filters;
  data: DashboardData;
  preferences: UserPrefs;
  ui: UIState;
}>(/* ... */);

// After: split by update frequency
const FilterContext = createContext<Filters>(/* ... */);
const DataContext = createContext<DashboardData>(/* ... */);
const PreferencesContext = createContext<UserPrefs>(/* ... */);
```

Impact: **50% reduction** in unnecessary re-renders.

### 2. Stable References with useMemo/useCallback

Every inline `style={{}}` and `onClick={() => {}}` creates a new reference. For components wrapped in `React.memo`, this defeats the optimization entirely.

We established a team convention: **no inline objects or functions in JSX for memoized components**.

### 3. Virtualization for Large Lists

For our data tables (sometimes 10,000+ rows), we switched to `@tanstack/react-virtual`. Only DOM nodes for visible rows get created.

## Results

- Render times dropped from **80ms to 12ms** (85% improvement)
- Time-to-interactive improved by **2.3 seconds** on initial load
- Users reported the dashboard feeling "snappy" for the first time

The key lesson: **measure before you optimize**, and optimize the architecture before the components.
