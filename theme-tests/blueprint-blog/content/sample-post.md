---
title: "Markdown Sample Post"
date: "2025-05-05"
description: "A sample post demonstrating various Markdown elements"
tags: ["markdown", "example", "syntax"]
---

# Markdown Sample Post

This post demonstrates various Markdown elements and features supported by StyleMD.

## 1. Text Formatting

Regular text with **bold text**, *italic text*, and ~~strikethrough~~.

> This is a blockquote. It's used for emphasizing important content.
> 
> It can also span multiple paragraphs.

## 2. Lists

### Unordered List:

* Item 1
* Item 2
  * Nested item 2.1
  * Nested item 2.2
* Item 3

### Ordered List:

1. First item
2. Second item
3. Third item

## 3. Code

Inline code: `console.log('Hello, World!')`

Code block:

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet('World'));
```

## 4. Links and Images

[StyleMD GitHub Page](https://github.com/ddukbg/stylemd)

![Nature Image](https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80)

## 5. Tables

| Name | Age | Profession |
|------|-----|------------|
| John Doe | 30 | Developer |
| Jane Smith | 25 | Designer |
| Emily Johnson | 28 | Marketer |

## 6. Horizontal Rule

Below is a horizontal rule:

---

## 7. Task Lists

- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task

## 8. Footnotes

This has a footnote[^1].

[^1]: This is the footnote content.

## 9. Definition List

StyleMD
: A tool that converts Markdown files to HTML with various styles

Markdown
: A lightweight markup language with plain-text formatting syntax

## 10. Mermaid Diagrams

StyleMD also supports Mermaid diagrams:

```mermaid
graph TD
    A[Start] --> B{Is it Markdown?}
    B -->|Yes| C[Process with StyleMD]
    B -->|No| D[Use another tool]
    C --> E[Generate HTML]
    E --> F[Apply Theme]
    F --> G[Final Output]
    D --> G
```

Flowchart example:

```mermaid
flowchart LR
    A[Input] --> B(Process)
    B --> C{Decision}
    C -->|One| D[Output 1]
    C -->|Two| E[Output 2]
```

Sequence diagram:

```mermaid
sequenceDiagram
    participant User
    participant StyleMD
    participant Browser
    
    User->>StyleMD: Edit Markdown
    StyleMD->>StyleMD: Process Markdown
    StyleMD->>Browser: Generate HTML
    Browser->>User: Display Result
```

## 11. Mathematical Formulas

Some math expressions: $E = mc^2$

$$
\frac{d}{dx}(x^n) = nx^{n-1}
$$