define([
	"doh", "require",
	"dojo/throttle"
], function(doh, require, throttle){
	doh.register("tests.throttle", [
		function throttleTest(){
			var throttledCount = {},
				throttleTest1 = throttle(function() {
					throttledCount['test1'] = throttledCount['test1'] || 0;
					throttledCount['test1']++;
				}, 100),
				throttleTest2 = throttle(function() {
					throttledCount['test2'] = throttledCount['test2'] || 0;
					throttledCount['test2']++;
				}, 100);

			throttleTest1();
			throttleTest1();
			throttleTest1();

			throttleTest2();
			setTimeout(function() {
				throttleTest2();
			}, 40);
			setTimeout(function() {
				throttleTest2();
			}, 80);
			setTimeout(function() {
				throttleTest2();
			}, 120);
			setTimeout(function() {
				throttleTest2();
			}, 180);
			setTimeout(function() {
				throttleTest2();
			}, 220);
			setTimeout(function() {
				throttleTest2();
			}, 350);
			
			var deferred = new doh.Deferred();
			setTimeout(deferred.getTestCallback(function(){
				doh.is(1, throttledCount['test1']);
				doh.is(3, throttledCount['test2']);
			}), 500);
			return deferred;

		}
	]);
});
