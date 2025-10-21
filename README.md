
# 🧩 jQuery RenInputRules v3 (ES6)

A lightweight jQuery plugin for automatic text input validation and formatting.  
Built with modern **ES6** standards, supporting **common validation presets** and **smart auto-formatting**.

---

## 🚀 Features

| Category | Feature | Description |
|-----------|----------|-------------|
| 🎯 Validation | `preset: 'email' | 'phone' | 'url' | 'hex'` | Automatically validate input format using built-in regex. |
| 🧮 Formatting | `autoFormat: 'phone' | 'card' | 'nik'` | Automatically format input while typing. |
| ✍️ Transformation | `transform: 'upper' | 'lower' | 'capitalize'` | Auto convert text case. |
| 📏 Input Length | `minlength`, `maxlength` | Restrict the number of characters allowed. |
| 🧩 Custom Allowed | `customAllowed: '@#_'` | Add extra allowed characters. |
| 🧯 Paste Blocking | `blockPaste: true` | Prevent pasting for sensitive fields (PIN, OTP). |
| 🔐 Masking | `maskChar: '*'` | Hide input visually but store original value. |
| ⚡ Events | `ren:valid`, `ren:invalid`, `ren:formatted` | Custom jQuery events for advanced handling. |
| 🪵 Debug Mode | `debug: true` | Log all plugin actions in the console. |

---

## 🧠 Installation

```bash
# via npm (optional)
npm install ren-input-rules

# or include directly in HTML
<script src="jquery.min.js"></script>
<script src="RenInputRules.js"></script>
```

---

## 💻 Example Usage

```js
$('input#phone').RenInputRules({
  preset: 'phone',
  autoFormat: 'phone',
  showError: true,
  transform: 'none',
  debug: true
});
```

### 💳 Credit Card Formatting
```js
$('input#card').RenInputRules({
  autoFormat: 'card',
  maxlength: 19
});
```

### 🔐 Secure PIN Input
```js
$('input.pin').RenInputRules({
  autoFormat: 'none',
  blockPaste: true,
  maskChar: '*'
});
```

---

## ⚙️ Full Options

| Option | Default | Description |
|---------|----------|-------------|
| `preset` | `'none'` | Enables built-in regex validation. |
| `autoFormat` | `'none'` | Controls live input formatting. |
| `transform` | `'none'` | Automatically change text case. |
| `customAllowed` | `''` | Add extra characters to whitelist. |
| `blockPaste` | `false` | Block paste action. |
| `maskChar` | `null` | Mask input visually. |
| `minlength` | `null` | Minimum input length. |
| `maxlength` | `null` | Maximum input length. |
| `showError` | `false` | Show tooltip error on invalid input. |
| `errorMessage` | `'Invalid input!'` | Tooltip message. |
| `debug` | `false` | Enable console debug logs. |

---

## 🧩 Events

| Event | Triggered When | Parameters |
|--------|----------------|-------------|
| `ren:cleaned` | After input sanitization | `{ oldValue, newValue }` |
| `ren:valid` | Input becomes valid | `{ value }` |
| `ren:invalid` | Input becomes invalid | `{ value }` |
| `ren:formatted` | After auto-format applied | `{ formattedValue }` |
| `ren:masked` | After masking applied | `{ realValue, maskedValue }` |

---

## 🪄 Reset Plugin

```js
$('input').RenInputRulesReset();
```

---

## 🧩 Difference between `preset` and `autoFormat`

| Feature | Purpose | Example |
|----------|----------|----------|
| `preset` | Validates the **content** | `user@mail.com` ✅ / `user@mail` ❌ |
| `autoFormat` | Formats the **visual appearance** | `081234567890` → `0812-3456-7890` |

> 💡 **Combine both for maximum accuracy and better UX.**

---

## 🧾 License

MIT © 2025 RENPWN  
GitHub: [https://github.com/hardknockdays](https://github.com/hardknockdays)
