//加载模块css
require('./css/dialog.scss');



module.exports = function() {
	var $dialog = $(html).clone();
	$dialog.find('.close').on('click', function() {
		$dialog.fadeOut(function() {
			$(this).remove();
		});
	});
	$('body').append($dialog);
	$dialog.fadeIn();
}