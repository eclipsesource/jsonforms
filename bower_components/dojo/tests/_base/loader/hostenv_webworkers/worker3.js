// summary:
//		Test whether the require function loads modules as it should in async mode.

var dojoConfig = {
	baseUrl: "../../../../../",
	async: true,
	packages: [{
		name: "dojo", location: "dojo"
	}]
};

importScripts("../../../../dojo.js", "console.js");

try{
	require(["dojo/tests/_base/loader/hostenv_webworkers/strings"], function(strings){
		self.postMessage({
			type: "testResult",
			test: "require is working",
			value: true
		});
	});
}catch(e){
	self.postMessage({
		type: "testResult",
		test: "require is working",
		value: false
	});
}
