# RenInputRules
regex, patter, etc

### Usage

In its simple case, RenInputRules can be initialised with a single line of Javascript:
```
$('input').RenInputRules();
```

While configuration parameter be passed in to RenInputRules to have it perform certain actions by using a configuration object as the parameter passed in to the RenInputRules constructor. For example:
```
$('input').RenInputRules({
  patnnumstat		: false,
  patntextstat	: false
});
```
will add pattern number properties into input type number and pattern text properties for input type text. And also the other configuration are below : 
```
patnnum 		: '[0-9.]',
patntext		: '[a-zA-Z0-9!/.-\s_].{0,}',
```
the configuration above set by default, you can change the pattern and it will added into input attributes.

```
regexnum		: /^[0-9]+\.[0-9][0-9][0-9]/gi, //for number
```
the configuration above set by default, and use for input type number, it will replace all input into "" (blank), except number.
```
regexdef		: /[^a-zA-Z0-9().|\/!-\s_]/gi, // for all input
```
the configuration above set by default, and use for input type text.
```
regexcustoms	: /[^a-zA-Z0-9.]/gi, // for customs class
```
the configuration above set by default, and use for input type text that have easy-autocomplete class.
