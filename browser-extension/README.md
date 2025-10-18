# QuickNotes Browser Extension

A browser extension for quickly capturing notes from any webpage to your QuickNotes account.

## Features

- 🚀 Quick note creation from browser toolbar
- 📝 Capture selected text with context menu
- ⌨️ Keyboard shortcut (Ctrl/Cmd + Shift + N) for instant capture
- 🔗 Automatically includes source URL and page title
- 🏷️ Support for tags and categorization
- 🔒 Secure authentication with your QuickNotes account

## Installation

### Chrome / Edge / Brave

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `browser-extension` folder
5. The QuickNotes extension icon should appear in your toolbar

### Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Navigate to the `browser-extension` folder
4. Select the `manifest.json` file
5. The extension will be loaded temporarily

## Usage

### First Time Setup

1. Click the QuickNotes extension icon in your toolbar
2. Enter your QuickNotes API URL (default: `http://localhost:3000`)
3. Enter your email and password
4. Click "Login"

### Creating Notes

#### Method 1: Extension Popup
1. Click the QuickNotes icon
2. Enter note title, content, and tags
3. Click "Save Note"

#### Method 2: Context Menu
1. Select text on any webpage
2. Right-click and choose "Save to QuickNotes"
3. A notification will confirm the save

#### Method 3: Keyboard Shortcut
1. Select text on any webpage
2. Press `Ctrl+Shift+N` (Windows/Linux) or `Cmd+Shift+N` (Mac)
3. A notification will appear confirming the save

## Configuration

The extension stores your authentication credentials locally in the browser. To update the API URL or re-authenticate:

1. Open the extension popup
2. Click "Logout"
3. Re-enter your credentials with the new API URL

## Security Notes

- The extension stores authentication tokens locally in your browser
- All communication with the QuickNotes API is done over HTTPS (in production)
- Never share your authentication credentials
- For production use, configure the API URL to your deployed QuickNotes instance

## Development

To modify the extension:

1. Edit files in the `browser-extension` folder
2. Reload the extension in your browser's extension management page
3. Test changes in the extension popup or on web pages

### Files

- `manifest.json` - Extension configuration and permissions
- `popup.html` - Extension popup UI
- `popup.js` - Popup logic and API communication
- `background.js` - Background service worker for context menu and notifications
- `content.js` - Content script that runs on web pages for keyboard shortcuts

## Troubleshooting

### Extension doesn't appear after installation
- Make sure Developer mode is enabled
- Check that all files are in the correct folder
- Reload the extension from the extensions page

### Login fails
- Verify your API URL is correct
- Check that your QuickNotes server is running
- Ensure your email and password are correct

### Notes not saving
- Check browser console for errors
- Verify you're logged in (check extension popup)
- Ensure the API URL is accessible from your browser

## Future Enhancements

- [ ] OAuth authentication
- [ ] Offline note queue
- [ ] Rich text formatting in popup
- [ ] Note search and management
- [ ] Sync with QuickNotes web app
- [ ] Custom keyboard shortcuts
- [ ] Multiple account support

## License

Same as QuickNotes main application.
