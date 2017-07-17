// عند إضافة تعليق جديد
	(function($){
		$.fn.add_comment = function(){
			var this_map=this;
			$('body').on('click', '.js-add-comment-submit', function() {
				var form = $(this).parents('form');
				var valid = form.valid();
				if(valid){
					var data = form.serializeObject();
					myApp.showIndicator();
					$.ajax({
						type: 'post',
						url: site_url+"/comments.php",
						crossDomain: true,
						async: true,
						dataType: "json",
						data: data,
						success: function (data) {
							//console.log(data);
							myApp.hideIndicator();

							if(!data.errors) {
							myApp.closeNotification(".notification-item");
								myApp.addNotification({
									title: 'شكراً لك',
									message: ' لقد تم إرسال التعليق بنجاح '
								});
								setTimeout(function () {
									myApp.closeNotification(".notification-item");
								}, 2000);
								form.find("[name=comment]").val("");
								
							} else {
								var msg = data.errors.join('<br>');
								myApp.alert(data.msg, msg);
							}
						}
					}).always(function() {
						myApp.hideIndicator();
						  });
					
					
				}
			});
		}
	})(jQuery);
	