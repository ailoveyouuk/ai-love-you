import xml.etree.ElementTree as ET
import math

def analyze_3mf_object(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()
    # Define namespace
    ns = {'ns': 'http://schemas.microsoft.com/3dmanufacturing/core/2015/02'}
    
    vertices = []
    for vertex in root.findall('.//ns:vertex', ns):
        x = float(vertex.get('x'))
        y = float(vertex.get('y'))
        z = float(vertex.get('z'))
        radius = math.sqrt(x*x + y*y)
        vertices.append((radius, z))
    
    # Sort by radius to see the profiles
    vertices.sort()
    
    # Group by radius (rough bins)
    bins = {}
    for r, z in vertices:
        r_bin = round(r, 1)
        if r_bin not in bins:
            bins[r_bin] = set()
        bins[r_bin].add(round(z, 2))
    
    # Print a summary of planes
    print("Radial Z-Profile Analysis:")
    for r in sorted(bins.keys()):
        # Print every 5mm roughly
        if round(r, 0) % 5 == 0:
             print(f"Radius {r}mm: Z-values {sorted(list(bins[r]))}")
        # Print the transitions near the wall
        elif r > 40:
             print(f"Radius {r}mm: Z-values {sorted(list(bins[r]))}")

analyze_3mf_object('/tmp/coaster_extract/objects/3D/Objects/object_1.model')
