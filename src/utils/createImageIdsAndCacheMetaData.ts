import { api } from "dicomweb-client";
import dcmjs from "dcmjs";
import { calculateSUVScalingFactors } from "@cornerstonejs/calculate-suv";
import { getPTImageIdInstanceMetadata } from "./getPTImageIdInstanceMetadata";
import { utilities } from "@cornerstonejs/core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import WADORSHeaderProvider from "./WADORSHeaderProvider";
import ptScalingMetaDataProvider from "./ptScalingMetaDataProvider";
import getPixelSpacingInformation from "./getPixelSpacingInformation";

const { DicomMetaDictionary } = dcmjs.data;
const { calibratedPixelSpacingMetadataProvider } = utilities;

interface ImageMetaData {
  [key: string]: any;
}

interface StudySearchOptions {
  studyInstanceUID: string;
  seriesInstanceUID: string;
}

interface CreateImageIdsAndCacheMetaDataProps {
  StudyInstanceUID: string;
  SeriesInstanceUID: string;
  wadoRsRoot: string;
  type: string;
}

type ImageIdArray = string[];

const VOLUME = "volume";

export default async function createImageIdsAndCacheMetaData({
  StudyInstanceUID,
  SeriesInstanceUID,
  wadoRsRoot,
  type,
}: CreateImageIdsAndCacheMetaDataProps): Promise<ImageIdArray> {
  const SOP_INSTANCE_UID = "00080018";
  const SERIES_INSTANCE_UID = "0020000E";
  const MODALITY = "00080060";

  const studySearchOptions: StudySearchOptions = {
    studyInstanceUID: StudyInstanceUID,
    seriesInstanceUID: SeriesInstanceUID,
  };

  const client = new api.DICOMwebClient({ url: wadoRsRoot });
  const instances = await client.retrieveSeriesMetadata(studySearchOptions);

  const modality = instances[0][MODALITY].Value[0];
  const imageIds: ImageIdArray = instances.map((instanceMetaData: ImageMetaData) => {
    const SeriesInstanceUID = instanceMetaData[SERIES_INSTANCE_UID].Value[0];
    const SOPInstanceUID = instanceMetaData[SOP_INSTANCE_UID].Value[0];

    const prefix = type === VOLUME ? "streaming-wadors:" : "wadors:";

    const imageId =
      prefix +
      wadoRsRoot +
      "/studies/" +
      StudyInstanceUID +
      "/series/" +
      SeriesInstanceUID +
      "/instances/" +
      SOPInstanceUID +
      "/frames/1";

    cornerstoneWADOImageLoader.wadors.metaDataManager.add(imageId, instanceMetaData);
    WADORSHeaderProvider.addInstance(imageId, instanceMetaData);

    const m = JSON.parse(JSON.stringify(instanceMetaData));
    const instance = DicomMetaDictionary.naturalizeDataset(m);
    const pixelSpacing = getPixelSpacingInformation(instance);

    calibratedPixelSpacingMetadataProvider.add(
      imageId,
      pixelSpacing.map((s: string) => parseFloat(s)),
    );

    return imageId;
  });

  if (modality === "PT") {
    const InstanceMetadataArray: any[] = [];
    imageIds.forEach((imageId: string) => {
      const instanceMetadata = getPTImageIdInstanceMetadata(imageId);

      if (typeof instanceMetadata.CorrectedImage === "string") {
        instanceMetadata.CorrectedImage = instanceMetadata.CorrectedImage.split("\\");
      }

      if (instanceMetadata) {
        InstanceMetadataArray.push(instanceMetadata);
      }
    });

    if (InstanceMetadataArray.length) {
      const suvScalingFactors = calculateSUVScalingFactors(InstanceMetadataArray);
      InstanceMetadataArray.forEach((_, index) => {
        ptScalingMetaDataProvider.addInstance(imageIds[index], suvScalingFactors[index]);
      });
    }
  }

  return imageIds;
}
