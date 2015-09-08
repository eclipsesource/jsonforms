define(["doh/main", "require"], function(doh, require){
	doh.register("tests.dom-attr", require.toUrl("./dom-attr.html"), 30000);
});
