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
  );
};

export default NavigationBar;
