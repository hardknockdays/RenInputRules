
# 🧩 jQuery RenInputRules v3 (ES6)

Plugin jQuery ringan untuk validasi dan formatting input teks secara otomatis.  
Didesain modern dengan dukungan **ES6**, **preset validasi umum**, dan **auto-format pintar**.

---

## 🚀 Fitur Utama

| Kategori | Fitur | Deskripsi |
|-----------|--------|------------|
| 🎯 Validasi | `preset: 'email' | 'phone' | 'url' | 'hex'` | Cek format input otomatis dengan regex bawaan. |
| 🧮 Formatting | `autoFormat: 'phone' | 'card' | 'nik'` | Format input jadi rapi saat diketik. |
| ✍️ Transformasi | `transform: 'upper' | 'lower' | 'capitalize'` | Ubah huruf otomatis. |
| 📏 Panjang Input | `minlength`, `maxlength` | Batas karakter input. |
| 🧩 Custom Allowed | `customAllowed: '@#_'` | Tambah karakter khusus yang diizinkan. |
| 🧯 Blok Paste | `blockPaste: true` | Blokir paste untuk input sensitif (PIN, OTP). |
| 🔐 Masking | `maskChar: '*'` | Sembunyikan tampilan input tapi simpan nilai asli. |
| ⚡ Event | `ren:valid`, `ren:invalid`, `ren:formatted` | Event jQuery kustom untuk aksi lanjut. |
| 🪵 Debug | `debug: true` | Log semua aktivitas ke console. |

---

## 🧠 Instalasi

```bash
# via npm (opsional)
npm install ren-input-rules

# atau langsung include di HTML
<script src="jquery.min.js"></script>
<script src="RenInputRules.js"></script>
```

---

## 💻 Contoh Penggunaan

```js
$('input#phone').RenInputRules({
  preset: 'phone',
  autoFormat: 'phone',
  showError: true,
  transform: 'none',
  debug: true
});
```

### 💳 Format Kartu
```js
$('input#card').RenInputRules({
  autoFormat: 'card',
  maxlength: 19
});
```

### 🔐 PIN Aman
```js
$('input.pin').RenInputRules({
  autoFormat: 'none',
  blockPaste: true,
  maskChar: '*'
});
```

---

## ⚙️ Daftar Opsi Lengkap

| Opsi | Default | Deskripsi |
|------|----------|-----------|
| `preset` | `'none'` | Validasi regex otomatis. |
| `autoFormat` | `'none'` | Format tampilan input. |
| `transform` | `'none'` | Ubah huruf otomatis. |
| `customAllowed` | `''` | Karakter tambahan yang diizinkan. |
| `blockPaste` | `false` | Blokir aksi paste. |
| `maskChar` | `null` | Masking input. |
| `minlength` | `null` | Panjang minimal. |
| `maxlength` | `null` | Panjang maksimal. |
| `showError` | `false` | Tampilkan tooltip error. |
| `errorMessage` | `'Input tidak valid!'` | Pesan tooltip. |
| `debug` | `false` | Mode debugging. |

---

## 🧩 Event

| Event | Kapan Terjadi | Parameter |
|--------|----------------|------------|
| `ren:cleaned` | Setelah input dibersihkan | `{ oldValue, newValue }` |
| `ren:valid` | Input valid | `{ value }` |
| `ren:invalid` | Input invalid | `{ value }` |
| `ren:formatted` | Setelah auto-format | `{ formattedValue }` |
| `ren:masked` | Setelah masking | `{ realValue, maskedValue }` |

---

## 🪄 Reset Plugin

```js
$('input').RenInputRulesReset();
```

---

## 🧩 Perbedaan `preset` vs `autoFormat`

| Fitur | Tujuan | Contoh |
|--------|---------|--------|
| `preset` | Validasi isi input | `user@mail.com` ✅ / `user@mail` ❌ |
| `autoFormat` | Format tampilan input | `081234567890` → `0812-3456-7890` |

> 💡 **Gunakan keduanya bersama untuk hasil terbaik.**

---

## 🧾 Lisensi

MIT © 2025 RENPWN
GitHub: [https://github.com/hardknockdays](https://github.com/hardknockdays)
