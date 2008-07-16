// Abstracts the general form of an XMLHttpRequest handler into an action.

Components.utils.import("resource://socialite/debug.jsm");
Components.utils.import("resource://socialite/utils/action/action.jsm");

var EXPORTED_SYMBOLS = ["RequestAction", "GetAction", "PostAction"];

STATUS_SUCCESS = 200;

function RequestAction(method, url, parameters, successCallback, failureCallback) {
  var act = new _HTTPRequestAction(successCallback, failureCallback);
  
  act.url = url;
  
  if (method) {
    method = method.toLowerCase()
    if ((method == "post") ||
       (method == "get" )) {
      act.method = method;
    } else {
      throw "HTTPRequestAction: invalid XMLHttpRequest method specified.";
    }
  } else {
    // Default
    act.method = "post";
  }
  
  if (parameters) {
    act.parameters = parameters;
  } else {
    act.parameters = {}
  }
  
  act.request = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
  
  return act;
}

function GetAction(url, parameters, successCallback, failureCallback) {
  return new RequestAction("get", url, parameters, successCallback, failureCallback);
}

function PostAction(url, parameters, successCallback, failureCallback) {
  return new RequestAction("post", url, parameters, successCallback, failureCallback);
}

// Based on code from reddit.com javascript:
// From http://code.reddit.com/browser/r2/r2/public/static/utils.js
// Modified by chromakode to merge in and remove prototyped Object.__iter__
function make_get_params(obj) {
  var res = [];
  for(var o in obj) {
    if(!(o in Object.prototype)) {
      res.unshift( o+"="+encodeURIComponent(obj[o]) );
    }
  }
  return res.join("&");
}

var _HTTPRequestAction = Action("httpRequest", function(action) {
  var onLoad = function(e) {
    var request = e.target;
    if (request.status == STATUS_SUCCESS) {
      action.success(request);
    } else {
      action.failure(request);
    }
  };
  
  var formattedParams = make_get_params(action.parameters);
  
  if (action.method == "get") {
    var target = action.url + "?" + formattedParams;
    debug_log("httpRequest", "GET request to " + target);
    action.request.open("get", target, true);
    action.request.onload = onLoad;
    action.request.send(null);
  } else if (action.method == "post") {
    action.request.open("post", action.url, true);
    action.request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    action.request.onload = onLoad;
    debug_log("httpRequest", "POST to " + action.url + " (sent: " + formattedParams +  ")");
    action.request.send(formattedParams);
  }
});
