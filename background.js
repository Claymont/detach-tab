function handleDetached(tabId, detachInfo) {
  window.undoWinId = detachInfo.oldWindowId;
  window.undoPosId = detachInfo.oldPosition;
  window.undoTabId = tabId;
}

browser.tabs.onDetached.addListener(handleDetached);

browser.commands.onCommand.addListener(function (command) {
  function getCurrentWindowTabs() {
    return browser.tabs.query({ currentWindow: true });
  }

  function callOnActiveTab(callback) {
    getCurrentWindowTabs().then((tabs) => {
      tabIdArray = [];
      for (var tab of tabs) {
        // we want to move all highlighted tabs (the active tab is always highlighted)
        if (tab.highlighted) {
          tabIdArray.push(tab.id);
        }
      }
      callback(tabIdArray, tabs);
    });
  }

  if (command == "detach-tab") {
    function logTabs(windowInfo) {
      for (let tabInfo of windowInfo.tabs) {
        var tabInformation = tabInfo.index;
        if (tabInformation == "0") {
          continue;
        } else {
          callOnActiveTab((tabIdArray, tabs) => {
            // new windows can only take a single new tab
            firstTab = tabIdArray.shift();
            var creating = browser.windows.create({ tabId: firstTab });

            // if there was more than one tab, move the rest
            if (tabIdArray.length > 0) {
              creating.then((window) => {
                browser.tabs.move(tabIdArray, {
                  // add tabs after the first one
                  index: -1,
                  windowId: window.id,
                });
              });
            }
          });
          break;
        }
      }
    }
    let getTabs = browser.windows.getCurrent({ populate: true });
    getTabs.then(logTabs);
  }

  if (command == "reattach-tab") {
    function AllTabsAllWins(windowInfoArray) {
      for (let tabInfo of windowInfoArray) {
        var tabIdAllWin = tabInfo.tabs.map((tab) => {
          return tab.id;
        });
        for (let tabtabInfo of tabIdAllWin) {
          if (tabtabInfo == window.undoTabId) {
            function AllWins(windowInfoArray) {
              for (let windowInfo of windowInfoArray) {
                var windowInformation = windowInfo.id;
                if (windowInformation != window.undoWinId) {
                  continue;
                } else {
                  var moving = browser.tabs.move([window.undoTabId], {
                    windowId: window.undoWinId,
                    index: window.undoPosId,
                  });
                  browser.windows.update(window.undoWinId, { focused: true });
                  browser.tabs.update(window.undoTabId, { active: true });
                  break;
                }
              }
            }
            var getAllWins = browser.windows.getAll({ populate: true });
            getAllWins.then(AllWins);
            break;
          } else {
            continue;
          }
        }
      }
    }
    var getAllTabsAllWins = browser.windows.getAll({ populate: true });
    getAllTabsAllWins.then(AllTabsAllWins);
  }
});
