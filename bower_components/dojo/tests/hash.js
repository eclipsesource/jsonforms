define(["doh/main", "../hash", "../topic"], function(doh, hash, topic){

	// utilities for the tests:
	function setHash(h){
		h = h || "";
		location.replace('#'+h);
	}

	function getHash(){
		var h = location.href, i = h.indexOf("#");
		return (i >= 0) ? h.substring(i + 1) : "";
	}

	doh.register("tests.hash", [
		// hash as an empty string.
		{
			name: "Getting an empty hash",
			setUp: function(){
				setHash();
			},
			runTest: function(t){
				t.is('', hash());
			}
		},
		{
			name: "Setting an empty hash",
			setUp: function(){
				hash('');
			},
			runTest: function(t){
				t.is('', getHash());
			}
		},
		// hash as "test"
		{
			name: "Getting the hash of 'test'",
			setUp: function(){
				setHash('test');
			},
			runTest: function(t){
				t.is('test', hash());
			},
			tearDown: function(){
				setHash();
			}
		},
		{
			name: "Setting the hash to 'test'",
			setUp: function(){
				hash('test');
			},
			runTest: function(t){
				t.is('test', getHash());
			},
			tearDown: function(){
				setHash();
			}
		},
		// hash with spaces
		{
			name: "Getting the hash of 'test%20with%20spaces'",
			setUp: function(){
				setHash('test%20with%20spaces');
			},
			runTest: function(t){
				t.is('test%20with%20spaces', hash());
			},
			tearDown: function(){
				setHash();
			}
		},
		{
			name: "Setting the hash of 'test%20with%20spaces'",
			setUp: function(){
				setHash('test%20with%20spaces');
			},
			runTest: function(t){
				t.is('test%20with%20spaces', getHash());
			},
			tearDown: function(){
				setHash();
			}
		},
		// hash with encoded hash
		{
			name: "Getting the hash of 'test%23with%23encoded%23hashes'",
			setUp: function(){
				setHash('test%23with%23encoded%23hashes');
			},
			runTest: function(t){
				t.is('test%23with%23encoded%23hashes', hash());
			},
			tearDown: function(){
				setHash();
			}
		},
		{
			name: "Setting the hash of 'test%23with%23encoded%23hashes'",
			setUp: function(){
				setHash('test%23with%23encoded%23hashes');
			},
			runTest: function(t){
				t.is('test%23with%23encoded%23hashes', getHash());
			},
			tearDown: function(){
				setHash();
			}
		},
		// hash with plus character: test+with+pluses
		{
			name: "Getting the hash of 'test+with+pluses'",
			setUp: function(){
				setHash('test+with+pluses');
			},
			runTest: function(t){
				t.is('test+with+pluses', hash());
			},
			tearDown: function(){
				setHash();
			}
		},
		{
			name: "Setting the hash to 'test+with+pluses'",
			setUp: function(){
				hash('test+with+pluses');
			},
			runTest: function(t){
				t.is('test+with+pluses', getHash());
			},
			tearDown: function(){
				setHash();
			}
		},
		// hash with leading space
		{
			name: "Getting the hash of '%20leadingSpace'",
			setUp: function(){
				setHash('%20leadingSpace');
			},
			runTest: function(t){
				t.is('%20leadingSpace', hash());
			},
			tearDown: function(){
				setHash();
			}
		},
		{
			name: "Setting the hash to '%20leadingSpace'",
			setUp: function(){
				hash('%20leadingSpace');
			},
			runTest: function(t){
				t.is('%20leadingSpace', getHash());
			},
			tearDown: function(){
				setHash();
			}
		},

		// hash with trailing space:
		{
			name: "Getting the hash of 'trailingSpace%20'",
			setUp: function(){
				setHash('trailingSpace%20');
			},
			runTest: function(t){
				t.is('trailingSpace%20', hash());
			},
			tearDown: function(){
				setHash();
			}
		},
		{
			name: "Setting the hash to 'trailingSpace%20'",
			setUp: function(){
				hash('trailingSpace%20');
			},
			runTest: function(t){
				t.is('trailingSpace%20', getHash());
			},
			tearDown: function(){
				setHash();
			}
		},
		// hash with underscores.
		{
			name: "Getting the hash of 'under_score'",
			setUp: function(){
				setHash('under_score');
			},
			runTest: function(t){
				t.is('under_score', hash());
			},
			tearDown: function(){
				setHash();
			}
		},
		{
			name: "Setting the hash to 'under_score'",
			setUp: function(){
				hash('under_score');
			},
			runTest: function(t){
				t.is('under_score', getHash());
			},
			tearDown: function(){
				setHash();
			}
		},
		{
			name: "Getting the hash of 'extra&instring'",
			setUp: function(){
				setHash("extra&instring");
			},
			runTest: function(t){
				t.is("extra&instring", hash());
			},
			tearDown: function(){
				setHash();
			}
		},
		{
			name: "Setting the hash to 'extra&instring'",
			setUp: function(){
				hash('extra&instring');
			},
			runTest: function(t){
				t.is('extra&instring', getHash());
			},
			tearDown: function(){
				setHash();
			}
		},
		{
			name: "Getting the hash of 'extra?instring'",
			setUp: function(){
				setHash('extra?instring');
			},
			runTest: function(t){
				t.is('extra?instring', hash());
			},
			tearDown: function(){
				setHash();
			}
		},
		{
			name: "Setting the hash of 'extra?instring'",
			setUp: function(){
				hash('extra?instring');
			},
			runTest: function(t){
				t.is('extra?instring', getHash());
			},
			tearDown: function(){
				setHash();
			}
		},
		{
			name: "Getting the hash resembling a query parameter ('?testa=3&testb=test')",
			setUp: function(){
				setHash('?testa=3&testb=test');
			},
			runTest: function(t){
				t.is('?testa=3&testb=test', hash());
			},
			tearDown: function(){
				setHash();
			}
		},
		{
			name: "Setting the hash resembling a query parameter ('?testa=3&testb=test')",
			setUp: function(){
				hash('?testa=3&testb=test');
			},
			runTest: function(t){
				t.is('?testa=3&testb=test', getHash());
			},
			tearDown: function(){
				setHash();
			}
		},
		{
			name: "Setting the hash to '#leadingHash' should result in the hash being 'leadingHash'",
			setUp: function(){
				hash('#leadingHash');
			},
			runTest: function(t){
				t.is('leadingHash', getHash());
			},
			tearDown: function(){
				setHash();
			}
		},
		{
			_s: null, // used for the subscriber.

			name: "Hash change publishes to '/dojo/hashchange'",
			setUp: function(t){
				setHash();
			},
			runTest: function(t){
				var d = new doh.Deferred();
				this._s = topic.subscribe('/dojo/hashchange', d.getTestCallback(function(value){
					doh.assertEqual('test', value);
				}));

				hash('test');
				return d;
			},
			tearDown: function(){
				this._s.remove();
				setHash();
			}
		}
	]);
});
