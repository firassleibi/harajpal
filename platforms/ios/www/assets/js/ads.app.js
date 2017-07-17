
// بنرات إعلانية
	(function($){
		$.fn.get_banners = function(settings){
			var this_map=this;
			// set up default options 
				var defaults = { 
					query: "",
					Indicator: true,
				}; 
	
			var options = $.extend({}, defaults, settings);
			
			if(options.Indicator){
					myApp.showIndicator();
			}
			
			$.getJSON( site_url+"/banners.php"+options.query, { only: options.get_only }, function( data ) {
				if(data){
					data.settings=site_settings;
					var HTML = myApp.templates.bannersTemplate(data);
					this_map.find('.list-banners').html(HTML);
				}
			}).always(function() {
						if(options.Indicator){
								myApp.hideIndicator();
						}
					  });
		}
	})(jQuery);
	
// جلب المتاجر
	(function($){
		$.fn.get_shops = function(settings){
			var this_map=this;
			// set up default options 
				var defaults = { 
					page: 1,
					//get_only: "",
					search_query: "",
					more: false,
					Indicator: true,
				}; 
	
			var options = $.extend({}, defaults, settings);
			
			if(options.Indicator){
					myApp.showIndicator();
			}
			
			//console.log(site_url+"/ads_loop.php"+options.search_query);
			$.getJSON( site_url+"/shops.php"+options.search_query, { only: options.get_only ,page:options.page}, function( data ) {
				if(data){
					
					if(data.next_page < 1){
						// عند عدم وجود نتائج أخرى
						if(options.end){
							options.end();
						}
					}
					data.settings=site_settings;
					if(options.more == true){
						if(data.results.length > 0){ // عند وجود بيانات جديدة
							var HTML = myApp.templates.shopsTemplate(data);
							this_map.find('.list-users').append(HTML);
						}
					}else{
						var HTML = myApp.templates.shopsTemplate(data);
						this_map.find('.list-users').html(HTML);
					}
				}
			}).always(function() {
						if(options.always){
							options.always();
						}
						if(options.Indicator){
								myApp.hideIndicator();
						}
					  });
			
		}
	})(jQuery);
	
// جلب الأعلانات 
	(function($){
		
		$.fn.get_ads = function(settings){
			var this_map=this;
			
			// set up default options 
				var defaults = { 
					page: 1,
					get_only: "",
					search_query: "",
					set_title: true,
					more: false,
					Indicator: true,
					max: 0,
					refresh: false,
				}; 
	
			var options = $.extend({}, defaults, settings);
			
			if(options.Indicator){
				myApp.showIndicator();
			}
			
			//console.log(site_url+"/ads_loop.php"+options.search_query);
			$.getJSON( site_url+"/ads_loop.php"+options.search_query, { only: options.get_only ,page:options.page}, function( data ) {
				if(data){
					if(data.this_title){
						if(options.set_title == true){
							$('.sliding').html(data.this_title);
						}
					}
					
					if(data.next_page < 1){
						// عند عدم وجود نتائج أخرى
						if(options.end){
							options.end();
						}
					}
					data.settings=site_settings;
					//console.log(data);
					/*if(options.refresh == true){
						if(data.results.length > 0){ // عند وجود إعلانات جديدة
							var HTML = myApp.templates.adsTemplate(data);
							this_map.append(HTML);
						}
					}else */if(options.more == true){
						if(data.results.length > 0){ // عند وجود بيانات جديدة
							var HTML = myApp.templates.adsTemplate(data);
							this_map.append(HTML);
						}
					}else{
						var HTML = myApp.templates.adsTemplate(data);
						this_map.html(HTML);
					}
					options.max=data.max;
					if(options.refresh == true){
						// عند عمل تحديث
						// Pull to refresh content
						var ptrContent = this_map.closest('.pull-to-refresh-content'); 
						// Add 'refresh' listener on it
						ptrContent.on('refresh', function (e) {
							//console.log(options.max);
							$.getJSON( site_url+"/ads_loop.php"+options.search_query, { only: options.get_only ,refresh:true,max:options.max}, function( data ) {
								//console.log(data);
								if(data.results.length > 0){ // عند وجود بيانات جديدة
									options.max=data.max;
									data.settings=site_settings;
									var HTML = myApp.templates.adsTemplate(data);
									$(HTML).prependTo(this_map);
								}
							}).always(function() {
								setTimeout(function () {
										myApp.pullToRefreshDone();
								}, 500);
							});
						});
						
					}
				}
			}).always(function() {
						if(options.always){
							options.always();
						}
						if(options.Indicator){
								myApp.hideIndicator();
						}
					  });
			
		}
	})(jQuery);
	
// إضافة الإعلان للمفضلة
	(function($){
		$.fn.Favorit = function(){
			// إضافة إعلان للمفضلة
			$$('body').on('click', '.Ad2Favorit', function () {
							myApp.showIndicator();
				var MapAd2Favorit = $(this).parent().children(".Ad2Favorit");
				var MapDl2Favorit = $(this).parent().children(".Dl2Favorit");
				var id = $(this).data("id");
				var string = 'id='+ id ;
				$.ajax({
					dataType: "json",
					type: "POST",
					url: site_url+"/data.php?add_favorit=1",
					data: string,
					cache: false,
					success: function(json){
							//myApp.closeNotification('.NotificationFavorit');
						if(json.add == true){
							$(MapAd2Favorit).hide();
							$(MapDl2Favorit).show(); 
							myApp.closeNotification(".notification-item");
							myApp.addNotification({
								title: 'تم بنجاح',
								message: ' تم إضافة الإعلان إلى المُفضلة يمكنك الآن الرجوع إلى الإعلان فى وقت لاحق ',
								media: '<i class="fa fa-check-circle"></i>',
								//additionalClass: 'NotificationFavorit'
							});
								setTimeout(function () {
									myApp.closeNotification(".notification-item");
								}, 2000);
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
					}
				}).always(function() {
							myApp.hideIndicator();
							  });
				return false;
			});
			// حذف إعلان من المفضلة
			$$('body').on('click', '.Dl2Favorit', function () {
							myApp.showIndicator();
				var MapAd2Favorit = $(this).parent().children(".Ad2Favorit");
				var MapDl2Favorit = $(this).parent().children(".Dl2Favorit");
				var id = $(this).data("id");
				var string = 'id='+ id ;
				$.ajax({
					dataType: "json",
					type: "POST",
					url: site_url+"/data.php?del_favorit=1",
					data: string,
					cache: false,
					success: function(json){
						if(json.delete == true){
							$(MapDl2Favorit).hide(); 
							$(MapAd2Favorit).show();
							myApp.closeNotification(".notification-item");
							myApp.addNotification({
								title: 'تم ',
								message: 'تم إزالة الإعلان من المُفضلة',
								media: '<i class="fa fa-check-circle"></i>'
							});
								setTimeout(function () {
									myApp.closeNotification(".notification-item");
								}, 2000);
						}else{
							var msg = json.errors.join('<br>');
							myApp.closeNotification(".notification-item");
							myApp.addNotification({
								title: 'هناك خطاء ',
								message: msg,
								media: '<i class="fa fa-exclamation-circle"></i>'
							});
						}
					}
				}).always(function() {
							myApp.hideIndicator();
							  });
				return false;
			});
			
		}
	})(jQuery);
// تقييم الإعلانات
	(function($){
		$.fn.vote = function(){
			// تقييم إعلان كـ " أعجبنى"
			$$('body').on('click',  "[data-vote-ads='up']" , function () {
				myApp.showIndicator();
				var id = $(this).data('id-ads');
				var LoadMap = $(this).find(".vote-number");
				var down = $( "[data-vote-ads='down'][data-id-ads='"+id+"']" ).find(".vote-number");

				var string = 'id='+ id ;

				$.ajax({
					dataType: "json",
					type: "POST",
					url: site_url+"/data.php?action=up&vote_ad=1",
					data: string,
					cache: false,
					success: function(json){
							
						if(json.errors){
							var msg = json.errors.join('<br>');
							myApp.closeNotification(".notification-item");
							myApp.addNotification({
								title: 'هناك خطاء ',
								message: msg,
								media: '<i class="fa fa-exclamation-circle"></i>'
							});
						}else{
							LoadMap.html(json.votes_up);
							down.html(json.votes_down);
						}
					}
				}).always(function() {
							myApp.hideIndicator();
							  });
							   
				return false;
			});
			// تقييم أعلان " لم يعجبنى "
			$$('body').on('click',  "[data-vote-ads='down']" , function () {
							myApp.showIndicator();
				var id = $(this).data('id-ads');
				var LoadMap = $(this).find(".vote-number");
				var up = $( "[data-vote-ads='up'][data-id-ads='"+id+"']" ).find(".vote-number");

				var string = 'id='+ id ;

				$.ajax({
					dataType: "json",
					type: "POST",
					url: site_url+"/data.php?action=down&vote_ad=1",
					data: string,
					cache: false,
					success: function(json){
						
						if(json.errors){
							var msg = json.errors.join('<br>');
							myApp.closeNotification(".notification-item");
							myApp.addNotification({
								title: 'هناك خطاء ',
								message: msg,
								media: '<i class="fa fa-exclamation-circle"></i>'
							});
						}else{
							
							LoadMap.html(json.votes_down);
							up.html(json.votes_up);
							
						}
						
					}
				}).always(function() {
							myApp.hideIndicator();
							  });
							  
				return false;
			});
		}
	})(jQuery);
// إرسال تبليغ
	(function($){
		$.fn.report = function(settings){
				$$('body').on('click', ".report" , function () {
				
					var clickedLink = this;
						myApp.showIndicator();
					$.ajax({
						dataType: "json",
						type: "get",
						url: site_url+"/get.php",
						data: {
							action:'ReportsList'
						}
						,
						cache: false,
						success: function(json){
							json.id=settings.id;
							var popoverHTML = myApp.templates.ReportPopoverTemplate(json);
							myApp.popover(popoverHTML, clickedLink);
							
						}
					}).always(function() {
								myApp.hideIndicator();
					});
					return false;
				});
					
		if(FnLoad['report'] != true){
				$$('body').on('click', "[data-report=true]" , function () {

						myApp.showIndicator();
					var id = $(this).data('id');
					var type = $(this).data('type');
					var reason = $(this).data('report-reason');
					
						$('#loading_page').show();
						var Mapthis = $(this);
						var string = 'id='+ id +"&type="+type+"&reason="+reason;
						$.ajax({
							dataType: "json",
							type: "POST",
							url: site_url+"/data.php?Report=1",
							data: string,
							cache: false,
							success: function(json){
								
								myApp.closeNotification('.NotificationReport');
								if(json.errors){
									var msg = json.errors.join('<br>');
							myApp.closeNotification(".notification-item");
									myApp.addNotification({
										title: 'هناك خطاء ',
										additionalClass: 'NotificationReport',
										message: msg,
										media: '<i class="fa fa-exclamation-circle"></i>'
									});
								}else{
							myApp.closeNotification(".notification-item");
									myApp.addNotification({
										title: 'شكراً لك',
										additionalClass: 'NotificationReport',
										message: ' لقد تم إرسال البلاغ بنجاح وسيقوم أحد مشرفينا بمراجعته ',
										media: '<i class="fa fa-check-circle"></i>'
									});
								setTimeout(function () {
									myApp.closeNotification(".notification-item");
								}, 2000);
								}
								myApp.closeModal('.popover-report');
							}
						}).always(function() {
									myApp.hideIndicator();
						});
					
					return false;
				});
				FnLoad['report'] = true;
		}
				
		}
	})(jQuery);
	
	// مشاركة الإعلان
	
	(function($){
		$.fn.sharecontent = function(){
			// إضافة إعلان للمفضلة
			$$('body').on('click', '.share', function () {
				
				//var link = encodeURIComponent($(this).data( "link" ));
				var link = $(this).data( "link" );
				var title = $(this).data( "title" );
				
				window.plugins.socialsharing.share(title, null, null, link);
				
				return false;
			});
			
		}
	})(jQuery);
	
// جلب الإعلان
	(function($){
		$.fn.show_ads = function(settings){
			var this_map=this;
			// set up default options 
				var defaults = {
					search_query: ""
				}; 
	
			var options = $.extend({}, defaults, settings);
					myApp.showIndicator();
			//console.log(site_url+"/ads_show.php"+options.search_query);
			$.getJSON( site_url+"/ads_show.php"+options.search_query, { }, function( data ) {
				if(data){


                    $.ajax({
                        type: 'get',
                        url: site_url+"/user.php",
                        dataType: "json",
                        success: function (j) {
                            if(j){
                                data.settings=site_settings;
                                data.user=j;

                                if(data.results.activ == 3){
                                    myApp.alert('لقد أنتهى هذا الإعلان', 'تنبيه');
                                }else if(data.results.activ == 2){
                                    myApp.alert('هذا الإعلان مرفوض ولن يتم عرضة فى الموقع', 'تنبيه');
                                }else if(data.results.activ == 0){
                                    myApp.alert('هذا الإعلان ينتظر التفعيل ', 'تنبيه');
                                }

                                var HTML = myApp.templates.ShowAdsTemplate(data);
                                this_map.html(HTML);
                                if(options.toolbar){
                                    data.settings=site_settings;
                                    //console.log(data);
                                    var HTML = myApp.templates.ShowAdsToolbarTemplate(data);
                                    options.toolbar.html(HTML);

                                }

                                $(this_map).get_banners({
                                    query:'?group=4'

                                });

                            }
                        }
                    });

                }
			}).always(function() {
					myApp.hideIndicator();
					  });
		}
	})(jQuery);
	
// جلب بيانات الإتصال
	(function($){
		$.fn.get_contact = function(settings){
			var this_map=this;
			
				myApp.showIndicator();
			$.getJSON( site_url+"/get.php?action=contact_us_content", function( data ) {
				if(data){
					var HTML = myApp.templates.contact_usTemplate(data);
					this_map.html(HTML);
					
				}
			}).always(function() {
				myApp.hideIndicator();
					  });
		}
	})(jQuery);
	
// جلب بيانات الإتصال
	(function($){
		$.fn.get_contact = function(settings){
			var this_map=this;
			
				myApp.showIndicator();
			$.getJSON( site_url+"/get.php?action=contact_us_content", function( data ) {
				if(data){
					var HTML = myApp.templates.contact_usTemplate(data);
					this_map.html(HTML);
					
				}
			}).always(function() {
				myApp.hideIndicator();
					  });
		}
	})(jQuery);
// جلب صفحة
	(function($){
		$.fn.show_page = function(settings){
			var this_map=this;
			// set up default options 
				var defaults = {
					search_query: ""
				}; 
	
			var options = $.extend({}, defaults, settings);
					myApp.showIndicator();
			//console.log(site_url+"/ads_show.php"+options.search_query);
			$.getJSON( site_url+"/pages_show.php"+options.search_query, { }, function( data ) {
				if(data){
					data.settings=site_settings;
					var HTML = myApp.templates.ShowPageTemplate(data);
					this_map.html(HTML);
				}
			}).always(function() {
					myApp.hideIndicator();

					  });
		}
	})(jQuery);
	
// سلايد الأقسام
	(function($){
		$.fn.swiper_categories = function(settings){
			var this_map=this;
				$('.city-btn').hide();
				$('.Sub-Sections').hide();
				$('.Sub-Sections-container').hide();
			$.getJSON( site_url+"/get.php?action=swiper_categories", function( json ) {
				if(json){
					$(this_map).find('.swiper-wrapper').append('<div class="swiper-slide open-brand-swiper active" data-id=""><input type="radio" name="cat" value=""> الكل </div>');
					// وضع عنصر السلايدر أولاً 
					$.each(json, function(i, item) {
						$(this_map).find('.swiper-wrapper').append('<div class="swiper-slide open-brand-swiper" data-id="'+item.id+'"> 	<input type="radio" name="cat" value="'+item.id+'">'+item.name+'	</div>');
						//$(this_map).find('.swiper-wrapper').append(' <label class="label-switch"><input type="checkbox" name="test'+item.id+'">'+item.name+'</label>');
					});
					// صناعة السلايدر 
					var swiper = new Swiper(this_map, {
						    mode:'horizontal',
						slidesPerView: 3,
						paginationClickable: true,
						spaceBetween: 5,
						pagination: false
					});
				}
			}).always(function() {
						$(this_map).find('.preloader').remove();
					  });
		}

		// جلب التصنيفات الفرعية عند طلباها
		$('body').on('click', ".open-brand-swiper", function() {
			var id=$(this).data('id');
			$('.Sub-Sections-container').find('.swiper-slide').remove();
			
			$.getJSON( site_url+"/get.php?action=swiper_brand&val="+id, function( json ) {
				if(json.length > 0){
					$('.Sub-Sections').show();
					$('.Sub-Sections-container').show();
						$('.Sub-Sections-container').find('.swiper-wrapper').append('<div class="swiper-slide  set-brand  active" data-id=""><input type="radio" name="brand" value="">الكل</div>');
					// وضع عنصر السلايدر أولاً 
					$.each(json, function(i, item) {
						$('.Sub-Sections-container').find('.swiper-wrapper').append('<div class="swiper-slide set-brand" data-id="'+item.id+'"><input type="radio" name="brand" value="'+item.id+'">'+item.name+'</div>');
					});
					// صناعة السلايدر 
					var swiper = new Swiper('.Sub-Sections-container', {
						slidesPerView: 3,
						paginationClickable: true,
						spaceBetween: 5,
						pagination: false
					});
				}else{
					$('.Sub-Sections').hide();
					$('.Sub-Sections-container').hide();
				}
			}).always(function() {
						$('.Sub-Sections-container').find('.preloader').remove();
					  });
			return false;
		});
	})(jQuery);
// جلب الأقسام
	(function($){
		$.fn.get_categories = function(settings){
			var this_map=this;
			
				myApp.showIndicator();
			$.getJSON( site_url+"/get.php?action=categories", function( data ) {
				if(data){
					data.settings=site_settings;
					var HTML = myApp.templates.CategoriesTemplate(data);
					this_map.html(HTML);
				}
			}).always(function() {
				myApp.hideIndicator();
					  });
		}
		$.fn.get_categories_list = function(settings){
			var this_map=this;
				myApp.showIndicator();
			$.getJSON( site_url+"/get.php?action=categories", function( data ) {
				if(data){
					var HTML = myApp.templates.CategoriesListTemplate(data);
					this_map.html(HTML);
				}
			}).always(function() {

				myApp.hideIndicator();
					  });
		}
	})(jQuery);
// جلب الماركات
	(function($){
		$.fn.get_brands = function(settings){
			var this_map=this;
			
				myApp.showIndicator();
			$.getJSON( site_url+"/get.php?action=brands", function( data ) {
				if(data){
					var obj={
						'results':data,
						'settings':site_settings
					};
					var HTML = myApp.templates.BrandsTemplate(obj);
					this_map.html(HTML);
					
				}
			}).always(function() {
				myApp.hideIndicator();
					  });
		}
	})(jQuery);
	
// جلب بيانات التحويل 
	(function($){
		$.fn.get_money_transfer = function(settings){
			var this_map=this;
			myApp.showIndicator();
			$.getJSON( site_url+"/money_transfer.php", function( data ) {
				if(data){
					data.settings=site_settings;
					var HTML = myApp.templates.MoneyTransferTemplate(data); 
					this_map.html(HTML);
				}
			}).always(function() {
						myApp.hideIndicator();
					  });
			
		}
	})(jQuery);
	
// جلب الصفحات
	(function($){
		$.fn.get_pages = function(settings){
			var this_map=this;
			
				myApp.showIndicator();
			$.getJSON( site_url+"/get.php?action=pages", function( data ) {
				if(data){
					
					var HTML = myApp.templates.pagesTemplate(data);
					this_map.html(HTML);
					
				}
			}).always(function() {
				myApp.hideIndicator();
					  });
		}
	})(jQuery);
// وضع الإعدادات
	(function($){
		$.fn.set_setting = function(settings){
			var this_map=this;
			// set up default options 
				var defaults = {
				}; 
	
			var options = $.extend({}, defaults, settings);
			
			$('.site-logo').attr("src", site_settings.site_url+'/upload/'+site_settings.logo_apps);
			$('.site-name').html(site_settings.title);
			
		}
	})(jQuery);
	 
	(function($){
		$.fn.bidding = function(){
			// إرسال مزايدة
			$$('body').on('click',  '.send-bidding' , function () {
				var amount =$(this).parents('.bidding-box').find('.amount').val();
				var id = $(this).parents('.bidding-box').data('id-ads');
				
				myApp.showIndicator();

				var string = 'ads='+ id +'&amount='+ amount ;

				$.ajax({
					dataType: "json",
					type: "POST",
					url: site_url+"/auctions_members_ajax.php",
					data: string,
					cache: false,
					success: function(json){
						if(json.errors){
							var msg = json.errors.join('<br>');
							myApp.closeNotification(".notification-item");
							myApp.addNotification({
								title: 'هناك خطاء ',
								message: msg,
								media: '<i class="fa fa-exclamation-circle"></i>'
							});
						}else{
							mainView.router.refreshPage();
							myApp.closeNotification(".notification-item");
							myApp.addNotification({
								title: 'شكراً لك',
								additionalClass: 'NotificationReport',
								message: 'تم إرسال المزايدة بنجاح',
								media: '<i class="fa fa-check-circle"></i>'
							});
								setTimeout(function () {
									myApp.closeNotification(".notification-item");
								}, 2000);
						}
					}
				}).always(function() {
							myApp.hideIndicator();
							  });
				
				return false;
			});
		}
	})(jQuery); 