from flask import Blueprint, jsonify
from services.activity_player import activity_player

simulation_bp = Blueprint("simulation", __name__)


@simulation_bp.route("/simulation/info")
def simulation_info():

    return jsonify(activity_player.get_info())

@simulation_bp.route("/simulation/all")
def simulation_all():
    return jsonify({

        "frames" : activity_player.frames.tolist()
    })

@simulation_bp.route("/simulation/frame/<int:index>")
def simulation_frame(index):

    return jsonify({

        "frame": index,

        "activity": activity_player.get_frame(index)

    })