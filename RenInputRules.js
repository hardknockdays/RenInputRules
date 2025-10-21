(function ($) {
  class RenInputRules {
    constructor($el, options = {}) {
      this.$el = $el;

      // Default settings
      this.set = Object.assign({
        // existing core
        patnnumstat: false,
        patntextstat: false,
        patnnum: '^[0-9]*\\.?[0-9]*$',
        patntext: '^[a-zA-Z0-9!/\\.\\-\\s_]+$',
        regexnum: /[^0-9.]/g,
        regexdef: /[^a-zA-Z0-9().|\\/!._\\-\\s]/g,
        regexcustoms: /[^a-zA-Z0-9.]/g,

        // v2 extras
        maxlength: null,
        minlength: null,
        transform: 'none', // none | upper | lower | capitalize
        showError: false,
        errorMessage: 'Input tidak valid',
        preset: 'none', // none | email | phone | url | hex
        customAllowed: '',
        autoDetectType: false,
        debug: false,

        // v3 features
        autoFormat: 'none', // none | phone | card | nik
        blockPaste: false,
        maskChar: null, // e.g. '*' for masking; null = disabled
        maskKeepValueAttr: 'data-real', // where to store real value
        autoFormatPhoneOptions: { countryCode: '+62', separator: '-' }, // basic
      }, options);

      this._onInput = this._onInput.bind(this);
      this._onKeypress = this._onKeypress.bind(this);
      this._onPaste = this._onPaste.bind(this);
      this._onBlur = this._onBlur.bind(this);

      this.init();
    }

    init() {
      if (this.$el.is('[disabled], [readonly]')) return;

      this.bindPattern();
      this.attachEvents();

      // if already has value, process it initially
      const initial = this.$el.val();
      if (initial) this.processAndSet(initial, { silent: true });
    }

    bindPattern() {
      const { patnnumstat, patntextstat, patnnum, patntext } = this.set;
      if (patnnumstat && this.$el.prop('type') === 'number') this.$el.prop('pattern', patnnum);
      if (patntextstat && this.$el.prop('type') === 'text') this.$el.prop('pattern', patntext);
    }

    attachEvents() {
      this.$el.on('input', this._onInput);
      this.$el.on('keypress', this._onKeypress);
      this.$el.on('blur', this._onBlur);

      if (this.set.blockPaste) {
        this.$el.on('paste', this._onPaste);
      }
    }

    detachEvents() {
      this.$el.off('input', this._onInput);
      this.$el.off('keypress', this._onKeypress);
      this.$el.off('paste', this._onPaste);
      this.$el.off('blur', this._onBlur);
    }

    _onInput(e) {
      const raw = this.getRawValue();
      this.processAndSet(raw, { event: e });
    }

    _onKeypress(e) {
      // prevent non-digit if type=number
      if (this.$el.prop('type') === 'number') {
        const ch = e.which || e.keyCode;
        if (ch < 48 || ch > 57) {
          e.preventDefault();
          return false;
        }
      }
    }

    _onPaste(e) {
      if (this.set.blockPaste) {
        e.preventDefault();
        if (this.set.debug) console.log('[RenInputRules] paste blocked');
      }
    }

    _onBlur() {
      // on blur we may want to validate & format final value
      const raw = this.getRawValue();
      this.processAndSet(raw, { blur: true });
    }

    getRawValue() {
      // if masked, real value stored in data attribute
      if (this.set.maskChar) {
        const real = this.$el.data('real');
        // If not set, fallback to current visible value stripped of mask
        return real != null ? String(real) : (this.$el.val() || '');
      }
      return this.$el.val() || '';
    }

    // central processing: sanitize -> transform -> format -> mask -> validate -> set
    processAndSet(rawValue, opts = {}) {
      const oldVal = this.getRawValue();
      let val = String(rawValue || '');

      // step 1: sanitize / remove invalid characters based on regex
      val = this._sanitizeByRegex(val);

      // step 2: optionally auto-detect type
      if (this.set.autoDetectType && /^\d+(\.\d+)?$/.test(val)) {
        // for digits -> apply numeric regex
        val = val.replace(this.set.regexnum, '');
      }

      // step 3: block leading zeros for integer numbers (if input type=number and no dot)
      if (this.$el.prop('type') === 'number' && /^0[0-9]+$/.test(val) && !val.includes('.')) {
        val = val.replace(/^0+/, '');
      }

      // step 4: enforce maxlength
      if (this.set.maxlength && val.length > this.set.maxlength) {
        val = val.slice(0, this.set.maxlength);
      }

      // step 5: transform casing / trim
      val = this.applyTransform(val);

      // step 6: auto-formatting (phone/card/nik)
      let formatted = val;
      if (this.set.autoFormat && this.set.autoFormat !== 'none') {
        formatted = this.applyAutoFormat(val, this.set.autoFormat);
        if (formatted !== val) this.$el.trigger('ren:formatted', { raw: val, formatted });
      }

      // step 7: masking (if enabled)
      if (this.set.maskChar) {
        // store real value
        this.$el.data('real', val);
        const maskedView = this.getMaskedDisplay(val);
        this.$el.val(maskedView);
        this.$el.trigger('ren:masked', { masked: maskedView });
      } else {
        // set actual value (prefer formatted if used)
        this.$el.val(formatted);
      }

      // step 8: update validation state (minlength/preset)
      this.updateValidationState(val);

      // step 9: trigger cleaned event if changed
      if (val !== oldVal) {
        this.$el.trigger('ren:cleaned', { oldValue: oldVal, newValue: val });
        if (this.set.debug) console.log(`[RenInputRules] cleaned: "${oldVal}" → "${val}"`);
      }
    }

    _sanitizeByRegex(val) {
      const reg = this.getRegex();
      // If preset returns a full-match regex (like email), we should not replace using it;
      // instead for sanitization we'll fallback to default allowed characters if preset used.
      if (this.set.customAllowed) {
        const safe = this.set.customAllowed.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
        const rx = new RegExp(`[^a-zA-Z0-9${safe}\\s]`, 'g');
        return String(val).replace(rx, '');
      }

      if (this.set.preset !== 'none') {
        // don't aggressively remove; instead do a gentle cleanup (strip control chars)
        return String(val).replace(/[\x00-\x1F\x7F]/g, '');
      }

      if (this.$el.prop('type') === 'number') return String(val).replace(this.set.regexnum, '');
      if (this.$el.closest('.easy-autocomplete').length) return String(val).replace(this.set.regexcustoms, '');
      return String(val).replace(this.set.regexdef, '');
    }

    getRegex() {
      const { regexnum, regexdef, regexcustoms, preset } = this.set;

      const presets = {
        email: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-z]{2,}$/i,
        phone: /^[0-9+()\-\s]+$/,
        url: /^(https?:\/\/)?[^\s$.?#].[^\s]*$/,
        hex: /^#[0-9A-Fa-f]{6}$/
      };

      if (preset !== 'none') return presets[preset] || regexdef;
      if (this.$el.prop('type') === 'number') return regexnum;
      if (this.$el.closest('.easy-autocomplete').length) return regexcustoms;
      return regexdef;
    }

    applyTransform(val) {
      switch (this.set.transform) {
        case 'upper': return String(val).toUpperCase();
        case 'lower': return String(val).toLowerCase();
        case 'capitalize': return String(val).replace(/\b\w/g, l => l.toUpperCase());
        default: return String(val).trim();
      }
    }

    applyAutoFormat(val, mode) {
      if (!val) return val;
      switch (mode) {
        case 'phone':
          return this.formatPhone(val);
        case 'card':
          return this.formatCard(val);
        case 'nik':
          return this.formatNIK(val);
        default:
          return val;
      }
    }

    // basic phone formatter (Indonesia-focused): 081234567890 -> 0812-3456-7890
    formatPhone(raw) {
      let v = String(raw).replace(/[^\d+]/g, '');
      // remove leading + if present then keep country prefix if exists
      // simple smart grouping: if starts with +62 or 62, convert to +62 8...
      const { countryCode = '+62', separator = '-' } = this.set.autoFormatPhoneOptions || {};
      // normalize leading zeros or country code
      if (v.startsWith('0')) {
        // local
        v = v;
      } else if (v.startsWith('62')) {
        v = '0' + v.slice(2);
      } else if (v.startsWith('+62')) {
        v = '0' + v.slice(3);
      }
      // keep only digits
      v = v.replace(/[^\d]/g, '');
      // grouping: 4-4-4... but ensure first block 4 if length>3
      const parts = [];
      if (v.length <= 4) return v;
      // first 4
      parts.push(v.slice(0, 4));
      v = v.slice(4);
      while (v.length > 4) {
        parts.push(v.slice(0, 4));
        v = v.slice(4);
      }
      if (v.length) parts.push(v);
      return parts.join(separator);
    }

    // credit card: group by 4 with spaces
    formatCard(raw) {
      const v = String(raw).replace(/\D/g, '').slice(0, 19); // limit somewhat
      return v.replace(/(.{4})/g, '$1 ').trim();
    }

    // NIK: just strip non-digits and return as-is (optional grouping not common)
    formatNIK(raw) {
      const v = String(raw).replace(/\D/g, '').slice(0, 16);
      return v; // we keep no separators — can change if you want grouping
    }

    getMaskedDisplay(val) {
      const mask = String(this.set.maskChar || '');
      if (!mask) return val;
      // If we also have autoFormat, reflect formatted length with mask placeholders
      let display = '';
      if (this.set.autoFormat && this.set.autoFormat !== 'none') {
        const formatted = this.applyAutoFormat(val, this.set.autoFormat);
        // preserve separators from formatted but mask digits
        for (let i = 0; i < formatted.length; i++) {
          const ch = formatted[i];
          display += /\d/.test(ch) ? mask : ch;
        }
      } else {
        display = mask.repeat(val.length);
      }
      return display;
    }

    updateValidationState(val) {
      let valid = true;
      const { preset, minlength, showError, errorMessage } = this.set;

      if (minlength && String(val).length < minlength) valid = false;

      if (preset !== 'none') {
        const regex = this.getRegex();
        // if regex is a RegExp test full-match
        try {
          valid = regex.test(String(val));
        } catch (err) {
          // fallback
          valid = true;
        }
      }

      this.$el.toggleClass('valid', valid).toggleClass('invalid', !valid);

      if (showError && !valid) this.$el.attr('title', errorMessage);
      else this.$el.removeAttr('title');

      this.$el.trigger(valid ? 'ren:valid' : 'ren:invalid', { value: val });
    }

    // static helper to reset/unbind
    static reset($targets) {
      $targets.each(function () {
        const $t = $(this);
        $t.off('input keypress paste blur');
        $t.removeClass('valid invalid');
        $t.removeAttr('title');
        $t.removeData('real');
      });
    }
  }

  // jQuery plugin register
  $.fn.RenInputRules = function (options) {
    return this.each(function () {
      const $this = $(this);
      // store instance if needed
      if (!$this.data('RenInputRules')) {
        const inst = new RenInputRules($this, options);
        $this.data('RenInputRules', inst);
      } else {
        // update options by re-instantiating (simple approach)
        const inst = $this.data('RenInputRules');
        inst.detachEvents();
        $this.removeData('RenInputRules');
        const newInst = new RenInputRules($this, options);
        $this.data('RenInputRules', newInst);
      }
    });
  };

  $.fn.RenInputRulesReset = function () {
    RenInputRules.reset(this);
    return this;
  };
})(jQuery);
