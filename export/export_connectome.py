from tvb.simulator.lab import *
import tvb_data
import os
import json

# Load connectivity
data_path = os.path.join(
    os.path.dirname(tvb_data.__file__),
    "connectivity",
    "connectivity_96.zip"
)

conn = connectivity.Connectivity.from_file(data_path)

conn.configure()

brain = {
    "labels": conn.region_labels.tolist(),
    "centres": conn.centres.tolist(),
    "weights": conn.weights.tolist(),
    "tract_lengths": conn.tract_lengths.tolist()
}

with open("brain_data.json", "w") as f:
    json.dump(brain, f, indent=4)

print("brain_data.json created successfully!")