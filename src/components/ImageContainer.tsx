import { useEffect } from "react";
import { MedicalViewport } from "../types/constants";

interface ImageContainerProps {
  viewportId: MedicalViewport;
  leftRef: React.RefObject<HTMLDivElement>;
  rightRef: React.RefObject<HTMLDivElement>;
  handleContainerClick: (container: MedicalViewport) => void;
}

const ImageContainer: React.FC<ImageContainerProps> = ({ viewportId, leftRef, rightRef, handleContainerClick }) => {
  useEffect(() => {
    console.log(viewportId);
  }, [viewportId]);

  return (
    <div className="flex w-full h-full">
      <div
        className={`w-1/2 ${viewportId === MedicalViewport.LEFT_CT_STACK_VIEWPORT && "border-4 border-main p-0.5"}`}
        ref={leftRef}
        onClick={() => handleContainerClick(MedicalViewport.LEFT_CT_STACK_VIEWPORT)}
      ></div>
      <div
        className={`w-1/2 ${viewportId === MedicalViewport.RIGHT_CT_STACK_VIEWPORT && "border-4 border-main p-0.5"}`}
        ref={rightRef}
        onClick={() => handleContainerClick(MedicalViewport.RIGHT_CT_STACK_VIEWPORT)}
      ></div>
    </div>
  );
};

export default ImageContainer;