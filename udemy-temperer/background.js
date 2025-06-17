chrome.commands.onCommand.addListener((command) => {
  if (command === "summarize-transcript") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: () => {
            window.dispatchEvent(new CustomEvent("RUN_SUMMARY_SCRIPT"));
          }
        });
      }
    });
  }
});
