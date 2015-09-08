define(["doh/main", "../regexp"], function(doh, regexp){

doh.register("tests.regexp",
		function test_regexp_escape(t){
			t.assertTrue(new RegExp(regexp.escapeString("\f\b\n\t\r+.$?*|{}()[]\\/^")).test("TEST\f\b\n\t\r+.$?*|{}()[]\\/^TEST"));
			t.assertTrue(new RegExp(regexp.escapeString("\f\b\n\t\r+.$?*|{}()[]\\/^", ".")).test("TEST\f\b\n\t\r+X$?*|{}()[]\\/^TEST"));
			t.is("a\\-z", regexp.escapeString("a-z"));
		}
);


});
