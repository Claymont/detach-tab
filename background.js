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
    callOnActiveTab((tab, tabs) => {
      var creating = browser.windows.create({
        tabId: tab.id
      });

    });
  }

  console.log("Tab Detached!");

});