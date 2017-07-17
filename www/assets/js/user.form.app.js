	(function($){
		$.fn.UserForm = function(settings){
			
			var btn = this;
			
			var AdElementsClass = function(){};
			AdElementsClass.prototype = {
				//open: true,
				run: function() {
					
					opj=this;
					
					
					myApp.showIndicator();
					
					opj.form.find('.country').empty();
					
					opj.get_elements({type:'countrys',value: 'code'});
					
					if(opj.settings.type == 'add' ){
						opj.add_user();
					}else if(opj.settings.type == 'edit' ){
						var ff= opj.get_user();
						opj.edit_user();
					}
					
				}, 
				get_user: function() {
					opj=this;

					opj.form.find('[name=edit_pass]').change(function() {
						var vl=$(this).val();
						if(vl == 1){
							opj.form.find('.wr-pass').show();
						}else{
							opj.form.find('.wr-pass').hide();
						}
					}).change();

					myApp.showIndicator();
					$.ajax({
						type: 'get',
						url: site_url+"/user.php",
						dataType: "json",
						success: function (data) {
								myApp.hideIndicator();
							if(data){
								opj.form.find('[name=user_mail]').val(data.results.user_mail);
								opj.form.find('[name=user_name]').val(data.results.user_name);
								setTimeout(
									  function() 
									  {
										opj.form.find('[name=user_country] option[value='+data.results.user_country+']' ).attr('selected','selected');
									  }, 2000);
								opj.form.find('[name=in_cont]').val(data.results.in_cont);
								opj.form.find('[name=mobile]').val(data.results.mobile);
							}
						}
					});
				},
				//تعديل بيانات العضو
				edit_user: function() {
					
					opj=this;
					
						opj.form.submit(function () {
							myApp.showIndicator();
							$.ajax({
								dataType: "json",
								url     : site_url+"/members.php?edit_phi_members=1",
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
													title: 'تمت العملية',
													message: ' تم تعديل بياناتك ',
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
				// إضافة إعلان جديد
				add_user: function() {
					
					opj=this;
					
						opj.form.submit(function () {
							myApp.showIndicator();
							$.ajax({
								dataType: "json",
								url     : site_url+"/members.php",
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
												/*myApp.addNotification({
													title: 'تم تسجيل عضويتك بنجاح',
													message: 'لقد تم إرسال رسالة التفعيل إلى جوالك',
													media: '<i class="fa fa-check-circle"></i>'
												});*/
												
												$(document).get_user({});
												
												mainView.router.loadPage('index.html');
												//myApp.popup('.popup-activation');
												document.addEventListener('deviceready', onDeviceReady, true);
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
					if(options.type == 'countrys'){
						
						opj.form.find('.country').append($('<option>', {
							value: 0,
							text : 'إختر'
						}));
						// جلب البلد
						opj.set_options(
						{
							url:site_url+"/get.php?action=countrys",
							index: opj.form.find(".country"),
							options:options,
							change: function ( index ) {
								// عند أختيار البلد
								
							}
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
	 
	