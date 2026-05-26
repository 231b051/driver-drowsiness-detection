# 😴 CNN-based Real-Time Driver Drowsiness Detection System

A real-time driver safety system that detects drowsiness using a Convolutional Neural Network (CNN) model trained on eye state data, integrated with a web-based dashboard for live monitoring and instant alerts.

---

## 🎯 Features

- 🎥 Real-time camera feed with live detection
- 🧠 CNN model trained on custom dataset (CLOSED / YAWN / NEUTRAL)
- 📊 96% training accuracy, 100% validation accuracy
- ⚠️ Smart alert system with audio + visual alerts
- 🔐 User Authentication (Signup / Login)
- ⏱️ Session timer and event log
- 📱 Mobile friendly web interface
- 🔁 Consecutive frame threshold to avoid false alerts

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Model** | CNN (Convolutional Neural Network) |
| **Framework** | TensorFlow / Keras |
| **Camera Processing** | OpenCV |
| **Backend** | Flask (Python) |
| **Frontend** | HTML, CSS, JavaScript |
| **API** | REST API (Flask) |

---

## 📁 Project Structure
driver-drowsiness-detection/
│
├── 📁 frontend/                  # Web Application
│   ├── index.html                # Login Page
│   ├── 📁 pages/
│   │   ├── signup.html           # Register Page
│   │   └── dashboard.html        # Detection Dashboard
│   ├── 📁 css/
│   │   ├── auth.css              # Login/Signup Styles
│   │   └── dashboard.css         # Dashboard Styles
│   └── 📁 js/
│       ├── auth.js               # Authentication Logic
│       └── dashboard.js          # Camera + Detection Logic
│
└── 📁 drowsiness_backend/        # Flask Backend
├── app.py                    # Flask API Server
├── train_model.ipynb         # CNN Model Training
└── requirements.txt          # Python Dependencies

---

## 🧠 How It Works
📷 Live Camera Feed
↓
🖼️  Capture frame every 1.5 seconds
↓
📤 Send as base64 image to Flask API
↓
🧠 CNN Model predicts eye state
↓
📊 Returns: CLOSED / YAWN / NEUTRAL
↓
⚠️  3 consecutive CLOSED frames → Alert!
↓
🔊 Audio + Visual Alert triggered

---

## 📊 Model Details

| Parameter | Value |
|---|---|
| Input Size | 80 x 80 pixels |
| Classes | CLOSED, YAWN, NEUTRAL |
| Architecture | CNN (Conv2D + MaxPooling + Dense) |
| Optimizer | Adam (lr=0.001) |
| Loss Function | Categorical Crossentropy |
| Epochs | 10 |
| Training Accuracy | 96.05% |
| Validation Accuracy | 100% |

---

## 🚀 How to Run

### 1. Clone the Repository
```bash
git clone https://github.com/231b051/driver-drowsiness-detection.git
cd driver-drowsiness-detection
```

### 2. Setup Backend
```bash
cd drowsiness_backend
pip install -r requirements.txt
python app.py
```
Backend runs at → `http://127.0.0.1:5000`

### 3. Setup Frontend
- Open `frontend/index.html` in VS Code
- Right click → **Open with Live Server**

Frontend runs at → `http://127.0.0.1:5500`

### 4. Use the App
1. Register a new account
2. Login with your credentials
3. Click **Start Detection**
4. Allow camera permission
5. System starts monitoring in real time

---

## ⚠️ Alert System Logic
NEUTRAL  → Driver is awake ✅ — no alert
YAWN     → 2 consecutive yawns → ⚠️ Warning alert
CLOSED   → 3 consecutive closed frames → 🚨 Danger alert
Cooldown → 8 seconds between alerts to avoid spam

---

## 📦 Requirements
flask
flask-cors
numpy
opencv-python
tensorflow

Install all:
```bash
pip install flask flask-cors numpy opencv-python tensorflow
```

---


## 👨‍💻 Developer

**Ankit Raj**
B.Tech Computer Science — JUET
- 🔗 [LinkedIn](https://www.linkedin.com/in/ankit-raj-1b9260284/)
- 🐙 [GitHub](https://github.com/231b051)

---

## 📄 License

This project is for educational purposes as part of B.Tech Minor Project.

---

⭐ If you found this helpful, give it a star on GitHub!