routes = [

  {
    path: '/',
    url: './index.html',
  },
  {
    path: '/about/',
    url: './pages/about.html',
  },
  {
    path: '/counter/',
    url: './pages/counter.html',
  },
  {
    path: '/forgot-password/',
    url: './pages/forgot-password.html',
    animate: false
  },
  {
    path: '/reload/',
    url: './pages/reload.html',
  },
  {
    path: '/form/',
    url: './pages/form.html',
  },
  {
    path: '/history/',
    url: './pages/history.html',
  },
  {
    path: '/balance/',
    url: './pages/balance.html',
  },
  {
    path: '/settings/',
    url: './pages/settings.html',
  },
  {
    path: '/change-pin/',
    url: './pages/change-pin.html',
  },
  {
    path: '/change-password/',
    url: './pages/change-password.html',
  },
  {
    path: '/search/',
    url: './pages/search.html',
  },
  {
    path: '/reload/',
    url: './pages/reload.html',
  },
  // Page Loaders & Router
  {
    path: '/page-loader-template7/:user/:userId/:posts/:postId/',
    templateUrl: './pages/page-loader-template7.html',
  },
  {
    path: '/page-loader-component/:user/:userId/:posts/:postId/',
    componentUrl: './pages/page-loader-component.html',
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/request-and-load.html',
          },
          {
            context: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
