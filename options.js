const commandName = 'detach-tab';
const commandUndo = 'undo-detach-tab';

/**
 * Update the UI: set the value of the shortcut textbox.
 */
async function updateUI() {
  let commands = await browser.commands.getAll();
  for (command of commands) {
    if (command.name === commandName) {
      document.querySelector('#shortcut').value = command.shortcut;
    }
    if (command.name === commandUndo) {
      document.querySelector('#shortcutundo').value = command.shortcut;
    }
  }
}

/**
 * Update the shortcut based on the value in the textbox.
 */
async function updateShortcut() {
  await browser.commands.update({
    name: commandName,
    shortcut: document.querySelector('#shortcut').value
  });
  await browser.commands.update({
    name: commandUndo,
    shortcut: document.querySelector('#shortcutundo').value
  });
}

/**
 * Reset the shortcut and update the textbox.
 */
async function resetShortcut() {
  await browser.commands.reset(commandName);
  await browser.commands.reset(commandUndo);
  updateUI();
}

/**
 * Update the UI when the page loads.
 */
document.addEventListener('DOMContentLoaded', updateUI);

/**
 * Handle update and reset button clicks
 */
document.querySelector('#update').addEventListener('click', updateShortcut)
document.querySelector('#reset').addEventListener('click', resetShortcut)