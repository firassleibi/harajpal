(function( $ ) {
    $.fn.index_ads = function(settings) {
			var ele=this;
			var defaults ={
				get_only : [ "title", "id" , "last_thumbnail" , "det" , "area_name" , "num_files" , "member_user_name" , "service_name" , "time_format", "last_thumbnail_id","time_since_time" ],
				//get_only : '',
				max:0, 
				NumPage:2
			};
			var values = $.extend({}, defaults, settings);
				
			$.fn.ads_list = function(settings){
					var this_map=this;
					// set up default options 
						var defaults = {
							get_only : [ "title", "id" , "last_thumbnail" , "det" , "area_name" , "num_files" , "member_user_name" , "service_name" , "time_format", "last_thumbnail_id","time_since_time" ],
							//get_only: "",
							page: 1,
							//query: settings.query,
							query: '',
							set_title: false,
							more: true,
							Indicator: true,
							//max: 0,
							refresh: true,
							end : function () {
								// Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
								myApp.detachInfiniteScroll($$('.infinite-scroll'));
								$$('.infinite-scroll-preloader').hide();
								return;
							},
							always : function (  ) {
							}
						};
						
					var options = $.extend({}, defaults, settings);
					
					if(options.Indicator){
						myApp.showIndicator();
					}
					
					//console.log(site_url+"/ads_loop.php"+options.query);
					$.getJSON( site_url+"/ads_loop.php"+options.query, { only: options.get_only ,page:options.page}, function( data ) {
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
							if(options.more == true){
								if(data.results.length > 0){ // عند وجود بيانات جديدة
									var HTML = myApp.templates.adsTemplate(data);
									this_map.append(HTML);
								}
							}else{
								var HTML = myApp.templates.adsTemplate(data);
								this_map.html(HTML);
							}
							//options.max_input.val(data.max);
							// console.log(values);
							values.max=data.max;
							// console.log(values);
						}
					}).always(function() {
								if(options.always){
									options.always();
								}
								if(options.Indicator){
										myApp.hideIndicator();
								}
							  });
					return this;
				}
			
			
				// عند عمل تحديث
				ele.on('refresh', function (e) {
					if(values.num == FunNum){
							var form = $(values.form); 
							var vrs = $(form).serialize();
							var query ='?search=1&'+vrs;
							// console.log(query);
							$.getJSON( site_url+"/ads_loop.php"+query, { only: values.get_only ,refresh:true,max:values.max}, function( data ) {
								//console.log(data);
								if(data.results.length > 0){ // عند وجود بيانات جديدة
									values.max=data.max;
									data.settings=site_settings;
									var HTML = myApp.templates.adsTemplate(data);
									$(HTML).prependTo(ele);
								}
							}).always(function() {
								
								setTimeout(function () {
										myApp.pullToRefreshDone();
								}, 500);
							});
					}
				});
				
				// عند النزولل للأسفل لجل آخر الإعلانات
				// Loading flag
				var loading = false;
				// Last loaded index
				// var lastIndex = $$('.list-ads li').length;
				// Attach 'infinite' event handler
				$$('.infinite-scroll').on('infinite', function () {
					if(values.num == FunNum){
					// Exit, if loading in progress
					if (loading) return;
					// Set loading flag
					loading = true;
					// Emulate 1s loading
					setTimeout(function () {
						
						var form = $(values.form);
						var vrs = $(form).serialize(); 
						var query ='?search=1&'+vrs;
							
						$(ele).ads_list(
								{
									query : query,
									Indicator : false,
									page : values.NumPage,
									always : function (  ) {
										// Reset loading flag
										loading = false;
									}
								});
								
						values.NumPage++;
						
					}, 1000);
					}
				});
				
			// آخر الإعلانات 
				var form = $(values.form);
					$(ele).empty();
					$(ele).ads_list({
						//query:query,
						// max_input:form.find('[name="max"]')
						// always : function (  ) {
							// }
					});
			
			// جلب إعلانات التصنيفات الرئيسية
			$('body').on('click', ".open-brand-swiper", function() {
					if(values.num == FunNum){
				myApp.attachInfiniteScroll($$('.infinite-scroll'));
				$$('.infinite-scroll-preloader').show();
					values.NumPage =2;
				$(this).closest('.wrapper-block').find('.swiper-slide').removeClass('active');
				$(this).addClass('active');
				
				//var form = $(this).closest('form');
				var form = $(values.form);
					form.find('[name="cat"]').prop('checked', false);
					$(this).find('[name="cat"]').prop('checked', true);
				var vrs = $(form).serialize(); 
				
				var id=$(this).data('id');
					var query ='?search=1&'+vrs;
					$(ele).empty();
					$(ele).ads_list({
						query:query,
						// max_input:form.find('[name="max"]')
					});
					
					}
				return false;
			});
			
			// جلب الإعلانات عند اختيار قسم فرعى
			$('body').on('click', ".set-brand", function() {
					if(values.num == FunNum){
				myApp.attachInfiniteScroll($$('.infinite-scroll'));
				$$('.infinite-scroll-preloader').show();
					values.NumPage =2	;
				$(this).closest('.wrapper-block').find('.swiper-slide').removeClass('active');
				$(this).addClass('active');
				
				// var form = $(this).closest('form');
				var form = $(values.form);
					form.find('[name="brand"]').prop('checked', false);
					$(this).find('[name="brand"]').prop('checked', true);
				var vrs = $(form).serialize(); 
				
				var id=$(this).data('id');
					var query ='?search=1&'+vrs;
					$(ele).empty();
					$(ele).ads_list({
						query:query,
						// max_input:form.find('[name="max"]')
					});
					}
				return false;
			});
			
			// جلب الإعلانات عند اختيار نوع الاعلان
			$('body').on('click', ".open-type", function() {
				if(values.num == FunNum){
				myApp.attachInfiniteScroll($$('.infinite-scroll'));
				$$('.infinite-scroll-preloader').show();
				values.NumPage =2	;
				$(this).closest('.wrapper-block').find('.swiper-slide').removeClass('active');
				$(this).addClass('active');
				
				// var form = $(this).closest('form');
				var form = $(values.form);
					form.find('[name="type"]').prop('checked', false);
					$(this).find('[name="type"]').prop('checked', true);
				var vrs = $(form).serialize();
				
				var type = $(this).find('[name="type"]').val();
				if( type == 'city'){
					$('.city-btn').show();
				}else{
					$('.city-btn').hide();
				}
				
				var id=$(this).data('id');
					var query ='?search=1&'+vrs;
					$(ele).empty();
					$(ele).ads_list({
						key:'open-type',
						query:query,
						// max_input:form.find('[name="max"]')
					});
					}
				return false;
			});
			
        return this;
 
    };
 
}( jQuery ));