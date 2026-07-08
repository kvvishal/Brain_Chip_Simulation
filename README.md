# 🧠 Brain Chip Simulator for Alzheimer's Disease

> An interactive 3D Brain Simulator for visualizing Alzheimer's disease
> progression and a conceptual Brain Chip therapy.

## Overview

This project combines **The Virtual Brain (TVB)**, **React Three
Fiber**, **Three.js**, **Flask**, and **Python** to visualize:

-   Healthy Brain
-   Alzheimer's Disease
-   Brain Regions (96 ROI)
-   Structural Connectivity (1302 connections)
-   Future Brain Chip stimulation and recovery

## Features

-   Interactive 3D Brain
-   96 Brain Regions
-   TVB Connectome
-   Animated Regions
-   Brain Engine
-   Disease Engine
-   Healthy / Alzheimer's / Brain Chip Controls
-   Flask Backend

## Tech Stack

### Frontend

-   Next.js
-   React
-   TypeScript
-   Three.js
-   React Three Fiber
-   Drei
-   Tailwind CSS

### Backend

-   Flask
-   Python
-   NumPy

### Neuroscience

-   The Virtual Brain (TVB)

## Project Structure

``` text
frontend/
backend/
docs/
README.md
```

## Installation

### Frontend

``` bash
cd frontend
npm install
npm run dev
```

### Backend

``` bash
cd backend
pip install -r requirements.txt
python app.py
```

# Generating TVB Data

Required files:

``` text
backend/data/

regions.json
brain_connections.json
healthy_activity.npy
activity.json (optional)
```

## Export Regions

``` python
from tvb.datatypes.connectivity import Connectivity

connectivity = Connectivity.from_file()

regions=[]

for i in range(len(connectivity.region_labels)):
    regions.append({
        "id":i,
        "name":connectivity.region_labels[i],
        "position":connectivity.centres[i].tolist()
    })
```

Save as `regions.json`.

## Export Connectivity

``` python
connections=[]

for i in range(connectivity.weights.shape[0]):
    for j in range(connectivity.weights.shape[1]):
        if connectivity.weights[i][j]>0:
            connections.append({
                "source":i,
                "target":j,
                "weight":float(connectivity.weights[i][j])
            })
```

Save as `brain_connections.json`.

## Export Healthy Activity

``` python
import numpy as np

np.save("healthy_activity.npy", activity)
```

Optional JSON:

``` python
import json
import numpy as np

activity=np.load("healthy_activity.npy")
json.dump(activity.tolist(), open("activity.json","w"))
```

## Simulation Pipeline

``` text
TVB
 ↓
Connectivity + Regions
 ↓
JSON / NPY
 ↓
Flask Backend
 ↓
React Three Fiber
 ↓
3D Brain
 ↓
Healthy
 ↓
Alzheimer's
 ↓
Brain Chip
```

## Roadmap

-   ✅ 3D Brain
-   ✅ Brain Regions
-   ✅ Connectome
-   ✅ Brain Engine
-   ✅ Disease Engine
-   🚧 Real TVB Activity
-   🚧 Disease Progression
-   🚧 Brain Chip Implant
-   ⏳ Neural Pulse Animation
-   ⏳ Analytics Dashboard

## Author

**Vishal Kashyap**

B.Sc. Research Project

## License

Academic and research use.
