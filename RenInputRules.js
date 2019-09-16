	(function ( $ ) {
 
		$.fn.RenInputRules = function( options ) {
	 
			// This is the easiest way to have default options.
			var set = $.extend({
				// These are the defaults.
				patnnumstat		: false,
				patntextstat	: false,
				
				patnnum 		: '[0-9.]',
				patntext		: '[a-zA-Z0-9!/.-\s_].{0,}',
				
				regexnum		: /^[0-9]+\.[0-9][0-9][0-9]/gi, //for number
				regexdef		: /[^a-zA-Z0-9().|\/!-\s_]/gi, // for all input
				regexcustoms	: /[^a-zA-Z0-9.]/gi, // for customs class
				
				
			}, options );
			
			return this.each(function() {
				// Plugin code would go here...
				var e = $(this);
				
				if(typeof e.attr('disabled') === 'undefined' && typeof e.attr('readonly') === 'undefined'){
					if(set.patnnumstat)
						$('input[type="number"]').prop('pattern', set.patnnum);
					
					if(set.patntextstat)
						$('input[type="text"]').prop('pattern', set.patntext);
				}
				
				// e.css({
					// color: settings.color,
					// backgroundColor: settings.backgroundColor
				// });				
				
				// $('body').delegate('input', "keypress keyup", function(event){
				e.on("keypress keyup", function(event){
					// var e = $(this);
					
					if(typeof e.attr('disabled') === 'undefined' && typeof e.attr('readonly') === 'undefined'){
						if(e.prop('type') === 'number')
							e.val(e.val().replace(set.regexnum, ""));
						else if($(event.target).parent().attr('class') == 'easy-autocomplete')
							e.val(e.val().replace(set.regexcustoms, ""));
						else
							e.val(e.val().replace(set.regexdef, ""));
						
						if(e.prop('type') === 'number' && event.type === 'keypress'){
							if ((event.which < 48 || event.which > 57)){
								event.preventDefault();
							}else if(e.val()[0] === '0'){
								e.val("");
							}
						}
					}
				});
			});
		};
	 
	}( jQuery ));
