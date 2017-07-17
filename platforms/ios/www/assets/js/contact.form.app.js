	(function($){
		$.fn.ContactForm = function(settings){
			
			var btn = this;
			
			var AdElementsClass = function(){};
			AdElementsClass.prototype = {
				//open: true,
				run: function() {
					
					opj=this;
					
					
					myApp.showIndicator();
					
					opj.form.find('.purpose').empty(); 
					opj.get_elements({type:'purpose',value: 'i',text: 'm'});
					
					opj.form.find('.important').empty(); 
					opj.get_elements({type:'important',value: 'i',text: 'm'});
					
					if(opj.settings.type == 'send' ){
						opj.send();
					}
				},
				// إضافة إعلان جديد
				send: function() {
					
					opj=this;
					
						opj.form.submit(function () {
							myApp.showIndicator();
							$.ajax({
								dataType: "json",
								url     : site_url+"/contact_us.php",
								type    : $(this).attr('method'),
								data    : $(this).serialize(),
								success : function( response ) {
											if(response.errors){
												
												var msg = response.errors.join('<br>');
							myApp.closeNotification(".notification-item");
												myApp.addNotification({
													title: 'خطاء',
													message: msg,
													closeOnClick: true,
													media: '<i class="fa fa-exclamation-circle"></i>'
												});
												
											}else{ 
												myApp.closeNotification(".notification-item");
												myApp.addNotification({
													title: 'شكراً لك',
													message: 'تم إرسال الرسالة بنجاح ',
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
						
				},
				//	جلب العناصر
				get_elements: function(settings) {
					
					opj=this; 
					var defaults = {
						value: 'id',
						text: 'name',
					};
					var options = $.extend({}, defaults, settings);
					if(options.type == 'purpose'){
						opj.form.find('.purpose').append($('<option>', {
							value: 0,
							text : 'إختر'
						}));
						// جلب البلد
						opj.set_options(
						{
							url:site_url+"/get.php?action=contact-purpose",
							index: opj.form.find(".purpose"),
							options:options,
							//change: function ( index ) {
							//}
						});
					}else if(options.type == 'important'){
						opj.form.find('.important').append($('<option>', {
							value: 0,
							text : 'إختر'
						}));
						// جلب البلد
						opj.set_options(
						{
							url:site_url+"/get.php?action=contact-important",
							index: opj.form.find(".important"),
							options:options,
							//change: function ( index ) {
							//}
						});
					}
				},
				set_options: function(settings , callback) {
					
					myApp.showIndicator();
					$.getJSON( settings.url, function( data ) {
						myApp.hideIndicator();
						if(data){
							$.each(data, function (i, item) {
								
								$(settings.index).append($('<option>', {
									value: item[settings.options.value],
									text : item[settings.options.text]
								}));
								
							});
						}
					}).always(function() {
						
						if(settings.change){
							settings.change(settings.index);
						}
					
						myApp.hideIndicator();
					  });
					  
				}
			};
			
			AdElements = new AdElementsClass();
			AdElements.settings=settings;
			AdElements.form=btn;
			AdElements.run();
			
		}
	})(jQuery);
	 
	