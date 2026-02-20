import numpy as np
from scipy.signal import welch

def extract_features(signal, fs=100):
    freqs, psd = welch(signal, fs)

    def band(l, h):
        return np.mean(psd[(freqs>=l) & (freqs<=h)])

    return [
        band(0.5,4), band(4,8), band(8,13),
        band(13,30), band(30,40),
        np.mean(signal), np.std(signal)
    ]
