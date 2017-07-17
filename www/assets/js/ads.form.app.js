
	
	(function($){
		$.fn.HomeForm = function(settings){
			var btn = this;
			
			var HomeFormClass = function(){};
			HomeFormClass.prototype = {
				//open: true,
				run: function() {
					Aopj=this;
					
						Aopj.get_form_options({
							
							callback: function (  ) {

								myApp.showIndicator();
								
								Aopj.form.find('.country').empty();
								Aopj.form.find( ".area" ).empty();
								Aopj.get_elements({type:'countrys',value: 'code'});
								
								var calendarRange = myApp.calendar({
									input: Aopj.form.find('.calendar-auction'),
									dateFormat: 'dd/mm/yyyy',
								});
								
								Aopj.search();
							}
							
						});
					
				},
				// البحث عن إعلان 
				search: function() {
					Aopj=this;
						Aopj.form.submit(function () { 
								myApp.showIndicator();
								$.ajax({
									dataType: "json",
									url     : site_url+"/members.city.php?edit_phi_members=1",
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
														message: ' تم تعديل تعديل مدينتك ',
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
					
					/*
						Aopj.form.submit(function () {
							myApp.showIndicator();
								var query ='?visitor=1&'+$(this).serialize();
								$('.home-ads .list-block ul').get_ads(
										{
											get_only : [ "title", "id" , "last_thumbnail" , "det" , "area_name" , "num_files" , "member_user_name" , "service_name" , "time_format", "last_thumbnail_id","time_since_time" ],
											search_query : query,
											always : function () {
											}
										});
							return false;
						});
							var query ='?visitor=1';
						$('.home-ads .list-block ul').get_ads(
								{
									get_only : [ "title", "id" , "last_thumbnail" , "det" , "area_name" , "num_files" , "member_user_name" , "service_name" , "time_format", "last_thumbnail_id","time_since_time" ],
									search_query : query,
									always : function (  ) {
									}
								});
					*/
				},
				//	جلب العناصر
				get_elements: function(settings) {
					
					Aopj=this; 
					var defaults = {
						value: 'id',
						text: 'name',
					};
					var options = $.extend({}, defaults, settings);
					
					if(options.type == 'countrys'){
						
						Aopj.form.find('.country').append($('<option>', {
							value: 0,
							text : 'إختر'
						}));
						// جلب البلد
						Aopj.set_options(
						{
							url:site_url+"/get.php?action=countrys",
							index: Aopj.form.find(".country"),
							options:options,
							change: function ( index ) {
								// عند أختيار البلد
								$(index).change(function() {
									var vl = $(this).val();
										
										Aopj.form.find( ".area" ).empty();
										options.value='id';
										Aopj.set_options(
										{
											url:site_url+"/get.php?action=areas&val="+vl,
											index: Aopj.form.find(".area"),
											options:options
										}
										);
								});
							}
						}
						);
						
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
					  
				},
				get_form_options: function(settings) {

					Aopj=this;
						myApp.showIndicator();
					$.getJSON( site_url+"/get.php?action=form_options", function( data ) {
						Aopj.form_options=data;

					}).always(function() {
						myApp.hideIndicator();
						if(settings.callback){
							settings.callback();
						}
					  });
					  
				}
			};
			
			HomeForm = new HomeFormClass();
			HomeForm.settings=settings;
			HomeForm.form=btn;
			HomeForm.run();
		}
	})(jQuery);
	
	(function($){
		// عمل فيديو
		$.fn.get_video = function(){
		
			var btn = this;
			
			var VdClass = function(){};
			VdClass.prototype = {
				//last_id: 0,
				run: function() {
					Vopj=this;
					
					Vopj.button.on('click', function () {
						Vopj.videoCapture();
					});
					
					
				},
				videoCapture: function() {
				   var options = {
					  limit: 1,
					  duration: 10
				   };
				   navigator.device.capture.captureVideo(onSuccess, onError, options);
				   function onSuccess(mediaFiles) {
					  var i, path, len, type;
						
					  for (i = 0, len = mediaFiles.length; i < len; i += 1) {
						 path = mediaFiles[i].fullPath;
						 type = mediaFiles[i].type;
						 //console.log(mediaFiles);
					  }
					//window.plugins.streamingMedia.playVideo(path);
					//alert(path);
					
						$('.video_exists').show(); 
						$('.video_url').val(path); 
						$('.video_type').val(type); 
					  /*
						var v = "<video controls='controls'>";
						v += "<source src='" + path + "' type='video/mp4'>";
						v += "</video>";
						document.querySelector("#videoArea").innerHTML = v;
						*/
					
				   }
				   function onError(error) {
						navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
				   }
				}
			};
			
			GVD = new VdClass();
			GVD.button=btn;
			GVD.run();
			
		}
	})(jQuery);
	
	(function($){
		// رفع ملف
		$.fn.uploadimages = function(){
		
			var btn = this;
			
			var UpClass = function(){};
			UpClass.prototype = {
				//last_id: 0,
				run: function() {
					opj=this;
					$('.preloader-files').hide();
					var pictureSource;   // picture source
					var destinationType; // sets the format of returned value

					// Wait for device API libraries to load
					//
					document.addEventListener("deviceready",opj.onDeviceReady,false);

					
					opj.browser();
					
				},onDeviceReady: function() {
					// device APIs are available 
					pictureSource=navigator.camera.PictureSourceType;
					destinationType=navigator.camera.DestinationType;
				},
				browser: function() {
					opj=this;
					
					opj.button.on('click', function () {
			
						//http://docs.phonegap.com/en/edge/cordova_camera_camera.md.html
						
						source=pictureSource.SAVEDPHOTOALBUM;
						//source=pictureSource.PHOTOLIBRARY;
						
						opj.getPhoto({
									quality: 50,
									destinationType: destinationType.FILE_URI,
									sourceType: source,
									//allowEdit : true,	// عند إستخدامها سيكون رابط الصورة واحد ولن يتم تغييرها اذا ما تم استخدام عملية الرفع اكثر من مرة 
									encodingType: Camera.EncodingType.JPEG,
									saveToPhotoAlbum: false,
									targetWidth: 600,
									targetHeight: 400,
								});
						
					});
				},
				getPhoto: function(cameraOptions) {
					// Retrieve image file location from specified source
					navigator.camera.getPicture(opj.onPhotoURISuccess, opj.onFail, cameraOptions);
				},
				onFail: function(message) {
					// Called if something bad happens.
					//alert('Failed because: ' + message);
				},
				onPhotoURISuccess: function(imageURI) {
	
					$('.preloader-files').show();
					// Called when a photo is successfully retrieved
					// Uncomment to view the image file URI
					// console.log(imageURI);

					var win = function (r) {
						/*
						var onSetMetadataWin = function() {
							//console.log("success setting metadata") 
						} 
						var onSetMetadataFail = function() { 
							//console.log("error setting metadata") 
						} 
						r.setMetadata(onSetMetadataWin, onSetMetadataFail, {"com.apple.MobileBackup": 1});
						*/
						//myApp.hideIndicator();
						$('.preloader-files').hide();
						//console.log("Code = " + r.responseCode);
						//console.log("Response = " + r.response);
						//console.log("Sent = " + r.bytesSent);
						 
						var json = jQuery.parseJSON( r.response );
						
						if(json.errors){
							var msg = json.errors.join('<br>');
								myApp.closeNotification(".notification-item");
								myApp.addNotification({
									title: 'خطاء',
									message: msg,
									closeOnClick: true,
									media: '<i class="fa fa-exclamation-circle"></i>'
								});
						}else{
							var ImgThumbnailUrl=site_settings.site_url+'/upload/thumbnail/'+json.results.file;
							var ImgUrl=site_settings.site_url+'/upload/'+json.results.file;
							//alert(ImgThumbnailUrl);
							
							var HtmlCode= '<div class="item-content">'+
							'	<div class="item-inner">'+
							'		<div class="name">'+
							'			<label class="label-switch">'+
							'				<input type="checkbox" checked="checked" name="arr_files[]" value="'+json.results.id+'">'+
							'				<div class="checkbox"></div>'+
							'			</label>'+
							'		</div>'+
							'	</div>'+
							'	<div class="item-media">'+
							'	<a title="Title" class="zoom" href="'+ImgUrl+'">'+
							'		<img src="'+ImgThumbnailUrl+'">'+
							'	</div>'+
							'</div>';
							
							//console.log(HtmlCode);
							
							$('<li></li>').appendTo('#files').html(HtmlCode);
						}
						
					}

					var fail = function (error) {
						//myApp.hideIndicator();
						$('.preloader-files').hide();
						//alert("An error has occurred: Code = " + error.code);
						//console.log("upload error source " + error.source);
						//console.log("upload error target " + error.target);
					}

					var options = new FileUploadOptions();
					options.fileKey = "file";
					options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1)+'.jpg';
					options.mimeType = "image/jpeg";

					//var params = {};
					//params.value1 = "test";
					//params.value2 = "param";
                    //
					//options.params = params;

					var ft = new FileTransfer();
					ft.upload(imageURI, encodeURI(site_url+"/files_ajax.php"), win, fail, options);
					
				
					  // Show the captured photo
					  // The inline CSS rules are used to resize the image
					  //
					  
					//// Get image handle
					//var largeImage = document.getElementById('largeImage');
					//// Unhide image elements
					//largeImage.style.display = 'block';
					//largeImage.src = imageURI;
					//<br>
					//<img style="display:none;" id="largeImage" src="" />
				
				}
			};
			
			Up = new UpClass();
			Up.button=btn;
			Up.run();
			
		}
	})(jQuery);
	
	(function($){
		$.fn.AdForm = function(settings){
			var btn = this;
			
			var AdElementsClass = function(){};
			AdElementsClass.prototype = {
				//open: true,
				run: function() {
					Aopj=this;
					
						$('input#send_video').change(function() {
							$('#btn_video').toggle();
						});
						
						$( ".typ_item" ).hide();
						$( ".model_item" ).hide();
						
						Aopj.form.find(".video_url").empty();
						Aopj.get_form_options({
							
							callback: function (  ) {

								myApp.showIndicator();
								
								Aopj.form.find(".service").empty();
								Aopj.form.find(".currency_type").empty();
								Aopj.form.find('.cat').empty();
								Aopj.form.find(".brand").empty();
								Aopj.form.find( ".typ" ).empty();
								Aopj.form.find('.country').empty();
								Aopj.form.find( ".area" ).empty();
								Aopj.form.find(".model").empty();

                                if(Aopj.settings.type == 'search' || Aopj.settings.type == 'add' ) {
									
                                    Aopj.get_elements({type: 'service'});
                                    Aopj.get_elements({type: 'currency_type', text: 'type'});
                                    Aopj.get_elements({type: 'cat'});
                                    Aopj.get_elements({type: 'models'});
                                    Aopj.get_elements({type: 'ad_time'});
                                    Aopj.get_elements({type: 'countrys', value: 'code'});
                                }
								var calendarRange = myApp.calendar({
									input: Aopj.form.find('.calendar-auction'),
									dateFormat: 'dd/mm/yyyy',
								});
								
								if(Aopj.settings.type == 'search' ){
										Aopj.search();
								}else if(Aopj.settings.type == 'add' ){
									
									

									myApp.popup('.popup-splash');
									$$('.popup-splash').on('opened', function () {
										$$('.commission').html(site_settings.commission);
									});
                                    Aopj.add_ad();
									
								}else if(Aopj.settings.type == 'edit' ){
                                    Aopj.get_add({
                                        callback: function (json) {
                                            if(json.results.files){
                                                $.each(json.results.files, function( index, value ) {

                                                    var ImgThumbnailUrl=site_settings.site_url+'/upload/thumbnail/'+value.file;

                                                    var HtmlCode= '<div class="item-content">'+
                                                        '	<div class="item-inner">'+
                                                        '		<div class="name">'+
                                                        '			<label class="label-switch">'+
                                                        '				<input type="checkbox" checked="checked" name="arr_files[]" value="'+value.id+'">'+
                                                        '				<div class="checkbox"></div>'+
                                                        '			</label>'+
                                                        '		</div>'+
                                                        '	</div>'+
                                                        '	<div class="item-media">'+
                                                        '	<a title=" صورة " class="zoom" href="'+ImgThumbnailUrl+'">'+
                                                        '		<img src="'+ImgThumbnailUrl+'">'+
                                                        '	</div>'+
                                                        '</div>';
                                                    $('<li></li>').appendTo('#files').html(HtmlCode);

                                                });
                                            }

                                            Aopj.form.find('[name=title]').val(json.results.title);
                                            Aopj.form.find('[name=delivery_term]').val(json.results.delivery_term);
                                            Aopj.form.find('[name=price]').val(json.results.price);
                                            Aopj.form.find('[name=auction_start]').val(json.results.auction_start);
                                            Aopj.form.find('[name=date_auction_end]').val(json.results.date_auction_end);
                                            Aopj.form.find('[name=mobile]').val(json.results.mobile);
                                            Aopj.form.find('[name=text]').val(json.results.text);

                                            Aopj.get_elements({
												type: 'currency_type',
												text: 'type',
                                                selected:json.results.currency_type
                                            });
                                            Aopj.get_elements({
												type: 'countrys',
												value: 'code',
                                                selected:json.results.country,
                                                area:json.results.area
                                            });

                                            Aopj.get_elements(
                                                {
                                                    type:'service',
                                                    selected:json.results.service
                                                }
                                            );
                                            //Aopj.get_elements({type:'currency_type',text: 'type'});
                                            Aopj.get_elements(
                                                {
                                                    type:'cat',
                                                    selected:json.results.cat,
                                                    typ_selected:json.results.typ,
                                                    brand_selected:json.results.brand,
                                                }
                                            );
                                            Aopj.get_elements(
                                                {
                                                    type:'models',
                                                    selected:json.results.model
                                                }
                                            );
                                            Aopj.get_elements({
                                                type:'ad_time',
                                                selected:json.results.ad_time
                                            });
                                            /*
                                            Aopj.get_elements(
                                                {
                                                    type:'areas',
                                                    selected:json.results.area
                                                }
                                            );*/

                                        }
                                    });
                                    Aopj.add_edit();

                                }
							}
							
						});
					
				},
				// البحث عن إعلان 
				search: function() {
					
					myApp.attachInfiniteScroll($$('.infinite-scroll'));
					$$('.infinite-scroll-preloader').show();
					
					Aopj=this;
					
						$$('.infinite-scroll-preloader').hide();
						Aopj.form.submit(function () {
						$$('.infinite-scroll-preloader').show();
							myApp.showIndicator();
							var query ='?'+$(this).serialize();
								Aopj.settings.list.get_ads(
										{
											get_only : [ "title", "id" , "last_thumbnail" , "det" , "area_name" , "num_files" , "member_user_name" , "service_name" , "time_format", "last_thumbnail_id","time_since_time" ],
												search_query : query,
												always : function (  ) {
													myApp.closeModal('.popup-search');
						
													// Loading flag
													var loading = false;
													 
													// Last loaded index
													// var lastIndex = $$('.list-ads li').length;
													
													var NumPage =2	;
														
													// Max items to load
													// var maxItems = 60;
													 
													// Attach 'infinite' event handler
													$$('.infinite-scroll').on('infinite', function () {
														
														// Exit, if loading in progress
														if (loading) return;
														
														// Set loading flag
														loading = true;
														 
														  // Emulate 1s loading
														setTimeout(function () {
														 
															Aopj.settings.list.get_ads(
																	{
																		get_only : [ "title", "id" , "last_thumbnail" , "det" , "area_name" , "num_files" , "member_user_name" , "service_name" , "time_format", "last_thumbnail_id","time_since_time" ],
																		search_query : query,
																		more : true,
																		Indicator : false,
																		page : NumPage,
																		end : function (  ) {
																			
																			// Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
																			myApp.detachInfiniteScroll($$('.infinite-scroll'));
																			// Remove preloader
																			// $$('.infinite-scroll-preloader').remove();
																			$$('.infinite-scroll-preloader').hide();
																			
																			return;
																		},
																		always : function (  ) {
																			// Reset loading flag
																			loading = false;
																		}
																	});
																	
															NumPage++;
															
														}, 1000);
														  
													});
												},
												end : function (  ) {
													
													// Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
													myApp.detachInfiniteScroll($$('.infinite-scroll'));
													// Remove preloader
													// $$('.infinite-scroll-preloader').remove();
													$$('.infinite-scroll-preloader').hide();
													return;
												}
										});
										
							return false;
						});
				},
				reset: function() {
					Aopj=this;
					Aopj.form.find("[name=title]").val('');
					Aopj.form.find("[name=mobile]").val('');
					Aopj.form.find("textarea").val('');
					Aopj.form.find(".video_url").val('');
					Aopj.form.find("#files").empty();
					
					//Aopj.form.find(".service").empty();
					//Aopj.form.find(".currency_type").empty();
					//Aopj.form.find('.cat').empty();
					//Aopj.form.find(".brand").empty();
					//Aopj.form.find( ".typ" ).empty();
					//Aopj.form.find('.country').empty();
					//Aopj.form.find( ".area" ).empty();
					//Aopj.form.find(".model").empty();
				},
				// إضافة إعلان جديد
                get_add: function(settings) {
                    Aopj=this;
                    myApp.showIndicator();
                    $.ajax({
                        type: 'get',
                        url: site_url+"/ads.edit.php",
                        dataType: "json",
                        data: {
                            'edit_ads':Aopj.settings.id
                        },
                        success: function (data) {
                            myApp.hideIndicator();
                        }
                    }).always(function(data) {
                        myApp.hideIndicator();
                        if(settings){
                            if(settings.callback){
                                settings.callback(data);
                            }
                        }
                    }).fail(function() {
                        myApp.hidePreloader();
                        myApp.hideIndicator();
                        myApp.closeNotification(".notification-item");
                        myApp.addNotification({
                            title: 'لا يوجد استجابه من السيرفر حالياً حاول مره أخرى',
                            closeOnClick: true
                        });
                    });
				},
                // تعديل إعلان
                add_edit: function() {
                    Aopj=this;
                    Aopj.form.submit(function () {
                        myApp.showIndicator();
                        $.ajax({
                            dataType: "json",
                            url     : site_url+"/ads.edit.php?edit_ads="+Aopj.settings.id,
                            type    : 'post',
                            data    : $(this).serialize(),
                            success : function( response ) {
                                myApp.hideIndicator();
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
                                        title: 'تم تعديل الإعلان',
                                        message: '<a href="ads_show.html?id='+response.results.id+'">إضغط هنا لفتح الإعلان</a>',
                                        media: '<i class="fa fa-check-circle"></i>'
                                    });
                                }

                            }
                        }).fail(function() {
                            myApp.hidePreloader();
                            myApp.hideIndicator();
                            myApp.closeNotification(".notification-item");
                            myApp.addNotification({
                                title: 'لا يوجد استجابه من السيرفر حالياً حاول مره أخرى',
                                closeOnClick: true
                            });
                        });
                        return false;
                    });

                },
				// إضافة إعلان جديد
				add_ad: function() {
					
					(function($){
						$.fn.serializeObject = function () {
							"use strict";

							var result = {};
							var extend = function (i, element) {
								var node = result[element.name];

						// If node with same name exists already, need to convert it to an array as it
						// is a multi-value field (i.e., checkboxes)
						
								if ('undefined' !== typeof node && node !== null) {
									if ($.isArray(node)) {
										node.push(element.value);
									} else {
										result[element.name] =node + ','+ element.value;
										//result[element.name] = [node, element.value];
									}
								} else {
									result[element.name] = element.value;
								}
							};

							$.each(this.serializeArray(), extend);
							return result;
						};
					})(jQuery);
						
					Aopj=this;
						Aopj.form.submit(function () {
							
							myApp.showIndicator();
							
							var url_vid = Aopj.form.find(".video_url").val();
							var type_vid = Aopj.form.find(".video_type").val();
							//window.plugins.streamingMedia.playVideo(url_vid);
							

							if ($('input#send_video').is(':checked')) {
								var win = function (r) {
									//alert("Code = " + r.responseCode);
									//alert("Response = " + r.response);
									//alert("Sent = " + r.bytesSent);
									var json = jQuery.parseJSON( r.response );
									myApp.hideIndicator();
									if(json.errors){
										var msg = json.errors.join('<br>');
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
											title: 'تم إضافة الإعلان',
											message: '<a href="ads_show.html?id='+json.results.id+'">إضغط هنا لفتح الإعلان</a>',
											media: '<i class="fa fa-check-circle"></i>'
										});
										setTimeout(function () {
											myApp.closeNotification(".notification-item");
										}, 2000);
										mainView.router.loadPage('ads_show.html?id='+json.results.id);
										Aopj.reset();
									}
								}

								var fail = function (error) {
									//alert('no');
									myApp.hideIndicator();
									myApp.closeNotification(".notification-item");
									myApp.addNotification({
										title: 'خطاء',
										message: 'خطاء فى رفع الفيديو ،ربما أن لم تختر الفيديو أو مدتة قصيرة جداً',
										closeOnClick: true,
										media: '<i class="fa fa-exclamation-circle"></i>'
									});
									//alert("An error has occurred: Code = " + error.code);
									//alert("upload error source " + error.source);
									//alert("upload error target " + error.target);
								}
								
								var options = new FileUploadOptions();
								options.fileKey = "video";
								options.fileName = url_vid.substr(url_vid.lastIndexOf('/') + 1);
								options.mimeType = type_vid;
								
								//var params = $(this).serialize();
								var params = $(this).serializeObject();
								options.params = params;

								//alert(' hi 4');
								var ft = new FileTransfer();
								ft.upload(url_vid, encodeURI(site_url+"/ads.php"), win, fail, options);
									
							}else{
								$.ajax({
									dataType: "json",
									url     : site_url+"/ads.php",
									type    : $(this).attr('method'),
									data    : $(this).serialize(),
									success : function( json ) {
												if(json.errors){
													var msg = json.errors.join('<br>');
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
														title: 'تم إضافة الإعلان',
														message: '<a href="ads_show.html?id='+json.results.id+'">إضغط هنا لفتح الإعلان</a>',
														media: '<i class="fa fa-check-circle"></i>'
													});
													setTimeout(function () {
														myApp.closeNotification(".notification-item");
													}, 2000);
													mainView.router.loadPage('ads_show.html?id='+json.results.id);
													Aopj.reset();
												}
												
											}
								}).always(function() {
												myApp.hideIndicator();
								  });
							} 
							return false;
						});
						
				},
				//	جلب العناصر
				get_elements: function(settings) {
					
					Aopj=this; 
					var defaults = {
						value: 'id',
						text: 'name',
					};
					var options = $.extend({}, defaults, settings);
					
					if(options.type == 'service'){
						// جلب الخدمات
						Aopj.set_options(
						{
							url:site_url+"/get.php?action=service",
							index: Aopj.form.find(".service"),
							options:options,
							change: function ( index ) {
								// عند أختيار الخدمة
								$(index).change(function() {
									var vl = $(this).val();

									if($.inArray( vl,Aopj.form_options.ids_services.delivery_term ) !== -1){
										$( ".delivery_term_item" ).show();
									}else{
										$( ".delivery_term_item" ).hide();
									}
									if($.inArray( vl,Aopj.form_options.ids_services.auction_start ) !== -1){
										$( ".auction_start_item" ).show();
									}else{
										$( ".auction_start_item" ).hide();
									}
									if($.inArray( vl,Aopj.form_options.ids_services.date_auction_end ) !== -1){
										$( ".date_auction_end_item" ).show();
									}else{
										$( ".date_auction_end_item" ).hide();
									}

									if($.inArray( vl,Aopj.form_options.ids_services.price ) !== -1){
										$( ".price_item" ).show();
										$( ".currency_type_item" ).show();
									}else{
										$( ".price_item" ).hide();
										$( ".currency_type_item" ).hide();
									}

								}).change();
							},
							callback: function (  ) {
                                Aopj.form.find('[name=service] option[value='+options.selected+']' ).attr('selected','selected').change();
                            }
						}
						);
						
						
					}else if(options.type == 'ad_time'){
						// مدة الإعلان 
						Aopj.set_options(
						{
							url:site_url+"/get.php?action=ad_time",
							index: Aopj.form.find(".ad_time"),
							options:options,
                            callback: function (  ) {
                                Aopj.form.find('[name=ad_time] option[value='+options.selected+']' ).attr('selected','selected').change();
                            }
						}
						);
					}else if(options.type == 'currency_type'){
						// جلب أنواع العملات
						Aopj.set_options(
						{
							url:site_url+"/get.php?action=currency_type",
							index: Aopj.form.find(".currency_type"),
							options:options,
                            callback: function (  ) {
                                Aopj.form.find('[name=currency_type] option[value='+options.selected+']' ).attr('selected','selected').change();
                            }
						}
						);
					}else if(options.type == 'cat'){
						// جلب الأقسام
						
						Aopj.form.find('.cat').append($('<option>', {
							value: 0,
							text : 'إختر'
						}));
						
						Aopj.set_options(
						{
							url:site_url+"/get.php?action=categories",
							index: Aopj.form.find(".cat"),
							options:options,
							change: function ( index ) {
									// عند أختيار القسم
									$(index).change(function() {
										var vl = $(this).val();
											
											Aopj.form.find( ".typ" ).empty();
											Aopj.form.find( ".brand" ).empty();
											
											Aopj.set_options(
											{
												url:site_url+"/get.php?action=brand&val="+vl,
												index: Aopj.form.find(".brand"),
												options:options,
                                                callback: function (  ) {
                                                    Aopj.form.find('[name=brand] option[value='+options.brand_selected+']' ).attr('selected','selected').change();
                                                }
											}
											);
											
											if($.inArray( vl,JSON.parse(Aopj.form_options.ids_hide_sub) ) !== -1){
												$( ".brand_item" ).show();
											}else{
												$( ".brand_item" ).hide();
											}
											
											if($.inArray( vl,JSON.parse(Aopj.form_options.ids_hide_typ) ) !== -1){
												$( ".typ_item" ).show();
											}else{
												$( ".typ_item" ).hide();
											}
											
											if($.inArray( vl,JSON.parse(Aopj.form_options.ids_hide_model )) !== -1){
												$( ".model_item" ).show();
											}else{
												$( ".model_item" ).hide();
											}
											
									});
									// عند إختيار التصنيف
									Aopj.form.find(".brand").change(function() {
										var vl = $(this).val();
										if(vl > 0){
											
											Aopj.form.find( ".typ" ).empty();
											
											Aopj.set_options(
											{
												url:site_url+"/get.php?action=typ&val="+vl,
												index: Aopj.form.find(".typ"),
												options:options,
                                                callback: function (  ) {

                                                    Aopj.form.find('[name=typ] option[value='+options.typ_selected+']' ).attr('selected','selected');

                                                }
											}
											);
										}
									});
							},
                            callback: function (  ) {
                                Aopj.form.find('[name=cat] option[value='+options.selected+']' ).attr('selected','selected').change();
                            }
						}
						);
						
					}else if(options.type == 'countrys'){
						
						Aopj.form.find('.country').append($('<option>', {
							value: 0,
							text : 'إختر'
						}));
						// جلب البلد
						Aopj.set_options(
						{
							url:site_url+"/get.php?action=countrys",
							index: Aopj.form.find(".country"),
							options:options,
							change: function ( index ) {
								// عند أختيار البلد
								$(index).change(function() {
									var vl = $(this).val();
										
										Aopj.form.find( ".area" ).empty();
										options.value='id';

										Aopj.set_options(
										{
											url:site_url+"/get.php?action=areas&val="+vl,
											index: Aopj.form.find(".area"),
											options:options,
                                            callback: function (  ) {
                                                Aopj.form.find('[name=area] option[value='+options.area+']' ).attr('selected','selected').change();
                                            }
										}
										);
								});
							},
                            callback: function (  ) {
                                Aopj.form.find('[name=country] option[value='+options.selected+']' ).attr('selected','selected').change();
                            }
						}
						);

						
					}else if(options.type == 'models'){
						// جلب الموديلات
						Aopj.set_options(
						{
							url:site_url+"/get.php?action=models",
							index: Aopj.form.find(".model"),
							options:options,
                            callback: function (  ) {
                                Aopj.form.find('[name=model] option[value='+options.selected+']' ).attr('selected','selected').change();
                            }
						}
						);
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

                        if(settings.callback){
                            settings.callback();
                        }
						myApp.hideIndicator();
					  });
					  
				},
				get_form_options: function(settings) {

					Aopj=this;
						myApp.showIndicator();
					$.getJSON( site_url+"/get.php?action=form_options", function( data ) {
						Aopj.form_options=data;

					}).always(function() {
						myApp.hideIndicator();
						if(settings.callback){
							settings.callback();
						}
					  });
					  
				}
			};
			
			AdElements = new AdElementsClass();
			AdElements.settings=settings;
			AdElements.form=btn;
			AdElements.run();
			
		}
	})(jQuery);
	function checkAdd(){
		if(localStorage.getItem('logged_in')=='false'){
				$('.index-bg').removeClass('page-bg');
				$('.index-bg').removeClass('page-w');
				$('.tab').removeClass('active');
				$('.index-bg').addClass('usercp-bg');
				$('.UserPanel').addClass('active');							
										
									}
									else{
										mainView.router.loadPage('add.ads.html');

									}
		
	}
	 
	