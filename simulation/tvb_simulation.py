from tvb.simulator.lab import *
from tvb.simulator import models
import tvb_data
import os
import numpy as np
import matplotlib.pyplot as plt

# -------------------------------
# Load Connectivity
# -------------------------------
data_path = os.path.join(
    os.path.dirname(tvb_data.__file__),
    "connectivity",
    "connectivity_96.zip"
)

conn = connectivity.Connectivity.from_file(data_path)
conn.speed = np.array([3.0])

# -------------------------------
# Brain Model
# -------------------------------
model = models.Generic2dOscillator()

# -------------------------------
# Coupling
# -------------------------------
coupling_model = coupling.Linear(
    a=np.array([0.00390625])
)

# -------------------------------
# Integrator
# -------------------------------
integrator = integrators.HeunDeterministic(
    dt=0.01220703125
)

# -------------------------------
# Monitor
# -------------------------------
monitor = (monitors.Raw(),)

# -------------------------------
# Simulator
# -------------------------------
sim = simulator.Simulator(
    model=model,
    connectivity=conn,
    coupling=coupling_model,
    integrator=integrator,
    monitors=monitor
)

sim.configure()

print("Running Healthy Brain Simulation...")

(raw_data,) = sim.run(
    simulation_length=1000
)

print("Simulation Completed!")

# -------------------------------
# Extract Activity
# -------------------------------
time = raw_data[0]

activity = raw_data[1]

print("Time Shape:", time.shape)
print("Activity Shape:", activity.shape)

# Convert from (time,1,96,1) -> (time,96)
activity = activity[:,0,:,0]

# -------------------------------
# Save Results
# -------------------------------
backend_data = os.path.join(
    "..",
    "backend",
    "data"
)

os.makedirs(backend_data, exist_ok=True)

np.save(
    os.path.join(
        backend_data,
        "healthy_activity.npy"
    ),
    activity
)

print("Saved healthy_activity.npy")

# -------------------------------
# Plot First Region
# -------------------------------
plt.figure(figsize=(12,5))

plt.plot(time, activity[:,0])

plt.title("Healthy Brain Activity")

plt.xlabel("Time (ms)")
plt.ylabel("Activity")

plt.grid(True)

plt.show()