from tvb.simulator.lab import *
import tvb_data
import json
import os

data_path = os.path.join(
    os.path.dirname(tvb_data.__file__),
    "connectivity",
    "connectivity_96.zip"
)

conn = connectivity.Connectivity.from_file(data_path)

connections = []

for i in range(len(conn.weights)):
    for j in range(len(conn.weights)):
        if conn.weights[i][j] > 0:
            connections.append({
                "source": int(i),
                "target": int(j),
                "weight": float(conn.weights[i][j])
            })

os.makedirs("../backend/data", exist_ok=True)

with open("../backend/data/brain_connections.json", "w") as f:
    json.dump(connections, f, indent=4)

print("Connections exported")