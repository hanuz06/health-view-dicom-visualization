import { useEffect, useRef, useState } from "react";
import { RenderingEngine, Enums } from "@cornerstonejs/core";
import { initDemo, createImageIdsAndCacheMetaData, ctVoiRange } from "./utils";
import { getViewportFromRenderingEngine } from "./utils/helpers";
import { MedicalViewport } from "./types/constants";

import ImageContainer from "./components/ImageContainer";
import NavigationBar from "./components/NavigationBar";

// Get Cornerstone imageIds and fetch metadata into RAM
const imageIds = await createImageIdsAndCacheMetaData({
  StudyInstanceUID: "1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463",
  SeriesInstanceUID: "1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561",
  wadoRsRoot: "https://d3t6nz73ql33tx.cloudfront.net/dicomweb",
});

function App() {
  const [viewportId, setViewportId] = useState<MedicalViewport>(MedicalViewport.LEFT_CT_STACK_VIEWPORT);

  const leftImageContainerRef = useRef<HTMLDivElement>(null);
  const rightImageContainerRef = useRef<HTMLDivElement>(null);

  const { ViewportType } = Enums;

  const renderingEngineId = "myRenderingEngine";

  useEffect(() => {
    async function initialRun() {
      await initDemo();

      const renderingEngine = new RenderingEngine(renderingEngineId);

      const leftViewportInput = {
        viewportId: MedicalViewport.LEFT_CT_STACK_VIEWPORT,
        type: ViewportType.STACK,
        element: leftImageContainerRef.current!,
      };

      const rightViewportInput = {
        viewportId: MedicalViewport.RIGHT_CT_STACK_VIEWPORT,
        type: ViewportType.STACK,
        element: rightImageContainerRef.current!,
      };

      renderingEngine.enableElement(leftViewportInput);
      renderingEngine.enableElement(rightViewportInput);

      const leftViewport = getViewportFromRenderingEngine({
        renderingEngineId,
        viewportId: MedicalViewport.LEFT_CT_STACK_VIEWPORT,
      });

      const rightViewport = getViewportFromRenderingEngine({
        renderingEngineId,
        viewportId: MedicalViewport.RIGHT_CT_STACK_VIEWPORT,
      });

      if (!leftViewport || !rightViewport) return;

      const stack = [imageIds[0], imageIds[1]];

      await leftViewport.setStack(stack);
      await rightViewport.setStack(stack);

      leftViewport.setProperties({ voiRange: ctVoiRange });
      rightViewport.setProperties({ voiRange: ctVoiRange });

      leftViewport.render();
      rightViewport.render();
    }

    initialRun();
  }, []);

  async function updateViewport(currentImageContainer: HTMLDivElement, currentViewportId: MedicalViewport) {
    const renderingEngine = new RenderingEngine(renderingEngineId);

    const viewportInput = {
      viewportId: currentViewportId,
      type: ViewportType.STACK,
      element: currentImageContainer,
    };

    renderingEngine.enableElement(viewportInput);

    const viewport = getViewportFromRenderingEngine({
      renderingEngineId,
      viewportId: currentViewportId,
    });

    if (!viewport) return;

    const stack = [imageIds[0], imageIds[1]];

    await viewport.setStack(stack);

    viewport.setProperties({ voiRange: ctVoiRange });

    viewport.render();
  }

  const handleContainerClick = (imageContainer: MedicalViewport) => {
    setViewportId(imageContainer);

    if (imageContainer === MedicalViewport.LEFT_CT_STACK_VIEWPORT) {
      updateViewport(leftImageContainerRef.current!, imageContainer);
    } else {
      updateViewport(rightImageContainerRef.current!, imageContainer);
    }
  };

  return (
    <main className="w-screen h-screen flex flex-col">
      <NavigationBar renderingEngineId={renderingEngineId} viewportId={viewportId} />
      <ImageContainer
        viewportId={viewportId}
        leftRef={leftImageContainerRef}
        rightRef={rightImageContainerRef}
        handleContainerClick={handleContainerClick}
      />
    </main>
  );
}

export default App;
