import numpy as np

data = np.load("data/healthy_activity.npy")

print("Shape:", data.shape)
print("Dtype:", data.dtype)
print("Min:", data.min())
print("Max:", data.max())
print("First frame:", data[0][:10] if data.ndim > 1 else data[:10])