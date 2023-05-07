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

def create_rotation_matrix(axis, angle_degrees):
    angle_radians = np.deg2rad(angle_degrees)
    cos_angle = np.cos(angle_radians)
    sin_angle = np.sin(angle_radians)
    
    if axis == 'x':
        return np.array([
            [1, 0, 0, 0],
            [0, cos_angle, -sin_angle, 0],
            [0, sin_angle, cos_angle, 0],
            [0, 0, 0, 1]
        ]).flatten()
    elif axis == 'y':
        return np.array([
            [cos_angle, 0, sin_angle, 0],
            [0, 1, 0, 0],
            [-sin_angle, 0, cos_angle, 0],
            [0, 0, 0, 1]
        ]).flatten()
    elif axis == 'z':
        return np.array([
            [cos_angle, -sin_angle, 0, 0],
            [sin_angle, cos_angle, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]).flatten()
    else:
        raise ValueError('Invalid axis, must be "x", "y", or "z".')

def main(filepath, axis):
    data = read_json_file(filepath)
    vertices, faces = extract_vertices_and_faces(data)
    center_of_mass = calculate_center_of_mass(vertices)
    rotation_matrix = create_rotation_matrix(axis, 1)
    print(', '.join(map(str, rotation_matrix)))

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python script.py <path_to_json_file> <rotation_axis>")
    else:
        main(sys.argv[1], sys.argv[2])
