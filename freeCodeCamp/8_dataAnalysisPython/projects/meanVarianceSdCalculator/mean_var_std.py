import numpy as np

def calculate(inputList):
  try:
    newMatrix = np.reshape(np.array(inputList), (3,3))
  except ValueError:
    raise ValueError("List must contain nine numbers.")
  
  return {
    'mean': [np.mean(newMatrix, axis=0).tolist(), np.mean(newMatrix, axis=1).tolist(), np.mean(newMatrix)],
    'variance': [np.var(newMatrix, axis=0).tolist(), np.var(newMatrix, axis=1).tolist(), np.var(newMatrix)],
    'standard deviation': [np.std(newMatrix, axis=0).tolist(), np.std(newMatrix, axis=1).tolist(), np.std(newMatrix)],
    'max': [newMatrix.max(axis=0).tolist(), newMatrix.max(axis=1).tolist(), newMatrix.max()],
    'min': [newMatrix.min(axis=0).tolist(), newMatrix.min(axis=1).tolist(), newMatrix.min()],
    'sum': [np.sum(newMatrix, axis=0).tolist(), np.sum(newMatrix, axis=1).tolist(), np.sum(newMatrix)]
  }