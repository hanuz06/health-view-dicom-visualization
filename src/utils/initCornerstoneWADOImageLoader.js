import dicomParser from "dicom-parser";
import * as cornerstone from "@cornerstonejs/core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";

export default function initCornerstoneWADOImageLoader() {
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  cornerstoneWADOImageLoader.configure({
    useWebWorkers: true,
    decodeConfig: {
      convertFloatPixelDataToInt: false
    }
  });

  var config = {
    maxWebWorkers: navigator.hardwareConcurrency || 1,
    startWebWorkersOnDemand: true,
    taskConfiguration: {
      decodeTask: {
        initializeCodecsOnStartup: false,
        strict: false
      }
    }
  };

  cornerstoneWADOImageLoader.webWorkerManager.initialize(config);
}
