import sys
import json
import numpy as np

def read_json_file(filepath):
    with open(filepath, 'r') as file:
        return json.load(file)

def extract_vertices_and_faces(data):
    vertices = np.array(data['meshes'][0]['vertices']).reshape(-1, 3)
    faces = np.array([face for sublist in data['meshes'][0]['faces'] for face in sublist]).reshape(-1, 3)
    return vertices, faces

def calculate_center_of_mass(vertices):
    return np.mean(vertices, axis=0)

def main(filepath):
    data = read_json_file(filepath)
    vertices, faces = extract_vertices_and_faces(data)
    center_of_mass = calculate_center_of_mass(vertices)
    print(center_of_mass)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python script.py <path_to_json_file>")
    else:
        main(sys.argv[1])
