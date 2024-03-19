import {
  handleZooming,
  handleFlipV,
  handleInvert,
  handleResetViewport,
  handleRotateDelta30,
  handleGoToPreviousImage,
  handleGoToNextImage,
  handleFlipH,
  handleApplyColormap,
} from "../utils/helpers";

import ImageManipulationButton from "./ImageManipulationButton";
import ImageNavigationButton from "./ImageNavigationButton";

interface NavigationBarProps {
  renderingEngineId: string;
  viewportId: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ renderingEngineId, viewportId }) => {
  return (
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
        <ImageNavigationButton
          title="Previous Image"
          onClick={() => handleGoToPreviousImage(renderingEngineId, viewportId)}
        />
        <ImageNavigationButton title="Next Image" onClick={() => handleGoToNextImage(renderingEngineId, viewportId)} />
      </div>
    </nav>
  );
};

export default NavigationBar;
