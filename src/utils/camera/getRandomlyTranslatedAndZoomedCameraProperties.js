import { vec3 } from "gl-matrix";

let modifierIndex = 0;

export default function getRandomlyTranslatedAndZoomedCameraProperties(camera) {
  const { viewUp, viewPlaneNormal, parallelScale, focalPoint } = camera;

  const modifierValues = [0.9, 0.8, 0.7]; // Define the desired values for zoom levels

  // Function to get the next random modifier value
  const getNextModifier = () => {
    const modifier = modifierValues[modifierIndex];
    modifierIndex = (modifierIndex + 1) % modifierValues.length; // Cycle through the values
    console.log(modifier);
    return modifier;
  };

  // Usage example
  const randomModifier = getNextModifier();
  const newParallelScale = parallelScale * randomModifier;

  // Move the camera in plane by some random number
  let viewRight = vec3.create(); // Get the X direction of the viewport

  vec3.cross(viewRight, viewUp, viewPlaneNormal);

  viewRight = [-viewRight[0], -viewRight[1], -viewRight[2]];

  const diff = [0, 0, 0];

  // const newPosition = [];
  const newFocalPoint = [];

  for (let i = 0; i <= 2; i++) {
    newFocalPoint[i] = focalPoint[i] + diff[i];
  }

  return {
    focalPoint: newFocalPoint,
    parallelScale: newParallelScale,
  };
}
