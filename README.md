# Console Automation – Google Photos Selector

Language‑agnostic **browser console automation scripts** to bulk manage photos in Google Photos.

This project was built to solve a real migration problem: moving thousands of photos from one Google account to another without manually clicking day by day.

The repo now includes **two complementary scripts** located inside `/scripts/`:

- 📅 `google-photos-days-selector.js` → Select entire day groups automatically
- 🖼️ `google-photos-photos-selector.js` → Select individual photos automatically (review mode)

Together they make large migrations fast and painless.

---

## 💡 Why This Exists

I needed to migrate my photo library between Google accounts.

Google Photos doesn’t provide an easy way to:

❌ Select hundreds of days quickly  
❌ Bulk add large sets of photos to albums  
❌ Review unselected leftovers efficiently  

Doing this manually = hours of repetitive clicking.

So I built small **console scripts** that automate the boring parts.

---

## 📁 Project Structure

```
/scripts
   google-photos-days-selector.js
   google-photos-photos-selector.js
README.md
```

---

## 🔁 Real Migration Workflow (Recommended)

### Step‑by‑step

1. Log into the **destination account**
2. Create **one shared album**
3. Invite the **source account**
4. Switch to the **source account**
5. Open the shared album → click **“Add photos”**
6. Open DevTools → Console
7. Run the scripts

### Typical usage

### 1️⃣ Select days first
Paste and run:
```
scripts/google-photos-days-selector.js
```

This selects multiple **whole days** at once.

Click **Save manually**.

### 2️⃣ Then review leftovers (optional)
Paste and run:
```
scripts/google-photos-photos-selector.js
```

This:
- selects individual photos
- hides already selected ones
- scrolls automatically
- helps you catch anything you missed

Run again to toggle OFF.

---

## ✨ Features

### Day selector
✔ Bulk day selection  
✔ Smart checkbox detection  
✔ Scroll up/down/both  
✔ Language‑agnostic  

### Photo selector
✔ Selects visible photos automatically  
✔ Hides already selected photos (clean view)  
✔ Toggle ON/OFF  
✔ Scroll direction control (up/down)  
✔ Start at top/bottom/keep position  

---

## 🚀 Quick Start

1. Open Google Photos
2. Navigate to album or timeline
3. Open DevTools → Console
4. Paste one of the scripts
5. Press Enter

Done.

---

## ⚙️ Configuration

### Day selector

```javascript
const ACTION_MODE = "older"; // newer | older | both
const DAYS_TO_SELECT = 5;
const SAVE_CLICKS = true;
```

### Photo selector

```javascript
const START_AT = "top";     // top | bottom | keep
const SCROLL_MODE = "down"; // down | up
```

---

## 🧠 How It Works

Instead of relying on language‑specific labels like:

❌ aria-label^="Select all photos"

The scripts use:

✔ role="checkbox"  
✔ aria-checked state  
✔ DOM structure  
✔ visual proximity  

So they work in **any language**:
English, Spanish, Portuguese, French, German, etc.

---

## ⚠️ Disclaimer

Not an official Google tool.  
It simply simulates clicks locally in your browser.

Use responsibly.

---
