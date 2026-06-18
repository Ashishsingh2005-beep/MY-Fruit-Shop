Deploying a full-stack Flask application like yours to the "real world" typically involves a platform like **Render**, **Railway**, or **PythonAnywhere**. These services are easier than AWS/Google Cloud for beginners and offer free tiers.

Here is a step-by-step guide to deploy your Fruit Shop:

### **Phase 1: Prepare Your Code**

1.  **Create a `Procfile`**:
    *   This file tells the hosting service how to start your app.
    *   Create a file named `Procfile` (no extension) in your root folder.
    *   Add this line: `web: gunicorn backend.server:app` (Assuming your main flask app is `server` inside `backend` folder).

2.  **Verify `requirements.txt`**:
    *   Ensure all Python libraries are listed. You need `gunicorn` for production.
    *   `Flask`, `flask-cors`, `requests`, `python-dotenv`, `gunicorn`.
    *   Run: `pip freeze > requirements.txt` to update it.

3.  **Update `API_BASE` in `app.js`**:
    *   Currently, `app.js` points to local: `const API_BASE = 'http://127.0.0.1:5000';`.
    *   **Change this to your deployed URL** after deployment, OR make it dynamic:
        ```javascript
        const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'http://127.0.0.1:5000' 
            : 'https://your-app-name.onrender.com';
        ```

### **Phase 2: Push to GitHub**

1.  Create a GitHub account if you don't have one.
2.  Create a **New Repository** named `fruit-shop`.
3.  Upload your project files (drag and drop or use Git commands):
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/fruit-shop.git
    git push -u origin main
    ```

### **Phase 3: Deploy on Render (Recommended & Free)**

1.  Go to [dashboard.render.com](https://dashboard.render.com/).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  **Settings**:
    *   **Name**: `fruit-shop-live` (or unique name)
    *   **Region**: Singapore (for better speed in India)
    *   **Root Directory**: `.` (leave generic)
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `gunicorn backend.server:app`
5.  Click **Create Web Service**.

### **Phase 4: Final Configuration**

1.  **Environment Variables**:
    *   On Render dashboard -> "Environment" tab.
    *   Add your secrets: `FAST2SMS_API_KEY`, etc.
2.  **Update Frontend URL**:
    *   Once deployed, Render gives you a URL like `https://fruit-shop-live.onrender.com`.
    *   Go back to `app.js`, update `API_BASE` with this new URL.
    *   Commit and push changes to GitHub. Render will auto-redeploy.

Your website will be live at the Render URL!
