# 🎨 Font Theming Rules

## 📚 Font System Overview

We use **3 fonts** with specific purposes:

| Font | Purpose | Character | Weight Range |
|------|---------|-----------|--------------|
| **Barlow** | Headings & Buttons | Bold, Geometric, Modern | 400-800 |
| **Rubik** | Body & Form Text | Rounded, Friendly, Readable | 300-700 |
| **Geist Mono** | Code & Technical | Monospace, Technical | Default |

---

## 🎯 Theming Rules - Where to Apply Which Font

### **1. Barlow (Headings & Actions)**

**Use for:**
- ✅ All headings (`h1`, `h2`, `h3`, `h4`, `h5`, `h6`)
- ✅ Buttons and CTAs (Call-to-Action)
- ✅ Navigation items
- ✅ Card titles
- ✅ Section headers
- ✅ Important labels

**Why:** Bold, geometric style draws attention and creates visual hierarchy.

**Weight Guidelines:**
- 400 (Regular) - Subtle headings
- 500 (Medium) - Navigation
- 600 (Semibold) - Buttons, Card titles ⭐ Most common
- 700 (Bold) - Page headings
- 800 (Extrabold) - Hero text, display headings

---

### **2. Rubik (Body & Forms)**

**Use for:**
- ✅ Paragraphs (`p`)
- ✅ Descriptions
- ✅ Form inputs (`input`, `textarea`, `select`)
- ✅ Labels
- ✅ Lists (`li`)
- ✅ Tables (`td`, `th`)
- ✅ Inline text (`span`, `div`)
- ✅ Links (`a`)
- ✅ Status messages

**Why:** Rounded, friendly style is easy to read for long-form content.

**Weight Guidelines:**
- 300 (Light) - Subtle text, placeholders
- 400 (Regular) - Body text ⭐ Most common
- 500 (Medium) - Emphasized text
- 600 (Semibold) - Strong emphasis
- 700 (Bold) - Very strong emphasis

---

### **3. Geist Mono (Code & Technical)**

**Use for:**
- ✅ Code blocks (`code`, `pre`)
- ✅ Technical IDs (transaction IDs, user IDs)
- ✅ API responses
- ✅ Keyboard shortcuts (`kbd`)
- ✅ File paths
- ✅ Terminal output

**Why:** Monospace font ensures alignment and technical readability.

---

## 📋 Element-Specific Rules

### **Buttons**
```css
button {
  font-family: var(--font-barlow);
  font-weight: 600; /* Semibold */
}
```
**Reason:** Buttons are action elements like headings - they command attention.

### **Form Inputs**
```css
input, textarea, select {
  font-family: var(--font-rubik);
}
```
**Reason:** Users read and type in forms - need friendly, readable font.

### **Headings**
```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-barlow);
}
```
**Reason:** Create clear visual hierarchy with bold geometric style.

### **Body Text**
```css
p, span, div, a, label, li, td, th {
  font-family: var(--font-rubik);
}
```
**Reason:** Main content needs comfortable reading experience.

### **Code**
```css
code, pre, kbd, samp {
  font-family: var(--font-geist-mono);
}
```
**Reason:** Technical content requires monospace alignment.

---

## 🎨 Typography Classes

### **Heading Classes (Barlow)**
```tsx
<h1 className="heading">Main Page Title</h1>
<h2 className="subheading">Section Header</h2>
<h3 className="title">Card Title</h3>
```

### **Body Classes (Rubik)**
```tsx
<p className="body">Normal paragraph text</p>
<p className="muted">Secondary information</p>
```

### **Status Classes (Rubik)**
```tsx
<p className="success">Success message</p>
<p className="error">Error message</p>
<p className="warning">Warning message</p>
```

### **Code Classes (Geist Mono)**
```tsx
<code className="code">TXN-123456789</code>
```

---

## ✅ Complete Implementation

**globals.css:**
```css
@layer base {
  /* Default body font - Rubik */
  body {
    font-family: var(--font-rubik);
  }
  
  /* Headings - Barlow (bold, geometric) */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-barlow);
  }
  
  /* Body text - Rubik (rounded, friendly) */
  p, span, div, a, label, li, td, th {
    font-family: var(--font-rubik);
  }
  
  /* Form elements - Rubik (readable) */
  input, textarea, select {
    font-family: var(--font-rubik);
  }
  
  /* Buttons - Barlow (action-oriented) */
  button {
    font-family: var(--font-barlow);
    font-weight: 600;
  }
  
  /* Code - Geist Mono (technical) */
  code, pre, kbd, samp {
    font-family: var(--font-geist-mono);
  }
}
```

---

## 🎯 Visual Hierarchy

```
┌─────────────────────────────────────┐
│  HEADING (Barlow Bold 700)          │ ← Page title, commands attention
├─────────────────────────────────────┤
│  Subheading (Barlow Semibold 600)   │ ← Section header, organizes content
├─────────────────────────────────────┤
│  Title (Barlow Semibold 600)        │ ← Card titles, smaller headers
├─────────────────────────────────────┤
│  Body text (Rubik Regular 400)      │ ← Main content, easy to read
│  More body text continues here...   │
├─────────────────────────────────────┤
│  Muted text (Rubik Regular 400)     │ ← Secondary info, lighter color
├─────────────────────────────────────┤
│  [Button Text] (Barlow Semibold)    │ ← Action, matches heading style
├─────────────────────────────────────┤
│  TXN-12345 (Geist Mono)             │ ← Technical data, monospace
└─────────────────────────────────────┘
```

---

## 🚫 Don't Mix Fonts Randomly

❌ **Wrong:**
```tsx
<h1 style={{fontFamily: 'var(--font-rubik)'}}>Heading</h1> {/* Rubik for heading */}
<button style={{fontFamily: 'var(--font-rubik)'}}>Click</button> {/* Rubik for button */}
```

✅ **Correct:**
```tsx
<h1 className="heading">Heading</h1> {/* Barlow */}
<button>Click</button> {/* Barlow */}
```

---

## 📱 Responsive Behavior

All fonts work seamlessly across devices:
- **Mobile:** Smaller font sizes, same font families
- **Tablet:** Medium font sizes
- **Desktop:** Larger font sizes

Typography classes automatically adjust:
```css
.heading {
  font-size: 2xl (mobile) → 3xl (desktop)
}
```

---

## 🎨 Theme-Aware

Fonts work with both light and dark themes:
- Font families stay the same
- Only colors change (via shadcn tokens)
- Weights remain consistent

---

## ✨ Summary

**Simple Rule:**
- **Barlow** = Attention (headings, buttons)
- **Rubik** = Reading (body, forms)
- **Geist Mono** = Technical (code, IDs)

**3 fonts. Clear rules. Beautiful typography.** 🚀
