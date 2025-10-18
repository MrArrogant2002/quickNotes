// Background service worker for QuickNotes extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('QuickNotes extension installed');
  
  // Set default API URL
  chrome.storage.local.set({ 
    apiUrl: 'http://localhost:3000' 
  });
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveNote') {
    handleSaveNote(request.data)
      .then(response => sendResponse({ success: true, data: response }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep the message channel open for async response
  }
});

async function handleSaveNote(noteData) {
  const storage = await chrome.storage.local.get(['authToken', 'apiUrl']);
  
  if (!storage.authToken) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${storage.apiUrl}/api/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${storage.authToken}`
    },
    body: JSON.stringify(noteData)
  });

  if (!response.ok) {
    throw new Error('Failed to save note');
  }

  return await response.json();
}

// Context menu for quick note creation
chrome.contextMenus.create({
  id: 'quicknote-selected',
  title: 'Save to QuickNotes',
  contexts: ['selection']
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'quicknote-selected') {
    const selectedText = info.selectionText;
    
    try {
      await handleSaveNote({
        title: `Note from ${tab.title}`,
        content: `<p>${selectedText}</p><hr><p><small>Source: <a href="${tab.url}">${tab.title}</a></small></p>`,
        tags: ['quick-capture']
      });
      
      // Show notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'QuickNotes',
        message: 'Note saved successfully!'
      });
    } catch (error) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'QuickNotes',
        message: 'Failed to save note: ' + error.message
      });
    }
  }
});
