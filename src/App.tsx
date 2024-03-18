import { RenderingEngine, Types, Enums } from "@cornerstonejs/core";

import { initDemo, createImageIdsAndCacheMetaData, ctVoiRange } from "./utils";
import { useEffect, useRef } from "react";
import {
  getViewportFromRenderingEngine,
  handleApplyColormap,
  handleFlipH,
  handleFlipV,
  handleInvert,
  handleResetViewport,
  handleRotateDelta30,
  handleZooming,
  handleGoToPreviousImage,
  handleGoToNextImage,
} from "./utils/helpers";
import ImageManipulationButton from "./components/ImageManipulationButton";

function App() {
  const leftImageContainerRef = useRef<HTMLDivElement>(null);
  const rightImageContainerRef = useRef<HTMLDivElement>(null);

  const { ViewportType } = Enums;

  const viewportId = "CT_STACK";
  const renderingEngineId = "myRenderingEngine";

  useEffect(() => {
    async function run() {
      // Init Cornerstone and related libraries
      await initDemo();

      // Get Cornerstone imageIds and fetch metadata into RAM
      const imageIds = await createImageIdsAndCacheMetaData({
        StudyInstanceUID: "1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463",
        SeriesInstanceUID: "1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561",
        wadoRsRoot: "https://d3t6nz73ql33tx.cloudfront.net/dicomweb",
      });

      // Instantiate a rendering engine
      const renderingEngine = new RenderingEngine(renderingEngineId);

      // Create a stack viewport
      const viewportInput = {
        viewportId,
        type: ViewportType.STACK,
        element: leftImageContainerRef.current!,
        defaultOptions: {
          background: [0.2, 0, 0.2] as Types.Point3,
        },
      };

      renderingEngine.enableElement(viewportInput);

      const viewport = getViewportFromRenderingEngine({
        renderingEngineId,
        viewportId,
      });

      if (!viewport) return;

      // Define a stack containing a single image
      const stack = [imageIds[0], imageIds[1]];

      // Set the stack on the viewport
      await viewport.setStack(stack);

      // Set the VOI of the stack
      viewport.setProperties({ voiRange: ctVoiRange });

      // Render the image
      viewport.render();
    }

    run();
  }, [ViewportType.STACK]);

  return (
    <div className="w-screen h-screen flex flex-col">
      <nav className="flex items-center justify-between w-full h-28 px-10">
        <h3 className="text-xl font-bold">Dicom Viewer(with Cornerstone.js)</h3>
        <div className="flex gap-1">
          <ImageManipulationButton title="Zoom" onClick={() => handleZooming(renderingEngineId, viewportId)} />
          <ImageManipulationButton title="Flip H" onClick={() => handleFlipH(renderingEngineId, viewportId)} />
          <ImageManipulationButton title="Flip V" onClick={() => handleFlipV(renderingEngineId, viewportId)} />
          <ImageManipulationButton
            title="Rotate Delta 30"
            onClick={() => handleRotateDelta30(renderingEngineId, viewportId)}
          />
          <ImageManipulationButton title="Invert" onClick={() => handleInvert(renderingEngineId, viewportId)} />
          <ImageManipulationButton
            title="Apply Colormap"
            onClick={() => handleApplyColormap(renderingEngineId, viewportId)}
          />
          <ImageManipulationButton title="Reset" onClick={() => handleResetViewport(renderingEngineId, viewportId)} />
        </div>
        <div className="flex">
          <button
            className="px-2 py-3 border flex items-center justify-center ml-1 font-semibold text-white bg-main hover:bg-blue-700"
            onClick={() => handleGoToPreviousImage(renderingEngineId, viewportId)}
          >
            Previous Image
          </button>
          <button
            className="px-2 py-3 border flex items-center justify-center ml-1 font-semibold text-white bg-main hover:bg-blue-700"
            onClick={() => handleGoToNextImage(renderingEngineId, viewportId)}
          >
            Next Image
          </button>
        </div>
      </nav>
      <div className="flex w-full h-full">
        <div className="w-1/2 border-4 border-main" ref={leftImageContainerRef}></div>
        <div className="w-1/2" ref={rightImageContainerRef}></div>
      </div>
    </div>
  );
}

export default App;
