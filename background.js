function handleDetached(tabId, detachInfo) {
  window.undoWinId = detachInfo.oldWindowId;
  window.undoPosId = detachInfo.oldPosition;
  window.undoTabId = tabId;
}

browser.tabs.onDetached.addListener(handleDetached);

browser.commands.onCommand.addListener(function(command) {

  function getCurrentWindowTabs() {
    return browser.tabs.query({currentWindow: true});
  }

  function callOnActiveTab(callback) {
    getCurrentWindowTabs().then((tabs) => {
      for (var tab of tabs) {
        if (tab.active) {
          callback(tab, tabs);
        }
      }
    });
  }

  if (command == "detach-tab") {
    function logTabs(windowInfo) {
      for (let tabInfo of windowInfo.tabs) {
        var tabInformation = tabInfo.index;
        if (tabInformation == '0') {
          console.log("Only one tab? Don't detach!");
          continue;
        }
        else {
          callOnActiveTab((tab, tabs) => {
            var creating = browser.windows.create({
              tabId: tab.id
            });
          });
          console.log("More than one tab! Tab detached!");
          break;
        }
      }
    }
    let getTabs = browser.windows.getCurrent({populate: true});
    getTabs.then(logTabs);
  }

  if (command == "undo-detach-tab") {
    function AllTabsAllWins(windowInfoArray) {
      for (let tabInfo of windowInfoArray) {
        var tabIdAllWin = tabInfo.tabs.map((tab) => {return tab.id});
        for (let tabtabInfo of tabIdAllWin) {
          if (tabtabInfo == window.undoTabId) {
            function AllWins(windowInfoArray) {
              for (let windowInfo of windowInfoArray) {
                var windowInformation = windowInfo.id;
                if (windowInformation != window.undoWinId) {
                  console.log("Already reattached!");
                  break;
                }
                else  {
                  var moving = browser.tabs.move([window.undoTabId], {
                    windowId: window.undoWinId,
                    index: window.undoPosId
                  });
                  browser.windows.update(window.undoWinId, {focused: true});
                  browser.tabs.update(window.undoTabId, {active: true})
                  console.log("Tab Reattached!");
                  break;
                }
              }
            }
            var getAllWins = browser.windows.getAll({populate: true});
            getAllWins.then(AllWins);
            break;
          }
          else {
            console.log("Not the right tab, don't reattach!");
            continue;
          }
        }
      }
    }
    var getAllTabsAllWins = browser.windows.getAll({populate: true});
    getAllTabsAllWins.then(AllTabsAllWins);
  };

});