// console.log(0, Math.round(1000*-29/530)/10);
// console.log(Math.round(1000*-280/700)/10, Math.round(1000*-29/530)/10);
// console.log(Math.round(1000*-325/700)/10, Math.round(1000*0/530)/10);
// console.log(Math.round(1000*-100/700)/10, Math.round(1000*-0/530)/10);
// console.log(Math.round(1000*-285/700)/10, Math.round(1000*-109/530)/10);
// console.log(Math.round(1000*-69/700)/10, Math.round(1000*-159/530)/10);




$(document).ready(function(){



  // load comments
  var nowPage = 0;
  //getCelebrity();
  //有名人留言時再呼叫此 function
  //目前暫定是用 ?sort=-created_at&q={"is_agree":"1"}&famous=true 來篩出名人留言
  //如果 API 用的名稱不同再麻煩修改 function 內的網址
  getComments(nowPage);

  var offset = 0;
  

  function getComments(page){
    $('.guestbook__loading:not(.guestbook__loading--celebrity)').addClass('on');
    offset = (page)*2;
    var xhr = $.ajax({
      url: 'https://gsheet-toolkit.small-service.gpeastasia.org/v1/db/tw-no-nuclear-message-board?sort=-created_at&limit=2&offset=' + offset,
      method: 'get',
      headers: {
        'Access-Control-Expose-Headers': '*'
      },
      crossdomain: true,
      success:function(res, status, jqXHR){
        //console.log(jqXHR.getAllResponseHeaders())
        var data = res;
        //console.log(data)
        $('#total').text(data.totalCount)
        $('#peoples').html('');
        for(var i = 0; i<data.records.length; i++){
          var temp = $('#msgTemplate').html();
          var thisData = data.records[i];
          // console.log(thisData["is_agree"], thisData["job_title"], thisData["last_name"], thisData["first_name"], thisData["msg"]);
          temp = temp.replaceAll('{{avatar}}', thisData["avatar_url"]);
          temp = temp.replaceAll('{{agree}}', thisData["is_agree"] === '0' ? 'o' : 'x');
          temp = temp.replaceAll('{{title}}', thisData["job_title"]);
          temp = temp.replaceAll('{{name}}', thisData["last_name"]+' '+thisData["first_name"]);
          if(thisData["is_agree"] === '0'){
            temp = temp.replaceAll('{{msg}}', '我同意核四續建。'+thisData["msg"]);
          }else{
            temp = temp.replaceAll('{{msg}}', '我不同意核四續建。'+thisData["msg"]);
          }
          $('#peoples').append($(temp));
        }
        updateCustomScroll();
        $('.guestbook__prev').toggleClass('off', (nowPage<=0))
      },
      error:function(err){
        console.log(err)
      },
    }).then(function(){
      $('.guestbook__loading:not(.guestbook__loading--celebrity)').removeClass('on');
    });
  }

  function randomCelebrity(){
    
    var all = $('.msg--celebrity').length;
    $('.msg--celebrity').hide();
    $('.msg--celebrity').eq(Math.floor(Math.random()*all)).fadeIn();
  }
  

  function getCelebrity(){
    $('.guestbook__loading--celebrity').addClass('on');
    var xhr = $.ajax({
      url: 'https://gsheet-toolkit.small-service.gpeastasia.org/v1/db/tw-no-nuclear-message-board?sort=-created_at&q={"is_agree":"1"}&famous=true',
      method: 'get',
      headers: {
        'Access-Control-Expose-Headers': '*'
      },
      crossdomain: true,
      success:function(res, status, jqXHR){
        //console.log(jqXHR.getAllResponseHeaders())
        var data = res;
        //console.log(data)
        $('#celebrity').html('');
        for(var i = 0; i<data.records.length; i++){
          
          var temp = $('#msgFamousTemplate').html();
          var thisData = data.records[i];
          // console.log(thisData["is_agree"], thisData["job_title"], thisData["last_name"], thisData["first_name"], thisData["msg"]);
          temp = temp.replaceAll('{{id}}', String((i+1)));
          temp = temp.replaceAll('{{avatar}}', thisData["avatar_url"]);
          temp = temp.replaceAll('{{agree}}', thisData["is_agree"] === '0' ? 'o' : 'x');
          temp = temp.replaceAll('{{title}}', thisData["job_title"]);
          temp = temp.replaceAll('{{name}}', thisData["last_name"]+' '+thisData["first_name"]);
          if(thisData["is_agree"] === '0'){
            temp = temp.replaceAll('{{msg}}', '我同意核四續建。'+thisData["msg"]);
          }else{
            temp = temp.replaceAll('{{msg}}', '我不同意核四續建。'+thisData["msg"]);
          }
          if(i>0){
            $(temp).hide();
          }
          $('#celebrity').append($(temp));

        }
        updateCustomScroll();
      },
      error:function(err){
        console.log(err)
      },
    }).then(function(){
      randomCelebrity();
      $('.guestbook__loading--celebrity').removeClass('on');
    });
  }



  $(document).on('click', '.msg__another', function(e){
    e.preventDefault();
    var nowItem = $('.msg--celebrity:visible');
    $('.msg--celebrity').hide();
    if(nowItem.next().length > 0){
      nowItem.next().fadeIn();
    }else{
      $('.msg--celebrity').eq(0).fadeIn();
    }
  });

  

  $('.guestbook__prev, .guestbook__next').on('click', function(e){
    e.preventDefault();
    if($(this).hasClass('guestbook__next')){
      nowPage += 1;
      getComments(nowPage);
    }else{
      nowPage -= 1;
      if(nowPage<=0) nowPage = 0;
      getComments(nowPage);
    }
  });















  //nav
  
  $('.menu-btn').click(function(e){
    e.preventDefault();
    var menu = $('.nav')
    if(menu.hasClass('on')){
      menu.removeClass('on');
      $(this).removeClass('on');
      $(window).trigger('scroll');
    }else{
      menu.addClass('on');
      $(this).addClass('on');
    }
  });

  $('.scrollto').on('click', function(e){
    e.preventDefault();
    var goal = $($(this).attr('href')).offset().top;
    $('html,body').animate({scrollTop: goal});
    $('.menu-btn, .nav').removeClass('on');
  });

  var shareurl = window.location.href;
  if (navigator.share) {
    $('.share-fb-btn').on('click', function(e){
      e.preventDefault();
      
      navigator.share({
        title: $('title').text(),
        text: $('meta[name="description"]').attr('content'),
        url: window.location.href,
      })
        .then(() => console.log('成功！'))
        .catch((error) => console.log('發生錯誤', error));
    });
    
  }else{
    
    $('.share-fb-btn').attr('href', 'https://www.facebook.com/sharer/sharer.php?u='+shareurl);
  }



  
  

  //map slider
  var mapSlider = new Swiper('.map__container', {
    loop: true,
  });
  $('.map').one('click touchstart', function(){
    if(!$('.map').hasClass('nodelay')){
      $('.map').addClass('hide-hint');
    }
  });

  
  //power distribution slider
  var powerSliderInited = false;
  var powerSlider = new Swiper('#distributionSlider', {
    loop: true,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    speed: 800,
    autoplay:{
      delay: 3000,
      
    },
    navigation: {
      nextEl: '#distributionSlider .swiper-button-next',
      prevEl: '#distributionSlider .swiper-button-prev',
    },
    on: {
      afterInit: function () {
        this.autoplay.stop();
        powerSliderInited = true;
      },
    },
  });

  $(window).on('scroll', function(){
    var nowScroll = $(this).scrollTop();
    var uni = $('#choise').offset().top;
    //switch menu theme color
    if($('.wrap').hasClass('wrap--darkbg')){
        if((nowScroll < uni) && !$('.menu-btn').hasClass('menu-btn--sub')){
          $('.menu-btn').addClass('menu-btn--sub');
        }
        if((nowScroll >= uni) && $('.menu-btn').hasClass('menu-btn--sub')){
          $('.menu-btn').removeClass('menu-btn--sub');
        }
    }
    // show map hint
    if(nowScroll + $(window).height() >= $('.map').offset().top + $('.map__body').height() && !$('.map').hasClass('hide-hint')){
      setTimeout(function(){
        $('.map').addClass('hide-hint');
      }, 3000);
    }
    //start power distribution slider autoplay
    //console.log(powerSlider.autoplay.running)
    if(powerSliderInited && nowScroll + $(window).height()/2 > $('.distribution').offset().top){
      
      powerSlider.autoplay.start();
    }
  }).trigger('scroll');


  // custom scrollbar
  function updateCustomScroll(){
    $('.msg__container').each(function(item){
      new SimpleBar($(this)[0],{
        autoHide: false
      });
    });
  }
 





  // box
  $('#toAvatarBtn').click(function(e){
    e.preventDefault();
    $('.comment').hide();
    $('.avatars__upload').removeAttr('style').removeClass('avatars__upload--uploaded');
    $('.avatars__btn').eq(0).trigger('click');
    $('.comment--step2').fadeIn();
  });

  



  

  $('.avatars__btn').on('click', function(e){
    e.preventDefault();
    $('.avatars__item').removeClass('on');
    $(this).parent('.avatars__item').addClass('on');
  });

  // upload pic
  var avatarUrl = '';

  $(".avatars__file").change(function(){
    readURL(this);  
  });
  function readURL(input){
    if(input.files && input.files[0]){
      var reader = new FileReader();
      reader.onload = function (e) {
        $('.avatars__upload').addClass('avatars__upload--uploaded').css({
          'background-image': 'url(' + e.target.result + ')'
        });
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  $('#uploadBtn').click(function(e){
    e.preventDefault();
    $('.avatars__file').trigger('click');
    
  });

  
  var cl = new cloudinary.Cloudinary();
  var timestamp = Math.round((new Date).getTime()/1000);
  var sig = "eager=w_300,h_300,c_crop&folder=tw-playground&timestamp="+timestamp+"87pY0BM8ezCtTZ1YWWW-Gp4JAf0";
  //console.log(sig,sha1(sig) )
  var signData = {
    cloud_name: 'gpea',
    api_key: '267614719157871',
    api_secret: '87pY0BM8ezCtTZ1YWWW-Gp4JAf0',
    eager: "w_300,h_300,c_crop",
    timestamp: String(timestamp),
    signature: sha1(sig),
    secure: true
  };

  
  var cloudurl = "https://api.cloudinary.com/v1_1/gpea/auto/upload";
  
  $('.avatars__form').on('submit', function(e){
    e.preventDefault();
    showFullPageLoading();

    var files = $(this).find("[type=file]")[0].files;
    var formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      formData.append("file", file);
      formData.append("api_key", signData.api_key);
      formData.append("timestamp", signData.timestamp);
      formData.append("signature", signData.signature);
      formData.append("eager", signData.eager);
      formData.append("folder", "tw-playground");

      fetch(cloudurl, {
          method: "POST",
          body: formData
      })
      .then((response) => {
          hideFullPageLoading();
          return response.text();
      })
      .then((data) => {
          var res = JSON.parse(data)
          //console.log(res)
          avatarUrl = res.secure_url;
          //hideFullPageLoading();
          $('.comment').hide();
          $('.form__avatar').css({
            'background-image': 'url('+avatarUrl+')'
          });
          $('.form__avatar').attr('data-url', avatarUrl);
          $('.comment--step3').fadeIn();
      });
    }


  });

  

  $('#toFormBtn').click(function(e){
    e.preventDefault();
    if($('.avatars__item--custom').hasClass('on')){
      if($('.avatars__upload').hasClass('avatars__upload--uploaded')){
        $('.avatars__form').submit();
      }else{
        alert('請上傳圖片')
      }
      
    }else{
      avatarUrl = $('.avatars__item.on img').attr('src');
      $('.comment').hide();
      $('.form__avatar').css({
        'background-image': 'url('+avatarUrl+')'
      });
      $('.form__avatar').attr('data-url', avatarUrl);
      $('.comment--step3').fadeIn();
    }
    
  });
  $('#backBtn').click(function(e){
    e.preventDefault();
    $('.comment').hide();
    $('.comment--step3').fadeIn();
  });
  
  


  $('#vote').on('change', function(){
    var ans = $(this).find(':selected').text();
    $(this).prev('.form__select-val').text(ans);
  });

  $('#comment').on('keyup change', function(){
    if($(this).val().length>250) $(this).val($(this).val().slice(0, 250));
    $('#chrCounter').text($(this).val().length);
  });


  $('#submitBtn').click(function(e){
    e.preventDefault();

   // if($('#email').val().length>0) validateFileds.push('email');
    if(validate(['lastName2', 'firstName2'])){
      
      showFullPageLoading();

    

      // var fName = '';
      // var lName = '';

      // if($('#name').val() === $('#lastName').val() + $('#firstName').val()){
      //   fName = $('#firstName').val();
      //   lName = $('#lastName').val();
      // }else{
      //   fName = '';
      //   lName = $('#name').val();
      // }
      if($('#comment').val().length>250) $('#comment').val($('#comment').val().slice(0, 250));
      var thisData = [{
        "avatar_url": $('.form__avatar').attr('data-url'),
        "job_title": $('#career').val(),
        "first_name":$('#firstName2').val(),
        "last_name": $('#lastName2').val(),
        "email": (validate(['email'])) ? $('#email').val() : "",
        "is_agree": $('#vote').val(),
        "msg": $('#comment').val(),
        "created_at": formatDate(new Date())
        //"created_at": "2021/09/01 15:06:00"
      }];

      $('#email').next('.error-msg').hide();
      
      $.ajax({
        url: 'https://gsheet-toolkit.small-service.gpeastasia.org/v1/db/tw-no-nuclear-message-board',
        method: 'post',
        contentType: 'application/json',
        data: JSON.stringify(thisData),
        success:function(res){
          //console.log(res);
          nowPage = 0;
          getComments(nowPage);
          
          hideFullPageLoading();
          //$('.comment').hide();
          //$('.comment--del').fadeIn();
          alert('留言成功！');
          closeBox();
          
        },
        error:function(err){
          console.log(err)
          hideFullPageLoading();
          alert('送出失敗，請重試或聯絡我們。')
        },
      });
    
    }else{

    }


    
  });
  $('.lightbox__close, #deleteBtn').click(function(e){
    e.preventDefault();
    if($('#comment').val().length >0 && $('.comment--step3').is(":visible")) {
        $('.comment').hide();
        $('.comment--del').fadeIn();
    }else{
      closeBox();
    }
    
  });

  $('[data-box]').click(function(e){
    e.preventDefault();
    openBox($(this).attr('data-box'));
  });

  function openBox(id){
    $('.lightbox').hide();
    if(id === 'commentBox'){
      $('.comment').hide();
      $('.comment--step1').fadeIn();
      $('.form input, .form textarea').val('');
      $('#firstName2').val($('#firstName').val());
      $('#lastName2').val($('#lastName').val());
    }
    $('#'+id).stop().fadeIn();
  }
  function closeBox(){
    $('.lightbox').stop().fadeOut();
  }


  // share

  function switchStat(stat){
    $('.shot').attr('class', 'shot shot--' + stat);
    // $('.shot__title').attr('class', 'shot__title shot__title--' + stat);
    $('.shot__title').hide();
    $('.shot__title--' + stat).show();
    $('.shot__stat #stat').attr('class', 'stat-' + stat);
    $('.shot__stat #stat').text((stat==='agree')?'同意':'不同意');
    $('.shot__bg').attr('class', 'shot__bg shot__bg--' + stat);
    $('.sharepic').attr('class', 'sharepic sharepic--' + stat);
  }

  $(document).on('click', '.msg__share', function(e){
    e.preventDefault();
    var stat = $(this).hasClass('msg__share--o') ? 'agree':'disagree';
    var commentCont = $(this).closest('.msg');
    var commentText = commentCont.find('.msg__content').text().split((stat==='agree') ? '我同意核四續建。': '我不同意核四續建。')[1];
    $('.shot__name .title').text(commentCont.find('.msg__name .title').text());
    $('.shot__name .name').text(commentCont.find('.msg__name .name').text());
    var commentTextAry = commentText.split("");
    var newCommentText = "";
    for(var i = 0; i<commentTextAry.length; i++){
      newCommentText+="<span>"+commentTextAry[i]+"</span>";
    }
    $('.shot__comment').html(newCommentText);
    $('.shot__avatar').css('background-image', 'url('+commentCont.find('.msg__avatar').attr('data-url')+')')
    //$('.shot__avatar').css('background-image', 'url(https://cdn-icons-png.flaticon.com/512/147/147144.png)')
    switchStat(stat);


    var canvas = document.createElement('canvas');
    canvas.width = $('#shot').width();
    canvas.height = $('#shot').height();
    
    showFullPageLoading();

    var src = commentCont.find('.msg__avatar').attr('data-url');
    var image = new Image();
    image.addEventListener('load', function() {
      canvas.width = $('#shot').width();
    canvas.height = $('#shot').height();
      html2canvas($('#shot')[0],{
        scale: 1,
        logging: true,
        useCORS: true,
        logging: true,
      }).then(function(canvas2) {
        hideFullPageLoading();
        var ctx = canvas2.getContext('2d');
        ctx.font = '13px sans-serif';
        ctx.textAlign = 'left';
        //document.body.appendChild(canvas2);
        //console.log(ctx)
        $('#shareBox img').attr('src', canvas2.toDataURL("image/png"));
        
        openBox('shareBox');
      });
    });
    image.src = src;
    
    
  });

  function validate(fields){
    var errors = [];

    if(fields.indexOf('OptIn')>=0){
      if(!$('#OptIn').prop("checked")){
        errors.push({
          el: '#OptIn',
        });
        alert('請勾選同意個人資料政策');
      }
    }
    
    if(fields.indexOf('email')>=0){
      if($('#email').val().length <= 0){
        errors.push({
          el: '#email',
          msg: '必填'
        });
      }else if(!$('#email').val().match(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/i)){
        errors.push({
          el: '#email',
          msg: 'Email 格式錯誤'
        });
      }
    }

    if(fields.indexOf('lastName')>=0){
      if($('#lastName').val().length <= 0){
        errors.push({
          el: '#lastName',
          msg: '必填'
        });
      }
    }
    if(fields.indexOf('firstName')>=0){
      if($('#firstName').val().length <= 0){
        errors.push({
          el: '#firstName',
          msg: '必填'
        });
      }
    }

    if(fields.indexOf('lastName2')>=0){
      if($('#lastName2').val().length <= 0){
        errors.push({
          el: '#lastName2',
          msg: '必填'
        });
      }
    }
    if(fields.indexOf('firstName2')>=0){
      if($('#firstName2').val().length <= 0){
        errors.push({
          el: '#firstName2',
          msg: '必填'
        });
      }
    }

  
    

    if(errors.length>0){
      for(var i=0; i<errors.length; i++){
        $(errors[i].el).next('.error-msg').show().text(errors[i].msg);
      }
    }

    return (errors.length<=0);

  

    

  }

  $('input').on('focus', function(){
    $(this).next('.error-msg').hide();
  });

  // $('#firstName, #lastName').on('change', function(){
  //   console.log($('#lastName').val()+$('#firstName').val())
  //   $('#name').val($('#lastName').val()+$('#firstName').val());
  // });

  
  $('#edmBtn').on('click', function(e){
    e.preventDefault();
    
    if(validate(['email', 'lastName', 'firstName', 'OptIn'])){
      showFullPageLoading();
      var formData = new FormData();
			document.querySelectorAll("#mc-form input,select").forEach(function (el, idx) {
				let v = null
				if (el.type==="checkbox") {
					v = el.checked;
				} else {
					v = el.value;
				}

				formData.append(el.name, v);
				//console.log("Use", el.name, v);
			});

      fetch(document.querySelector("#mc-form").action, {
				method: 'POST',
				body: formData
			})
			.then(response => {console.log(response); return response.json()})
			.then(response => {            
				if (response) {              
					// hide the Form, display the thank you div
					alert('訂閱完成');
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
              'event': 'gaEvent',
              'eventCategory': 'mc-subscription',
              'eventAction': 'subscribe',
              'eventLabel': '2021-17sayno'
          });    
					if (response.Supporter) {
						// add tracking code here
						//console.log('successful');
					}
				}
				hideFullPageLoading();
			})
			.catch(error => {
				console.log(error);
				hideFullPageLoading();
				// display the error message                      
			});
    }
  });


  function showFullPageLoading(){
		if ( !document.querySelector("#page-loading")) {
			document.querySelector("body").insertAdjacentHTML('beforeend', `
				<div id="page-loading" class="hide">
				<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
				</div>`);
        }

        setTimeout(() => { // to enable the transition
          document.querySelector("#page-loading").classList.remove("hide")
        }, 0)
	}
    /**
     * Hide the full page loading
     */
    function hideFullPageLoading (){
		document.querySelector("#page-loading").classList.add("hide")

        setTimeout(() => {
          document.querySelector("#page-loading").remove()
        }, 1100)
	} 

});


function formatDate (current_datetime){
  let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
  return formatted_date;
}