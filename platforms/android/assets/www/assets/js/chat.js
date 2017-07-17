$(document).ready(function(){
// جلب المحادثات
	(function($){
		$.fn.get_chats = function(settings){
			var this_map=this;
				var defaults = {
				}; 
			var options = $.extend({}, defaults, settings);
			console.log(options);
			if(options.Indicator){
					myApp.showIndicator();
			}
			
			$.getJSON( site_url+"/chat.php", { action: 'chats' }, function( json ) {
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
					var HTML = myApp.templates.chatsTemplate(json);
					this_map.find('.chats-list').html(HTML);
				}
			}).always(function() {
						myApp.hideIndicator();
					  });
		}
	})(jQuery);
	$(function() {
		$.fn.chat = function(settings){
			
			var defaults = {
				last_id:0,
				wait:true
			}; 
			var options = $.extend({}, defaults, settings);
			
			var this_map=this;
			
			$$(this).find('.messagebar .link').on('click', function () {
				// Init Messagebar
					var myMessagebar = myApp.messagebar('.messagebar');

				// Message text
					var messageText = myMessagebar.value().trim();
				// Exit if empy message
					if (messageText.length === 0) return;
				 
				// Empty messagebar
					myMessagebar.clear()
					//this_map.set_msg({
					//	message:messageText,
					//	type:messageType
					//});
					this_map.send_msg({
						message:messageText
					});
			});
			
			this.get_messages = function (){
				opj=this;
				// options.wait حتى لا تعمل الدالة إلا إذا تم إنهاء عملها فى الثوانى السابقة وذلك حتى لا يتم جلب عناصر بشكل مكرر فى الشات 
				if(options.wait == true ){
					options.wait=false;
					$.getJSON( site_url+"/chat.php?action=chat" , { last: options.last_id ,id_user:options.user } , function( json ) {
						options.wait=true;
						
						if(json.chat !== null  ){ 
							$.each( json.chat, function( i, l ){
								
								this_map.set_msg({
									message:l.msg,
									type:l.type
								});
								
								
							});
						}
						
						if(json.max > 0){
							options.last_id = json.max;
						}
					}, "json");
				}
				
			}
			
					this_map.get_messages();
			setInterval(function(){
				if(user_chat == options.user){
					this_map.get_messages();
				}
			},2000);
				
			this.set_msg = function (obj){
				//console.log(obj);
				// Conversation flag
					var conversationStarted = false;

				// Init Messages
					var myMessages = myApp.messages('.messages', {
						autoLayout:true
					});
				// Add message
					myMessages.addMessage({
						// Message text
						text: obj.message,
						// Random message type
						type: obj.type,
						// Avatar and name:
						//avatar: 'http://lorempixel.com/29/29/people/',
						//name: 'Kate',
						// Day
						//day: !conversationStarted ? 'Today' : false,
						//time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
					});
				// Update conversation flag
					conversationStarted = true;
				
			}
			this.send_msg = function (obj){
					$.post( site_url+"/chat.php?action=send" , { message: obj.message , id: options.user }, function( json ) {
						if(json.add == true){
							//console.log(json);
						}else{
							var msg = json.errors.join('<br>');
							myApp.closeNotification(".notification-item");
							myApp.addNotification({
								title: 'هناك خطاء ',
								message: msg,
								media: '<i class="fa fa-exclamation-circle"></i>',
								//additionalClass: 'NotificationFavorit'
							});
						}
					}, "json");
			}
		}
	});
});
