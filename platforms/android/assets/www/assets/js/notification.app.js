 
	// جلب الإشعارات
	(function($){
		$.fn.get_notifications = function(settings){
			var this_map=this;
			// set up default options 
				var defaults = { 
					page: 1,
					search_query: ""
				}; 
	
			var options = $.extend({}, defaults, settings);
					$(this_map).find('.preloader').show();
			//console.log(site_url+"/ads_loop.php"+options.search_query);
			$.getJSON( site_url+"/members_notifications.php"+options.search_query, { page:options.page}, function( json ) {
				if(json.errors){
					myApp.popup('.popup-login');
					myApp.closeNotification(".notification-item");
					myApp.addNotification({
						title: 'هناك خطاء ',
						message: 'يجب تسجيل الدخول أولاً <a href="#" class="link open-popup" data-popup=".popup-login">إضغط هنا </a>',
						media: '<i class="fa fa-exclamation-circle"></i>',
						//additionalClass: 'NotificationFavorit'
					});
				}else if(json){
					var HTML = myApp.templates.NotificationsTemplate(json);
					this_map.html(HTML);
				}
			}).always(function() {
						if(settings.always){
							settings.always();
						}
					$(this_map).find('.preloader').hide();
					  });
		}
	})(jQuery);
	/*
	// الاشعارات sse
	(function( $ ) {
		NotifierSSE = (function() {
			var _stateNode = $('.notification-count'),
				_chatNode = $('.chats-count'),
				_src,
				_handler = {
				onMessage : function(event) {
					var data = JSON.parse(event.data);
					if(data.notifications > 0){
						_stateNode.html(data.notifications).show();
					}else{
						_stateNode.html(0).hide();
					}
					if(data.chats > 0){
						_chatNode.html(data.chats).show();
					}else{
						_chatNode.html(0).hide();
					}
					
					//_stateNode.val(data.updatedNotificationNum);
				}
			};
			return {
				init : function () {
				_src = new EventSource(site_url+"/count.php");
				_src.addEventListener('message', _handler.onMessage, false);
				}
			}
		}());
		setTimeout(NotifierSSE.init, 40);
	})( jQuery );*/
	/*
	(function($){
			wait_count=true;
		$.fn.get_notifications_count = function(){
			var this_map=this;
			//myApp.showIndicator();
			if(wait_count == true ){
			wait_count=false;
				$.getJSON( site_url+"/members_counts.php", function( json ) {
					if(json.notifications > 0){
						$('.notification-count').html(json.notifications).show();
					}else{
						$('.notification-count').html(0).hide();
					}
					if(json.chats > 0){
						$('.chats-count').html(json.chats).show();
					}else{
						$('.chats-count').html(0).hide();
					}
					if(json.messages > 0){
						$('.messages-count').html(json.messages).show();
					}else{
						$('.messages-count').html(0).hide();
					}
				}).always(function() {
					wait_count=true;
							//myApp.hideIndicator();
						  });
			}
		}
	})(jQuery);
	*/

//	$(document).get_notifications_count();
	//setInterval(function(){
	//	$(document).get_notifications_count();
	//},2000);