//在哪个页面禁止，就在哪个页面使用forbiddenBack.init();并且在前一个跳转页面加一个hash值#no-back;
/*
例如：
	在index.html: <a href="center.html#no-back">
	在center.html: <script>
						var forbiddenBack = require('forbiddenBack.js');
						forbiddenBack.init();
				   </script>
*/
var forbiddenBack = {
	init: function() {
		
		function changeState(hash) {
			var history_api = typeof history.pushState !== 'undefined';
			if (history_api) 
	            history.pushState(null, '', hash);
	        else
	            location.hash = hash;
		}

		function forbiddenJump(lastHash, newHash) {
			if (location.hash == lastHash) {
		        changeState(newHash);
		        window.onhashchange = function(newURL, oldURL) {
		        	//此时的location是oldURL；
		            if (location.hash == lastHash) {
		                changeState(newHash);
		            }
		        }
		    }
		}
	    forbiddenJump('#no-back', '#stay');
	    forbiddenJump('#stay', '#no-back');
	}
};
module.exports = forbiddenBack;