/**
 * A fast, small and feature-rich javascript library for mobile browser
 * Use it just like jQuery, although they work different.
 * Have fun.
 */

;(function(root, name, factory){
	if(typeof module === 'object' && module.exports){
		module.exports = factory();
	}
	else if(typeof define === 'function'){
		if(define.amd){
			define(name, factory);
		}
		else {
			define(factory);
		}
	}
	else {
		root[name] = factory();
	}

})(this, 'kQuery', function(){
	var kQuery = {};

	return kQuery;
});



