export default class RenInputRules {
  constructor(el, options = {}) {
    this.el = el instanceof HTMLElement ? el : document.querySelector(el);

    this.set = Object.assign({
      patnnumstat: false,
      patntextstat: false,
      patnnum: '^[0-9]*\\.?[0-9]*$',
      patntext: '^[a-zA-Z0-9!/\\.\\-\\s_]+$',
      regexnum: /[^0-9.]/g,
      regexdef: /[^a-zA-Z0-9().|\\/!._\\-\\s]/g,
      regexcustoms: /[^a-zA-Z0-9.]/g,
      maxlength: null,
      minlength: null,
      transform: 'none',
      showError: false,
      errorMessage: 'Input tidak valid',
      preset: 'none',
      customAllowed: '',
      autoDetectType: false,
      debug: false,
      autoFormat: 'none',
      blockPaste: false,
      maskChar: null,
      maskKeepValueAttr: 'data-real',
      autoFormatPhoneOptions: { countryCode: '+62', separator: '-' },
    }, options);

    this._onInput = this._onInput.bind(this);
    this._onKeypress = this._onKeypress.bind(this);
    this._onPaste = this._onPaste.bind(this);
    this._onBlur = this._onBlur.bind(this);

    this.init();
  }

  init() {
    if (this.el.disabled || this.el.readOnly) return;

    this.bindPattern();
    this.attachEvents();

    const initial = this.el.value;
    if (initial) this.processAndSet(initial, { silent: true });
  }

  bindPattern() {
    const { patnnumstat, patntextstat, patnnum, patntext } = this.set;
    if (patnnumstat && this.el.type === 'number') this.el.pattern = patnnum;
    if (patntextstat && this.el.type === 'text') this.el.pattern = patntext;
  }

  attachEvents() {
    this.el.addEventListener('input', this._onInput);
    this.el.addEventListener('keypress', this._onKeypress);
    this.el.addEventListener('blur', this._onBlur);
    if (this.set.blockPaste) this.el.addEventListener('paste', this._onPaste);
  }

  detachEvents() {
    this.el.removeEventListener('input', this._onInput);
    this.el.removeEventListener('keypress', this._onKeypress);
    this.el.removeEventListener('paste', this._onPaste);
    this.el.removeEventListener('blur', this._onBlur);
  }

  _onInput(e) {
    this.processAndSet(this.getRawValue(), { event: e });
  }

  _onKeypress(e) {
    if (this.el.type === 'number') {
      const ch = e.which || e.keyCode;
      if (ch < 48 || ch > 57) e.preventDefault();
    }
  }

  _onPaste(e) {
    if (this.set.blockPaste) {
      e.preventDefault();
      if (this.set.debug) console.log('[RenInputRules] paste blocked');
    }
  }

  _onBlur() {
    this.processAndSet(this.getRawValue(), { blur: true });
  }

  getRawValue() {
    if (this.set.maskChar) {
      const real = this.el.getAttribute(this.set.maskKeepValueAttr);
      return real ?? this.el.value ?? '';
    }
    return this.el.value ?? '';
  }

  processAndSet(rawValue, opts = {}) {
    const oldVal = this.getRawValue();
    let val = String(rawValue || '');

    val = this._sanitizeByRegex(val);

    if (this.set.autoDetectType && /^\d+(\.\d+)?$/.test(val)) {
      val = val.replace(this.set.regexnum, '');
    }

    if (this.el.type === 'number' && /^0[0-9]+$/.test(val) && !val.includes('.')) {
      val = val.replace(/^0+/, '');
    }

    if (this.set.maxlength && val.length > this.set.maxlength) {
      val = val.slice(0, this.set.maxlength);
    }

    val = this.applyTransform(val);

    let formatted = val;
    if (this.set.autoFormat && this.set.autoFormat !== 'none') {
      formatted = this.applyAutoFormat(val, this.set.autoFormat);
      this.dispatch('ren:formatted', { raw: val, formatted });
    }

    if (this.set.maskChar) {
      this.el.setAttribute(this.set.maskKeepValueAttr, val);
      const masked = this.getMaskedDisplay(val);
      this.el.value = masked;
      this.dispatch('ren:masked', { masked });
    } else {
      this.el.value = formatted;
    }

    this.updateValidationState(val);

    if (val !== oldVal) {
      this.dispatch('ren:cleaned', { oldValue: oldVal, newValue: val });
      if (this.set.debug) console.log(`[RenInputRules] cleaned: "${oldVal}" → "${val}"`);
    }
  }

  _sanitizeByRegex(val) {
    if (this.set.customAllowed) {
      const safe = this.set.customAllowed.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
      const rx = new RegExp(`[^a-zA-Z0-9${safe}\\s]`, 'g');
      return val.replace(rx, '');
    }

    if (this.set.preset !== 'none') return val.replace(/[\x00-\x1F\x7F]/g, '');
    if (this.el.type === 'number') return val.replace(this.set.regexnum, '');
    return val.replace(this.set.regexdef, '');
  }

  applyTransform(val) {
    switch (this.set.transform) {
      case 'upper': return val.toUpperCase();
      case 'lower': return val.toLowerCase();
      case 'capitalize': return val.replace(/\b\w/g, l => l.toUpperCase());
      default: return val.trim();
    }
  }

  applyAutoFormat(val, mode) {
    if (!val) return val;
    switch (mode) {
      case 'phone': return this.formatPhone(val);
      case 'card': return this.formatCard(val);
      case 'nik': return this.formatNIK(val);
      default: return val;
    }
  }

  formatPhone(raw) {
    let v = raw.replace(/[^\d+]/g, '');
    const { separator = '-' } = this.set.autoFormatPhoneOptions || {};
    if (v.startsWith('62')) v = '0' + v.slice(2);
    else if (v.startsWith('+62')) v = '0' + v.slice(3);
    v = v.replace(/[^\d]/g, '');
    const parts = [];
    parts.push(v.slice(0, 4));
    v = v.slice(4);
    while (v.length > 4) {
      parts.push(v.slice(0, 4));
      v = v.slice(4);
    }
    if (v.length) parts.push(v);
    return parts.join(separator);
  }

  formatCard(raw) {
    return raw.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();
  }

  formatNIK(raw) {
    return raw.replace(/\D/g, '').slice(0, 16);
  }

  getMaskedDisplay(val) {
    const mask = this.set.maskChar || '';
    if (!mask) return val;
    if (this.set.autoFormat && this.set.autoFormat !== 'none') {
      const formatted = this.applyAutoFormat(val, this.set.autoFormat);
      return [...formatted].map(ch => (/\d/.test(ch) ? mask : ch)).join('');
    }
    return mask.repeat(val.length);
  }

  updateValidationState(val) {
    let valid = true;
    const { preset, minlength, showError, errorMessage } = this.set;

    if (minlength && val.length < minlength) valid = false;
    if (preset !== 'none') {
      const regex = this.getPresetRegex(preset);
      valid = regex.test(val);
    }

    this.el.classList.toggle('valid', valid);
    this.el.classList.toggle('invalid', !valid);
    if (showError && !valid) this.el.title = errorMessage;
    else this.el.removeAttribute('title');

    this.dispatch(valid ? 'ren:valid' : 'ren:invalid', { value: val });
  }

  getPresetRegex(preset) {
    const presets = {
      email: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-z]{2,}$/i,
      phone: /^[0-9+()\-\s]+$/,
      url: /^(https?:\/\/)?[^\s$.?#].[^\s]*$/,
      hex: /^#[0-9A-Fa-f]{6}$/
    };
    return presets[preset] || this.set.regexdef;
  }

  dispatch(event, detail) {
    this.el.dispatchEvent(new CustomEvent(event, { detail }));
  }

  static reset(targets) {
    (targets instanceof NodeList ? targets : document.querySelectorAll(targets))
      .forEach(t => {
        t.classList.remove('valid', 'invalid');
        t.removeAttribute('title');
        t.removeAttribute('data-real');
      });
  }
}

// Optional jQuery bridge (if jQuery detected)
if (typeof window !== 'undefined' && window.jQuery) {
  (function ($) {
    $.fn.RenInputRules = function (options) {
      return this.each(function () {
        const inst = new RenInputRules(this, options);
        $(this).data('RenInputRules', inst);
      });
    };
    $.fn.RenInputRulesReset = function () {
      RenInputRules.reset(this);
      return this;
    };
  })(window.jQuery);
}
