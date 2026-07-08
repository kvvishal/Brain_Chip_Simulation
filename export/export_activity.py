import numpy as np
import json
import os

activity = np.load("backend/data/healthy_activity.npy")

print("Shape:", activity.shape)

frames = []

for t in range(activity.shape[0]):
    frames.append(activity[t].tolist())

os.makedirs("backend/data", exist_ok=True)

with open("backend/data/activity.json", "w") as f:
    json.dump({"frames": frames}, f)

print("activity.json created successfully")