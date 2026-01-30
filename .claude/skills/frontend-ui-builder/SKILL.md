---
name: frontend-ui-builder
description: Build responsive pages and reusable UI components with clean layouts and modern styling. Use for frontend development tasks.
---

# Frontend UI Development

## Instructions

1. **Page & layout structure**

   - Use semantic HTML5 elements
   - Grid/Flexbox-based layouts
   - Responsive across breakpoints

2. **Component building**

   - Reusable, self-contained components
   - Clear props / inputs
   - Consistent naming conventions

3. **Styling**

   - Modern CSS (Flexbox, Grid)
   - Utility-first or component-scoped styles
   - Design tokens for colors, spacing, typography

4. **Responsiveness**
   - Mobile-first approach
   - Fluid typography and spacing
   - Adaptive layouts for tablet & desktop

## Best Practices

- Keep components small and focused
- Avoid inline styles unless necessary
- Use consistent spacing scale
- Ensure accessibility (ARIA, contrast, keyboard nav)
- Prefer composition over duplication

## Example Structure

```html
<main class="page-container">
  <header class="page-header">
    <h1 class="title">Page Title</h1>
    <p class="subtitle">Supporting description</p>
  </header>

  <section class="content-grid">
    <article class="card">
      <h2 class="card-title">Card Title</h2>
      <p class="card-text">Card content goes here.</p>
      <button class="primary-button">Action</button>
    </article>
  </section>
</main>
```
