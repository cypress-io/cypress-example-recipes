/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/utils.js
/* global chrome */
const IS_EDGE = navigator.userAgent.indexOf('Edg') >= 0;
const IS_FIREFOX = navigator.userAgent.indexOf('Firefox') >= 0;
const IS_CHROME = IS_EDGE === false && IS_FIREFOX === false;
function getBrowserName() {
  if (IS_EDGE) {
    return 'Edge';
  }

  if (IS_FIREFOX) {
    return 'Firefox';
  }

  if (IS_CHROME) {
    return 'Chrome';
  }

  throw new Error('Expected browser name to be one of Chrome, Edge or Firefox.');
}
function getBrowserTheme() {
  if (IS_CHROME) {
    // chrome.devtools.panels added in Chrome 18.
    // chrome.devtools.panels.themeName added in Chrome 54.
    return chrome.devtools.panels.themeName === 'dark' ? 'dark' : 'light';
  } else {
    // chrome.devtools.panels.themeName added in Firefox 55.
    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/devtools.panels/themeName
    if (chrome.devtools && chrome.devtools.panels) {
      switch (chrome.devtools.panels.themeName) {
        case 'dark':
          return 'dark';

        default:
          return 'light';
      }
    }
  }
}
const COMPACT_VERSION_NAME = 'compact';
const EXTENSION_CONTAINED_VERSIONS = [COMPACT_VERSION_NAME];
;// CONCATENATED MODULE: ./src/background.js
/* global chrome */



const ports = {};

async function dynamicallyInjectContentScripts() {
  const contentScriptsToInject = [{
    id: 'hook',
    matches: ['<all_urls>'],
    js: ['build/installHook.js'],
    runAt: 'document_start',
    world: chrome.scripting.ExecutionWorld.MAIN
  }, {
    id: 'renderer',
    matches: ['<all_urls>'],
    js: ['build/renderer.js'],
    runAt: 'document_start',
    world: chrome.scripting.ExecutionWorld.MAIN
  }];

  try {
    // For some reason dynamically injected scripts might be already registered
    // Registering them again will fail, which will result into
    // __REACT_DEVTOOLS_GLOBAL_HOOK__ hook not being injected
    // Not specifying ids, because Chrome throws an error
    // if id of non-injected script is provided
    await chrome.scripting.unregisterContentScripts(); // equivalent logic for Firefox is in prepareInjection.js
    // Manifest V3 method of injecting content script
    // TODO(hoxyq): migrate Firefox to V3 manifests
    // Note: the "world" option in registerContentScripts is only available in Chrome v102+
    // It's critical since it allows us to directly run scripts on the "main" world on the page
    // "document_start" allows it to run before the page's scripts
    // so the hook can be detected by react reconciler

    await chrome.scripting.registerContentScripts(contentScriptsToInject);
  } catch (error) {
    console.error(error);
  }
}

if (!IS_FIREFOX) {
  dynamicallyInjectContentScripts();
}

chrome.runtime.onConnect.addListener(function (port) {
  let tab = null;
  let name = null;

  if (isNumeric(port.name)) {
    tab = port.name;
    name = 'devtools';
    installProxy(+port.name);
  } else {
    tab = port.sender.tab.id;
    name = 'content-script';
  }

  if (!ports[tab]) {
    ports[tab] = {
      devtools: null,
      'content-script': null
    };
  }

  ports[tab][name] = port;

  if (ports[tab].devtools && ports[tab]['content-script']) {
    doublePipe(ports[tab].devtools, ports[tab]['content-script'], tab);
  }
});

function isNumeric(str) {
  return +str + '' === str;
}

function installProxy(tabId) {
  if (IS_FIREFOX) {
    chrome.tabs.executeScript(tabId, {
      file: '/build/proxy.js'
    }, function () {});
  } else {
    chrome.scripting.executeScript({
      target: {
        tabId: tabId
      },
      files: ['/build/proxy.js']
    });
  }
}

function doublePipe(one, two, tabId) {
  one.onMessage.addListener(lOne);

  function lOne(message) {
    try {
      two.postMessage(message);
    } catch (e) {
      if (false) {}

      shutdown();
    }
  }

  two.onMessage.addListener(lTwo);

  function lTwo(message) {
    try {
      one.postMessage(message);
    } catch (e) {
      if (false) {}

      shutdown();
    }
  }

  function shutdown() {
    one.onMessage.removeListener(lOne);
    two.onMessage.removeListener(lTwo);
    one.disconnect();
    two.disconnect(); // clean up so that we can rebuild the double pipe if the page is reloaded

    ports[tabId] = null;
  }

  one.onDisconnect.addListener(shutdown);
  two.onDisconnect.addListener(shutdown);
}

function setIconAndPopup(reactBuildType, tabId) {
  const action = IS_FIREFOX ? chrome.browserAction : chrome.action;
  action.setIcon({
    tabId: tabId,
    path: {
      '16': chrome.runtime.getURL(`icons/16-${reactBuildType}.png`),
      '32': chrome.runtime.getURL(`icons/32-${reactBuildType}.png`),
      '48': chrome.runtime.getURL(`icons/48-${reactBuildType}.png`),
      '128': chrome.runtime.getURL(`icons/128-${reactBuildType}.png`)
    }
  });
  action.setPopup({
    tabId: tabId,
    popup: chrome.runtime.getURL(`popups/${reactBuildType}.html`)
  });
}

function isRestrictedBrowserPage(url) {
  return !url || new URL(url).protocol === 'chrome:';
}

function checkAndHandleRestrictedPageIfSo(tab) {
  if (tab && isRestrictedBrowserPage(tab.url)) {
    setIconAndPopup('restricted', tab.id);
  }
} // update popup page of any existing open tabs, if they are restricted browser pages.
// we can't update for any other types (prod,dev,outdated etc)
// as the content script needs to be injected at document_start itself for those kinds of detection
// TODO: Show a different popup page(to reload current page probably) for old tabs, opened before the extension is installed


if (!IS_FIREFOX) {
  chrome.tabs.query({}, tabs => tabs.forEach(checkAndHandleRestrictedPageIfSo));
  chrome.tabs.onCreated.addListener((tabId, changeInfo, tab) => checkAndHandleRestrictedPageIfSo(tab));
} // Listen to URL changes on the active tab and update the DevTools icon.


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (IS_FIREFOX) {
    // We don't properly detect protected URLs in Firefox at the moment.
    // However we can reset the DevTools icon to its loading state when the URL changes.
    // It will be updated to the correct icon by the onMessage callback below.
    if (tab.active && changeInfo.status === 'loading') {
      setIconAndPopup('disabled', tabId);
    }
  } else {
    // Don't reset the icon to the loading state for Chrome or Edge.
    // The onUpdated callback fires more frequently for these browsers,
    // often after onMessage has been called.
    checkAndHandleRestrictedPageIfSo(tab);
  }
});
chrome.runtime.onMessage.addListener((request, sender) => {
  var _request$payload, _request$payload2;

  const tab = sender.tab; // sender.tab.id from content script points to the tab that injected the content script

  if (tab) {
    const id = tab.id; // This is sent from the hook content script.
    // It tells us a renderer has attached.

    if (request.hasDetectedReact) {
      setIconAndPopup(request.reactBuildType, id);
    } else {
      var _ports$id;

      const devtools = (_ports$id = ports[id]) === null || _ports$id === void 0 ? void 0 : _ports$id.devtools;

      switch ((_request$payload = request.payload) === null || _request$payload === void 0 ? void 0 : _request$payload.type) {
        case 'fetch-file-with-cache-complete':
        case 'fetch-file-with-cache-error':
          // Forward the result of fetch-in-page requests back to the extension.
          devtools === null || devtools === void 0 ? void 0 : devtools.postMessage(request);
          break;
        // This is sent from the backend manager running on a page

        case 'react-devtools-required-backends':
          const backendsToDownload = [];
          request.payload.versions.forEach(version => {
            if (EXTENSION_CONTAINED_VERSIONS.includes(version)) {
              if (!IS_FIREFOX) {
                // equivalent logic for Firefox is in prepareInjection.js
                chrome.scripting.executeScript({
                  target: {
                    tabId: id
                  },
                  files: [`/build/react_devtools_backend_${version}.js`],
                  world: chrome.scripting.ExecutionWorld.MAIN
                });
              }
            } else {
              backendsToDownload.push(version);
            }
          }); // Request the necessary backends in the extension DevTools UI
          // TODO: handle this message in main.js to build the UI

          devtools === null || devtools === void 0 ? void 0 : devtools.postMessage({
            payload: {
              type: 'react-devtools-additional-backends',
              versions: backendsToDownload
            }
          });
          break;
      }
    }
  } // sender.tab.id from devtools page may not exist, or point to the undocked devtools window
  // so we use the payload to get the tab id


  if ((_request$payload2 = request.payload) === null || _request$payload2 === void 0 ? void 0 : _request$payload2.tabId) {
    var _request$payload3;

    const tabId = (_request$payload3 = request.payload) === null || _request$payload3 === void 0 ? void 0 : _request$payload3.tabId; // This is sent from the devtools page when it is ready for injecting the backend

    if (request.payload.type === 'react-devtools-inject-backend-manager') {
      if (!IS_FIREFOX) {
        // equivalent logic for Firefox is in prepareInjection.js
        chrome.scripting.executeScript({
          target: {
            tabId
          },
          files: ['/build/backendManager.js'],
          world: chrome.scripting.ExecutionWorld.MAIN
        });
      }
    }
  }
});
/******/ })()
;