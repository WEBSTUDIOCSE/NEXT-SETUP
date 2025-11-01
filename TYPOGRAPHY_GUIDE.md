# 🎨 Minimal Typography System

**Just 9 Essential Classes - Super Easy!**

---

## 📚 Fonts

- **Headings**: Barlow (bold, modern)
- **Body**: Rubik (clean, readable)
- **Code**: Geist Mono (monospace)

---

## 🎯 The 9 Classes

### **Headings (3 classes)**

```tsx
// Main page heading
<h1 className="heading">Payment Successful</h1>
// Size: 2xl → 3xl (mobile → desktop)

// Section/Card heading
<h2 className="subheading">Transaction Details</h2>
// Size: lg → xl

// Small heading
<h3 className="title">Order Summary</h3>
// Size: base → lg
```

---

### **Body Text (2 classes)**

```tsx
// Normal text
<p className="body">Your payment has been processed.</p>
// Size: sm

// Muted/subtle text
<p className="muted">Last updated 2 hours ago</p>
// Size: sm, muted color
```

---

### **Status (3 classes)**

```tsx
// Success message
<p className="success">Payment completed!</p>

// Error message
<p className="error">Transaction failed</p>

// Warning message
<p className="warning">Session expiring soon</p>
```

---

### **Code (1 class)**

```tsx
// Code/technical text
<code className="code">npm install</code>
```

---

## � Complete Example

```tsx
export default function PaymentPage() {
  return (
    <div className="p-6">
      {/* Page Header */}
      <h1 className="heading">Payment Successful</h1>
      <p className="muted">Transaction completed at 3:45 PM</p>

      {/* Card */}
      <div className="mt-6 p-4 border rounded-lg">
        <h2 className="subheading">Transaction Details</h2>
        
        <div className="mt-4 space-y-2">
          <h3 className="title">Order Summary</h3>
          <p className="body">Your order has been confirmed.</p>
          
          {/* Status */}
          <p className="success">Payment completed successfully!</p>
          
          {/* Code */}
          <code className="code">TXN-123456789</code>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎨 Quick Reference

| Class | Font | Size | Color | Use For |
|-------|------|------|-------|---------|
| `heading` | Barlow | 2xl-3xl | Primary | Page titles |
| `subheading` | Barlow | lg-xl | Foreground | Sections |
| `title` | Barlow | base-lg | Foreground | Cards |
| `body` | Rubik | sm | Foreground | Paragraphs |
| `muted` | Rubik | sm | Muted | Descriptions |
| `success` | Rubik | sm | Primary | Success msgs |
| `error` | Rubik | sm | Destructive | Error msgs |
| `warning` | Rubik | sm | Muted | Warnings |
| `code` | Geist Mono | sm | Foreground | Code/IDs |

---

## ✅ That's It!

**9 classes cover 99% of your needs!**

Need more? Just use Tailwind utilities:
```tsx
<p className="text-lg font-bold text-primary">Custom style</p>
```

**Simple. Clean. Easy to remember.** 🚀
