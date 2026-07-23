from flask import Flask, render_template, request, send_from_directory, jsonify
from flask_cors import CORS
import torch
import clip
import cv2
from PIL import Image
import os
import time
import json
import mimetypes

# Fix Windows MIME type registration for JavaScript & CSS modules
mimetypes.init()
mimetypes.types_map['.js'] = 'application/javascript'
mimetypes.types_map['.mjs'] = 'application/javascript'
mimetypes.types_map['.jsx'] = 'application/javascript'
mimetypes.types_map['.ts'] = 'application/javascript'
mimetypes.types_map['.tsx'] = 'application/javascript'
mimetypes.types_map['.css'] = 'text/css'
mimetypes.types_map['.json'] = 'application/json'
mimetypes.types_map['.wasm'] = 'application/wasm'
mimetypes.types_map['.svg'] = 'image/svg+xml'

for ext in ['.js', '.mjs', '.jsx', '.ts', '.tsx']:
    mimetypes.add_type('application/javascript', ext)
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('application/json', '.json')
mimetypes.add_type('application/wasm', '.wasm')
mimetypes.add_type('image/svg+xml', '.svg')

app = Flask(__name__, static_folder="dist", static_url_path="")
CORS(app)  # Enable CORS for React frontend

@app.after_request
def set_mime_types(response):
    path = request.path.lower().split('?')[0]
    if any(path.endswith(ext) for ext in ['.js', '.mjs', '.jsx', '.ts', '.tsx']):
        response.headers["Content-Type"] = "application/javascript; charset=utf-8"
    elif path.endswith(".css"):
        response.headers["Content-Type"] = "text/css; charset=utf-8"
    elif path.endswith(".wasm"):
        response.headers["Content-Type"] = "application/wasm"
    elif path.endswith(".json"):
        response.headers["Content-Type"] = "application/json; charset=utf-8"
    elif path.endswith(".svg"):
        response.headers["Content-Type"] = "image/svg+xml"
    return response


# Upload folder
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# In-memory history store (and disk backup)
HISTORY_FILE = "detection_history.json"
detection_history = []

if os.path.exists(HISTORY_FILE):
    try:
        with open(HISTORY_FILE, "r") as f:
            detection_history = json.load(f)
    except Exception:
        detection_history = []

def save_history():
    try:
        with open(HISTORY_FILE, "w") as f:
            json.dump(detection_history, f, indent=2)
    except Exception as e:
        print("Error saving history:", e)

# Device
device = "cuda" if torch.cuda.is_available() else "cpu"

# Lazy loading
model = None
preprocess = None

def load_model():
    global model, preprocess
    if model is None:
        model, preprocess = clip.load("ViT-B/32", device=device)
        model.eval()

def ai_probability(img):
    load_model()

    image = preprocess(Image.fromarray(img)).unsqueeze(0).to(device)
    text = clip.tokenize(
        ["a real photograph", "an AI-generated image"]
    ).to(device)

    with torch.no_grad():
        image_features = model.encode_image(image)
        text_features = model.encode_text(text)
        similarity = (image_features @ text_features.T).softmax(dim=-1)

    return similarity[0][1].item()

def analyze_video(path):
    cap = cv2.VideoCapture(path)
    score = 0
    frames = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        score += ai_probability(frame)
        frames += 1

        if frames >= 30:   # limit frames
            break

    cap.release()

    if frames == 0:
        return 0, 100

    ai_percent = int((score / frames) * 100)
    real_percent = 100 - ai_percent

    return ai_percent, real_percent

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

@app.route("/api/analyze", methods=["POST"], strict_slashes=False)
def api_analyze():
    if "file" not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    filename = file.filename
    path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(path)

    ext = filename.lower().split(".")[-1]
    is_image = ext in ["jpg", "jpeg", "png", "webp", "bmp"]

    if is_image:
        img = cv2.imread(path)
        if img is None:
            return jsonify({"error": "Could not read image file"}), 400
        prob = ai_probability(img)
        ai_frames = int(prob * 100)
        real_percent = 100 - ai_frames
        media_type = "image"
    else:
        ai_frames, real_percent = analyze_video(path)
        media_type = "video"

    result_label = "AI Generated Content" if ai_frames >= 50 else "Real Content"

    history_item = {
        "id": int(time.time() * 1000),
        "filename": filename,
        "file_url": f"/uploads/{filename}",
        "media_type": media_type,
        "result": result_label,
        "ai_percent": ai_frames,
        "real_percent": real_percent,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }

    detection_history.insert(0, history_item)
    save_history()

    return jsonify({
        "success": True,
        "data": history_item
    })

@app.route("/api/history", methods=["GET"], strict_slashes=False)
def api_history():
    return jsonify({
        "success": True,
        "history": detection_history
    })

@app.route("/api/stats", methods=["GET"], strict_slashes=False)
def api_stats():
    total_scans = len(detection_history)
    ai_count = sum(1 for item in detection_history if item["result"] == "AI Generated Content")
    real_count = total_scans - ai_count
    avg_ai_score = round(sum(item["ai_percent"] for item in detection_history) / max(1, total_scans), 1)

    return jsonify({
        "success": True,
        "total_scans": total_scans,
        "ai_count": ai_count,
        "real_count": real_count,
        "avg_ai_score": avg_ai_score
    })

def get_mimetype(filepath):
    ext = os.path.splitext(filepath)[1].lower()
    if ext in ['.js', '.mjs', '.jsx', '.ts', '.tsx']:
        return 'application/javascript; charset=utf-8'
    elif ext == '.css':
        return 'text/css; charset=utf-8'
    elif ext == '.json':
        return 'application/json; charset=utf-8'
    elif ext == '.wasm':
        return 'application/wasm'
    elif ext == '.svg':
        return 'image/svg+xml'
    return None

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path.startswith("api/"):
        return jsonify({"error": "API route not found", "success": False}), 404
    target_path = os.path.join(app.static_folder, path)
    if path != "" and os.path.exists(target_path) and not os.path.isdir(target_path):
        mimetype = get_mimetype(path)
        return send_from_directory(app.static_folder, path, mimetype=mimetype)
    elif os.path.exists(os.path.join(app.static_folder, "index.html")):
        return send_from_directory(app.static_folder, "index.html", mimetype="text/html; charset=utf-8")
    else:
        # Fallback to legacy index or basic info if dist is not built yet
        if os.path.exists("templates/index.html"):
            return render_template("index.html")
        return "React Frontend is building or ready on Vite Dev Server (port 5173)."


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)


