/**
* Class provides all functionality for creating order
* @author: Nikita Kruchinkin
* @e-mail: nikita.kruchinkin@gmail.com
* @version: 0.2.0.0
* @date: 28.09.17
**/
var Order = {
  payment_status: false, // Payment status
  total: 0, // Curent total of order
  sub_total: 0, // Current sub_total of order
  payment_method: false, // Payment method code
  shipping_method: false, // Shipping method code
  
  
  /**
  * Initialization of Order cselass. 
  * Need to be called on window.ready to register all callbacks and hooks
  **/

  init: function() {
    console.log('order.init');
    
    Order = this; 
    
    Order.payment_method = $('input[name=payment_method]:checked').val();
    Order.shipping_method = $('input[name=shipping_method]:checked').val();


    
    // Choosing shipping method (delivery or pickup)
    $('.shipping__method').click(function(e){
      var code = $(this).data('shipping-code');

      Order.setShippingMethod(code);
      return false;
    });

    // Choosing payment method (delivery or pickup)
    $('.payment__method').click(function(e){
      var code = $(this).data('payment-code');
      Order.setPaymentMethod(code);
      return false;
    });
    
    $('#date').datetimepicker({
      language: 'ru',
      pickTime: false
    });
    
    $('.im--phone').mask('+7 (000) 000-00-00', {placeholder: "+7 (___) ___-__-__"});

    // Submitting order
    $('.order').submit(function(){
      console.log('submitting order');
      console.log(Order.shipping_method);
      
      $('.input--error').removeClass('input--error');
      $('.alert').remove();

      if ($('#firstname').val() == '') {
        Order.error('Поля "Имя" и "Телефон" обязательны для заполнения!');
        $('#firstname').addClass('input--error');
        return false;
      }
      
      if ($('#telephone').val() == '') {
        Order.error('Поля "Имя" и "Телефон" обязательны для заполнения!')
        $('#telephone').addClass('input--error');
        return false;
      }

      if ($('#telephone').val().length  != 18) {
        Order.error('Полe "Телефон" заполнено не коррертно!');
        $('#telephone').addClass('input--error');
        return false;
      }

      if (!Order.shipping_method) {
        Order.error('Выберите способ доставки!');
        return false;
      }

      if (!Order.payment_method) {
        Order.error('Выберите способ оплаты!');
        return false;
      }

      if (Order.shipping_method=='courier') {
        if ($('#city').val() == '' ||  $('#address').val() == '') {
          Order.error('Поля "Город" и "Адрес" обязательны для заполнения!');
          $('#city').addClass('input--error');
          $('#address').addClass('input--error');
          return false;
        }
        if ($('#date').val() == '') {
          Order.error('Укажите дату доставки!');
          $('#date').addClass('input--error');
          return false;
        }
      }
      
      if (!$('#shipping_date').val()) {
        $('#shipping_date').val(new Date());  
      }

      console.log('confirming...');
      
      $.ajax({
        method: 'POST',
        url: '/index.php?route=checkout/confirm',
        data: $('#order_form').serialize(),
        dataType: 'json',
        success: function (data) {
          console.log(data);
          if (!data.status) {
            $.each(data.errors, function(k,v) {
              Order.error(v);
            });
            return false;
          }
          order_id = data.order_id;
          if (!Order.payment_status) {
            payment_method=Order.payment_method;
            Order.paymentForm(payment_method, order_id);
            return false;
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
      });
      
      return false;
    });
  },
  
  paymentForm: function(method,order_id) {
    console.log('paymentForm: '+method+', order_id: '+order_id);
    
    $.ajax({ 
      type: 'get',
      url: '/index.php?route=extension/payment/'+method+'/confirm',
      success: function() {
        location = '/index.php?route=checkout/success';
      },
      error: function(xhr, ajaxOptions, thrownError) {
        alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
      }
    });
    
  },

  
  /**
  * Setting shipping method (delivery or pickup)
  * @param code - shipping method code
  */
  setShippingMethod: function(code) {
    console.log('setShippingMethod '+code);
    Order.shipping_method=code;
    $('#delivery-type').val(code);
    $.ajax({
      method: 'POST',
      url: '/index.php?route=checkout/checkout/setShippingMethod',
      data: {
        code: code,
      },
      dataType: 'json',
      success: function (data) {
        console.log(data);
        if (data.status) {
          $('#shipping_method').val(code);
          $('.shipping__method').removeClass('method__method--active');
          $('.shipping__method[data-shipping-code="'+code+'"]').addClass('method__method--active');
        } else {
          Order.error(data.error);  
        }
      },
    });
  },

  setPaymentMethod: function(code) {
    console.log('setPaymentMethod '+code);
    Order.payment_method=code;
    $.ajax({
      method: 'POST',
      url: '/index.php?route=checkout/checkout/setPaymentMethod',
      data: {
        code: code,
      },
      dataType: 'json',
      success: function (data) {
        console.log(data);
        if (data.status) {
          $('#payment_method').val(code);
          $('.payment__method').removeClass('method__method--active');
          $('.payment__method[data-payment-code="'+code+'"]').addClass('method__method--active');
        } else {
          Order.error(data.error);  
        }
      },
    });
  },

  /**
  * Setting shipping cost
  * @param zone_type - Type of the zone of delivery
  * @param cost - Cost of delivery to zone zone_type
  */
  setShippingCost: function(zone, cost) {
    console.log('set shipping cost');
  },

  // Counting totals of order
  countPrice: function() {
    console.log('countPrice');
    //Order.disableForm();
  },

  // Client select his address if exists
  selectAddress: function(id) {
    console.log('select address');
    //Order.disableForm();
    if (id!=-1) {
      $.ajax({
        method: 'POST',
        url: '/index.php?route=account/address/getAddress',
        data: {
          address_id: id,
        },
        dataType: 'json',
        success: function (json) {
          if (json.status) {
            address = json.address;
            form = $('.delivery-content[data-shipping-method="courier"]');
            form.find('#street').val(address.street);
            form.find('#house').val(address.house);
            form.find('#flat').val(address.room);
            form.find('#entrance').val(address.entrance);
            form.find('#floor').val(address.floor);
            form.find('#code').val(address.code);
            
            $('#street').trigger('change');
          }
          else Order.error('Ошибка при выбора адреса!');
        },
      });
    } else {
      form = $('.delivery-content--delivery');
      form.find('#street').val('');
      form.find('#house').val('');
      form.find('#flat').val('');
      form.find('#entrance').val('');
      form.find('#floor').val('');
      form.find('#code').val('');
    }
  },
  
  error: function(message) {
    console.log('error: '+message);
    $('.alert').remove();
    $('.page-content .container').prepend('<div class="alert alert-danger alert-dismissible">'+message+'</div>');
        $('body,html').animate({
            scrollTop: 0
        }, 400);
    },
  
  success: function(message) {
    console.log('success: '+message);
    $('.alert').remove();
    $('.page-content .container').prepend('<div class="alert alert-success alert-dismissible">'+message+'</div>');
        $('body,html').animate({
            scrollTop: 0
        }, 400);
  }
}

$(function (){
  console.log('pre-init');
  Order.init();
  console.log('after-init');
});
