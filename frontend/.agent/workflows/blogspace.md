---
description: How to add new blog posts to Blogspace
---

# Blogspace - Adding New Blog Posts

This workflow explains how to add new blog posts to the MugShot Studio Blogspace feature.

## Prerequisites
- Project running with `npm run dev`
- Access to the `/content/blogs/` directory

## Steps

### 1. Create a new Markdown file

Create a new `.md` file in the `content/blogs/` directory:

```
content/blogs/your-post-title.md
```

**Naming Convention:**
- Use lowercase letters
- Replace spaces with hyphens
- The filename becomes the URL slug (e.g., `my-post.md` → `/blogspace/my-post`)

### 2. Add YAML Frontmatter

At the top of your markdown file, add the required frontmatter:

```yaml
---
title: "Your Post Title"
date: 2026-01-15
categories: ["Category1", "Category2"]
tags: ["tag1", "tag2", "tag3"]
cover: "/asset/blog-images/your-cover.jpg"
excerpt: "A brief description of your post (150-200 characters recommended)"
author: "Author Name"
readTime: "5 min read"
featured: false
---
```

**Frontmatter Fields:**
| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | The display title of your post |
| `date` | Yes | Publication date (YYYY-MM-DD format) |
| `categories` | Yes | Array of category names (creates filters) |
| `tags` | No | Array of tags for additional filtering |
| `cover` | No | Path to cover image (relative to public folder) |
| `excerpt` | No | Short description for cards (auto-generated if omitted) |
| `author` | No | Author name (defaults to "Anonymous") |
| `readTime` | No | Estimated read time (auto-calculated if omitted) |
| `featured` | No | Set to `true` to show as featured post |

### 3. Write Your Content

After the frontmatter (after the closing `---`), write your blog content in Markdown:

```markdown
# Main Heading

Your introduction paragraph here...

## Section Heading

Content with **bold**, *italic*, and `code` formatting.

### Subsection

- Bullet points
- Work great

1. Numbered lists
2. Also supported

> Blockquotes for emphasis

![Image description](/asset/blog-images/your-image.jpg)

| Tables | Are | Supported |
|--------|-----|-----------|
| Cell 1 | Cell 2 | Cell 3 |

\`\`\`javascript
// Code blocks with syntax highlighting
const example = "Hello World";
\`\`\`
```

### 4. Add Images

Place blog images in:
```
public/asset/blog-images/
```

Reference them in markdown:
```markdown
![Alt text](/asset/blog-images/image-name.jpg)
```

Or in frontmatter cover:
```yaml
cover: "/asset/blog-images/cover-image.jpg"
```

### 5. Preview Your Post

// turbo
The dev server automatically picks up new posts. Visit:
- Blog listing: http://localhost:3000/blogspace
- Your post: http://localhost:3000/blogspace/your-post-slug

### 6. Verify Everything

Check for:
- [ ] Title displays correctly
- [ ] Categories appear and filter works
- [ ] Cover image loads (or gradient fallback shows)
- [ ] Content renders properly
- [ ] Images within content load
- [ ] Related posts appear on the post page

## Tips

### Making a Post Featured
Only one post should be featured at a time. Set `featured: true` in the frontmatter.

### Categories Best Practices
- Use 1-3 categories per post
- Keep category names consistent (case-sensitive)
- Common categories: Tutorial, AI, Design, Marketing, Branding, Trends

### SEO Optimization
- Write descriptive titles (50-60 characters)
- Include keywords in excerpt
- Use descriptive alt text for images
- Add relevant tags

## File Structure

```
frontend/
├── content/
│   └── blogs/
│       ├── getting-started-with-ai-thumbnails.md
│       ├── mastering-prompt-engineering.md
│       └── your-new-post.md
├── public/
│   └── asset/
│       └── blog-images/
│           ├── ai-thumbnails-cover.jpg
│           └── your-cover.jpg
└── src/
    ├── lib/
    │   ├── blog.ts (utility functions)
    │   └── blog-types.ts (TypeScript types)
    └── components/
        └── blogspace/
            ├── blog-header.tsx
            ├── featured-post.tsx
            ├── post-card.tsx
            ├── post-list.tsx
            ├── category-filter.tsx
            └── post-renderer.tsx
```

## Troubleshooting

### Post not appearing
- Check file extension is `.md`
- Verify frontmatter syntax (YAML requires proper indentation)
- Check for date format errors

### Images not loading
- Ensure path starts with `/` (relative to public folder)
- Check file exists in `public/asset/blog-images/`
- Verify file extension matches

### Build errors
// turbo
Run `npm run build` to check for any markdown parsing issues.
