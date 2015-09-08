define([
	"doh", "require",
	"dojo/debounce"
], function(doh, require, debounce){
	doh.register("tests.debounce", [
		function debounceTest(){
			var debouncedCount = {},
				debounceTest1 = debounce(function() {
					debouncedCount['test1'] = debouncedCount['test1'] || 0;
					debouncedCount['test1']++;
				}, 100),
				debounceTest2 = debounce(function() {
					debouncedCount['test2'] = debouncedCount['test2'] || 0;
					debouncedCount['test2']++;
				}, 100);

			debounceTest1();
			debounceTest1();
			debounceTest1();

			debounceTest2();
			setTimeout(function() {
				debounceTest2();
			}, 40);
			setTimeout(function() {
				debounceTest2();
			}, 80);
			setTimeout(function() {
				debounceTest2();
			}, 120);
			setTimeout(function() {
				debounceTest2();
			}, 180);
			setTimeout(function() {
				debounceTest2();
			}, 220);
			setTimeout(function() {
				debounceTest2();
			}, 350);
			
			var deferred = new doh.Deferred();
			setTimeout(deferred.getTestCallback(function(){
				doh.is(1, debouncedCount['test1']);
				doh.is(2, debouncedCount['test2']);
			}), 500);
			return deferred;

		}
	]);
});
