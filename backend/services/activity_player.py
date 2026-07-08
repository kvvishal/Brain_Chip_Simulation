import os
import numpy as np


class ActivityPlayer:

    def __init__(self):

        file_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "data",
            "healthy_activity.npy"
        )

        self.frames = np.load(file_path)

        self.total_frames = self.frames.shape[0]
        self.total_regions = self.frames.shape[1]

        print(f"Loaded {self.total_frames} frames")
        print(f"Regions: {self.total_regions}")

    def get_frame(self, index):

        index = max(0, min(index, self.total_frames - 1))

        return self.frames[index].tolist()

    def get_info(self):

        return {
            "frames": self.total_frames,
            "regions": self.total_regions
        }


activity_player = ActivityPlayer()