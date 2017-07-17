// Initialize app
site_url ='http://sooqmzad.com/api'; // رابط البرمجة على الموقع
//alert('welcom');
var FnLoad = []; // load fn once
// جلب أعدادات الموقع 
	$.ajax({
		dataType: "json",
		url:  site_url+"/get.php?action=settings",
		async: false,
		scriptCharset: "utf-8",
		//contentType: "application/json; charset=utf-8",
		success: function(json) 
		{
			site_settings=json;
		}
	}).fail(function( jqxhr, textStatus, error ) {
		var err = textStatus + ", " + error;
	//	alert("Request Failed: " + err );
	});
	
var myApp = new Framework7({
    swipeBackPage: false,
    pushState: true,
    swipePanel: 'left',
    //modalTitle: 'Title',
    precompileTemplates: true, //
    //template7Pages: true, //enable Template7 rendering for pages 
    //Specify templates/pages data
    // Hide and show indicator during ajax requests
    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    } ,
    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    }
}); 

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

$$('body').on('click', '.js-add-to-fav', function () {
    myApp.alert('You love this post!', '');
});

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});


$$('body').on('click', '#login-user', function () {
    // دخول الموقع لتسجيل الدخول من المواقع الاجتماعيه
    var ref = cordova.InAppBrowser.open(site_settings.site_url+'/opauth_app/', '_blank', 'location=no,closebuttoncaption=إغلاق'); // ,toolbar=no
    ref.addEventListener('loadstop', function(event) {

        //alert(event.url.match("callback.php"));

        if (event.url.match("callback.php")) { // #_=_
            $(document).get_user({
                always : function (data) {
                    //alert(data);
                    //alert(data.results.user_name);
                    if(data.results){
                        //alert('ok');
                        myApp.closeNotification(".notification-item");
                        myApp.addNotification({
                            title: 'دخول الأعضاء',
                            message: 'أهلاً بك'
                        });
                        setTimeout(function () {
                            myApp.closeNotification(".notification-item");
                        }, 2000);
                    }else{
                        //alert('error');
                        myApp.closeNotification(".notification-item");
                        myApp.addNotification({
                            title: 'خطا',
                            message: ' خطأ فى تسجيل الدخول ، حاول مره اخرى',
                        });
                        setTimeout(function () {
                            myApp.closeNotification(".notification-item");
                        }, 2000);
                    }
                }
            });
            ref.close();
            //alert('close');
        }
    });
});

$$('body').on('click', '.back-btn', function () {
	mainView.router.back();
});
if( localStorage.getItem('user_agree') === null || localStorage.getItem('user_agree') === true ) {
	myApp.popup('.popup-splash');
	$$('.popup-splash').on('opened', function () {
		$$('.commission').html(site_settings.commission);
	});
}
$$('.popup-splash').on('close', function () {
    localStorage.setItem('user_agree', true);
});


$$('.popup-search').on('opened', function () {
	myApp.closeNotification(".notification-item");
	//$('#SearchAds').AdForm({
	//	type:'search',
	//	once:true,
	//	list:$('.search-ads .ads-block')
	//});
});
	
$$('.popup-login').on('opened', function () {
	myApp.closeNotification(".notification-item");
});
	
 $.ajaxSetup({ 
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    }
});
$$('body').on('click', 'a[target=_blank] , a[target=_system]', function () {
	var url = encodeURI($(this).attr( "href" ));
	setTimeout(function() {
		myApp.hideIndicator();
	}, 2000);
	//var target = $(this).attr( "target" );
	var ref = cordova.InAppBrowser.open(url, '_system', 'location=yes, zoom=yes');
	myApp.hideIndicator();
});

//$(document).set_setting({});
//$(".categories-menu").get_categories({});
//$(".categories-list").get_categories_list({});
//$(".pages-list").get_pages({});
 /*
var RefreshKey;
*/
var FunNum=0;

myApp.onPageInit('index', function (page) {
	
	FunNum++;
	$('.index-ads .list-block ul').index_ads({
		form:'.index-form',
		num:FunNum
	});


	//console.log(page);
	// قائمة الأعضاء ودخول الأعضاء
	$(document).get_user({});
	
	//$$('.page-on-left').remove(); 
	//$$('.navbar-on-left').remove();
		$('.home-link').hide();
		$('.home-tab').show();

	$(document).set_setting({});
	//$(".categories-menu").get_categories({});
	//$(".brands-menu").get_brands({});
	
			
		$('.Sections-container').swiper_categories({});
	
		// صناعة سلايد نوع الاعلانات
		var swiper = new Swiper('.tpes-container', {
			slidesPerView: 3,
			paginationClickable: true,
			spaceBetween: 5,
			pagination: false
		});
		/*
		// آخر الإعلانات
		var query ='';
		RefreshKey='last-ads';
		$('.index-ads .list-block ul').get_ads_list({
			query:query,
			key:'last-ads'
		});
		*/
	// يتم الإنتظار ثانية لأنه حينما يتم فتح التطبيق وبعدها فتح رابط الرئيسية فلن تعمل الجافا سكريبت للتابات
		setTimeout(
		function() 
		{
			$('.index-bg').addClass('page-w');
			
			$$('#tab-home').on('show', function () {
				$('.index-bg').removeClass('usercp-bg');
				$('.index-bg').removeClass('page-bg');
				$('.index-bg').addClass('page-w');

			});
			$$('#tab-cat').on('show', function () {
				$('.index-bg').removeClass('page-w');
				$('.index-bg').removeClass('usercp-bg');
				$('.index-bg').addClass('page-bg');
			});
			$$('#tab-search').on('show', function () {
				$('.index-bg').removeClass('page-bg');
				$('.index-bg').removeClass('usercp-bg'); 
				$('.index-bg').addClass('page-w');
				// فتح نافذة البحث
				myApp.popup('.popup-search');
				$('#SearchAds').AdForm({
					type:'search',
					once:true,
					list:$('.search-ads .ads-block')
				});
			});
			$$('#tab-notification').on('show', function () {
				$('.index-bg').removeClass('page-w');
				$('.index-bg').removeClass('usercp-bg');
				$('.index-bg').addClass('page-bg');
				$('.notifications-list').get_notifications({});

			});
			$$('#tab-msgs').on('show', function () {
				$('.index-bg').removeClass('page-w');
				$('.index-bg').removeClass('usercp-bg');
				$('.index-bg').addClass('page-bg');
				 
				$('.inbox-list').get_inbox(
						{
							get_only : [ "title", "id" , "member_to_name" , "member_from_name" , "mday_time" , "mon_time" , "year_time" ,"ads_title","reading","ads_title","member_from_name"]
						});
							
				$('.sent-list').get_sent(
					{
						get_only : [ "title", "id" , "member_to_name" , "member_from_name" , "mday_time" , "mon_time" , "year_time" ,"ads_title","reading","ads_title","member_from_name"]
					});
				

			});
			$$('#more').on('show', function () {
				$('.index-bg').removeClass('page-bg');
				$('.index-bg').removeClass('page-w');
				$('.index-bg').addClass('usercp-bg');
			});
			
			$$('#tab-city').on('show', function () {
				$('.index-bg').removeClass('page-w');
				$('.index-bg').removeClass('usercp-bg');
				$('.index-bg').addClass('page-bg');
				$('#home-form').HomeForm({
					type:'add'
				});
			});
			
		}, 1000);
 }).trigger();

$$(document).on('pageInit', function (e) {
    var page = e.detail.page;
		$('.home-link').show();
		$('.home-tab').hide();
	//Disable page-on-left (History) 
	// عند إستخدامها فإن الصفحة الرئيسية عن الرجوع لها تكون فارغة
	//myApp.onPageAfterAnimation('index', function(){ $$('.page-on-left').remove();  $$('.navbar-on-left').remove(); })

    $( '.zoom' ).swipebox();
    $('.navbar').removeClass('navbar-clear');
    if(  page.name === 'menu' || page.name === 'activation' || page.name === 'dashboard-1' || page.name === 'panel' ) {
        $('.navbar').addClass('navbar-clear');
    }
	user_chat=0;
    if( page.name === 'index') {
		$('.home-link').hide();
		$('.home-tab').show();
	}else if( page.name === 'banners' ) {
		$(page.container).find('.page-content').get_banners({
			query:'?group=4'
		});
	}else if( page.name === 'shops' ) {
		 
			myApp.attachInfiniteScroll($$('.infinite-scroll'));
			$$('.infinite-scroll-preloader').show();
		$(page.container).find('.page-content').get_shops(
				{
					always : function (  ) {
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
							 
								 
								var query ='?'+$.param( page.query, true );
								
								$(page.container).find('.page-content').get_shops(
										{
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
				
		/*
			$(document).send_msg({
				user:page.query.user
			});
		*/
     }else if( page.name === 'ads' ) {
		
				myApp.attachInfiniteScroll($$('.infinite-scroll'));
				$$('.infinite-scroll-preloader').show();
				
		if(page.query.search =='open'){
			// فتح نافذة البحث
			myApp.popup('.popup-search');
			$('#SearchAds').AdForm({
				type:'search',
				once:true,
				list:$('[data-page="ads"]').find('.page-content .list-block ul')
			});
		}else{
			var query ='?'+$.param( page.query, true ); 
			
				$(page.container).find('.page-content .list-block ul').get_ads(
				{
					get_only : [ "title", "id" , "last_thumbnail" , "det" , "area_name" , "num_files" , "member_user_name" , "service_name" , "time_format", "last_thumbnail_id","time_since_time" ],
					search_query : query,
					refresh : true,
					always : function (  ) {
						
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
							 
								 
								var query ='?'+$.param( page.query, true );
								
								$(page.container).find('.page-content .list-block ul').get_ads(
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
		}
    }else if( page.name === 'sent' ) {

		var query ='?'+$.param( page.query, true );
		
		$(page.container).find('.page-content').get_sent(
				{
					get_only : [ "title", "id" , "member_to_name" , "member_from_name" , "mday_time" , "mon_time" , "year_time" ,"ads_title","reading","ads_title","member_from_name"],
					search_query : query
				});
				
    }else if( page.name === 'inbox' ) {

		var query ='?'+$.param( page.query, true );
		
		$(page.container).find('.page-content').get_inbox(
				{
					get_only : [ "title", "id" , "member_to_name" , "member_from_name" , "mday_time" , "mon_time" , "year_time" ,"ads_title","reading","ads_title","member_from_name"],
					search_query : query
				});
				
    }else if( page.name === 'msg_sent_show' ) {
		
		$(page.container).find('.page-content').show_sent_msg(
				{
					search_query : '?show='+page.query.id,
				});
				
				
    }else if( page.name === 'msg_show' ) {
		
		$(page.container).find('.page-content').show_msg(
				{
					search_query : '?show='+page.query.id,
				});
				
				
    }else if( page.name === 'user-profile' ) {
			myApp.closePanel('.panel-right');

		var query ='?'+$.param( page.query, true );
		
		$(page.container).find('.page-content').get_profile(
				{
					search_query : query
				});
				/*
		$(document).send_msg({
			user:page.query.user
		});
				*/
    }else if( page.name === 'commission' ) {
		
		$("#numElt").on("keyup", function() {
			var num_val = $(this).val();
			var percent = (num_val*site_settings.commission_num)/100;
			$('#ruElt').val(percent);
		});
		$(page.container).find('.site-commission').html(site_settings.commission_text);
		$(page.container).find('.transfer_data').get_money_transfer();
    }else if( page.name === 'ads_show' ) {
		 
		//console.log(page.query);
		
		$(page.container).find('.page-content').show_ads(
				{
					search_query : '?show='+page.query.id,
					toolbar : $(page.container).find('.toolbar')
				});
		
		if(FnLoad['add_comment'] != true){
			$(document).add_comment();
			FnLoad['add_comment'] = true;
		}
		
		if(FnLoad['Favorit'] != true){
			$(document).Favorit({});
			FnLoad['Favorit'] = true;
		}
		
		if(FnLoad['vote'] != true){
			$(document).vote({});
				FnLoad['vote'] = true;
		}
		if(FnLoad['bidding'] != true){
			$(document).bidding({});
				FnLoad['bidding'] = true;
		}
		
		$(document).report({
			id:page.query.id
		});
		
		if(FnLoad['sharecontent'] != true){
			$(document).sharecontent({});
				FnLoad['sharecontent'] = true;
		}
		
    }else if( page.name === 'page_show' ) {
		//console.log(page.query);
		
		$(page.container).find('.page-content').show_page(
				{
					search_query : '?show='+page.query.show
				});
		

    }else if( page.name === 'contact' ) {
		$(page.container).find('.page-content .contact-list').get_contact(
				{
					search_query : '?show='+page.query.show
				});
		

		$('#SendMsg').ContactForm({
			type:'send'
		});
    }else if( page.name === 'edit_ads' ) {

        $('#AddAd').AdForm({
            type:'edit',
            id : page.query.id
        });

        $("#btn").uploadimages();
        $("#btn_video").get_video();

    }else if( page.name === 'add_ads' ) {
		
		$('#AddAd').AdForm({
			type:'add'
		});
		
		$("#btn").uploadimages();
		$("#btn_video").get_video();
		
    }else if( page.name === 'edit_user' ) {
		
		$('#EditUser').UserForm({
			type:'edit'
		});
		
    }else if( page.name === 'add_user' ) {
		
		$('#AddUser').UserForm({
			type:'add'
		});
		
    }else if( page.name === 'chat' ) {
		setTimeout(
		function() 
		{
			user_chat=page.query.user;
			$('#chat-box').chat({
				user:page.query.user
			});
		}, 1000);
    }else if( page.name === 'chats' ) {
		
		$(page.container).find('.page-content').get_chats(
				{
					
				});
    }else if( page.name === 'notification' ) {

		var query ='?'+$.param( page.query, true );
		
		$(page.container).find('.page-content').get_notifications(
				{
					search_query : query
				});
				
		$$('body').on('click', '.get-notification', function () {
			
			$(document).get_notifications_count();
			$(page.container).find('.page-content').get_notifications(
					{
						search_query : query
					});
		});

    }else if( page.name === 're_pass' ) {
		
		$('#RePass').RePass({
		});
		
		$('#SetPass').RePass({
		});
    }
});

$(document).ready(function() {
	/*
    if( localStorage.getItem('newOptions') === null || localStorage.getItem('newOptions') === true ) {
        myApp.popup('.popup-splash');
        localStorage.setItem('newOptions', true);
    }*/

    naxvarBg();

    $('.js-toggle-menu').on('click', function() {
        $(this).next().slideToggle(200);
        $(this).find('span').toggleClass('icon-chevron-down').toggleClass('icon-chevron-up');
    });
});

$$('body').on('click', 'textarea', function () {
		setTimeout(
		function() 
		{
			$('.page-on-center .page-content').scrollTop(100000);
		}, 1000);
});


$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function naxvarBg() {
    var navbar = $('.navbar-clear'),
        box = null,
        cls = 'active';

    if(navbar.length === 0) {
        return false;
    }

    if($('.page-on-center').length > 0) {
        box = navbar.next().find('.page-on-center .page-content');
    } else {
        box = navbar.next().find('.page .page-content');
    }

    if( box.scrollTop() > 10 ) {
        navbar.addClass( cls );
    }else{
        navbar.removeClass( cls );
    }

    box.scroll(function() {
        if( $(this).scrollTop() > 40 ) {
            navbar.addClass( cls );
        }else{
            navbar.removeClass( cls );
        }
    });
}
