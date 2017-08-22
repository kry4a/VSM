$(document).ready(function() {
    console.log('ready');

    var header = $('.header--small');
    var navbar = header.find('.navbar');
    
    $(window).scroll(function(){
      var scrollTop = $(window).scrollTop();
      var headerHeight = header.outerHeight();
      if (scrollTop>headerHeight) navbar.toggleClass('navbar--fixed')
    });

    $(".navbar__toggler").click(function(e){
      e.preventDefault();
      var target = $(this).data('target');
      var collapse = $(target);
      collapse.toggleClass('in');
    });

    console.log('collapse');

    $('.tabs__selector .tabs__link').click(function(e) {
      $('.tabs__selector .tabs__tab').removeClass('tabs__tab--active');
      $('.tabs__content .tab__content').removeClass('tab__content--active');
      $(this).parent().addClass('tabs__tab--active');
      var currentTab = $(this).attr('href');
      $(currentTab).addClass('tab__content--active');
      e.preventDefault();
    });


    $('.flexslider').flexslider({
      animation: "slide",
      controlNav: "thumbnails",
      directionNav: false
    });
    
    ymaps.ready(init);
    function init () {
      map_office = new ymaps.Map('map--office', {
        center:[59.8632, 30.37619], 
        zoom:14
      });
      map_office.behaviors.disable(['rightMouseButtonMagnifier'])
      map_office.controls.add(
        new ymaps.control.ZoomControl()
      );
      
      map_service = new ymaps.Map('map--service', {
        center:[59.8632, 30.37619], 
        zoom:14
      });
      map_service.behaviors.disable(['rightMouseButtonMagnifier'])
      map_service.controls.add(
        new ymaps.control.ZoomControl()
      );
      
      office_mark = new ymaps.Placemark([59.8587, 30.37619], {
        balloonContentBody: '<p style="margin-bottom:5px;">Центральный офис ПК ВСМ</p><p style="font-size:12px; margin-bottom:5px;">ул. Некрасова д.60 пом. 44Н</p>', 
        hintContent: 'Центральный офис ПК ВСМ'
      }, {
        preset: 'twirl#blueStretchyIcon'
      });
      map_office.geoObjects.add(office_mark);
      office_mark.balloon.open();
      
      service_mark = new ymaps.Placemark([59.8587, 30.37619], {
        balloonContentBody: '<p style="margin-bottom:5px;">Сервисный центр</p><p style="font-size:12px; margin-bottom:5px;">пл. Морской Славы, д.1</p>',
        hintContent: 'Сервисный центр<'
      }, {
        preset: 'twirl#blueStretchyIcon'
      });

      map_service.geoObjects.add(service_mark);
      service_mark.balloon.open();
    }
});