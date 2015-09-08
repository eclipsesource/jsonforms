define([ "doh", "dojo/has", "require" ], function (doh, has, require) {
	if(has("host-browser")){
		doh.registerUrl("tests.text", require.toUrl("./text.html"), 30000);
	}
});
