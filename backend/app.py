from flask import Flask, json, jsonify, request
from flask_cors import CORS
import os

from routes.activity import activity_bp
from routes.brain import brain_bp

from services.brain_service import get_brain

app = Flask(__name__)
CORS(app)

app.register_blueprint(brain_bp)

app.register_blueprint(activity_bp)

@app.route("/")
def home():
    return "Brain Chip Backend Running"

@app.route("/brain")
def brain():
    return "Brain Data"

@app.route("/brain_regions")
def brain_regions():
    with open("data/brain_regions.json") as f:
        return jsonify(json.load(f))

@app.route("/save_regions", methods=["POST"])
def save_regions():

    data = request.json

    path = os.path.join(
        os.path.dirname(__file__),
        "data",
        "generated_regions.json"
    )

    with open(path, "w") as f:
        json.dump(data, f, indent=4)

    return {"status": "saved"}

@app.route("/brain_connections")
def brain_connections():

    with open("data/brain_connections.json") as f:
        
        return jsonify(json.load(f))

if __name__ == "__main__":
    app.run(debug=True)