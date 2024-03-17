import {
  RenderingEngine,
  Types,
  Enums,
  getRenderingEngine,
} from "@cornerstonejs/core";

import {
  initDemo,
  createImageIdsAndCacheMetaData,
  ctVoiRange,
  addButtonToToolbar,
} from "./utils";
import { useEffect, useRef } from "react";
import Title from "./components/Title";

function App() {
  const elementRef = useRef<HTMLDivElement>(null);
  const rotationInfoRef = useRef<HTMLDivElement>(null);
  const flipHorizontalInfoRef = useRef<HTMLDivElement>(null);
  const flipVerticalInfoRef = useRef<HTMLDivElement>(null);

  const { ViewportType, Events } = Enums;

  const viewportId = "CT_STACK";
  const renderingEngineId = "myRenderingEngine";

  useEffect(() => {
    async function run() {
      // Init Cornerstone and related libraries
      await initDemo();

      // Get Cornerstone imageIds and fetch metadata into RAM
      const imageIds = await createImageIdsAndCacheMetaData({
        StudyInstanceUID:
          "1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463",
        SeriesInstanceUID:
          "1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561",
        wadoRsRoot: "https://d3t6nz73ql33tx.cloudfront.net/dicomweb",
      });

      // Instantiate a rendering engine
      const renderingEngine = new RenderingEngine(renderingEngineId);

      // Create a stack viewport
      const viewportInput = {
        viewportId,
        type: ViewportType.STACK,
        element: elementRef.current!,
        defaultOptions: {
          background: [0.2, 0, 0.2] as Types.Point3,
        },
      };

      renderingEngine.enableElement(viewportInput);

      // Get the stack viewport that was created
      const viewport = renderingEngine.getViewport(
        viewportId
      ) as Types.IStackViewport;

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

    // Add event listener after rendering
    const viewportElement = elementRef.current;
    if (viewportElement) {
      viewportElement.addEventListener(
        Events.CAMERA_MODIFIED,
        handleCameraModified
      );
    }

    // Cleanup
    return () => {
      if (viewportElement) {
        viewportElement.removeEventListener(
          Events.CAMERA_MODIFIED,
          handleCameraModified
        );
      }
    };
  }, []);

  const handleCameraModified = () => {
    // Get the rendering engine
    const renderingEngine = getRenderingEngine(renderingEngineId);

    let viewport;

    // Get the stack viewport
    // Check if renderingEngine is defined
    if (renderingEngine) {
      // Get the stack viewport
      viewport = renderingEngine.getViewport(
        viewportId
      ) as Types.IStackViewport;

      // Check if viewport is defined
      if (viewport) {
        const { flipHorizontal, flipVertical } = viewport.getCamera();
        const { rotation } = viewport.getProperties();

        if (rotationInfoRef.current) {
          rotationInfoRef.current.innerText = `Rotation: ${Math.round(
            rotation as number
          )}`;
        }
        if (flipHorizontalInfoRef.current) {
          flipHorizontalInfoRef.current.innerText = `Flip horizontal: ${flipHorizontal}`;
        }
        if (flipVerticalInfoRef.current) {
          flipVerticalInfoRef.current.innerText = `Flip vertical: ${flipVertical}`;
        }
      } else {
        console.error("Viewport is undefined");
        return;
      }
    } else {
      console.error("Rendering engine is undefined");
    }
  };

  // Define button click handler outside the useEffect hook
  const handleRotateDelta30 = () => {
    // Get the rendering engine
    const renderingEngine = getRenderingEngine(renderingEngineId);

    // Get the stack viewport
    const viewport = renderingEngine?.getViewport(
      viewportId
    ) as Types.IStackViewport;

    if (!viewport) {
      console.error("Viewport is undefined");
      return;
    }

    const { rotation } = viewport.getProperties();
    viewport.setProperties({ rotation: rotation || 0 + 30 });

    viewport.render();
  };

  // Add button to toolbar
  addButtonToToolbar({
    title: "Rotate Delta 30",
    onClick: handleRotateDelta30,
  });

  return (
    <div className='w-full h-full flex flex-col'>
      <Title
        title='Basic Stack'
        description='Displays a single DICOM image in a Stack viewport.'
      />
      <div className='w-full'>
        <div ref={rotationInfoRef}>Rotation</div>
        <div ref={flipHorizontalInfoRef}>Flip horizontal</div>
        <div ref={flipVerticalInfoRef}>Flip vertical</div>
      </div>
      <div className='flex w-full'>
        <div
          id='cornerstone-element'
          className='h-80 w-1/2 border border-red-300'
          ref={elementRef}
        ></div>
        <div className='w-1/2 border border-red-300'></div>
      </div>
    </div>
  );
}

export default App;
