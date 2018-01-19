// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
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
      },
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

// Init/Create views
var homeView = app.views.create('#view-home', {
  url: '/'
});
var catalogView = app.views.create('#view-history', {
  url: '/history/'
});
var settingsView = app.views.create('#view-settings', {
  url: '/settings/'
});



//Login Page
$$(document).on('page:init', '.page[data-name="login"]', function (e) {

    $$('.page[data-name="login"]').find('#link-privacy-policy').on('click', function () {
      cordova.InAppBrowser.open('https://loadwallet.com/#!/mobile/privacy-policy', '_system', 'location=no');
    })
    $$('.page[data-name="login"]').find('#link-terms').on('click', function () {
      cordova.InAppBrowser.open('https://loadwallet.com/#!/mobile/terms-and-condition', '_system', 'location=no');
    })

    $$('.page[data-name="login"]').find('#btn-sign-in').on('click', function () {
        $$('.page[data-name="login"]').find('#login-form').hide();
        $$('.page[data-name="login"]').find('#login-preloader').show();
        setTimeout(function () {

          app.router.navigate('/', null);
          drawerItemCliked('#drawer-item-reload');
        }, 3000);
    })
    
});

//Reload Page
$$(document).on('page:init', '.page[data-name="home"]', function (e, page) {
  
   $$('.page[data-name="home"]').find('#btn-submit').on('click', function () {
      // Preloader
        app.dialog.preloader();
        setTimeout(function () {
          app.dialog.close();
        }, 3000);
    })
    
    
});

//History Page
$$(document).on('page:init', '.page[data-name="history"]', function (e) {
  
   $$('.page[data-name="history"]').find('#btn-submit').on('click', function () {
      // Preloader
        app.dialog.preloader();
        setTimeout(function () {
          app.dialog.close();
        }, 3000);
    })
    
});



$$(document).on('click', '.btn-ticket-option', function () {
    ticket_option.open();
});

var pickerDevice = app.picker.create({
  inputEl: '#select-product-type',
  cols: [
    {
      textAlign: 'center',
      values: ['All network', 'All out Surf', 'All text', 'Big Bytes', 'Call & Text Combo', 'Call & Text Unlimited', 'Flexi Max', 'Gaan text', 'Smart Regular Load']
    }
  ]
});


var pickerDevice = app.picker.create({
  inputEl: '#select-product-amount',
  cols: [
    {
      textAlign: 'center',
      values: ['All Text 60', 'All Text Plus', 'All text 10']
    }
  ]
});


//Drawer event
var drawerItemSelected = '#drawer-item-reload';
var panel = app.panel.create({
  el: '.panel-left',
})
app.panel.enableSwipe('left')

$$(document).on('click', '#drawer-item-reload', function () {
  //  app.router.navigate('/', null);
    drawerItemCliked('#drawer-item-reload');
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
   //app.router.navigate('/login/', {history:false});
    drawerItemCliked('#drawer-item-login');

});




function drawerItemCliked(id){

    panel.close('left',false);

    if(drawerItemSelected != id){
        $$(drawerItemSelected).removeClass('drawer-item-active');
        $$(id).addClass('drawer-item-active');
    }
    else if ( $$(id).hasClass('drawer-item-active') ){

    }
    else
        $$(id).addClass('drawer-item-active');

    drawerItemSelected = id;
};
