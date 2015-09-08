define(["doh/main", "require"], function(doh, require){
	doh.register("tests.dom-prop", require.toUrl("./dom-prop.html"), 30000);
});
