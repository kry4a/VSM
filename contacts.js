var Contacts = {
  init: function() {
    console.log('Contacts.init');
    Contacts = this; 
    
    // Submitting order
    $('#contacts').submit(function(){
      console.log('submitting contacts');
      
      $('.input-group__input--error').removeClass('input-group__input--error');
      $('.alert').remove();

      var flag = true;

      if ($('#name').val() == '') {
        Contacts.error('Поля "Имя" и "Телефон" обязательны для заполнения!');
        $('#name').addClass('input-group__input--error');
        flag = false;
      }
      
      if ($('#phone').val() == '') {
        Contacts.error('Поля "Имя" и "Телефон" обязательны для заполнения!')
        $('#phone').addClass('input-group__input--error');
        flag = false;
      } else if ($('#phone').val().length  != 18) {
        Contacts.error('Полe "Телефон" заполнено не коррертно!');
        $('#phone').addClass('input-group__input--error');
        flag = false;
      }


      if ($('#enquiry').val().length < 10) {
        Contacts.error('Текст сообщения должен быть больше 10 символов!');
        $('#enquiry').addClass('input-group__input--error');
        flag = false;
      }

      if (!flag) return false;

      console.log('confirming...');
      
      $.ajax({
        method: 'POST',
        url: '/index.php?route=information/contact/send',
        data: $('#contacts').serialize(),
        dataType: 'json',
        success: function (data) {
          console.log(data);
          if (!data.status) {
            $.each(data.errors, function(k,v) {
              Contacts.error(v);
            });
            return false;
          } else {
            Contacts.complete();
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
      });
      
      return false;
    });
  },
  complete: function() {
    $('#name').val('');
    $('#phone').val('');
    $('#email').val('');
    $('#enquiry').val('');
    Contacts.success('Ваше сообщение отправлено! Мы ответим вам в ближайшее время.');
  },

  error: function(message) {
    console.log('error: '+message);
    $('.alert').remove();
    $('main .container').prepend('<div class="alert alert--error">'+message+'</div>');
        $('body,html').animate({
            scrollTop: 0
        }, 400);
    },
  
  success: function(message) {
    console.log('success: '+message);
    $('.alert').remove();
    $('main .container').prepend('<div class="alert alert--success">'+message+'</div>');
        $('body,html').animate({
            scrollTop: 0
        }, 400);
  }
}

$(function (){
  console.log('pre-init');
  Contacts.init();
  console.log('after-init');
});