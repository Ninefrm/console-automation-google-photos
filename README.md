# Console Automation - Google Photos Selector
# 📸 Google Photos Bulk Day Selection Script

Language‑agnostic browser **console automation script** to bulk select entire day groups in Google Photos.

Built to solve a real migration problem: moving thousands of photos from one Google account to another without manually clicking day by day.

---

## 💡 Why This Exists

I needed to migrate my photo library from one Google account to another.

Google Photos doesn't provide an easy way to:

❌ Select dozens/hundreds of days quickly  
❌ Bulk add many day groups to an album efficiently  

Doing it manually = hours of clicking.

So I built a small **console automation script** that selects multiple days automatically while you scroll.

---

## 🔁 Real Migration Workflow (How I Use It)

This is the exact process the script was designed for:

### Step-by-step

1. Log into the **destination account**
2. Create **one shared album**
3. Invite the **source account** to that album
4. Switch to the **source account**
5. Open the shared album → click **“Add photos”**
6. Open DevTools → **Console**
7. Paste and run the script
8. Days are selected automatically
9. Click **Save manually**
10. Repeat as many times as needed

This approach lets you:

✅ Run the script multiple times  
✅ Migrate in batches  
✅ Avoid timeouts  
✅ Keep full control of what gets added  

---

## ✨ Features

✔ Bulk day selection  
✔ Works in ANY language  
✔ No fragile CSS classes  
✔ Uses accessibility roles (role="checkbox")  
✔ Smart day detection  
✔ Configurable scroll direction  
✔ Optional click history saving  
✔ No installation required  
✔ Runs directly in browser console  

---

## 🚀 Quick Start

1. Open Google Photos
2. Navigate to the album or timeline
3. Open DevTools → Console
4. Paste script.js
5. Press Enter

Done.

---

## ⚙️ Configuration

```javascript
const ACTION_MODE = "older"; // newer | older | both
const DAYS_TO_SELECT = 5;
const SAVE_CLICKS = true;
```

| Option | Description |
|--------|-------------|
| ACTION_MODE | Scroll direction |
| DAYS_TO_SELECT | How many day groups to select |
| SAVE_CLICKS | Store labels for debugging/replay |

---

## 🧠 How It Works

Instead of relying on language-specific labels like:

❌ aria-label^="Select all photos"

The script uses:

✔ role="checkbox"  
✔ DOM structure  
✔ Visual proximity to the day header  

This makes it work across:
English, Spanish, Portuguese, French, German, etc.

---

## ⚠️ Disclaimer

This is not an official Google tool.  
It simply simulates clicks in your own browser.

Use responsibly.

---
