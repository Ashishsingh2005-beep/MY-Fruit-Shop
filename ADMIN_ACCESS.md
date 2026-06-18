# 🔒 Admin Panel Access Guide

## How to Open Admin Panel
I have added a **"🔒 Admin"** link in the footer of the main website (`index.html`). 
You can click that link to open the admin panel easily.

Alternatively, you can open the file directly: `c:\Users\Admin\OneDrive\Desktop\Fruit shop\admin.html`

## Troubleshooting "Page Not Opening"

If the page is blank or not working:

1. **Check Server Connection**:
   - The admin panel needs the backend server to be running (`python app.py`).
   - If the server is not running, you can still open the page, but you won't be able to login.

2. **Offline Mode**:
   - The admin panel uses `Chart.js` for graphs. If you are offline, these graphs won't load, but the rest of the page should work.
   - I have updated the code to prevent crashes if you are offline.

3. **Global Error Alerts**:
   - I have added a system to show an alert if there is a script error. If you see a popup with "System Error", please share the message.

4. **Correct PIN**:
   - Ensure you are using the correct PIN to unlock the system.
   - Default PIN is usually `1234` or whatever you configured in `app.py`.

## Features
- **Dashboard**: View sales, orders, and live activity.
- **Inventory**: Add/Edit/Delete products.
- **Users**: Manage customers (Ban/Unban).
- **Complaints**: Respond to user issues.
- **Settings**: Configure weekend sales discount.

If you still face issues, please try clearing your browser cache or opening in Incognito mode.
