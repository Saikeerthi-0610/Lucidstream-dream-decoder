from sklearn.svm import SVC
import numpy as np
import pickle
import os

# Ensure model is saved in the same folder as this file
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "svm_model.pkl")

# Fake training data
X = np.random.rand(100, 7)
y = np.random.randint(0, 4, 100)

# Train model
model = SVC(probability=True)
model.fit(X, y)

# Save model
with open(MODEL_PATH, "wb") as f:
    pickle.dump(model, f)

print("✅ svm_model.pkl created successfully")
print("📍 Location:", MODEL_PATH)