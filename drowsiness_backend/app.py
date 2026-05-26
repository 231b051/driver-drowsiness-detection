from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import base64
import cv2
import os

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

try:
    import tensorflow as tf
    model = tf.keras.models.load_model(
        'drowsiness_model.h5',
        compile=False
    )
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Model loading error: {e}")
    model = None

CLASS_LABELS = ['CLOSED', 'YAWN', 'NEUTRAL']

@app.route('/')
def home():
    return jsonify({'status': 'Drowsiness Detection API is running!'})

@app.route('/predict', methods=['OPTIONS'])
def options():
    return '', 200

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    try:
        data = request.json['image']
        img_data = base64.b64decode(data.split(',')[1])
        np_arr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        frame = cv2.resize(frame, (80, 80))
        frame = frame / 255.0
        frame = np.expand_dims(frame, axis=0)

        predictions = model.predict(frame)[0]
        class_index = np.argmax(predictions)
        label = CLASS_LABELS[class_index]
        confidence = float(predictions[class_index])

        return jsonify({
            'prediction': label,
            'confidence': confidence
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)