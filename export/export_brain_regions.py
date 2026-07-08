from tvb.simulator.lab import *
import tvb_data
import os
import json
import numpy as np

data_path = os.path.join(
    os.path.dirname(tvb_data.__file__),
    "connectivity",
    "connectivity_96.zip"
)

conn = connectivity.Connectivity.from_file(data_path)

# ------------------------
# Normalize coordinates
# ------------------------

centres = conn.centres.copy()

max_value = np.abs(centres).max()

centres = centres / max_value

regions=[]

for i in range(len(conn.region_labels)):

    regions.append({

        "id":int(i),

        "name":str(conn.region_labels[i]),

        "position":[

            float(centres[i][0]),

            float(centres[i][1]),

            float(centres[i][2])

        ]

    })

output={
    "regions":regions
}

with open("backend/data/brain_regions.json","w") as f:

    json.dump(output,f,indent=4)

print("Done")