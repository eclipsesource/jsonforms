define(["doh/main", "../cldr/supplemental", "../cldr/monetary"], function(doh, supplemental){
	doh.register("tests.cldr", [
		function test_date_getWeekend(t){
			t.is(6, supplemental.getWeekend('en-us').start);
			t.is(0, supplemental.getWeekend('en').end);
			t.is(5, supplemental.getWeekend('he-il').start);
			t.is(6, supplemental.getWeekend('he').end);
		}
	]);
});

