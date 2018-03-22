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
  touch: {
    materialRipple:false
  }, 
  toast: {
    closeTimeout: 2000,
    closeButton: false,
  },
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

// Create bottom toast
var toastBottom = app.toast.create({
  text: 'toast',
  closeTimeout: 2000,
});

 var pickerType = null, pickerDenom = null, telcoPrefixes = [], telcoPlancodes = []


document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    StatusBar.show();
}
// Init/Create views

// Add view

var mainView = app.views.create('.view-main',{});

function hasInternet(){

    if(!window.navigator.onLine){
      modal('Request Failed', 'No internet connection.','danger',function(){});
      return false;
    }
    return true;
}

function modal(title, message, color, callback){
  var modal = $$('#modal');
  modal.find('#modal-header').addClass(color);
  modal.find('#modalTitle').html(title);
  modal.find('#modalContent').html(message);
  // Display the modal
  modal.show();
  //Hide modal when button is clicked
  modal.find('#btnModalClose').on('click', function(){
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


function reloadsModal(el,title, message, isSuccess, callback){
    var modal = $$('#reloadsModal');
    var content = modal.find('modal-content');
    if(isSuccess)
    modal.find('#icon').attr({
      src:'../img/icons/ic_check.png'
    })
    modal.find('#modalTitle').html(title);
    modal.find('#modalContent').html(message);
    // Display the modal
    modal.show();
    //Hide modal when button is clicked
   modal.find('#btnModalClose').on('click', function(){
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

function vewReload(el,title, message, reload, callback){
    var modal = $$(el);
    var content = modal.find('modal-content');
    if(reload.code==0)
    modal.find('#icon').attr({
      src:'../img/icons/ic_check.png'
    })
    modal.find('#modalTitle').html(title);
    modal.find('#modalDescription').html(message);
    //modal.find('#modalContent').html(message);
    var product = "";
            if(reload.Plancode){
              product = reload.Plancode.name;
            }
    var table_reload='';
     table_reload+='<table class="reloads-table" style="text-align: left; color: #757575;" id="reloads-table"> ';
      table_reload+='  <tr>';
      table_reload+='    <td><b>Transaction ID</b></td>';
      table_reload+='    <td style="text-align: center;">'+reload.tranId+'</td>';
      table_reload+='  </tr>';
      table_reload+='  <tr>';
      table_reload+='    <td>Target</td>';
      table_reload+='    <td style="text-align: center;">'+reload.target+'</td>';
      table_reload+='  </tr>';
      table_reload+='  <tr>';
      table_reload+='    <td>Product</td>';
      table_reload+='    <td style="text-align: center;">'+product+'</td>';
      table_reload+='  </tr>';
      table_reload+='  <tr>';
      table_reload+='    <td>Charge</td>';
      table_reload+='    <td style="text-align: center;">PHP '+reload.charge+'</td>';
      table_reload+='  </tr>';
      table_reload+='  <tr>';
      table_reload+='    <td>Updated Balance</td>';
      table_reload+='    <td style="text-align: center;">PHP '+reload.balance+'</td>';
      table_reload+='  </tr>';
      table_reload+='  <tr>';
      table_reload+='    <td>Reference No</td>';
      table_reload+='    <td style="text-align: center;">'+reload.referenceNumber+'</td>';
      table_reload+='  </tr>';
       
      table_reload+='</table>';
      modal.find('#modalContent').html(reload);
    
    // Display the modal
    modal.show();
    //Hide modal when button is clicked
   modal.find('#btnModalClose').on('click', function(){
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
  
  app.request.get('http://13.229.80.248:8083/auth/login/',
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
        modal('Login Failed','Unable to login. Please try again later.','danger', function(){});
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



function reload(page, data){

 


    app.dialog.preloader('Please wait...');
    app.request.setup({ 
        headers:{
          'Authorization':'Bearer '+localStorage.loginToken
        }
    });
    app.request.post('http://13.229.80.248:8083/reloads/',data,

     function (result) {

        var obj = JSON.parse(result);
        if(Object.keys(obj)<=0){
          modal( 'Request Failed', 'Failed to get history. Please try again later.','danger',function(){});
          return;
        }
        console.log(obj)
        var val = obj;

       if(('referenceNumber' in val) && val.referenceNumber==null){
        val.referenceNumber = val.customRefNo 
       }
       
       if(val.referenceNumber==null){
          val.referenceNumber = 'n/a';
       }

       var title = "Reload Failed";
       if(val.code==0)
          title ="Reload Successful";


       var table_reload='';
       table_reload+='<table class="reloads-table" style="text-align: left; color: #757575;" id="reloads-table"> ';
        table_reload+='  <tr>';
        table_reload+='    <td><b>Transaction ID</b></td>';
        table_reload+='    <td style="text-align: center;">'+val.tranId.toUpperCase()+'</td>';
        table_reload+='  </tr>';
        table_reload+='  <tr>';
        table_reload+='    <td>Target</td>';
        table_reload+='    <td style="text-align: center;">'+val.target+'</td>';
        table_reload+='  </tr>';
        table_reload+='  <tr>';
        table_reload+='    <td>Product</td>';
        table_reload+='    <td style="text-align: center;">'+page.$el.find("#select-product-amount").val()+'</td>';
        table_reload+='  </tr>';
        table_reload+='  <tr>';
        table_reload+='    <td>Charge</td>';
        table_reload+='    <td style="text-align: center;">PHP '+val.charge+'</td>';
        table_reload+='  </tr>';
        table_reload+='  <tr>';
        table_reload+='    <td>Updated Balance</td>';
        table_reload+='    <td style="text-align: center;">PHP '+val.balance+'</td>';
        table_reload+='  </tr>';
        table_reload+='  <tr>';
        table_reload+='    <td>Reference No</td>';
        table_reload+='    <td style="text-align: center;">'+val.referenceNumber+'</td>';
        table_reload+='  </tr>';
         
        table_reload+='</table>';
        vewReload('#transactionReloadsModal', title, val.message, table_reload,function(){});

        app.dialog.close();

        page.$el.find("#reloads-target").val('')
        page.$el.find("#select-product-type").val('Select Type')
        page.$el.find("#select-product-amount").val('Select Amount')

       
      },
      function(xhr, status){
        app.dialog.close();

        if(status==401){
          return sessionExpired();
        }
        modal( 'Request Failed', 'Failed to get history. Please try again later.','danger',function(){});
        
      });
      
}

function showReloadStatus(val){
    if(('referenceNumber' in val) && val.referenceNumber==null){
        val.referenceNumber = val.customRefNo 
       }

       if(val.referenceNumber==null){
          val.referenceNumber = 'n/a';
       }
       var product = 'Invalid'

       if(val.Plancode)
        product = val.Plancode.name

      var tranDate = moment("2018-03-21T06:47:11.000Z").format("MMM D, YYYY hh:mm:ss A");

        var table_reload='';
       table_reload+='<table class="reloads-table" style="font-size:0.9em; text-align: left; color: #757575;" id="reloads-table"> ';
        table_reload+='  <tr>';
        table_reload+='    <td>Transaction ID</td>';
        table_reload+='    <td style="text-align: center;">'+val.tranId.toUpperCase()+'</td>';
        table_reload+='  </tr>';
        table_reload+='  <tr>';
        table_reload+='    <td>Target</td>';
        table_reload+='    <td style="text-align: center;">'+val.target+'</td>';
        table_reload+='  </tr>';
        table_reload+='  <tr>';
        table_reload+='    <td>Product</td>';
        table_reload+='    <td style="text-align: center;">'+product+'</td>';
        table_reload+='  </tr>';
        table_reload+='  <tr>';
        table_reload+='    <td>Charge</td>';
        table_reload+='    <td style="text-align: center;">PHP '+val.charge+'</td>';
        table_reload+='  </tr>';
        table_reload+='  <tr>';
        table_reload+='    <td>Updated Balance</td>';
        table_reload+='    <td style="text-align: center;">PHP '+val.balance+'</td>';
        table_reload+='  </tr>';
        table_reload+='  <tr>';
        table_reload+='    <td>Reference No</td>';
        table_reload+='    <td style="text-align: center;">'+val.referenceNumber+'</td>';
        table_reload+='  </tr>';
        table_reload+='  <tr>';
        table_reload+='    <td>Date & Time</td>';
        table_reload+='    <td style="text-align: center;">'+tranDate+'</td>';
        table_reload+='  </tr>';
         
        table_reload+='</table>';
        var div = document.createElement("div");
        div.insertAdjacentHTML( 'beforeend', table_reload );

        var icon = 'error'
        if(val.code==0)
          icon = 'success'
        else if(val.code==10)
          icon = 'info'

        swal({
          title: 'Reload Status',
          icon: icon,
          text: val.message,
          content: div
        })
        console.log(val)


}


function getReload(page, tranId){
  console.log(tranId)
  if(!tranId || tranId==null){
    return  modal( 'Required', 'Transaction id or reference number is required.','danger',function(){});
  }

    app.dialog.preloader('Please wait...');
    app.request.setup({ 
        headers:{
          'Authorization':'Bearer '+localStorage.loginToken
        }
    });
    app.request.get('http://13.229.80.248:8083/reloads/'+tranId,

     function (data) {
      app.dialog.close();

        var obj = JSON.parse(data);
        if(Object.keys(obj)<=0){
          modal( 'Transaction not found', 'No transaction found.','danger',function(){});
          return;
        }
        console.log(obj)

        showReloadStatus(obj)
       
      },
      function(xhr, status){
        app.dialog.close();
        console.log(xhr)
        if(status==401){
          return sessionExpired();
        }

        var obj = JSON.parse(xhr.responseText);
        if(obj.code=='9999'){

          modal( 'Transaction not found', 'No transaction found.','danger',function(){});
        }else
        modal( 'Request Failed', 'Failed to get history. Please try again later.','danger',function(){});
        
      });
      
}

function getHistory(page){
    app.dialog.preloader('Please wait...');
    app.request.setup({ 
        headers:{
          'Authorization':'Bearer '+localStorage.loginToken
        }
    });
    app.request.post('http://13.229.80.248:8083/reloads/transactions/',
      {
        offset: offset,
        limit: limit
      },

     function (data) {
      app.dialog.close();

        var obj = JSON.parse(data);
        if(Object.keys(obj)<=0){
          // Display an error toast, with a title
          toast('End of record');
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


            var reloadDate = moment(val.tranDate);
            var today = moment();
            var diff = today.diff(reloadDate, 'days') // 1
            var tranDate = moment(val.tranDate).format('MMM D h:mm A');

            if(reloadDate.isSame(today, 'd'))
              tranDate = moment(val.tranDate).fromNow();
            if(reloadDate.year()!=today.year())
              tranDate = moment(val.tranDate).format('MMM D, YYYY h:mm A');

           
              list+='<li>'
              list+='  <a href="#" id="history-transaction-item-'+val.tranId+'" class="item-link item-content" >'
              list+='    <div class="item-inner">'
              list+='      <div class="item-title-row">'
              list+='        <div class="item-title"><b>'+val.target+'</b></div>'
              list+='        <div class="item-after">'+tranDate+'</div>'
              list+='      </div>'
              list+='      <div class="item-subtitle">'+product+'</div>'


              list+='      <div class="item-text">'+val.message+'</div>'
              list+='    </div>'
              list+='  </a>'
              list+='</li>'


             
             // $$('#history-transaction-item-'+val.tranId).off('click');
              //$$('#history-transaction-item-'+val.tranId).on('click', listenerFn);
            //  $$('#history-transaction-item-'+val.tranId).on('click', listenerFn);

            function clickHandler(){
              showReloadStatus(val)
            }
              $$(document).off('click','#history-transaction-list');

              $$(document).on('click','#history-transaction-item-'+val.tranId,clickHandler);
        });

        list+='';

        page.$el.find('#history-transaction-list').append(list);
      },
      function(xhr, status){
        app.dialog.close();
        if(status==401){
          return sessionExpired();
        }
        modal( 'Request Failed', 'Failed to get history. Please try again later.','danger',function(){});
        
      });
      
}

         
          function removeAllListeners(node, event) {
              if(node in _eventHandlers) {
                  var handlers = _eventHandlers[node];
                  if(event in handlers) {
                      var eventHandlers = handlers[event];
                      for(var i = eventHandlers.length; i--;) {
                          var handler = eventHandlers[i];
                          node.removeEventListener(event, handler[0], handler[1]);
                      }
                  }
              }
          }


function toast($text){

 app.toast.create({
    text: $text,
    closeTimeout: 2000,
  }).open();

}

function sessionExpired(){

    swal("Session expired. Please login again.")
    .then(function(value) {
        app.router.navigate('/', {history:false});
        //Submit logout request
        app.request.setup({ 
            headers:{
              'Authorization':'Bearer '+localStorage.loginToken
            }
          });
        
        app.request.get('http://13.229.80.248:8083/auth/logout/',
        function (data) {
          localStorage = null;
        },
        function(xhr, status){
        });
    });

}


function telcoChange(page, mobile){

    var providers = $$('#reloads-providers')
  if(mobile.length >4){

      var telcoId = 0;

      for(i = 0; i< telcoPrefixes.length; i++){    
          if(telcoPrefixes[i].prefixes.indexOf(mobile.substring(0,4)) !== -1){
              telcoId= telcoPrefixes[i].telcoId
          }        
      }
    console.log('Mobile Telco:' +telcoId)

    if(telcoId==2){
      providers.attr('src','img/logo_smart.png')
    }else if(telcoId ==3){
      providers.attr('src','img/logo_sun.png')
    }else{

      var uniqueNames = [];
      var obj = telcoPlancodes

      if(obj.length<=0) return;
      
      for(i = 0; i< obj.length; i++){    
          if(uniqueNames.indexOf(obj[i].productType) === -1 ){
            if(obj[i].productType=='Cignal' || obj[i].productType== 'PLDT' || obj[i].productType=='Meralco')
              uniqueNames.push(obj[i].productType);        
            
          }        
      }
    
      var col = pickerType.params.cols[0]
      col.values = uniqueNames
      console.log(uniqueNames)

      providers.attr('src','img/logo_others.png')
      return;
    }


      var uniqueNames = [];
      var obj = telcoPlancodes

      if(obj.length<=0) return;

      for(i = 0; i< obj.length; i++){    
          if(obj[i].telco ==telcoId && uniqueNames.indexOf(obj[i].productType) === -1 ){
            if(obj[i].productType!='Cignal' &&obj[i].productType!= 'PLDT' && obj[i].productType!='Meralco')
              uniqueNames.push(obj[i].productType);        
            
          }        
      }
    
      var col = pickerType.params.cols[0]
      col.values = uniqueNames
  }else{


      var uniqueNames = [];
      var obj = telcoPlancodes

      if(obj.length<=0) return;
      
      for(i = 0; i< obj.length; i++){    
          if(uniqueNames.indexOf(obj[i].productType) === -1 ){
             uniqueNames.push(obj[i].productType);        
          }        
      }
    
      var col = pickerType.params.cols[0]
      col.values = uniqueNames
      console.log(uniqueNames)

      providers.attr('src','img/providers.png')
  }
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
    
    app.request.get('http://13.229.80.248:8083/auth/logout/',
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
      var icon_sms_mode = $$('.page[data-name="login"]').find('#icon-sms-mode');
      
      icon_sms_mode.on('click', function () {
          var sms_mode = chk_sms_mode.prop('checked');
          chk_sms_mode.attr({checked:sms_mode});

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
          console.log('icon clicked')
      })
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

          console.log('p clicked')
      })
  }else if(page.name == 'forgot-password'){

    page.$el.find('#btn-submit').on('click', function () {

      var username = page.$el.find('#txt-username').val() +'';

      app.dialog.preloader('Please wait...');

      app.request.post('http://13.229.80.248:8083/auth/forgot/',
        {
         username: username
        },
       function (data) {
        app.dialog.close();
          console.log(data);

          var obj = JSON.parse(data);
          if(obj.code=='0000'){
            modal('Success', 'An email has been sent to '+obj.sentEmail+' with further instructions.','success',function(){});  
          }else if(obj.code=='9902'){
            modal('Failed', 'Username is invalid.','danger',function(){});  
          }
        },
        function(xhr, status){

          app.dialog.close();

          if(status==401){
            return sessionExpired();
          }
          modal('Failed', 'Unable to send request.','danger',function(){});  
          
        });
    
    });
  }else if(page.name == 'reload'){

    page.$el.find('#btn-reloads-about').on('click', function () {
      modal( 'About', '<img src="../img/logo_brand_dark_3.png" width="80%"> <br> <b class="color-gray ">1.0.0</b> <p>Communigate Technologies Inc.</p><p >By using this app you agree to our <a href="https://loadwallet.com/#!/mobile/privacy-policy">Privacy Policy</a> and accept our <a href="https://loadwallet.com/#!/mobile/terms-and-condition">Terms and Conditions</a></p>','info',function(){})
    })


    page.$el.find('#btn-reloads-update-products').on('click', function () {

    })
    


    // Display product types
    setTimeout(function() {

      app.dialog.preloader('Please wait...');
      app.request.setup({ 
          headers:{
            'Authorization':'Bearer '+localStorage.loginToken
          }
      });

      pickerDenom = app.picker.create({
        inputEl: '#select-product-amount',
        cols: [
          {
            textAlign: 'center',
            values: ['Select Amount']
          }
        ],
         on: {
            close: function () {
              var col = pickerDenom.params.cols[0]
              page.$el.find('#reload-selected-plancode').val( denomValues[col.values.indexOf(col.value)] )
            }
          }
      });

      var denomValues = []
      var denomDisplayValues = []

       app.request.get('http://13.229.80.248:8083/telco/prefixes/',
       function (data) {
          app.dialog.close();
          telcoPrefixes = JSON.parse(data);
          console.log(telcoPrefixes)
        },
        function(xhr, status){

          app.dialog.close();

          if(status==401){
            return sessionExpired();
          }
          modal('Ops!', 'Unable to get telco prefixes.','danger',function(){});
          
        });

        

        app.request.post('http://13.229.80.248:8083/telco/plancodes/',
         function (data) {
            app.dialog.close();
            var obj = JSON.parse(data);
            telcoPlancodes = obj
            console.log(obj)

            var uniqueNames = [];

            if(obj.length>0){

              for(i = 0; i< obj.length; i++){    
                  if(uniqueNames.indexOf(obj[i].productType) === -1){
                      uniqueNames.push(obj[i].productType);        
                  }        
              }

            }
            uniqueNames.sort()

            console.log(uniqueNames)

            pickerType =  app.picker.create({
              inputEl: '#select-product-type',
              $inputEl: '#select-product-type',
              cols: [
                {
                  textAlign: 'center',
                  values: uniqueNames
                }
              ],
               on: {
                  close: function () {

                    var col = pickerDenom.params.cols[0]
                    col.values = ['Select Amount']
                    var selectedProductType = pickerType.getValue() 
                    denomDisplayValues = []
                    denomValues = []
                    for(i = 0; i< obj.length; i++){    
                      if(obj[i].productType == selectedProductType){
                        denomDisplayValues.push(obj[i].alias)
                        denomValues.push(obj[i].name)
                      }        
                    }
                    col.values = denomDisplayValues
                  }
                }
            });

            

           
          },
          function(xhr, status){

            app.dialog.close();

            if(status==401){
              return sessionExpired();
            }
            modal('Ops!', 'Unable to get plancodes.','danger',function(){});
            
          });
    }, 250);
    
    $$('#txt-user-name').html(localStorage.name);
    $$('#txt-user-info').html(localStorage.username+' | '+localStorage.email);
    if (!Date.now) {
        Date.now = function() { return new Date().getTime(); }
    }

    page.$el.find('#btn-submit').on('click', function () {
      // Preloader
        var data = {
          amount : page.$el.find('#reload-selected-plancode').val(),
          target : page.$el.find('#reloads-target').val(),
          customRefNo: Date.now()
        }
      
        swal({
          title: 'Please confirm',
          text: "You are about to reload "+page.$el.find("#select-product-amount").val()+" to "+data.target, 
          buttons: {
            cancel: "CANCEL",
            continue: {
              text: "CONTINUE",
              value: "continue",
            }
          }
        })
        .then(function(value) {
          switch (value) {
         
            case "cancel":

              break;
         
            case "continue":
                reload(page,data)
              break;
         
            default:

          }
        });
        

    })

    $$('#reloads-target').on('keyup', function (e) {
      console.log('input value changed');
      telcoChange(page,$$('#reloads-target').val())
    });
  
  }else if(page.name == 'history'){

    setTimeout(function() {
      getHistory(page);
    }, 250);

    page.$el.find('#btn-load-more-history').on('click', function () {
      // Preloader
      offset+=5;
      getHistory(page);
    })

    page.$el.find('#btn-submit').on('click', function () {
      // Preloader
      getReload(page,page.$el.find('#history-input-tranid').val())
    })
  
  }else if(page.name == 'balance'){

    page.$el.find('#txt-user-balance').html(localStorage.balance);
    page.$el.find('#txt-user-balance-date').html(localStorage.balance_date);

     page.$el.find('#btn-submit').on('click', function () {
      
      if(!window.navigator.onLine){
        modal('Request Failed', 'No internet connection.','danger',function(){});
        return;
      }
        // Preloader
          app.dialog.preloader('Please wait...');
          app.request.setup({ 
              headers:{
                'Authorization':'Bearer '+localStorage.loginToken
              }
          });
          app.request.get('http://13.229.80.248:8083/account/balance/',
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

              if(status==401){
                return sessionExpired();
              }
              modal('Request Failed', 'Unable to get balance.','danger',function(){});
              
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

      app.request.post('http://13.229.80.248:8083/account/changepin/',
        {
         current_mpin: current_mpin,
         new_mpin: new_mpin 
        },
       function (data) {
        app.dialog.close();
          console.log(data);

          var obj = JSON.parse(data);
          if(obj.code=='0'){
            modal('Change Pin Sucessful','Successfully changed mpin.','success',function(){});
          }else if(obj.code=='9903'){
            modal('Request Failed', 'Current mpin is invalid.','danger',function(){});
          }
        },
        function(xhr, status){
          app.dialog.close();

          if(status==401){
            return sessionExpired();
          }
          modal('Request Failed', 'Unable to chnage pin.','danger',function(){});
          
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
        app.request.post('http://13.229.80.248:8083/account/changepassword/',
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

            if(status==401){
              return sessionExpired();
            }
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



