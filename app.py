from flask import Flask, render_template, request
import torch
import clip
import cv2
from PIL import Image
import os

app = Flask(__name__)

# Upload folder
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Device (CPU recommended for deployment)
device = "cuda" if torch.cuda.is_available() else "cpu"

# Lazy loading (IMPORTANT)
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

        # Limit frames for speed & stability
        if frames >= 30:
            break

    cap.release()

    if frames == 0:
        return 0, 100

    ai_percent = int((score / frames) * 100)
    real_percent = 100 - ai_percent

    return ai_percent, real_percent

@app.route("/", methods=["GET", "POST"])
def index():
    result = None
    ai_frames = 0
    real_frames = 0

    if request.method == "POST":
        file = request.files["file"]

        if file.filename == "":
            return render_template(
                "index.html",
                result="No file selected",
                ai_frames=0,
                real_frames=0,
            )

        path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(path)

        ext = file.filename.lower().split(".")[-1]

        if ext in ["jpg", "jpeg", "png"]:
            img = cv2.imread(path)
            prob = ai_probability(img)
            ai_frames = int(prob * 100)
            real_frames = 100 - ai_frames
        else:
            ai_frames, real_frames = analyze_video(path)

        result = "AI Generated Content" if ai_frames >= 50 else "Real Content"

    return render_template(
        "index.html",
        result=result,
        ai_frames=ai_frames,
        real_frames=real_frames,
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
