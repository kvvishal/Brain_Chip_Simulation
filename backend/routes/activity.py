from flask import Blueprint, jsonify
from services.activity_service import activity_service

activity_bp = Blueprint(
    "activity",
    __name__
)

frame = 0


@activity_bp.route("/activity")

def activity():

    global frame

    values = activity_service.get_frame(frame)

    frame += 1

    return jsonify({

        "frame": values

    })