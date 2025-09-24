(function ($) {
  $.fn.RenInputRules = function (options) {
    // Default options
    var set = $.extend({
      patnnumstat: false,
      patntextstat: false,

      patnnum: '^[0-9]*\\.?[0-9]*$', // lebih fleksibel: angka + optional titik
      patntext: '^[a-zA-Z0-9!/\\.\\-\\s_]+$',

      regexnum: /[^0-9.]/g,                // hanya angka & titik
      regexdef: /[^a-zA-Z0-9().|\\/!._\\-\\s]/g, // default allowed
      regexcustoms: /[^a-zA-Z0-9.]/g       // untuk input easy-autocomplete
    }, options);

    function cleanValue($el, event) {
      if ($el.is('[disabled], [readonly]')) return;

      let val = $el.val();

      if ($el.prop('type') === 'number') {
        val = val.replace(set.regexnum, "");
      } else if ($el.closest('.easy-autocomplete').length) {
        val = val.replace(set.regexcustoms, "");
      } else {
        val = val.replace(set.regexdef, "");
      }

      // blok leading zero hanya untuk angka integer, bukan decimal
      if ($el.prop('type') === 'number' && /^0[0-9]+$/.test(val)) {
        val = val.replace(/^0+/, '');
      }

      $el.val(val);

      // prevent input non-digit di keypress untuk number
      if ($el.prop('type') === 'number' && event.type === 'keypress') {
        if (event.which < 48 || event.which > 57) {
          event.preventDefault();
        }
      }
    }

    return this.each(function () {
      var $el = $(this);

      if (!$el.is('[disabled], [readonly]')) {
        if (set.patnnumstat && $el.prop('type') === 'number') {
          $el.prop('pattern', set.patnnum);
        }
        if (set.patntextstat && $el.prop('type') === 'text') {
          $el.prop('pattern', set.patntext);
        }
      }

      $el.on("input keypress keyup", function (event) {
        cleanValue($el, event);
      });
    });
  };
}(jQuery));
