# RenInputRules

jQuery plugin untuk mengatur **regex**, **pattern**, dan **rules input** di elemen form.  
Plugin ini memudahkan untuk membatasi input agar sesuai dengan kebutuhan (misalnya hanya angka, hanya teks dengan karakter tertentu, atau input dengan plugin autocomplete).

---

## 📦 Instalasi

Tambahkan file plugin setelah **jQuery**:

```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="jquery.RenInputRules.js"></script>
```

---

## 🚀 Usage

Inisialisasi sederhana:

```javascript
$('input').RenInputRules();
```

Menggunakan konfigurasi:

```javascript
$('input').RenInputRules({
  patnnumstat  : true,   // aktifkan pattern number pada input[type=number]
  patntextstat : true    // aktifkan pattern text pada input[type=text]
});
```

Contoh di atas akan menambahkan attribute `pattern` otomatis pada input number dan text.

---

## ⚙️ Configuration

Berikut daftar konfigurasi yang tersedia (dengan default value):

```javascript
{
  patnnumstat   : false, // aktifkan pattern number
  patntextstat  : false, // aktifkan pattern text

  patnnum       : '^[0-9]*\.?[0-9]*$',      // regex pattern untuk angka (integer/decimal)
  patntext      : '^[a-zA-Z0-9!/\.\-\s_]+$', // regex pattern untuk text

  regexnum      : /[^0-9.]/g,                // hanya izinkan angka + titik
  regexdef      : /[^a-zA-Z0-9().|\/!._\-\s]/g, // default allowed text
  regexcustoms  : /[^a-zA-Z0-9.]/g           // untuk input dengan class easy-autocomplete
}
```

---

## 📝 Contoh Penggunaan

### 1. Input Number
```html
<input type="number" id="price" placeholder="Only numbers">
<script>
  $('#price').RenInputRules({ patnnumstat: true });
</script>
```

### 2. Input Text
```html
<input type="text" id="username" placeholder="Alphanumeric only">
<script>
  $('#username').RenInputRules({ patntextstat: true });
</script>
```

### 3. Input dengan EasyAutocomplete
```html
<input type="text" class="easy-autocomplete" id="search">
<script>
  $('#search').RenInputRules();
</script>
```

---

## 🔒 Fitur Utama

- Auto replace karakter invalid saat `input`, `keypress`, atau `keyup`
- Support input `type="number"` (blokir leading zero untuk integer)
- Support input text biasa dan dengan plugin **easy-autocomplete**
- Bisa custom regex sesuai kebutuhan
- Bisa menambahkan atribut `pattern` otomatis

---

## 📄 Lisensi
MIT License © 2025
