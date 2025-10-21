# 🧩 RenInputRules v3 (Vanilla JS + jQuery Compatible)

A lightweight **input validation and formatting plugin**, rewritten in **pure ES6 JavaScript** — no jQuery required.  
You can still use it with jQuery for backward compatibility.

---

## 🚀 Features Overview

| Category | Feature | Description |
|-----------|----------|-------------|
| 🎯 Validation | `preset: 'email' | 'phone' | 'url' | 'hex'` | Built-in regex validation for common input types. |
| 🧮 Auto Formatting | `autoFormat: 'phone' | 'card' | 'nik'` | Automatically formats the input while typing. |
| ✍️ Transformation | `transform: 'upper' | 'lower' | 'capitalize'` | Automatically changes case of input text. |
| 📏 Input Length | `minlength`, `maxlength` | Control input character limits. |
| 🧩 Custom Allowed | `customAllowed: '@#_'` | Add extra allowed characters. |
| 🧯 Block Paste | `blockPaste: true` | Prevent pasting for sensitive fields (PIN, OTP). |
| 🔐 Masking | `maskChar: '*'` | Mask displayed input while keeping real value. |
| ⚡ Custom Events | `ren:valid`, `ren:invalid`, `ren:formatted` | Dispatch native DOM events for external logic. |
| 🪵 Debug Mode | `debug: true` | Log all plugin actions in console. |

---

## 🧠 Installation

### 1️⃣ Using npm
```bash
npm install ren-input-rules
```

### 2️⃣ Or via CDN / Manual include
```html
<script src="RenInputRules.js"></script>
```

---

## 💻 Usage Example

### 📱 Phone Input
```js
new RenInputRules('#phone', {
  preset: 'phone',
  autoFormat: 'phone',
  showError: true,
  transform: 'none',
  debug: true
});
```

### 💳 Card Number
```js
new RenInputRules('#card', {
  autoFormat: 'card',
  maxlength: 19
});
```

### 🔐 Secure PIN
```js
new RenInputRules('.pin', {
  autoFormat: 'none',
  blockPaste: true,
  maskChar: '*'
});
```

---

## ⚙️ Full Options Reference

| Option | Default | Description |
|--------|----------|-------------|
| `preset` | `'none'` | Regex-based validation preset. |
| `autoFormat` | `'none'` | Real-time formatting style. |
| `transform` | `'none'` | Text transform mode. |
| `customAllowed` | `''` | Extra allowed characters. |
| `blockPaste` | `false` | Disable paste action. |
| `maskChar` | `null` | Mask visible input. |
| `minlength` | `null` | Minimum input length. |
| `maxlength` | `null` | Maximum input length. |
| `showError` | `false` | Show tooltip error message. |
| `errorMessage` | `'Invalid input!'` | Error message text. |
| `debug` | `false` | Enable debug console logs. |

---

## 🧩 Custom Events

| Event | Trigger | Payload |
|--------|----------|----------|
| `ren:cleaned` | After input is cleaned | `{ oldValue, newValue }` |
| `ren:valid` | Input passes validation | `{ value }` |
| `ren:invalid` | Input fails validation | `{ value }` |
| `ren:formatted` | After auto-format | `{ formattedValue }` |
| `ren:masked` | After masking | `{ realValue, maskedValue }` |

---

## 🧩 Reset Plugin

```js
RenInputRules.reset('#phone');
```

---

## ⚖️ Difference Between `preset` and `autoFormat`

| Feature | Purpose | Example |
|----------|----------|----------|
| `preset` | Validates input content | `user@mail.com` ✅ / `user@mail` ❌ |
| `autoFormat` | Adjusts how text appears while typing | `081234567890` → `0812-3456-7890` |

> 💡 Combine both for best UX.

---

## 🧾 License

MIT © 2025 RENPWN  
GitHub: [https://github.com/hardknockdays](https://github.com/hardknockdays)
