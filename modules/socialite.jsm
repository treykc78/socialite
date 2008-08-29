Components.utils.import("resource://socialite/preferences.jsm");
logger = Components.utils.import("resource://socialite/utils/log.jsm");
logger.init("Socialite", {
  enabled:    SocialitePrefs.getBoolPref("debug"),
  useConsole: SocialitePrefs.getBoolPref("debugInErrorConsole")
});

Components.utils.import("resource://socialite/site.jsm");
Components.utils.import("resource://socialite/watchedURLs.jsm");

var alertsService = Components.classes["@mozilla.org/alerts-service;1"]
                    .getService(Components.interfaces.nsIAlertsService);

var windowManager = Components.classes['@mozilla.org/appshell/window-mediator;1']
                    .getService(Components.interfaces.nsIWindowMediator);

var EXPORTED_SYMBOLS = ["Socialite"];

// ---

var Socialite =
{  
  init: function() {
    Socialite.loaded = false;
    Socialite.sites = new SiteCollection();
    Socialite.watchedURLs = new WatchedURLs();
  },
  
  load: function() {
    if (!Socialite.loaded) {
      Socialite.sites.loadFromPreferences();
      Socialite.loaded = true;
    }
  },

  failureMessage: function(message) {
    logger.log("Socialite", "Failure occurred, message: " + message);
  
    alertsService.showAlertNotification(
      "chrome://global/skin/icons/Error.png",
      "Socialite Error",
      message, 
      null, null, null, "socialite-failure"
    );
  },

  openUILink: function(url, e) {
    window = windowManager.getMostRecentWindow("navigator:browser");
    window.openUILink(url, e);
  }

}

Socialite.init();