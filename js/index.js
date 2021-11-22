$(document).ready(function(){
  var loaded = 0;
  var fakeLoad = setInterval(function(){
    loaded += 20;
    if(loaded>=100){
      clearInterval(fakeLoad);
      $('.loadingbar__bar').addClass('loaded').css({
        "width":"100%"
      });
      $('.loadingbar__text').text('Done...');
      setTimeout(function(){
        transitionScene($('.index__container--loading'), $('.index__container--loaded'));
        
      }, 600);
      
      return;
    }
    $('.loadingbar__bar').css({
      "width": loaded+"%"
    });
  }, 200);

  

  $('#agree, #disagree, #agreeBtn, #disagreeBtn').on('click', function(e){
    e.preventDefault();
    if(!$('.index__options').is(":visible")) return;
    var agree = $(this).attr('data-ans') === 'yes';
    //console.log($(this).attr('data-ans'),agree)
    //var direction = '';
    $('.index__house').removeClass('on');
    
    $('.index__here').hide();
    if(agree){
      $('.index__house--2').addClass('on');
      $('#people').addClass('walk-right');
      $('#ans').addClass('ansed agree').text('同意');
      // $('.bubble__option').css({
      //   'background-position': ($('.bubble__option').width() * -1) + 'px 0'
      // });
    }else{
      $('.index__house--1').addClass('on');
      $('#people').addClass('walk-left');
      $('#ans').addClass('ansed disagree').text('不同意');
      // $('.bubble__option').css({
      //   'background-position': ($('.bubble__option').width() * -2) + 'px 0'
      // });
    }
    var end = agree ? 77.6 : 19.7;
    var speed = agree ? 1.5 : -1.5;
    var pos = parseInt($('#people').css('left')) / $('.index').width() * 100;
    var walkCounter = setInterval(function(){
      var newPos = Number(pos + speed);
      $('#people').css({
        'left': newPos + '%'
      });
      pos = newPos;
      if(agree){
        if(newPos >= end){
          $('#people').removeClass('walk-right');
          clearInterval(walkCounter);
          $('.index__container').addClass('sceneout');
          transToPage(agree);
        }
      }else{
        if(newPos <= end){
          $('#people').removeClass('walk-left');
          clearInterval(walkCounter);
          $('.index__container').addClass('sceneout');
          transToPage(agree);
        }
      }
      
    },40);
    
  });

  $('.index').on('introend',function(){
    bubbleSquence();
    
  });

  function transitionScene(from, to){
    from.addClass('sceneout');
    setTimeout(function(){
      from.hide();
      to.show();
      to.addClass('scenein');
      if(to.is('.index__container--loaded')) $('.index').trigger('introend');
    }, 800);
    to.one('animationend', function(){
      to.removeClass('scenein')
    });
  }

  function bubbleSquence(){
    $(document).one('click', function(){
      $('#bubble1').removeClass('on');
      setTimeout(function(){
          $('.index__title--intro').addClass('index__title--wait');
          $('.index__logo').fadeOut(300);
          $('#bubble2').addClass('on');
      },1000);
      setTimeout(function(){
        $('.index__here, .index__options').fadeIn(300);
        
      }, 1000+500);
    });
    // setTimeout(function(){
    //   $('#bubble1').removeClass('on');
      
      
    // }, 1750);
    // setTimeout(function(){
    //   $('.index__title--intro').addClass('index__title--wait');
    //   $('.index__logo').fadeOut(300);
    //   $('#bubble2').addClass('on');

    // }, 1750+1000);
    // setTimeout(function(){
    //   $('.index__here, .index__options').fadeIn(300);
      
    // }, 1750+1000+500);
  }

  function transToPage(agree){
    setTimeout(function(){
      location.href = agree ? './agree.html' : './disagree.html';
    }, 600);
  }

});

