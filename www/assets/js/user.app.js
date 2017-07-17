
	// متابعة عضو
	$('body').on('click', ".Follow", function() {
					myApp.showIndicator();
		var MapFollow = $(this).parent().children(".Follow");
		var MapUnfollowing = $(this).parent().children(".Unfollowing");
		var id = $(this).data("id-user");
		var string = 'id='+ id ;
		$.ajax({
				dataType: "json",
			type: "POST",
			url: site_url+"/data.php?Follow=1",
			data: string,
			cache: false,
			success: function(json){

               if(json.errors) {
					var msg = json.errors.join('<br>');
                     myApp.alert(json.msg, msg);
				}else if(json.follow == true){
					$(MapFollow).hide();
					$(MapUnfollowing).show();
							myApp.closeNotification(".notification-item");
							myApp.addNotification({
								title: 'تم بنجاح',
								message: ' تم إضافة العضو للمُتابعة',
								media: '<i class="fa fa-check-circle"></i>',
								//additionalClass: 'NotificationFavorit'
							});
								setTimeout(function () {
									myApp.closeNotification(".notification-item");
								}, 2000);
				}else{
							myApp.closeNotification(".notification-item");
					myApp.addNotification({
						title: 'هناك خطاء ',
						message: msg,
						media: '<i class="fa fa-exclamation-circle"></i>',
						//additionalClass: 'NotificationFavorit'
					});
				}
			}
		}).always(function() {
						myApp.hideIndicator();
					  });
		return false;
	});
	// إلغاء متابعة عضو
	$('body').on('click', ".Unfollowing", function() {
					myApp.showIndicator();
		var MapFollow = $(this).parent().children(".Follow");
		var MapUnfollowing = $(this).parent().children(".Unfollowing");
		var id = $(this).data("id-user");
		var string = 'id='+ id ;
		$.ajax({
			dataType: "json",
			type: "POST",
			url: site_url+"/data.php?Unfollowing=1",
			data: string,
			cache: false,
			success: function(json){

               if(json.errors) {
					var msg = data.errors.join('<br>');
                     myApp.alert(data.msg, msg);
				}else if(json.unfollowing == true){
					$(MapUnfollowing).hide();
					$(MapFollow).show();
							myApp.closeNotification(".notification-item");
							myApp.addNotification({
								title: 'تم بنجاح',
								message: 'تم إلغاء مُتابعة العضو',
								media: '<i class="fa fa-check-circle"></i>',
								//additionalClass: 'NotificationFavorit'
							});
								setTimeout(function () {
									myApp.closeNotification(".notification-item");
								}, 2000);
				}else{
							myApp.closeNotification(".notification-item");
					myApp.addNotification({
						title: 'هناك خطاء ',
						message: msg,
						media: '<i class="fa fa-exclamation-circle"></i>',
						//additionalClass: 'NotificationFavorit'
					});
				}
			}
		}).always(function() {
						myApp.hideIndicator();
					  });
		return false;
	});



	(function($){
		$.fn.get_profile = function(settings){

			var this_map=this;
			// set up default options
				var defaults = {
					search_query: ""
				};

			var options = $.extend({}, defaults, settings);
					myApp.showIndicator();
			$.getJSON( site_url+"/profile.php"+options.search_query, function( data ) {
				if(data){

					if(data.this_title){
						$('.sliding').html(data.page_title);
					}
						data.settings=site_settings;
					var HTML = myApp.templates.ProfileTemplate(data);
					this_map.html(HTML);

				}
			}).always(function() {
						myApp.hideIndicator();
					  });

		}
	})(jQuery);

	(function($){
		$.fn.get_user = function(settings){
			var this_map=this;
			// set up default options
				var defaults = {
					page: 1,
					get_only: "",
					search_query: ""
				};

			var options = $.extend({}, defaults, settings);

				myApp.showIndicator();

			$.ajax({
				type: 'get',
				url: site_url+"/user.php",
				dataType: "json",
				success: function (data) {
						myApp.hideIndicator();
					if(data){
						data.settings=site_settings;
						//console.log(data);
						var HTML = myApp.templates.UserPanelTemplate(data);
						console.log(data);
						if (!data.hasOwnProperty('results'))
							localStorage.setItem('logged_in', false);
						else
							localStorage.setItem('logged_in', true);
						
						
						$('.User-Panel').html(HTML);
						return  data;
					}else{
						return  false;
					}
				}
            }).always(function(data) {
                if(options.always){
                    options.always(data);
                }
            });
		}
	})(jQuery);

	//تسجيل الخروج
        $('body').on('click', '.logout', function() {
					myApp.showIndicator();
			$.ajax({
				dataType: "json",
				url     : site_url+"/logout.php",
				type    : 'post',
				data    :  { logout: "1" },
				success : function( response ) {
							localStorage.setItem('logged_in', false);
							myApp.closeNotification(".notification-item");
							myApp.addNotification({
								title: 'تسجيل الخروج',
								message: ' لقد تم تسجيل الخروج بنجاح '
							});
								setTimeout(function () {
									myApp.closeNotification(".notification-item");
								}, 2000);
							
							$(document).get_user({});

						}
			}).always(function() {
						myApp.hideIndicator();
					  });

			//logout

        });

	// عند تفعيل العضوية
    if ($('.js-active').length > 0) {
        $('body').on('click', '.send-active-msg', function() {
				var type=$(this).data('type');
                myApp.showPreloader();
				$.ajax({
					type: 'get',
					url: site_url+"/activation.php",
					crossDomain: true,
					async: true,
					dataType: "json",
					data: {
							re_send:1,
							send_to:type
					},
					success: function (data) {
						console.log(data);
                        myApp.hidePreloader();
							myApp.closeNotification('.NotificationReport');
                        if(!data.errors) {
							myApp.closeNotification(".notification-item");
							myApp.addNotification({
								title: 'أهلاً بك',
								message: ' تم إرسال كود التفعيل مرة أخرى',
								additionalClass: 'NotificationReport'
							});
								setTimeout(function () {
									myApp.closeNotification(".notification-item");
								}, 2000);
                        } else {
							myApp.closeNotification(".notification-item");
							myApp.addNotification({
								title: 'أهلاً بك',
								message: 'لا يمكن إرسال كود التفعيل إلا بعد مرور  12 ساعة من آخررسالة تم إرسالها لك ',
								additionalClass: 'NotificationReport'
							});
                        }
								myApp.closeModal('.popover-active');
					}
				});
				return false;
        });

		$('body').on('click', ".re-send" , function () {

			var clickedLink = this;
				myApp.showIndicator();
			$.ajax({
				dataType: "json",
				type: "get",
				url: site_url+"/get.php",
				data: {
					action:'sentList'
				}
				,
				cache: false,
				success: function(json){
					var popoverHTML = myApp.templates.activePopoverTemplate(json);
					myApp.popover(popoverHTML, clickedLink);

				}
			}).always(function() {
						myApp.hideIndicator();
			});
			return false;
		});

        $('body').on('click', '.js-active-submit', function() {
            var form = $(this).parents('form');
            var valid = form.valid();
            if(valid){
                var data = form.serializeObject();
                myApp.showPreloader();
				$.ajax({
					type: 'post',
					url: site_url+"/activation.php",
					crossDomain: true,
					async: true,
					dataType: "json",
					data: data,
					success: function (data) {
						console.log(data);
                        myApp.hidePreloader();
							myApp.closeNotification('.NotificationReport');
                        if(!data.errors) {
							myApp.closeNotification(".notification-item");
							myApp.addNotification({
								title: 'أهلاً بك',
								message: ' لقد تم تفعيل عضويتك بنجاح  ',
								additionalClass: 'NotificationReport'
							});
							myApp.closeModal('.popup-activation');
							$('.activation-link').remove();
								setTimeout(function () {
									myApp.closeNotification(".notification-item");
								}, 2000);
                        } else {

                            form.find("input[type=code]").val("");
							myApp.closeNotification(".notification-item");
							myApp.addNotification({
								title: 'أهلاً بك',
								message: ' هناك خطأ  أعد كتابة كود التفعيل',
								additionalClass: 'NotificationReport'
							});

                        }
					}
				});
            }
				return false;
        });
    }

	(function($){
		$.fn.send_registered = function(id){
			myApp.showIndicator();
			//alert(site_url+"/registered.php");
			$.ajax({
				dataType: "json",
				url     : site_url+"/registered.php",
				type    : 'post',
				data    :  {
					id: id ,
					device: device.platform
				},
				success : function( response ) {
					//alert(response);
					//alert(response.update);
					//alert(response.errors);
						}
			}).always(function() {
						myApp.hideIndicator();
					  });
		}
	})(jQuery);
	// عند تسجيل دخول
    if ($('.js-validate').length > 0) {
        $('body').on('click', '.js-form-submit', function() {
            var form = $(this).parents('form');
            var valid = form.valid();
            if(valid){
                var data = form.serializeObject();
                myApp.showPreloader();
				$.ajax({
					type: 'post',
					url: site_url+"/user.php",
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
								title: 'دخول الأعضاء',
								message: ' أهلاً بك يا '+data.results.user_name
							});
								setTimeout(function () {
									myApp.closeNotification(".notification-item");
								}, 2000);

                            form.find("input[type=user_mail], input[type=user_password]").val("");
							$(document).get_user({});
							myApp.closeModal('.popup-login');
							

							document.addEventListener('deviceready', onDeviceReady, true);

                        } else {
							var msg = data.errors.join('<br>');
                            myApp.alert(data.msg, msg);
                        }
					}
				});
            }
        });
    }

	(function($){
		$.fn.RePass = function(settings){
			var btn = this;
			var LoginElementsClass = function(){};
			LoginElementsClass.prototype = {
				//open: true,
				run: function() {
					var opj=this;
					//myApp.showIndicator();
					opj.form.submit(function () {
						var valid = opj.form.valid();
						if(valid){
							var data = opj.form.serializeObject();
							myApp.showPreloader();
							$.ajax({
								type: 'post',
								url: site_url+"/re_pass.php",
								crossDomain: true,
								async: true,
								dataType: "json",
								data: data,
								success: function (data) {
									//console.log(data);
									myApp.hidePreloader();

									if(data.reset == true) {
										
										myApp.closeNotification(".notification-item");
										myApp.addNotification({
											title: 'تمت العملية',
											closeOnClick: true,
											message:'يمكنك الآن الدخول بكلمة المرور التى كتبتها للتو'
										});
										
										opj.form.find("[type=text]").val(""); 
										opj.form.find("[type=number]").val(""); 
										opj.form.find("[type=email]").val(""); 
										opj.form.find("[type=password]").val(""); 
										///location.hash = "#!/index.html";
										mainView.router.loadPage('index.html');
									} else  if(!data.errors) {
										
										myApp.closeNotification(".notification-item");
										myApp.addNotification({
											title: 'تمت العملية',
											closeOnClick: true,
											message:data.message
										});
										
										opj.form.find("[type=text]").val(""); 
										opj.form.find("[type=number]").val(""); 
										opj.form.find("[type=email]").val(""); 
									} else {
										var msg = data.errors.join('<br>');
										myApp.alert(data.msg, msg);
									}
								}
							});
						}
						return false;
					});
				}
			};
			
			LoginElements = new LoginElementsClass();
			LoginElements.settings=settings;
			LoginElements.form=btn;
			LoginElements.run();
			
		}
	})(jQuery);
	 