# ERIP Visual Alignment Guide

## Overview
This guide ensures consistent visual alignment, spacing, and styling across all ERIP platform pages.

## Core Principles

### 1. Consistent Spacing
- **Base unit**: 4px (0.25rem)
- **Page sections**: py-16 sm:py-20 (64px/80px)
- **Component spacing**: Use Stack component with standardized gaps
- **Card padding**: p-6 (24px)
- **Button padding**: px-6 py-2.5 (standard size)

### 2. Container Widths
- **Small**: max-w-3xl (48rem)
- **Medium**: max-w-5xl (64rem)
- **Large**: max-w-6xl (72rem)
- **Extra Large**: max-w-7xl (80rem) - Default for most pages
- **Full**: max-w-full (100%)

### 3. Button Alignment
```tsx
// Single button - right aligned
<ButtonGroup align="end">
  <Button>Action</Button>
</ButtonGroup>

// Multiple buttons - with proper spacing
<ButtonGroup spacing="md">
  <Button variant="outline">Cancel</Button>
  <Button>Save</Button>
</ButtonGroup>

// Center aligned buttons
<ButtonGroup align="center">
  <Button>Get Started</Button>
</ButtonGroup>

// Full width buttons on mobile
<ButtonGroup fullWidth>
  <Button>Primary Action</Button>
  <Button variant="outline">Secondary</Button>
</ButtonGroup>
```

### 4. Grid Layouts
```tsx
// Feature cards - 3 columns on desktop
<Grid cols={3} gap="md">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</Grid>

// Metrics - 4 columns
<Grid cols={4} gap="sm">
  <MetricCard>...</MetricCard>
</Grid>
```

### 5. Page Structure
```tsx
<PageTemplate
  title="Page Title"
  subtitle="Optional subtitle"
  backLink="/previous-page"
  actions={
    <Button>Primary Action</Button>
  }
>
  <Section>
    <Container>
      {/* Page content */}
    </Container>
  </Section>
</PageTemplate>
```

## Button Variants

### Primary Actions
```tsx
<Button>Save Changes</Button>
<Button size="lg">Get Started</Button>
```

### Secondary Actions
```tsx
<Button variant="outline">Cancel</Button>
<Button variant="secondary">Learn More</Button>
```

### Destructive Actions
```tsx
<Button variant="destructive">Delete</Button>
```

### Navigation Buttons
```tsx
<Button variant="outline" className="gap-2">
  <ArrowLeft className="h-4 w-4" />
  Back
</Button>
```

## Common Patterns

### 1. Page Headers
```tsx
<PageHeader
  title="Dashboard"
  subtitle="Monitor your security posture"
  badge={<Badge>Pro</Badge>}
  actions={
    <Button>New Report</Button>
  }
/>
```

### 2. Empty States
```tsx
<EmptyState
  icon={<FileText className="h-12 w-12" />}
  title="No reports yet"
  description="Create your first security report"
  action={
    <Button>Create Report</Button>
  }
/>
```

### 3. Card Grids
```tsx
<CardGrid>
  {items.map(item => (
    <Card key={item.id}>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {item.content}
      </CardContent>
    </Card>
  ))}
</CardGrid>
```

### 4. Form Layouts
```tsx
<Stack spacing="lg">
  <div>
    <Label>Field Label</Label>
    <Input />
  </div>
  
  <ButtonGroup align="end">
    <Button variant="outline">Cancel</Button>
    <Button>Submit</Button>
  </ButtonGroup>
</Stack>
```

## Responsive Design

### Mobile First
- Stack buttons vertically on mobile
- Reduce padding on small screens
- Use full-width buttons on mobile

### Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Example Responsive Layout
```tsx
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {/* 1 column mobile, 2 tablet, 3 desktop */}
</div>
```

## Color Usage

### Primary Actions
- Blue gradient: `from-blue-600 to-blue-700`
- Hover state: Include hover effects

### Status Colors
- Success: Green (`from-emerald-600 to-emerald-700`)
- Warning: Orange (`from-orange-600 to-orange-700`)
- Error: Red (`from-red-600 to-red-700`)

### Neutral Elements
- Borders: `border-slate-200`
- Background: `bg-slate-50` for sections
- Text: `text-slate-900` (primary), `text-slate-600` (secondary)

## Implementation Checklist

- [ ] Use Container component for consistent page width
- [ ] Apply Section component for vertical spacing
- [ ] Use PageHeader for all page titles
- [ ] Implement ButtonGroup for button alignment
- [ ] Apply consistent padding to cards (p-6)
- [ ] Use Grid/Stack components for layouts
- [ ] Test responsive behavior on all breakpoints
- [ ] Ensure consistent hover states
- [ ] Verify color contrast for accessibility
- [ ] Use proper button variants for actions

## Migration Guide

To update existing pages:

1. Wrap page content in PageTemplate
2. Replace custom containers with Container component
3. Use ButtonGroup for all button alignments
4. Replace custom grids with Grid component
5. Apply Stack for vertical spacing
6. Update button variants to match patterns
7. Test on mobile devices