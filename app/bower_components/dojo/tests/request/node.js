require([
	'require',
	'doh/main',
	'dojo/request',
	'dojo/node!http',
	'dojo/node!url',
	'dojo/Deferred'
], function(require, doh, request, http, url, Deferred){
	var serverPort = 8142,
		serverUrl = 'http://localhost:8124';

	var responseDataMap = {
		'fooBar': '{ "foo": "bar" }',
		'invalidJson': '<not>JSON</not>'
	};
	function getRequestUrl(dataKey){
		return serverUrl + '?dataKey=' + dataKey;
	}
	function getResponseData(request){
		var parseQueryString = true;
		var urlInfo = url.parse(request.url, parseQueryString);
		return responseDataMap[urlInfo.query.dataKey];
	}

	var server = http.createServer(function(request, response){
		var body = getResponseData(request);

		response.writeHead(200, {
			'Content-Length': body.length,
			'Content-Type': 'application/json'
		});
		response.write(body);
		response.end();
	});

	function setUp(){ /* Do nothing */ }
	function tearDown(){ server.close(); }
	server.on('listening', function(){
		var tests = [
			{
				name: 'test',
				runTest: function(t){
					var d = new doh.Deferred();

					request.get(getRequestUrl('fooBar'), {
						handleAs: 'json'
					}).then(d.getTestCallback(function(data){
						t.is({ foo: 'bar' }, data);
					}), function(err){
						d.errback(err);
					});

					return d;
				}
			},
			{
				name: 'test-handler-exception',
				runTest: function(t){
					var d = new doh.Deferred();

					request.get(getRequestUrl('invalidJson'), {
						handleAs: 'json'
					}).then(function(){
						d.errback(new Error('Expected a handler exception.'));
					}, d.getTestCallback(function(err){
						doh.assertTrue(err instanceof SyntaxError);
					}));

					return d;
				}
			}
		];

		doh.register('tests.request.node', tests, setUp, tearDown);
		doh.run();
	});
	server.listen(8124);
});
