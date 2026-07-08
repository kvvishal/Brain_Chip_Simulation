import json
import os

from flask import Blueprint, jsonify

brain_bp = Blueprint("brain", __name__)

@brain_bp.route("/brain_regions")
def brain_regions():

    path = os.path.join(
        os.path.dirname(__file__),
        "..",
        "data",
        "brain_regions.json"
    )

    with open(path) as f:
        data = json.load(f)

    return jsonify(data)