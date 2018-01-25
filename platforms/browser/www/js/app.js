// Dom7
var $$ = Dom7;
var now = moment();
var offset = 0, limit = 5;


// Framework7 App main instance
var app  = new Framework7({
  swipePanel : 'left',
  root: '#app', // App root element
  id: 'io.comgtech.loadwallet', // App bundle ID
  name: 'About', // App name
  theme: 'auto', // Automatic theme detection
    animatePages:false,
  // App root data
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      }
    };
  },
  // App root methods
  methods: {

    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,
});



document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    StatusBar.show();
}
// Init/Create views

// Add view

var mainView = app.views.create('.view-main',{});


function modal(title, message, color, callback){
  var modal = $$('#modal');
  $$('#modal .modal-header').addClass(color);
  $$('#modalTitle').html(title);
  $$('#modalContent').html(message);
  // Display the modal
  modal.show();
  //Hide modal when button is clicked
  $$('#btnModalClose').on('click', function(){
      modal.hide();
      callback();
  });
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
        modal.hide();
      }
  }
}

var submitLogin = function(){
  $$('.page[data-name="login"]').find('#login-form').hide();
  $$('.page[data-name="login"]').find('#login-preloader').show();

  //Submit login request
  var username = $$('.page[data-name="login"]').find('#txt-login-username').val() +'';
  var password = $$('.page[data-name="login"]').find('#txt-login-password').val() +'';
  app.request.setup({ 
      headers:{
        'Authorization':'Basic '+btoa(username+':'+password)
      }
    });
  
  app.request.get('http://192.168.2.150:8083/auth/login/',
   function (data) {
      console.log(data);

      $$('.page[data-name="login"]').find('#login-preloader').hide();
      $$('.page[data-name="login"]').find('#login-form').show();

      var obj = JSON.parse(data);
      if(obj.code=='0'){
        localStorage.username = obj.user.userName;
        localStorage.parentId = obj.user.parent;
        localStorage.name = obj.user.firstName+' '+obj.user.lastName;
        localStorage.loginToken = obj.accessToken;
        localStorage.email = obj.user.email;
        localStorage.balance = obj.user.balance.toFixed(2);
        app.router.navigate('/reload/', null);
      }


    },
    function(xhr, status){

      $$('.page[data-name="login"]').find('#login-preloader').hide();
      $$('.page[data-name="login"]').find('#login-form').show();
      if(status==401){
        modal('Login Failed','Invalid username or password.','danger', function(){});
      }else{
        modal('Login Failed','Unable to login.','danger', function(){});
      }
    });
}

var drawerItemSelected = '#drawer-item-reload';

function drawerItemCliked(id){

    app.panel.close('left',true);

    if(drawerItemSelected != id){
        $$(drawerItemSelected).removeClass('drawer-item-active');
        $$(id).addClass('drawer-item-active');
    }
    else if ( $$(id).hasClass('drawer-item-active') ){

    }
    else
        $$(id).addClass('drawer-item-active');

    drawerItemSelected = id;
}

function getHistory(page){
    app.dialog.preloader('Please wait...');
    app.request.setup({ 
        headers:{
          'Authorization':'Bearer '+localStorage.loginToken
        }
    });
    app.request.post('http://192.168.2.150:8083/reloads/transactions/',
      {
        offset: offset,
        limit: limit
      },

     function (data) {
      app.dialog.close();

        var obj = JSON.parse(data);
        if(Object.keys(obj)<=0){
          page.$el.find('#history-transaction-list').html('<b>No queue found</p>');
          return;
        }

        //set data on list
        var list='';

        //iterate data list
        obj.forEach(function(val, index) {
          var product = "";
            if(val.Plancode){
              product = val.Plancode.name;
            }
              list+='<li>'
              list+='  <a href="#" id="history-transaction-item-'+val.tranId+'" class="item-link item-content">'
              list+='    <div class="item-inner">'
              list+='      <div class="item-title-row">'
              list+='        <div class="item-title"><b>'+val.target+'</b></div>'
              list+='        <div class="item-after">'+moment(val.tranDate).format('MMM Do h:mm A')+'</div>'
              list+='      </div>'
              list+='      <div class="item-subtitle">'+product+'</div>'


              list+='      <div class="item-text">'+val.message+'</div>'
              list+='    </div>'
              list+='  </a>'
              list+='</li>'

              page.$el.find('#history-transaction-item-'+val.tranId).on('click', function () {
                app.dialog.alert('Selected');
              });
        });

        list+='';

        page.$el.find('#history-transaction-list').append(list);
      },
      function(xhr, status){

        app.dialog.close();
        modal( 'Request Failed', 'Failed to get history. Please try again later.');
        
      });
      
}

$$(document).on('click', '#drawer-item-reload', function (e) {
  //  app.router.navigate('/', null);
    drawerItemCliked('#drawer-item-reload');
    app.params.swipePanel = true;
});
$$(document).on('click', '#drawer-item-history', function () {
  //  app.router.navigate('/history/', null);
    drawerItemCliked('#drawer-item-history');
});

$$(document).on('click', '#drawer-item-change-password', function () {
   // app.router.navigate('/change-password/', null);
    drawerItemCliked('#drawer-item-change-password');
});
$$(document).on('click', '#drawer-item-change-pin', function () {
   // app.router.navigate('/change-pin/', null);
    drawerItemCliked('#drawer-item-change-pin');
});
$$(document).on('click', '#drawer-item-settings', function () {
   // app.router.navigate('/settings/', null);
    drawerItemCliked('#drawer-item-settings');
});
$$(document).on('click', '#drawer-item-balance', function () {
   // app.router.navigate('/balance/', null);
    drawerItemCliked('#drawer-item-balance');
});

$$(document).on('click', '#drawer-item-login', function () {
    //app.router.back('/', {history:false});


    app.dialog.preloader('Please wait...');
    //Submit logout request
    app.request.setup({ 
        headers:{
          'Authorization':'Bearer '+localStorage.loginToken
        }
      });
    
    app.request.get('http://192.168.2.150:8083/auth/logout/',
     function (data) {
        app.router.navigate('/', {history:false});
        console.log(data);
        localStorage.username =null;
        localStorage.parentId = null;
        localStorage.name = null;
        localStorage.loginToken = null;
        localStorage.email = null;
        localStorage.balance = null;
        app.dialog.close();
      
      },
      function(xhr, status){
        app.router.navigate('/', {history:false});
        app.dialog.close();
      });

    drawerItemCliked('#drawer-item-login');

});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
  // Do something here when page loaded and initialized



  var page =e.detail;
  console.log(page.name+' initialized' );
  
  if(page.name == 'login'){
      page.$el.find('#txt-login-mpin-container').hide()
      app.params.swipePanel = false;
      page.$el.find('#link-privacy-policy').on('click', function () {
        cordova.InAppBrowser.open('https://loadwallet.com/#!/mobile/privacy-policy', '_system', 'location=no');
      })
      page.$el.find('#link-terms').on('click', function () {
        cordova.InAppBrowser.open('https://loadwallet.com/#!/mobile/terms-and-condition', '_system', 'location=no');
      })

      page.$el.find('#btn-sign-in').on('click', function(){
        submitLogin();
      })
      //Switch Sms Mode
      var chk_sms_mode = $$('.page[data-name="login"]').find('#chk-sms-mode');
      page.$el.find('#btn-sms-mode').on('click', function () {
          var sms_mode = chk_sms_mode.prop('checked');
          chk_sms_mode.attr({checked:!sms_mode});

          var username = page.$el.find('#txt-login-username-container')
          var password = page.$el.find('#txt-login-password-container')
          var mpin = page.$el.find('#txt-login-mpin-container')
          if(sms_mode){
            mpin.hide();
            username.show();
            password.show();
          }else{
            mpin.show();
            username.hide();
            password.hide(); 
          }
      })
  }else if(page.name == 'forgot-password'){

    page.$el.find('#btn-submit').on('click', function () {

      var username = page.$el.find('#txt-username').val() +'';

      app.dialog.preloader('Please wait...');

      app.request.post('http://192.168.2.150:8083/auth/forgot/',
        {
         username: username
        },
       function (data) {
        app.dialog.close();
          console.log(data);

          var obj = JSON.parse(data);
          if(obj.code=='0000'){
            app.dialog.alert('An email has been sent to '+obj.sentEmail+' with further instructions.','Success');
          }else if(obj.code=='9902'){
            app.dialog.alert('Username is invalid.','Request Failed');
          }
        },
        function(xhr, status){

          app.dialog.close();
          app.dialog.alert('Unable to send request.','Request Failed');
          
        });
    
    });

  }else if(page.name == 'reload'){

    var pickerType =  app.picker.create({
      inputEl: '#select-product-type',
      $inputEl: '#select-product-type',
      cols: [
        {
          textAlign: 'center',
          values: ['All network', 'All out Surf', 'All text', 'Big Bytes', 'Call & Text Combo', 'Call & Text Unlimited', 'Flexi Max', 'Gaan text', 'Smart Regular Load']
        }
      ]
    });

    var pickerDenom = app.picker.create({
      inputEl: '#select-product-amount',
      cols: [
        {
          textAlign: 'center',
          values: ['All Text 60', 'All Text Plus', 'All text 10']
        }
      ]
    });

    
    $$('#txt-user-name').html(localStorage.name);
    $$('#txt-user-info').html(localStorage.username+' | '+localStorage.email);
    page.$el.find('#btn-submit').on('click', function () {
      // Preloader
        app.dialog.preloader();
        setTimeout(function () {
          app.dialog.close();
        }, 200);
    })
  
  }else if(page.name == 'history'){



    page.$el.find('#btn-load-more-history').on('click', function () {
      // Preloader
      offset+=5;
      getHistory(page);


    })

    page.$el.find('#btn-submit').on('click', function () {
      // Preloader
        app.dialog.preloader();
        setTimeout(function () {
          app.dialog.close();
        }, 200);
    })
  
  }else if(page.name == 'balance'){

    page.$el.find('#txt-user-balance').html(localStorage.balance);
    page.$el.find('#txt-user-balance-date').html(localStorage.balance_date);

     page.$el.find('#btn-submit').on('click', function () {
        // Preloader
          app.dialog.preloader('Please wait...');
          app.request.setup({ 
              headers:{
                'Authorization':'Bearer '+localStorage.loginToken
              }
          });
          app.request.get('http://192.168.2.150:8083/account/balance/',
           function (data) {
            app.dialog.close();
              console.log(data);

              var obj = JSON.parse(data);
              if(obj.code=='0'){
                localStorage.balance = obj.balance.toFixed(2);
                localStorage.balance_date = now.format('MMM D YYYY, h:mm A');
                page.$el.find('#txt-user-balance').html(obj.balance.toFixed(2));
                page.$el.find('#txt-user-balance-date').html(now.format('MMM D YYYY, h:mm A'));
              }
            },
            function(xhr, status){

              app.dialog.close();
              app.dialog.alert('Unable to get balance.','Request Failed');
              
            });
      })
  
  }else if(page.name == 'change-pin'){

    page.$el.find('#btn-submit').on('click', function () {

      var current_mpin = page.$el.find('#txt-current-mpin').val() +'';
      var new_mpin = page.$el.find('#txt-new-mpin').val() +'';
      var confirm_mpin = page.$el.find('#txt-confirm-mpin').val() +'';

    

      if(current_mpin.length<4){
        app.dialog.alert('Current MPIN is too short.','Opss');
        return;
      }

      if(new_mpin.length<4){
        app.dialog.alert('New MPIN is too short.','Opss');
        return;
      }

      if(new_mpin == current_mpin){
        app.dialog.alert('Please provide new mpin.','Opss');
        return;
      }

      if(new_mpin!=confirm_mpin){
        app.dialog.alert('MPIN did not match.','Opss');
        return;
      }

      app.dialog.preloader('Please wait...');
      app.request.setup({ 
          headers:{
            'Authorization':'Bearer '+localStorage.loginToken
          }
      });

      app.request.post('http://192.168.2.150:8083/account/changepin/',
        {
         current_mpin: current_mpin,
         new_mpin: new_mpin 
        },
       function (data) {
        app.dialog.close();
          console.log(data);

          var obj = JSON.parse(data);
          if(obj.code=='0'){

            app.dialog.alert('Successfully changed mpin.','Change Pin Successful');
          }else if(obj.code=='9903'){
            app.dialog.alert('Current mpin is invalid.','Request Failed');
          }
        },
        function(xhr, status){

          console.log(xhr)

          app.dialog.close();
          app.dialog.alert('Unable to chnage pin.','Request Failed');
          
        });
      page.$el.find('#txt-current-mpin').val('');
      page.$el.find('#txt-new-mpin').val('');
      page.$el.find('#txt-confirm-mpin').val('');
    
    });
      
  }else if(page.name == 'change-password'){
     var page = page.$el;
      page.find('#btn-submit').on('click', function () {

        var currentPassword = page.find('#txt-current-password').val() +'';
        var newPassword = page.find('#txt-new-password').val() +'';
        var verifyPassword = page.find('#txt-new-verify').val() +'';


        if(newPassword.length<4){
          app.dialog.alert('New password is too short.','Opss');
          return;
        }
        if(newPassword == currentPassword){
          app.dialog.alert('Please provide new password.','Opss');
          return;
        }

        if(newPassword!=verifyPassword){
          app.dialog.alert('Password did not match.','Opss');
          return;
        }


        app.dialog.preloader('Please wait...');
        app.request.setup({ 
            headers:{
              'Authorization':'Bearer '+localStorage.loginToken
            }
        });
        app.request.post('http://192.168.2.150:8083/account/changepassword/',
          {
           currentPassword: currentPassword,
           newPassword: newPassword ,
           verifyPassword: verifyPassword
          },
         function (data) {
          app.dialog.close();
            console.log(data);

            var obj = JSON.parse(data);
            if(obj.code=='0'){

              modal('Change Password Successful', 'Successfully changed password. Click OK to login again.', 'success',  function(){
                app.router.navigate('/', null);
              });
            }else if(obj.code=='9903'){
             modal('Request Failed', 'Current password is invalid.','danger',function(){});
            }
          },
          function(xhr, status){
            app.dialog.close();
             modal('Request Failed', 'Unable to change password.','danger',function(){});
          });
        page.find('#txt-current-password').val('');
        page.find('#txt-new-password').val('');
        page.find('#txt-new-verify').val('');
    
      });
  }

})



/* Modal */


function openModal(modalId, buttonId){
  // Display the modal
  $$(modalId).show();
  //Hide modal when button is clicked
  $$(buttonId).on('click', function(){
      $$(modalId).hide();
  });
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == $$(modalId)) {
        $$(modalId).hide();
      }
  }
}



