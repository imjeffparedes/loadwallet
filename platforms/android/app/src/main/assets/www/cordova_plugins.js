cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-inappbrowser.inappbrowser",
    "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
    "pluginId": "cordova-plugin-inappbrowser",
    "clobbers": [
      "cordova.InAppBrowser.open",
      "window.open"
    ]
  },
  {
    "id": "cordova-plugin-statusbar.statusbar",
    "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
    "pluginId": "cordova-plugin-statusbar",
    "clobbers": [
      "window.StatusBar"
    ]
  },
  {
    "id": "cordova-plugin-shared-preferences.SharedPreferences",
    "file": "plugins/cordova-plugin-shared-preferences/www/SharedPreferences.js",
    "pluginId": "cordova-plugin-shared-preferences",
    "clobbers": [
      "SharedPreferences"
    ]
  },
  {
    "id": "cordova-sqlite-storage.SQLitePlugin",
    "file": "plugins/cordova-sqlite-storage/www/SQLitePlugin.js",
    "pluginId": "cordova-sqlite-storage",
    "clobbers": [
      "SQLitePlugin"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-console": "1.0.7",
  "cordova-plugin-inappbrowser": "2.0.1",
  "cordova-plugin-statusbar": "1.0.1",
  "cordova-plugin-whitelist": "1.2.2",
  "cordova-plugin-shared-preferences": "0.0.1",
  "cordova-sqlite-storage": "2.2.0"
};
// BOTTOM OF METADATA
});