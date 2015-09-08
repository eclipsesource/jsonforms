define(["doh/main", "../back", "dojo/_base/array"], function(doh, back, array){
	doh.register("tests.back.hash", [
		function getAndSet(t){
			var cases = [
				"test",
				"test with spaces",
				"test%20with%20encoded",
				"test+with+pluses",
				" leading",
				"trailing ",
				"under_score",
				"extra#mark",
				"extra?instring",
				"extra&instring",
				"#leadinghash"
			];
			function verify(s){
				back.setHash(s);
				t.is(s, back.getHash(s));
			}
			array.forEach(cases, verify);
		}
	]);
});
