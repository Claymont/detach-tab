browser.commands.onCommand.addListener((command) => {

  function getCurrentWindow() {
    return browser.windows.getCurrent();
  }

  if (command == "new-window") {
    let createData = {};
    let creating = browser.windows.create(createData);
    creating.then(() => {
      console.log("The normal window has been created");
    });
  }

  e.preventDefault();
});
