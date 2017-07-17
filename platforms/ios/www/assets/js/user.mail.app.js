
	//عرض رسالة
	(function($){
		$.fn.show_sent_msg = function(settings){
			var this_map=this;
			// set up default options 
				var defaults = {
					search_query: ""
				}; 
	
			var options = $.extend({}, defaults, settings);
					myApp.showIndicator();
			//console.log(site_url+"/ads_show.php"+options.search_query);
			$.getJSON( site_url+"/members_sent_show.php"+options.search_query, { }, function( data ) {
				if(data){
					data.settings=site_settings;
					var HTML = myApp.templates.ShowMsgSentTemplate(data);
					this_map.html(HTML);
				}
			}).always(function() {
					myApp.hideIndicator();
					  });
		}
	})(jQuery);
	
	// جلب الرسائل
	(function($){
		$.fn.get_sent = function(settings){
			var this_map=this;
			// set up default options 
				var defaults = { 
					page: 1,
					get_only: "",
					search_query: ""
				}; 
	
			var options = $.extend({}, defaults, settings);
					$(this_map).find('.preloader').show();
			//console.log(site_url+"/ads_loop.php"+options.search_query);
			$.getJSON( site_url+"/members_sent.php"+options.search_query, { only: options.get_only ,page:options.page}, function( json ) {
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
					var HTML = myApp.templates.SentTemplate(json);
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
	
	// جلب الرسائل
	(function($){
		$.fn.get_inbox = function(settings){
			var this_map=this;
			// set up default options 
				var defaults = { 
					page: 1,
					get_only: "",
					search_query: ""
				}; 
	
			var options = $.extend({}, defaults, settings);
					$(this_map).find('.preloader').show();
			//console.log(site_url+"/ads_loop.php"+options.search_query);
			$.getJSON( site_url+"/members_inbox.php"+options.search_query, { only: options.get_only ,page:options.page}, function( json ) {
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
					var HTML = myApp.templates.InboxTemplate(json);
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
	//عرض رسالة
	(function($){
		$.fn.show_msg = function(settings){
			var this_map=this;
			// set up default options 
				var defaults = {
					search_query: ""
				}; 
	
			var options = $.extend({}, defaults, settings);
					myApp.showIndicator();
			//console.log(site_url+"/ads_show.php"+options.search_query);
			$.getJSON( site_url+"/members_inbox_show.php"+options.search_query, { }, function( data ) {
				if(data){
					data.settings=site_settings;
					var HTML = myApp.templates.ShowMsgTemplate(data);
					console.log(data);
					this_map.html(HTML);
				}
			}).always(function() {
					myApp.hideIndicator();
					  });
		}
	})(jQuery);


    // عند إرسال رسالة لعضو
    if ($('.js-msg').length > 0) {
        // وضع رقم العضو عند فتح نافذه الارسال
        $('body').on('click', '[data-popup=".popup-sendmsg"]', function() {
            $('#popup-sendmsg').val($(this).data('id-user'));
        });

        // الإرسال للعضو
        $('body').on('click', '.js-msg-submit', function() {
            var form = $(this).parents('form');
            var valid = form.valid();
            if(valid){
                var data = form.serializeObject();
                var user = $('#popup-sendmsg').val();

                myApp.showPreloader();
                $.ajax({
                    type: 'post',
                    url: site_url+"/members_send_messages.php?id_user="+user,
                    crossDomain: true,
                    async: true,
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        //console.log(data);
                        myApp.hidePreloader();

                        if(!data.errors) {

                            myApp.closeNotification(".notification-item");
                            myApp.addNotification({
                                title: 'إرسال الرسالة',
                                message: ' شكراً لك لقد تم إرسال الرسالة بنجاح '
                            });
                            setTimeout(function () {
                                myApp.closeNotification(".notification-item");
                            }, 2000);

                            form.find("input[type=title], textarea").val("");

                            myApp.closeModal('.popup-sendmsg');
                        } else {
                            var msg = data.errors.join('<br>');

                            myApp.alert(data.msg, msg);
                        }
                    }
                });


            }
        });
    }