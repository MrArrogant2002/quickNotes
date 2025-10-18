// QuickNotes Browser Extension - Popup Script

let apiUrl = 'http://localhost:3000';
let authToken = null;

// DOM Elements
const loggedInSection = document.querySelector('.logged-in');
const loggedOutSection = document.querySelector('.logged-out');
const noteForm = document.querySelector('.note-form');
const statusDiv = document.getElementById('status');
const successDiv = document.getElementById('success');
const errorDiv = document.getElementById('error');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await checkLoginStatus();
  setupEventListeners();
});

async function checkLoginStatus() {
  const storage = await chrome.storage.local.get(['authToken', 'apiUrl']);
  
  if (storage.apiUrl) {
    apiUrl = storage.apiUrl;
    document.getElementById('apiUrl').value = apiUrl;
  }
  
  if (storage.authToken) {
    authToken = storage.authToken;
    showLoggedIn();
  } else {
    showLoggedOut();
  }
}

function setupEventListeners() {
  document.getElementById('loginBtn').addEventListener('click', handleLogin);
  document.getElementById('saveNoteBtn').addEventListener('click', handleSaveNote);
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

async function handleLogin() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  apiUrl = document.getElementById('apiUrl').value;

  if (!email || !password) {
    showError('Please enter email and password');
    return;
  }

  try {
    // For demo purposes, we'll store credentials
    // In production, use proper OAuth or session tokens
    const credentials = btoa(`${email}:${password}`);
    authToken = credentials;

    await chrome.storage.local.set({ 
      authToken: credentials,
      apiUrl: apiUrl,
      email: email
    });

    showSuccess('Logged in successfully!');
    setTimeout(() => {
      showLoggedIn();
    }, 1000);
  } catch (error) {
    showError('Login failed: ' + error.message);
  }
}

async function handleSaveNote() {
  const title = document.getElementById('noteTitle').value;
  const content = document.getElementById('noteContent').value;
  const tagsInput = document.getElementById('noteTags').value;
  const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];

  if (!title || !content) {
    showError('Please enter title and content');
    return;
  }

  try {
    const storage = await chrome.storage.local.get(['authToken', 'apiUrl', 'email']);
    
    // Get current tab URL for context
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const pageUrl = tab.url;
    const pageTitle = tab.title;

    // Add context to content
    const enrichedContent = `<p>${content}</p><hr><p><small>Source: <a href="${pageUrl}">${pageTitle}</a></small></p>`;

    const response = await fetch(`${storage.apiUrl}/api/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${storage.authToken}`
      },
      body: JSON.stringify({
        title,
        content: enrichedContent,
        tags
      })
    });

    if (response.ok) {
      showSuccess('Note saved successfully!');
      // Clear form
      document.getElementById('noteTitle').value = '';
      document.getElementById('noteContent').value = '';
      document.getElementById('noteTags').value = '';
    } else {
      const error = await response.json();
      showError('Failed to save note: ' + (error.error || 'Unknown error'));
    }
  } catch (error) {
    showError('Error saving note: ' + error.message);
  }
}

function handleLogout() {
  chrome.storage.local.remove(['authToken', 'email']);
  authToken = null;
  showLoggedOut();
  showSuccess('Logged out successfully!');
}

function showLoggedIn() {
  loggedInSection.style.display = 'block';
  noteForm.style.display = 'block';
  loggedOutSection.style.display = 'none';
  statusDiv.style.display = 'none';
}

function showLoggedOut() {
  loggedInSection.style.display = 'none';
  noteForm.style.display = 'none';
  loggedOutSection.style.display = 'block';
  statusDiv.style.display = 'none';
}

function showSuccess(message) {
  successDiv.textContent = message;
  successDiv.style.display = 'block';
  errorDiv.style.display = 'none';
  setTimeout(() => {
    successDiv.style.display = 'none';
  }, 3000);
}

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  successDiv.style.display = 'none';
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
}
