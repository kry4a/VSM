

$(document).ready(function() {
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
        balloonContentBody: '<p>Содержимое метки</p>', 
        hintContent: 'Стандартный значок метки'
      }, {
        preset: 'twirl#blueStretchyIcon'
      });
      map_office.geoObjects.add(office_mark);
      office_mark.balloon.open();
      
      service_mark = new ymaps.Placemark([59.8587, 30.37619], {
        balloonContentBody: '<p>Содержимое метки</p>', 
        hintContent: 'Стандартный значок метки'
      }, {
        preset: 'twirl#blueStretchyIcon'
      });
      map_service.geoObjects.add(service_mark);
      service_mark.balloon.open();
    }
});