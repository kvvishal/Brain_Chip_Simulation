import numpy as np
import os

class ActivityService:

    def __init__(self):

        path = os.path.join(
            "data",
            "healthy_activity.npy"
        )

        self.data = np.load(path)

        print("Activity Shape:", self.data.shape)

    def get_frame(self, frame):

        frame = frame % len(self.data)

        return self.data[frame].tolist()


activity_service = ActivityService()