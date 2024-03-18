import { Types, getRenderingEngine } from "@cornerstonejs/core";
import { camera as cameraHelpers } from "../utils";

type GetViewportFromRenderingEngineProps = {
  renderingEngineId: string;
  viewportId: string;
};

export const getViewportFromRenderingEngine = ({
  renderingEngineId,
  viewportId,
}: GetViewportFromRenderingEngineProps) => {
  const renderingEngine = getRenderingEngine(renderingEngineId);

  if (!renderingEngine) {
    console.error("Rendering engine is undefined");
    return null;
  }

  const viewport = renderingEngine.getViewport(
    viewportId
  ) as Types.IStackViewport;

  if (!viewport) {
    console.error("Viewport is undefined");
    return null;
  }

  return viewport;
};

export const handleZooming = (
  renderingEngineId: string,
  viewportId: string
) => {
  const viewport = getViewportFromRenderingEngine({
    renderingEngineId,
    viewportId,
  });

  if (!viewport) return;

  viewport.resetCamera();

  const camera = viewport.getCamera();

  const { parallelScale, focalPoint } =
    cameraHelpers.getRandomlyTranslatedAndZoomedCameraProperties(camera);

  const newCamera = {
    parallelScale,
    focalPoint: focalPoint as Types.Point3,
  };

  viewport.setCamera(newCamera);
  viewport.render();
};

export const handleFlipH = (renderingEngineId: string, viewportId: string) => {
  const viewport = getViewportFromRenderingEngine({
    renderingEngineId,
    viewportId,
  });

  if (!viewport) return;

  const { flipHorizontal } = viewport.getCamera();
  viewport.setCamera({ flipHorizontal: !flipHorizontal });

  viewport.render();
};

export const handleFlipV = (renderingEngineId: string, viewportId: string) => {
  const viewport = getViewportFromRenderingEngine({
    renderingEngineId,
    viewportId,
  });

  if (!viewport) return;

  const { flipVertical } = viewport.getCamera();
  viewport.setCamera({ flipVertical: !flipVertical });

  viewport.render();
};

export const handleRotateDelta30 = (
  renderingEngineId: string,
  viewportId: string
) => {
  const viewport = getViewportFromRenderingEngine({
    renderingEngineId,
    viewportId,
  });

  if (!viewport) return;

  const { rotation } = viewport.getProperties();
  viewport.setProperties({ rotation: (rotation || 0) + 30 });

  viewport.render();
};

export const handleInvert = (renderingEngineId: string, viewportId: string) => {
  const viewport = getViewportFromRenderingEngine({
    renderingEngineId,
    viewportId,
  });

  if (!viewport) return;

  const { invert } = viewport.getProperties();
  viewport.setProperties({ invert: !invert });

  viewport.render();
};

export const handleApplyColormap = (
  renderingEngineId: string,
  viewportId: string
) => {
  const viewport = getViewportFromRenderingEngine({
    renderingEngineId,
    viewportId,
  });

  if (!viewport) return;

  viewport.setProperties({ colormap: { name: "hsv" } });

  viewport.render();
};

export const handleResetViewport = (
  renderingEngineId: string,
  viewportId: string
) => {
  const viewport = getViewportFromRenderingEngine({
    renderingEngineId,
    viewportId,
  });

  if (!viewport) return;

  viewport.resetProperties();
  viewport.resetCamera();

  viewport.render();
};

export const handleGoToPreviousImage = (
  renderingEngineId: string,
  viewportId: string
) => {
  const viewport = getViewportFromRenderingEngine({
    renderingEngineId,
    viewportId,
  });

  if (!viewport) return;

  // Get the current index of the image displayed
  const currentImageIdIndex = viewport.getCurrentImageIdIndex();

  // Increment the index, clamping to the first image if necessary
  let newImageIdIndex = currentImageIdIndex - 1;

  newImageIdIndex = Math.max(newImageIdIndex, 0);

  // Set the new image index, the viewport itself does a re-render
  viewport.setImageIdIndex(newImageIdIndex);
};

export const handleGoToNextImage = (
  renderingEngineId: string,
  viewportId: string
) => {
  const viewport = getViewportFromRenderingEngine({
    renderingEngineId,
    viewportId,
  });

  if (!viewport) return;

   // Get the current index of the image displayed
    const currentImageIdIndex = viewport.getCurrentImageIdIndex();

    // Increment the index, clamping to the last image if necessary
    const numImages = viewport.getImageIds().length;
    let newImageIdIndex = currentImageIdIndex + 1;

    newImageIdIndex = Math.min(newImageIdIndex, numImages - 1);

    // Set the new image index, the viewport itself does a re-render
    viewport.setImageIdIndex(newImageIdIndex);
};
