// Content script for QuickNotes extension
// This script runs on all web pages and can interact with page content

// Add keyboard shortcut listener
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + Shift + N to quickly capture selected text
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
    e.preventDefault();
    captureSelectedText();
  }
});

async function captureSelectedText() {
  const selectedText = window.getSelection().toString().trim();
  
  if (!selectedText) {
    return;
  }

  try {
    const response = await chrome.runtime.sendMessage({
      action: 'saveNote',
      data: {
        title: `Quick capture from ${document.title}`,
        content: `<p>${selectedText}</p><hr><p><small>Source: <a href="${window.location.href}">${document.title}</a></small></p>`,
        tags: ['quick-capture']
      }
    });

    if (response.success) {
      showNotification('Note saved!', 'success');
    } else {
      showNotification('Failed to save note', 'error');
    }
  } catch (error) {
    console.error('Error saving note:', error);
    showNotification('Error: ' + error.message, 'error');
  }
}

function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
