define([
	"dojo/dom-construct",
	"doh",
	"require"
], function(construct, doh, require){

	if(doh.isBrowser){
		doh.register("tests.dom-construct-place", require.toUrl("./dom-construct-place.html"), 30000);
	}

	doh.register("tests.dom-construct", [
		{
			name: "Create element with textContent",
			runTest: function(t){
				var x = construct.create("div", {
					textContent: "<b>this is bold</b>"
				});
				t.is("&lt;b&gt;this is bold&lt;/b&gt;", x.innerHTML, "textContent was not properly set");
			}
		}
	]);

});
