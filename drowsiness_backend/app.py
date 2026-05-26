from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import base64
import cv2
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)

model = load_model('drowsiness_model.h5')
print("✅ Model loaded!")

CLASS_LABELS = ['CLOSED', 'YAWN', 'NEUTRAL']

@app.route('/predict', methods=['POST'])
def predict():
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
    app.run(debug=True, port=5000)