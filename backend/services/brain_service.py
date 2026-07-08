import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

DATA_DIR = os.path.join(BASE_DIR, "data")

with open(
    os.path.join(DATA_DIR, "brain_data.json")
) as f:

    brain = json.load(f)


def get_brain():

    return brain