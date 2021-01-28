import React from "react";
import { Dimensions } from "react-native";
import BaseForm from "../../BaseForm/BaseForm";
import * as yup from "yup";
import $ from "jquery";
import { v4 } from "uuid";
import ReactPlayer from "react-player";

import { dataBaseUrl } from "../../../../routes/routerBlock";
import { fetchCharacterData } from "../../../Data/CharacterData/CharacterDataSlice";
import {
  handleCurrentMediaInputsSelectedStyle,
  switchMediaMiniForm,
  checkIfValuesAreDifferent,
} from "../../BaseForm/BaseForm";

import "./DesktopAPIStyles.scss";

// Declare function handling initial data retrieval for component view/s setup
export const initializeCharacterDataRetrieval = (
  setInitialFormValues: Function,
  setDataForForm: Function,
  setMediaDataIds: Function,
  setFormPreviewData: Function,
  characterIndexToRetrieve?: number,
  characterSetId?: string,
  previewDisplayType?: string
) => {
  fetchCharacterData(
    characterIndexToRetrieve,
    {
      opts: "updateAPIState",
      exe: (
        retrievedCharactersQueries: any,
        retrievedCharacterData: any,
        retrievedClassesIds: any
      ) => {
        console[`log`]({
          retrievedCharactersQueries,
          retrievedCharacterData,
          retrievedClassesIds,
        });
        const randomGridPhotoId = v4();
        let retrievedCharacterDataVideosHold = {};
        let retrievedCharacterDataPhotosHold = {};
        let retrievedCharacterDataExcerptsHold = {};
        let retrievedCharacterDataGridPhotosHold = {
          [`gridPhotoData-${randomGridPhotoId}`]: {
            [`source`]:
              retrievedCharactersQueries &&
              retrievedCharactersQueries[`length`] > 0
                ? retrievedCharactersQueries[`find`](
                    (values: any) =>
                      values[`id`] === retrievedCharacterData[`id`]
                  )[`gridImage`]
                : ``,
          },
        };

        let initialFormValuesHold = {
          [`test`]: { [`characterName`]: ``, [`extraText`]: `` },
          [`videos`]: {},
          [`photos`]: {},
          [`excerpts`]: {},
          [`gridPhotos`]: retrievedCharacterDataGridPhotosHold,
        };

        if (
          retrievedCharacterData[`videos`] &&
          retrievedCharacterData[`videos`][`length`] > 0
        ) {
          retrievedCharacterData[`videos`][`forEach`]((video: any) => {
            const dataConfigv1 = {
              id: `${video[`id`]}`,
              title: `${video[`title`]}`,
              link: `${video[`link`]}`,
            };
            const dataConfigv2 = {
              title: `${video[`title`]}`,
              link: `${video[`link`]}`,
            };
            retrievedCharacterDataVideosHold = {
              ...retrievedCharacterDataVideosHold,
              [`videoData-${video[`id`]}`]: dataConfigv1,
            };
            initialFormValuesHold = {
              ...initialFormValuesHold,
              [`videos`]: {
                ...initialFormValuesHold[`videos`],
                [`videoData-${video[`id`]}`]: dataConfigv2,
              },
            };
          });
        }
        if (
          retrievedCharacterData[`characterImages`] &&
          retrievedCharacterData[`characterImages`][`modelImage`] &&
          retrievedCharacterData[`characterImages`][`modelImage`][`length`] > 0
        ) {
          retrievedCharacterData[`characterImages`][`modelImage`][`forEach`](
            (image: any, index: number) => {
              const randomIndexNumber = `${v4()}`;
              const dataConfigv1 = { id: randomIndexNumber, source: image };
              const dataConfigv2 = { source: image };
              retrievedCharacterDataPhotosHold = {
                ...retrievedCharacterDataPhotosHold,
                [`photoData-${randomIndexNumber}`]: dataConfigv1,
              };
              initialFormValuesHold = {
                ...initialFormValuesHold,
                [`photos`]: {
                  ...initialFormValuesHold[`photos`],
                  [`photoData-${randomIndexNumber}`]: dataConfigv2,
                },
              };
            }
          );
        }

        if (
          retrievedCharacterData[`webExcerpts`] &&
          retrievedCharacterData[`webExcerpts`][`length`] > 0
        ) {
          retrievedCharacterData[`webExcerpts`][`forEach`]((excerpt: any) => {
            const dataConfigv1 = {
              [`id`]: `${excerpt[`id`]}`,
              [`title`]: `${excerpt[`title`]}`,
              [`content`]: `${excerpt[`excerpt`]}`,
              [`webCite`]: `${excerpt[`webCite`]}`,
            };
            const dataConfigv2 = {
              [`title`]: `${excerpt[`title`]}`,
              [`content`]: `${excerpt[`excerpt`]}`,
              [`webCite`]: `${excerpt[`webCite`]}`,
            };
            retrievedCharacterDataExcerptsHold = {
              ...retrievedCharacterDataExcerptsHold,
              [`excerptData-${excerpt[`id`]}`]: dataConfigv1,
            };
            initialFormValuesHold = {
              ...initialFormValuesHold,
              [`excerpts`]: {
                ...initialFormValuesHold[`excerpts`],
                [`excerptData-${excerpt[`id`]}`]: dataConfigv2,
              },
            };
          });
        }
        setMediaDataIds((prevMediaDataIds: any) => {
          return {
            ...prevMediaDataIds,
            [`classesIds`]: retrievedClassesIds.all,
            [`charactersIds`]: retrievedCharactersQueries,
            [`current`]: {
              ...prevMediaDataIds[`current`],
              [`class`]: retrievedClassesIds[`specified`],
              [`character`]: {
                [`name`]: retrievedCharacterData[`name`],
                [`id`]: retrievedCharacterData[`id`],
              },
            },
          };
        });
        setInitialFormValues((prevInitialFormValues: any) => {
          return {
            ...initialFormValuesHold,
            [`test`]: {
              [`characterClass`]: retrievedClassesIds[`specified`][`name`],
              [`characterName`]: retrievedCharacterData[`name`]
                ? retrievedCharacterData[`name`]
                : ``,
              [`extraText`]: retrievedCharacterData[`description`]
                ? retrievedCharacterData[`description`]
                : ``,
            },
          };
        });
        setDataForForm((prevDataForForm: any) => {
          return {
            ...prevDataForForm,
            [`forId`]: `fetchedCharacterData`,
            [`forInput`]: `AllInputs`,
            [`inputValue`]: {
              [`test`]: {
                [`characterClass`]: retrievedClassesIds[`specified`][`name`],
                [`characterName`]: retrievedCharacterData[`name`],
                [`extraText`]: retrievedCharacterData[`description`],
              },
              [`videos`]: retrievedCharacterDataVideosHold,
              [`photos`]: retrievedCharacterDataPhotosHold,
              [`excerpts`]: retrievedCharacterDataExcerptsHold,
              [`gridPhotos`]: {
                ...retrievedCharacterDataGridPhotosHold,
                [`gridPhotoData-${randomGridPhotoId}`]: {
                  ...retrievedCharacterDataGridPhotosHold[
                    `gridPhotoData-${randomGridPhotoId}`
                  ],
                  [`id`]: randomGridPhotoId,
                },
              },
            },
          };
        });
        setFormPreviewData((prevFormPreviewData: any) => {
          return {
            ...prevFormPreviewData,
            [`stored`]: {
              ...prevFormPreviewData[`stored`],
              [`test`]: {
                [`characterClass`]: retrievedClassesIds[`specified`][`name`],
                [`characterName`]: retrievedCharacterData[`name`],
                [`extraText`]: retrievedCharacterData[`description`],
              },
              [`videos`]: retrievedCharacterDataVideosHold,
              [`photos`]: retrievedCharacterDataPhotosHold,
              [`excerpts`]: retrievedCharacterDataExcerptsHold,
              [`gridPhotos`]: retrievedCharacterDataGridPhotosHold,
            },
            [`current`]: previewDisplayType
              ? {
                  ...prevFormPreviewData[`current`],
                  [`type`]: previewDisplayType,
                }
              : { ...prevFormPreviewData[`current`] },
          };
        });
      },
    },
    characterSetId
  );
};

const DestktopAPI: React.FC = () => {
  // Handle screen size detection and changes
  const [screenHeight, setScreenHeight] = React.useState(() => {
    let fetchedScreenHeight = Dimensions[`get`]("window")[`height`];
    return fetchedScreenHeight;
  });
  const [screenWidth, setScreenWidth] = React.useState(() => {
    let fetchedScreenWidth = Dimensions[`get`]("window")[`width`];
    return fetchedScreenWidth;
  });

  $(window).on("resize", () => {
    setScreenHeight(() => {
      let fetchedScreenHeight = Dimensions[`get`]("window")[`height`];
      return fetchedScreenHeight;
    });
    setScreenWidth(() => {
      let fetchedScreenWidth = Dimensions[`get`]("window")[`width`];
      return fetchedScreenWidth;
    });
  });

  React.useEffect(() => {
    setStyles((prevStyles) => {
      return {
        ...prevStyles,
        [`mainDisplayStyle`]: {
          ...prevStyles[`mainDisplayStyle`],
          [`height`]: `${screenHeight}px`,
        },
        [`innerFormDisplaySupport`]: {
          ...prevStyles[`innerFormDisplaySupport`],
          [`width`]: screenWidth,
          [`height`]: screenHeight / 7,
        },
        [`outterMediaPreviewDisplaySupport`]: {
          ...prevStyles[`outterMediaPreviewDisplaySupport`],
          [`width`]: `${screenWidth}px`,
          [`height`]: `${(screenHeight / 7) * 6}px`,
        },
      };
    });
  }, [screenHeight, screenWidth]);

  // Declare stylesheet for manipulation
  const [styles, setStyles] = React.useState({
    [`mainDisplayClass`]: `mainAPIDisplayClass`,
    [`mainDisplayStyle`]: {
      [`width`]: `100%`,
      [`height`]: `${screenHeight}px`,
    },
    [`formEmbedder`]: `formEmbedder`,
    [`innerFormMainDisplay`]: `innerFormMainDisplay`,
    [`innerFormDisplaySupport`]: {
      [`width`]: screenWidth,
      [`height`]: screenHeight / 7,
      [`minHeight`]: 100,
    },
    [`innerFormSectionContainer`]: `innerFormSectionContainer`,
    [`innerFormSectionInputs`]: `innerFormSectionInputs`,
    [`innerFormAddInputButton`]: `innerFormAddInputButton`,
    [`innerFormSubmitButton`]: `innerFormSubmitButton`,
    [`formDataInputsHeader`]: `formDataInputsHeader`,
    [`extraHeaderOptionFreshFormBackToApiFrontPageButton`]: `extraHeaderOptionFreshFormBackToApiFrontPageButton`,
    [`extraHeaderOptionFetchedProjectDataBackToFullPreviewPageButton`]: `extraHeaderOptionFetchedProjectDataBackToFullPreviewPageButton`,
    [`characterNameStyle`]: `characterNameStyle`,
    [`selectionSection`]: `selectionSection`,
    [`selectionSectionNavigationBar`]: `selectionSectionNavigationBar`,
    [`nextSelectionButton`]: `nextSelectionButton`,
    [`prevSelectionButton`]: `prevSelectionButton`,
    [`addSelectionButton`]: `addSelectionButton`,
    [`addSelectionIcon`]: `addSelectionIcon`,
    [`selectionSectionCharacterClass`]: `selectionSectionCharacterClass`,
    [`selectionSectionCharacter`]: `selectionSectionCharacter`,
    [`selectionSectionMediaType`]: `selectionSectionMediaType`,
    [`selectionSectionMediaInputs`]: `selectionSectionMediaInputs`,
    [`miniForm`]: `miniForm`,
    [`videosInputs`]: `videosInputs`,
    [`photosInputs`]: `photosInputs`,
    [`gridPhotosInputs`]: `gridPhotosInputs`,
    [`excerptsInputs`]: `excerptsInputs`,
    [`selectionOptions`]: `selectionOptions`,
    [`cancelEditButton`]: `cancelEditButton`,
    [`annihilateButton`]: `annihilateButton`,
    [`saveEditButton`]: `saveEditButton`,
    [`outterMediaPreviewDisplay`]: `outterMediaPreviewDisplay`,
    [`outterMediaPreviewDisplaySupport`]: {
      [`width`]: `${screenWidth}px`,
      [`height`]: `${(screenHeight / 7) * 6}px`,
    },
    [`innerMediaPreviewDisplay`]: `innerMediaPreviewDisplay`,
    [`innerMediaPreviewDisplaySection`]: `innerMediaPreviewDisplaySection`,
    [`innerMediaPreviewDisplaySectionTitle`]: `innerMediaPreviewDisplaySectionTitle`,
    [`innerMediaPreviewDisplaySectionContentArea`]: `innerMediaPreviewDisplaySectionContentArea`,
    [`innerMediaPreviewDisplaySectionContent`]: `innerMediaPreviewDisplaySectionContent`,
    [`innerMediaPreviewDisplaySectionContentVideoData`]: `innerMediaPreviewDisplaySectionContentVideoData`,
    [`innerMediaPreviewDisplaySectionContentPhotoData`]: `innerMediaPreviewDisplaySectionContentPhotoData`,
    [`innerMediaPreviewDisplaySectionContentExcerptData`]: `innerMediaPreviewDisplaySectionContentExcerptData`,
    [`innerMediaPreviewDisplaySectionContentExtendedData`]: `innerMediaPreviewDisplaySectionContentExtendedData`,
    [`innerMediaPreviewClassConfirmation`]: `innerMediaPreviewClassConfirmation`,
    [`innerMediaPreviewClassConfirmationSubTextContainer`]: `innerMediaPreviewClassConfirmationSubTextContainer`,
    [`innerMediaPreviewClassConfirmationSubTextOne`]: `innerMediaPreviewClassConfirmationSubTextOne`,
    [`innerMediaPreviewClassConfirmationSubTextTwo`]: `innerMediaPreviewClassConfirmationSubTextTwo`,
    [`innerMediaPreviewCharacterConfirmation`]: `innerMediaPreviewCharacterConfirmation`,
    [`innerMediaPreviewCharacterConfirmationSubTextOne`]: `innerMediaPreviewCharacterConfirmationSubTextOne`,
    [`innerMediaPreviewCharacterConfirmationSubTextTwo`]: `innerMediaPreviewCharacterConfirmationSubTextTwo`,
    [`gridImageContainer`]: `gridImageContainer`,
    [`gridImage`]: `gridImage`,
    [`gridImageExtendedData`]: `gridImageExtendedData`,
    [`excerptTextarea`]: `excerpt-textarea`,
    [`finalInnerMediaPreviewDisplay`]: `finalInnerMediaPreviewDisplay`,
    [`finalMediaPreviewsConsolidated`]: `finalMediaPreviewsConsolidated`,
    [`finalIdeaTitle`]: `finalIdeaTitle`,
    [`finalVideoPreview`]: `finalVideoPreview`,
    [`finalVideoExtendedDataPreview`]: `finalVideoExtendedDataPreview`,
    [`finalVideoName`]: `finalVideoName`,
    [`finalVideoType`]: `finalVideoType`,
    [`finalizeOptions`]: `finalizeOptions`,
    [`returnToEditButton`]: `returnToEditButton`,
    [`finalizeDataButton`]: `finalizeDataButton`,
    [`retrievedProjectOptions`]: `retrievedProjectOptions`,
    [`backToApiFrontPageButton`]: `backToApiFrontPageButton`,
    [`projectsNavigationBar`]: `projectsNavigationBar`,
    [`projectsNavigationPrevious`]: `projectsNavigationPrevious`,
    [`projectsNavigationNext`]: `projectsNavigationNext`,
    [`editFetchedProjectButton`]: `editFetchedProjectButton`,
    [`destroyProjectButton`]: `destroyProjectButton`,
    [`dataUploadConfirmationPage`]: `dataUploadConfirmationPage`,
    [`dataUploadConfirmationTitle`]: `dataUploadConfirmationTitle`,
    [`dataUploadConfirmationOptions`]: `dataUploadConfirmationOptions`,
    [`dataUploadConfirmationOptionYes`]: `dataUploadConfirmationOptionYes`,
    [`dataUploadConfirmationOptionNo`]: `dataUploadConfirmationOptionNo`,
    [`apiFrontPage`]: `apiFrontPage`,
    [`annihilatePreviewDisplay`]: `annihilatePreviewDisplay`,
    [`annihilateTextContainer`]: `annihilateTextContainer`,
    [`annihilateTextOne`]: `annihilateTextOne`,
    [`annihilateTextTwo`]: `annihilateTextTwo`,
    [`annihilateTextThree`]: `annihilateTextThree`,
    [`createNewIdeaButton`]: `createNewIdeaButton`,
    [`browseIdeasForEditButton`]: `browseIdeasForEditButton`,
    [`toMainProjectsPageButton`]: `toMainProjectsPageButton`,
  });

  // Declare variable tracking current API page
  const [APIPage, setAPIPage] = React.useState(() => {
    return `NewCharacterForm`;
  });

  // Declare variable declaring data fetching opts
  const [dataFetchOpts, setDataFetchOpts] = React.useState<{
    dataIndex: number | undefined;
    dataSetId: string | undefined;
    previewDisplay: string | undefined;
  }>(() => {
    return { dataIndex: -1, dataSetId: undefined, previewDisplay: undefined };
  });

  // Declare variable holding initial  form values
  const [initialFormValues, setInitialFormValues] = React.useState(() => {
    return {
      test: {},
      videos: {},
      photos: {},
      excerpts: {},
    };
  });

  // Declare variable holding media data ids
  const [mediaDataIds, setMediaDataIds] = React.useState<{
    classesIds: Array<{ name: string; id: string }>;
    charactersIds: Array<{ name: string; id: string; gridImage: string }>;
    current: Record<string, any>;
  }>(() => {
    return { classesIds: [], charactersIds: [], current: {} };
  });

  // Declare variable holding validation schema
  const [validSchema, setValidSchema] = React.useState(() => {
    const initialSchema = yup[`object`]()[`shape`]({
      test: yup[`object`]()[`shape`]({}),
    });
    return initialSchema;
  });

  const [layoutType, setLayoutType] = React.useState(() => {
    return `v2`;
  });

  const [initialInputs, setInitialInputs] = React.useState(() => {
    return [
      {
        name: `characterClass`,
        inputType: `textInput`,
        placeholder: `CHARACTER CLASS`,
      },
      {
        name: `characterName`,
        inputType: `textInput`,
        placeholder: `CHARACTER NAME`,
      },
      {
        name: `extraText`,
        inputType: `textInput`,
        placeholder: `CHARACTER DESCRIPTION`,
      },
    ];
  });

  const [mediaMiniFormInputs, setMediaMiniFormInputs] = React.useState(() => {
    return [
      {
        mediaType: `video`,
        addButtonText: `Add Video`,
        inputsOpts: [
          {
            key: `title`,
            typeOfInput: `textInput`,
            childrenElements: [],
            initialValue: ``,
          },
          {
            key: `link`,
            typeOfInput: `textInput`,
            childrenElements: [],
            initialValue: ``,
          },
        ],
        inputsDeletionCallback: () => {},
      },
      {
        mediaType: `photo`,
        addButtonText: `Add Photo`,
        inputsOpts: [
          {
            key: `source`,
            typeOfInput: `fileInput`,
            childrenElements: [],
            initialValue: ``,
          },
        ],
        inputsDeletionCallback: () => {},
      },
      {
        mediaType: `excerpt`,
        addButtonText: `Add Exerpt`,
        inputsOpts: [
          {
            key: `title`,
            typeOfInput: `textInput`,
            childrenElements: [],
            initialValue: ``,
          },
          {
            key: `content`,
            typeOfInput: ``,
            childrenElements: [],
            initialValue: ``,
          },
          {
            key: `webCite`,
            typeOfInput: `textInput`,
            childrenElements: [],
            initialValue: ``,
          },
        ],
        inputsDeletionCallback: () => {},
      },
      {
        mediaType: `gridPhoto`,
        addButtonText: `Add Grid Photo`,
        inputsOpts: [
          {
            key: `source`,
            typeOfInput: `fileInput`,
            childrenElements: [],
            initialValue: ``,
          },
        ],
        inputsDeletionCallback: () => {},
      },
    ];
  });

  // Declare variable holding data for form
  const [dataForForm, setDataForForm] = React.useState<{
    [`forId`]: string | number;
    [`forInput`]: string | number;
    [`inputValue`]: string | Object | undefined;
  }>(() => {
    return {
      [`forId`]: ``,
      [`forInput`]: ``,
      [`inputValue`]: ``,
    };
  });

  // Declare variable holding form preview data
  const [formPreviewData, setFormPreviewData] = React.useState<{
    [`callBackIterationCount`]: number;
    [`stored`]: Record<string, any>;
    [`current`]: { [`type`]: string; data: any };
  }>(() => {
    return {
      [`callBackIterationCount`]: 0,
      [`stored`]: {},
      [`current`]: { [`type`]: ``, [`data`]: `` },
    };
  });

  // Declare variable holding form preview display
  const [previewDisplay, setPreviewDisplay] = React.useState(() => {
    return <></>;
  });

  // Declare variable holding media type text
  const [mediaTypeText, setMediaTypeText] = React.useState(() => {
    return ``;
  });

  // Declare variable holding stored refs
  let storedRefs: Record<string, React.MutableRefObject<any>> = {
    innerFormDisplayRef: React.useRef<any>(),
    selectionSectionCharacterClassRef: React.useRef<any>(),
    selectionSectionCharacterRef: React.useRef<any>(),
    miniForm: React.useRef(),
    videosInputViewRef: React.useRef<any>(),
    photosInputViewRef: React.useRef<any>(),
    excerptsInputViewRef: React.useRef<any>(),
    gridPhotosInputViewRef: React.useRef<any>(),
    nextSelectionButtonC1Ref: React.useRef<any>(),
    prevSelectionButtonC1Ref: React.useRef<any>(),
    addSelectionButtonC1Ref: React.useRef<any>(),
    nextSelectionButtonC2Ref: React.useRef<any>(),
    prevSelectionButtonC2Ref: React.useRef<any>(),
    addSelectionButtonC2Ref: React.useRef<any>(),
    nextSelectionButtonC3Ref: React.useRef<any>(),
    prevSelectionButtonC3Ref: React.useRef<any>(),
    nextSelectionButtonC4Ref: React.useRef<any>(),
    prevSelectionButtonC4Ref: React.useRef<any>(),
    addSelectionButtonC4Ref: React.useRef<any>(),
    finalVideosMediaPreviewsRef: React.useRef<any>(),
    destroyProjectButtonRef: React.useRef<any>(),
  };

  // Handle form column 4 media data switch
  const handleC4DataSwitch = (selectedMediaType: string, mediaId: string) => {
    switchMediaMiniForm(`${selectedMediaType}`, storedRefs, setMediaTypeText);
    handleCurrentMediaInputsSelectedStyle(
      storedRefs[`${selectedMediaType}sInputViewRef`][`current`][`childNodes`],
      `${mediaId}`,
      `${selectedMediaType}s`
    );
    setFormPreviewData((prevFormPreviewData: any) => {
      return {
        ...prevFormPreviewData,
        [`current`]: {
          ...prevFormPreviewData[`current`],
          [`type`]: `C4`,
        },
      };
    });
  };

  // Handle class and character data retrieval
  React.useEffect(() => {
    if (dataFetchOpts[`dataIndex`] === -1) {
      initializeCharacterDataRetrieval(
        setInitialFormValues,
        setDataForForm,
        setMediaDataIds,
        setFormPreviewData,
        0,
        undefined,
        `C1`
      );
    } else {
      initializeCharacterDataRetrieval(
        setInitialFormValues,
        setDataForForm,
        setMediaDataIds,
        setFormPreviewData,
        dataFetchOpts[`dataIndex`],
        dataFetchOpts[`dataSetId`],
        dataFetchOpts[`previewDisplay`]
      );
    }
  }, [dataFetchOpts]);

  // Handle preview display for preview form data changes
  React.useEffect(() => {
    const previewType = formPreviewData[`current`][`type`];
    if (previewType === `C1`) {
      setPreviewDisplay(() => {
        return (
          <div className={styles[`innerMediaPreviewDisplay`]}>
            {mediaDataIds[`charactersIds`][`map`]((ids, index) => {
              return (
                <div
                  key={`${ids[`name`]}-${ids[`id`]}`}
                  className={styles[`gridImageContainer`]}
                  onClick={(event) => {
                    setDataForForm((prevFormData: any) => {
                      return { ...prevFormData, forId: `DataAnnihilation` };
                    });
                    setDataFetchOpts((prevDataFetchOpts) => {
                      return {
                        ...prevDataFetchOpts,
                        [`dataIndex`]: index,
                        [`dataSetId`]: mediaDataIds[`current`][`class`][`id`],
                        [`previewDisplay`]: `C2`,
                      };
                    });
                  }}
                  onMouseEnter={(event) => {
                    const firstChildNodeTyped = (event[`currentTarget`][
                      `childNodes`
                    ][0] as unknown) as HTMLImageElement;
                    const secondChildNodeTyped = (event[`currentTarget`][
                      `childNodes`
                    ][1] as unknown) as HTMLDivElement;
                    firstChildNodeTyped[`style`][`display`] = `none`;
                    secondChildNodeTyped[`style`][`display`] = `flex`;
                  }}
                  onMouseLeave={(event) => {
                    const firstChildNodeTyped = (event[`currentTarget`][
                      `childNodes`
                    ][0] as unknown) as HTMLImageElement;
                    const secondChildNodeTyped = (event[`currentTarget`][
                      `childNodes`
                    ][1] as unknown) as HTMLDivElement;
                    firstChildNodeTyped[`style`][`display`] = `flex`;
                    secondChildNodeTyped[`style`][`display`] = `none`;
                  }}
                >
                  <img
                    className={styles[`gridImage`]}
                    src={ids[`gridImage`]}
                    alt={`${ids[`name`]}-gridImage`}
                  />
                  <div className={styles[`gridImageExtendedData`]}>
                    {ids[`name`]}
                  </div>
                </div>
              );
            })}
          </div>
        );
      });
    } else if (previewType === `C2`) {
      setPreviewDisplay(() => {
        return (
          <div className={styles[`innerMediaPreviewDisplay`]}>
            {mediaMiniFormInputs[`map`]((opts) => {
              let previewDataKeys = Object[`keys`](
                formPreviewData[`stored`][`${opts[`mediaType`]}s`]
              );
              return (
                <div className={styles[`innerMediaPreviewDisplaySection`]}>
                  <div
                    className={styles[`innerMediaPreviewDisplaySectionTitle`]}
                    onClick={(event) => {
                      setMediaTypeText(() => {
                        return opts[`mediaType`];
                      });
                      setFormPreviewData((prevFormPreviewData) => {
                        return {
                          ...prevFormPreviewData,
                          [`current`]: {
                            ...prevFormPreviewData[`current`],
                            [`type`]: `C3`,
                          },
                        };
                      });
                    }}
                  >{`${opts[`mediaType`]}s`}</div>
                  <div
                    className={
                      styles[`innerMediaPreviewDisplaySectionContentArea`]
                    }
                  >
                    {Object[`values`](
                      formPreviewData[`stored`][`${opts[`mediaType`]}s`]
                    )[`map`]((values: any, index: number) => {
                      let configgedContent = (
                        <div style={{ display: `none` }}></div>
                      );
                      let configgedExtendedData = (
                        <div
                          style={{
                            display: `flex`,
                            width: `100%`,
                            height: `100%`,
                          }}
                        ></div>
                      );
                      if (opts[`mediaType`] === `video`) {
                        configgedContent = (
                          <div
                            className={
                              styles[
                                `innerMediaPreviewDisplaySectionContentVideoData`
                              ]
                            }
                          >
                            <div
                              style={{
                                width: `100%`,
                                height: `2%`,
                                border: `1px solid cyan`,
                                boxSizing: `border-box`,
                                cursor: `pointer`,
                              }}
                              onDoubleClick={(event) => {
                                handleC4DataSwitch(
                                  opts[`mediaType`],
                                  previewDataKeys[index]
                                );
                              }}
                            ></div>
                            <ReactPlayer
                              width={"100%"}
                              height={"98%"}
                              controls
                              url={values[`link`]}
                              config={{
                                youtube: {
                                  playerVars: { start: 0 },
                                },
                              }}
                              playing={false}
                              onStart={() => {
                                console[`log`](
                                  `React Player has loaded with message: Started`
                                );
                              }}
                              onPlay={() => {}}
                              onPause={() => {}}
                              onEnded={() => {}}
                              onProgress={() => {}}
                            />
                          </div>
                        );
                        configgedExtendedData = (
                          <div
                            className={
                              styles[
                                `innerMediaPreviewDisplaySectionContentExtendedData`
                              ]
                            }
                          >
                            {values[`title`]}
                          </div>
                        );
                      } else if (opts[`mediaType`] === `photo`) {
                        configgedContent = (
                          <img
                            className={
                              styles[
                                `innerMediaPreviewDisplaySectionContentPhotoData`
                              ]
                            }
                            src={values[`source`]}
                            alt={`${opts[`mediaType`]}-${index}`}
                            width={`100%`}
                            height={`100%`}
                            onDoubleClick={(event) => {
                              console[`log`]({
                                formPreviewData,
                                previewDataKeys,
                              });
                              handleC4DataSwitch(
                                opts[`mediaType`],
                                previewDataKeys[index]
                              );
                            }}
                          />
                        );
                        configgedExtendedData = (
                          <div
                            className={
                              styles[
                                `innerMediaPreviewDisplaySectionContentExtendedData`
                              ]
                            }
                          >
                            {index + 1}
                          </div>
                        );
                      } else if (opts[`mediaType`] === `excerpt`) {
                        configgedContent = (
                          <div
                            className={
                              styles[
                                `innerMediaPreviewDisplaySectionContentExcerptData`
                              ]
                            }
                            onDoubleClick={(event) => {
                              handleC4DataSwitch(
                                opts[`mediaType`],
                                previewDataKeys[index]
                              );
                            }}
                          >
                            {values[`content`]}
                          </div>
                        );
                        configgedExtendedData = (
                          <div
                            className={
                              styles[
                                `innerMediaPreviewDisplaySectionContentExtendedData`
                              ]
                            }
                          >
                            {values[`title`]}
                          </div>
                        );
                      } else if (opts[`mediaType`] === `gridPhoto`) {
                        configgedContent = (
                          <img
                            className={
                              styles[
                                `innerMediaPreviewDisplaySectionContentPhotoData`
                              ]
                            }
                            src={values[`source`]}
                            alt={`${opts[`mediaType`]}-${index}`}
                            width={`100%`}
                            height={`100%`}
                            onDoubleClick={(event) => {
                              console[`log`]({
                                formPreviewData,
                                previewDataKeys,
                              });
                              handleC4DataSwitch(
                                opts[`mediaType`],
                                previewDataKeys[index]
                              );
                            }}
                          />
                        );
                        configgedExtendedData = (
                          <div
                            className={
                              styles[
                                `innerMediaPreviewDisplaySectionContentExtendedData`
                              ]
                            }
                          >
                            {index + 1}
                          </div>
                        );
                      }
                      return (
                        <div
                          className={
                            styles[`innerMediaPreviewDisplaySectionContent`]
                          }
                          onMouseEnter={(event) => {
                            const firstChildNodeTyped = (event[`currentTarget`][
                              `childNodes`
                            ][0] as unknown) as HTMLElement;
                            const secondChildNodeTyped = (event[
                              `currentTarget`
                            ][`childNodes`][1] as unknown) as HTMLDivElement;
                            firstChildNodeTyped[`style`][`display`] = `flex`;
                            secondChildNodeTyped[`style`][`display`] = `none`;
                          }}
                          onMouseLeave={(event) => {
                            const firstChildNodeTyped = (event[`currentTarget`][
                              `childNodes`
                            ][0] as unknown) as HTMLElement;
                            const secondChildNodeTyped = (event[
                              `currentTarget`
                            ][`childNodes`][1] as unknown) as HTMLDivElement;
                            firstChildNodeTyped[`style`][`display`] = `none`;
                            secondChildNodeTyped[`style`][`display`] = `flex`;
                          }}
                        >
                          {configgedContent}
                          {configgedExtendedData}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      });
    } else if (previewType === `C3`) {
      setPreviewDisplay(() => {
        let previewContentKeys = Object[`keys`](
          formPreviewData[`stored`][`${mediaTypeText}s`]
        );
        let configgedPreviewContent = Object[`values`](
          formPreviewData[`stored`][`${mediaTypeText}s`]
        )[`map`]((data: any, index: number) => {
          let configgedContent = <div style={{ display: `none` }}></div>;
          let configgedExtendedData = (
            <div
              style={{
                display: `flex`,
                width: `100%`,
                height: `100%`,
              }}
            ></div>
          );
          if (mediaTypeText === `video`) {
            configgedContent = (
              <div
                className={
                  styles[`innerMediaPreviewDisplaySectionContentVideoData`]
                }
              >
                <div
                  style={{
                    width: `100%`,
                    height: `2%`,
                    border: `1px solid cyan`,
                    boxSizing: `border-box`,
                    cursor: `pointer`,
                  }}
                  onDoubleClick={(event) => {
                    handleC4DataSwitch(
                      mediaTypeText,
                      previewContentKeys[index]
                    );
                  }}
                ></div>
                <ReactPlayer
                  width={"100%"}
                  height={"98%"}
                  controls
                  url={data[`link`]}
                  config={{
                    youtube: {
                      playerVars: { start: 0 },
                    },
                  }}
                  playing={false}
                  onStart={() => {
                    console[`log`](
                      `React Player has loaded with message: Started`
                    );
                  }}
                  onPlay={() => {}}
                  onPause={() => {}}
                  onEnded={() => {}}
                  onProgress={() => {}}
                />
              </div>
            );
            configgedExtendedData = (
              <div
                className={
                  styles[`innerMediaPreviewDisplaySectionContentExtendedData`]
                }
              >
                {data[`title`]}
              </div>
            );
          } else if (mediaTypeText === `photo`) {
            configgedContent = (
              <img
                className={
                  styles[`innerMediaPreviewDisplaySectionContentPhotoData`]
                }
                src={data[`source`]}
                alt={`${mediaTypeText}-${index}`}
                width={`100%`}
                height={`100%`}
                onDoubleClick={(event) => {
                  handleC4DataSwitch(mediaTypeText, previewContentKeys[index]);
                }}
              />
            );
            configgedExtendedData = (
              <div
                className={
                  styles[`innerMediaPreviewDisplaySectionContentExtendedData`]
                }
              >
                {index + 1}
              </div>
            );
          } else if (mediaTypeText === `excerpt`) {
            configgedContent = (
              <div
                className={
                  styles[`innerMediaPreviewDisplaySectionContentExcerptData`]
                }
                onDoubleClick={(event) => {
                  handleC4DataSwitch(mediaTypeText, previewContentKeys[index]);
                }}
              >
                {data[`content`]}
              </div>
            );
            configgedExtendedData = (
              <div
                className={
                  styles[`innerMediaPreviewDisplaySectionContentExtendedData`]
                }
              >
                {data[`title`]}
              </div>
            );
          } else if (mediaTypeText === `gridPhoto`) {
            configgedContent = (
              <img
                className={
                  styles[`innerMediaPreviewDisplaySectionContentPhotoData`]
                }
                src={data[`source`]}
                alt={`${mediaTypeText}-${index}`}
                width={`100%`}
                height={`100%`}
                onDoubleClick={(event) => {
                  handleC4DataSwitch(mediaTypeText, previewContentKeys[index]);
                }}
              />
            );
            configgedExtendedData = (
              <div
                className={
                  styles[`innerMediaPreviewDisplaySectionContentExtendedData`]
                }
              >
                {index + 1}
              </div>
            );
          }
          return (
            <div
              className={styles[`innerMediaPreviewDisplaySectionContent`]}
              onMouseEnter={(event) => {
                const firstChildNodeTyped = (event[`currentTarget`][
                  `childNodes`
                ][0] as unknown) as HTMLElement;
                const secondChildNodeTyped = (event[`currentTarget`][
                  `childNodes`
                ][1] as unknown) as HTMLDivElement;
                firstChildNodeTyped[`style`][`display`] = `flex`;
                secondChildNodeTyped[`style`][`display`] = `none`;
              }}
              onMouseLeave={(event) => {
                const firstChildNodeTyped = (event[`currentTarget`][
                  `childNodes`
                ][0] as unknown) as HTMLElement;
                const secondChildNodeTyped = (event[`currentTarget`][
                  `childNodes`
                ][1] as unknown) as HTMLDivElement;
                firstChildNodeTyped[`style`][`display`] = `none`;
                secondChildNodeTyped[`style`][`display`] = `flex`;
              }}
            >
              {configgedContent}
              {configgedExtendedData}
            </div>
          );
        });
        return (
          <div
            className={styles[`innerMediaPreviewDisplaySection`]}
            style={{ height: `100%` }}
          >
            <div
              className={styles[`innerMediaPreviewDisplaySectionTitle`]}
              style={{ cursor: `default` }}
            >{`${mediaTypeText}s`}</div>
            <div
              className={styles[`innerMediaPreviewDisplaySectionContentArea`]}
            >
              {configgedPreviewContent}
            </div>
          </div>
        );
      });
      switchMediaMiniForm(`${mediaTypeText}`, storedRefs, setMediaTypeText);
      if (
        storedRefs[`${mediaTypeText}sInputViewRef`][`current`][`childNodes`][
          `length`
        ] >= 1
      ) {
        handleCurrentMediaInputsSelectedStyle(
          storedRefs[`${mediaTypeText}sInputViewRef`][`current`][`childNodes`],
          `${
            storedRefs[`${mediaTypeText}sInputViewRef`][`current`][
              `childNodes`
            ][0][`id`]
          }`,
          `${mediaTypeText}s`
        );
      }
    } else if (previewType === `C4`) {
      const retrieveMediaId = () => {
        let foundId = ``;
        storedRefs[`${mediaTypeText}sInputViewRef`][`current`][`childNodes`][
          `forEach`
        ]((node: any) => {
          if (node[`style`][`display`] === `flex`) {
            foundId = node[`id`];
          }
        });
        console.log({ foundId });
        return foundId;
      };
      const retrievedMediaId = retrieveMediaId();
      if (mediaTypeText === `video`) {
        setPreviewDisplay(() => {
          console[`log`]({
            testingForVideoC4: formPreviewData[`stored`][`${mediaTypeText}s`],
          });
          return (
            <div className={styles[`innerMediaPreviewDisplay`]}>
              <ReactPlayer
                width={"100%"}
                height={"100%"}
                controls
                url={
                  formPreviewData[`stored`][`${mediaTypeText}s`][
                    `${retrievedMediaId}`
                  ] &&
                  formPreviewData[`stored`][`${mediaTypeText}s`][
                    `${retrievedMediaId}`
                  ][`link`]
                    ? formPreviewData[`stored`][`${mediaTypeText}s`][
                        `${retrievedMediaId}`
                      ][`link`]
                    : ``
                }
                config={{
                  youtube: {
                    playerVars: { start: 0 },
                  },
                }}
                playing={false}
                onStart={() => {
                  console.log(`React Player has loaded with message: Started`);
                }}
                onPlay={() => {}}
                onPause={() => {}}
                onEnded={() => {}}
                onProgress={() => {}}
              />
            </div>
          );
        });
      } else if (mediaTypeText === `photo`) {
        setPreviewDisplay(() => {
          return (
            <div className={styles[`innerMediaPreviewDisplay`]}>
              <img
                className={
                  styles[`innerMediaPreviewDisplaySectionContentPhotoData`]
                }
                style={{ display: `flex` }}
                width={`100%`}
                height={`100%`}
                src={
                  formPreviewData[`stored`][`${mediaTypeText}s`][
                    `${retrievedMediaId}`
                  ] &&
                  formPreviewData[`stored`][`${mediaTypeText}s`][
                    `${retrievedMediaId}`
                  ][`source`]
                    ? formPreviewData[`stored`][`${mediaTypeText}s`][
                        `${retrievedMediaId}`
                      ][`source`]
                    : `https://th.bing.com/th/id/Rbcd103972ed72a4e5f94e9efd83fc81b?rik=7%2fY04D1VgG35RQ&riu=http%3a%2f%2fwww.mashrek.edu.jo%2fImages%2fnoDataAvailableEN.png&ehk=0JEcACJpcazw0lcoywLfVnUwRscTL1lldJGB8ZijL7E%3d&risl=&pid=ImgRaw`
                }
                alt={`preview`}
              />
            </div>
          );
        });
      } else if (mediaTypeText === `excerpt`) {
        setPreviewDisplay((previousPreviewDisplay) => {
          // Create react class element for passage preview
          const textInputArea = React[`createElement`]("textarea", {
            className: styles[`excerptTextarea`],
            value:
              formPreviewData[`stored`][`${mediaTypeText}s`][
                `${retrievedMediaId}`
              ] &&
              formPreviewData[`stored`][`${mediaTypeText}s`][
                `${retrievedMediaId}`
              ][`content`]
                ? formPreviewData[`stored`][`${mediaTypeText}s`][
                    `${retrievedMediaId}`
                  ][`content`]
                : ``,
            onChange: (event) => {
              event[`persist`]();
              const eventTyped = (event as unknown) as React.ChangeEvent<HTMLTextAreaElement>;
              const retrievedText = eventTyped[`currentTarget`][`value`];
              setDataForForm((previousDataForForm) => {
                return {
                  ...previousDataForForm,
                  [`forId`]: `forStorage-${retrievedMediaId}`,
                  [`forInput`]: `content`,
                  [`inputValue`]: retrievedText,
                };
              });
            },
          });
          const PassagePreview = React[`createElement`](
            "div",
            { [`className`]: styles[`innerMediaPreviewDisplay`] },
            textInputArea
          );

          return PassagePreview;
        });
      } else if (mediaTypeText === `gridPhoto`) {
        setPreviewDisplay(() => {
          return (
            <div className={styles[`innerMediaPreviewDisplay`]}>
              <img
                className={
                  styles[`innerMediaPreviewDisplaySectionContentPhotoData`]
                }
                style={{ display: `flex` }}
                width={`100%`}
                height={`100%`}
                src={
                  formPreviewData[`stored`][`${mediaTypeText}s`][
                    `${retrievedMediaId}`
                  ] &&
                  formPreviewData[`stored`][`${mediaTypeText}s`][
                    `${retrievedMediaId}`
                  ][`source`]
                    ? formPreviewData[`stored`][`${mediaTypeText}s`][
                        `${retrievedMediaId}`
                      ][`source`]
                    : `https://th.bing.com/th/id/Rbcd103972ed72a4e5f94e9efd83fc81b?rik=7%2fY04D1VgG35RQ&riu=http%3a%2f%2fwww.mashrek.edu.jo%2fImages%2fnoDataAvailableEN.png&ehk=0JEcACJpcazw0lcoywLfVnUwRscTL1lldJGB8ZijL7E%3d&risl=&pid=ImgRaw`
                }
                alt={`preview`}
              />
            </div>
          );
        });
      }
    } else if (previewType === `newData`) {
      const doesClassExist = mediaDataIds[`classesIds`][`find`](
        (ids) =>
          ids[`name`] ===
          formPreviewData[`current`][`data`][`test`][`characterClass`]
      );
      const doesCharacterExist = mediaDataIds[`charactersIds`][`find`](
        (ids) => ids[`id`] === mediaDataIds[`current`][`character`][`id`]
      );
      if (doesClassExist) {
        setPreviewDisplay(() => {
          if (doesCharacterExist) {
            return (
              <div className={styles[`innerMediaPreviewCharacterConfirmation`]}>
                <div
                  className={
                    styles[`innerMediaPreviewCharacterConfirmationSubTextOne`]
                  }
                >{`CONFIRM ${formPreviewData[`current`][`data`][`test`][
                  `characterName`
                ][`toUpperCase`]()}'s DATA UPDATE FOR CLASS "${formPreviewData[
                  `current`
                ][`data`][`test`][`characterClass`][`toUpperCase`]()}"?`}</div>
                <div
                  className={
                    styles[`innerMediaPreviewCharacterConfirmationSubTextTwo`]
                  }
                  onClick={(event) => {
                    const updateCharacterData = async () => {
                      const characterUploadFormDataForGridImage = new FormData();
                      const characterUploadFormDataForModelImages = new FormData();
                      const gridPhotosInputsRef =
                        storedRefs[`gridPhotosInputViewRef`][`current`];
                      const modelImagesInputsRef =
                        storedRefs[`photosInputViewRef`][`current`];
                      const retrievedGridPhotoFile =
                        gridPhotosInputsRef &&
                        gridPhotosInputsRef[`childNodes`][0] &&
                        gridPhotosInputsRef[`childNodes`][0][`childNodes`][2] &&
                        gridPhotosInputsRef[`childNodes`][0][`childNodes`][2][
                          `childNodes`
                        ][0]
                          ? gridPhotosInputsRef[`childNodes`][0][
                              `childNodes`
                            ][2][`childNodes`][0][`childNodes`][2][`files`][0]
                          : undefined;
                      const retrievedModelImagesFiles = modelImagesInputsRef[
                        `childNodes`
                      ]
                        ? [][`slice`][`call`](
                            modelImagesInputsRef[`childNodes`]
                          )
                        : undefined;
                      let thereAreFilesForModelImages = false;

                      const updatingCharacterData = await fetch(
                        `${dataBaseUrl}character/basicInfo/update/${
                          mediaDataIds[`current`][`character`][`id`]
                        }`,
                        {
                          [`method`]: `PUT`,
                          [`mode`]: `cors`,
                          [`cache`]: `no-cache`,
                          [`headers`]: { [`Content-Type`]: `application/json` },
                          [`body`]: JSON[`stringify`]({
                            characterSetId: `${
                              mediaDataIds[`current`][`class`][`id`]
                            }`,
                            name:
                              formPreviewData[`current`][`data`][`test`][
                                `characterName`
                              ],
                            description:
                              formPreviewData[`current`][`data`][`test`][
                                `extraText`
                              ],
                          }),
                        }
                      )[`then`]((res) => {
                        const json = res[`json`]();
                        console[`log`](json);
                        return json;
                      });

                      if (retrievedGridPhotoFile) {
                        characterUploadFormDataForGridImage[`append`](
                          `gridImage`,
                          retrievedGridPhotoFile
                        );
                        const updatingCharacterGridImage = await fetch(
                          `${dataBaseUrl}character/gridImage/update/${
                            mediaDataIds[`current`][`character`][`id`]
                          }`,
                          {
                            [`method`]: `PUT`,
                            [`mode`]: `cors`,
                            [`cache`]: `no-cache`,
                            [`body`]: characterUploadFormDataForGridImage,
                          }
                        )[`then`]((res) => {
                          const json = res[`json`]();
                          console[`log`](json);
                          return json;
                        });
                        console[`log`]({ updatingCharacterGridImage });
                      }
                      if (
                        retrievedModelImagesFiles &&
                        retrievedModelImagesFiles[`length`] > 0
                      ) {
                        retrievedModelImagesFiles[`forEach`]((node: any) => {
                          const retrievedModelImageFile =
                            node[`childNodes`][2][`childNodes`][0][
                              `childNodes`
                            ][2][`files`][0];
                          if (retrievedModelImageFile) {
                            thereAreFilesForModelImages = true;
                            characterUploadFormDataForModelImages[`append`](
                              `modelImages`,
                              retrievedModelImageFile
                            );
                          }
                        });
                      }
                      if (thereAreFilesForModelImages) {
                        let retrievedFormPreviewDataForModelImages =
                          formPreviewData[`current`][`data`][`photos`];
                        let configuredModelImagesData: Array<string> = [];
                        let imageIterationTracker = 0;

                        for (let mI in retrievedFormPreviewDataForModelImages) {
                          if (
                            retrievedFormPreviewDataForModelImages[mI][
                              `source`
                            ][`includes`](`blob`)
                          ) {
                            const modelImageUploadData = `${imageIterationTracker}`;
                            configuredModelImagesData[`push`](
                              modelImageUploadData
                            );
                            imageIterationTracker = imageIterationTracker + 1;
                          } else if (
                            retrievedFormPreviewDataForModelImages[mI][
                              `source`
                            ][`includes`](`${dataBaseUrl}imagesv2/`)
                          ) {
                            const modelImageUploadData = retrievedFormPreviewDataForModelImages[
                              mI
                            ][`source`][`replace`](
                              `${dataBaseUrl}imagesv2/`,
                              ``
                            );
                            configuredModelImagesData[`push`](
                              modelImageUploadData
                            );
                          }
                        }

                        characterUploadFormDataForModelImages[`append`](
                          `modelImagesData`,
                          JSON[`stringify`](configuredModelImagesData)
                        );
                        const updatingCharacterModelImages = await fetch(
                          `${dataBaseUrl}character/modelImages/fullMutation/${
                            mediaDataIds[`current`][`character`][`id`]
                          }`,
                          {
                            [`method`]: `PUT`,
                            [`mode`]: `cors`,
                            [`cache`]: `no-cache`,
                            [`body`]: characterUploadFormDataForModelImages,
                          }
                        )[`then`]((res) => {
                          const json = res[`json`]();
                          console[`log`](json);
                          return json;
                        });
                        console[`log`]({ updatingCharacterModelImages });
                      }

                      if (
                        formPreviewData[`current`][`data`][`videos`] &&
                        formPreviewData[`current`][`data`][`videos`] !== {} &&
                        Object[`keys`](
                          formPreviewData[`current`][`data`][`videos`]
                        )[`length`] > 0
                      ) {
                        const retrievedFormPreviewDataForVideos =
                          formPreviewData[`current`][`data`][`videos`];
                        let configuredUploadDataForVideos: Array<{
                          [`title`]: string;
                          [`link`]: string;
                        }> = [];
                        for (let v in retrievedFormPreviewDataForVideos) {
                          const configuredVideoData = {
                            [`title`]: retrievedFormPreviewDataForVideos[v][
                              `title`
                            ],
                            [`link`]: retrievedFormPreviewDataForVideos[v][
                              `link`
                            ],
                          };
                          configuredUploadDataForVideos[`push`](
                            configuredVideoData
                          );
                        }
                        const updatingCharacterVideos = await fetch(
                          `${dataBaseUrl}character/videos/fullMutation/${
                            mediaDataIds[`current`][`character`][`id`]
                          }`,
                          {
                            [`method`]: `PUT`,
                            [`mode`]: `cors`,
                            [`cache`]: `no-cache`,
                            [`headers`]: {
                              [`Content-Type`]: `application/json`,
                            },
                            [`body`]: JSON[`stringify`]({
                              [`videos`]: configuredUploadDataForVideos,
                            }),
                          }
                        )[`then`]((res) => {
                          const json = res[`json`]();
                          console[`log`](json);
                          return json;
                        });
                        console.log({ updatingCharacterVideos });
                      }

                      if (
                        formPreviewData[`current`][`data`][`excerpts`] &&
                        formPreviewData[`current`][`data`][`excerpts`] !== {} &&
                        Object[`keys`](
                          formPreviewData[`current`][`data`][`excerpts`]
                        )[`length`] > 0
                      ) {
                        const retrievedFormPreviewDataForExcerpts =
                          formPreviewData[`current`][`data`][`excerpts`];
                        let configuredUploadDataForExcerpts: Array<{
                          [`title`]: string;
                          [`excerpt`]: string;
                          [`webCite`]: string;
                        }> = [];
                        for (let e in retrievedFormPreviewDataForExcerpts) {
                          const configuredExcerptData = {
                            [`title`]: retrievedFormPreviewDataForExcerpts[e][
                              `title`
                            ],
                            [`excerpt`]: retrievedFormPreviewDataForExcerpts[e][
                              `content`
                            ],
                            [`webCite`]: retrievedFormPreviewDataForExcerpts[e][
                              `webCite`
                            ],
                          };
                          configuredUploadDataForExcerpts[`push`](
                            configuredExcerptData
                          );
                        }

                        const updatingCharacterExcerpts = await fetch(
                          `${dataBaseUrl}character/webExcerpts/fullMutation/${
                            mediaDataIds[`current`][`character`][`id`]
                          }`,
                          {
                            [`method`]: `PUT`,
                            [`mode`]: `cors`,
                            [`cache`]: `no-cache`,
                            [`headers`]: {
                              [`Content-Type`]: `application/json`,
                            },
                            [`body`]: JSON[`stringify`]({
                              [`excerpts`]: configuredUploadDataForExcerpts,
                            }),
                          }
                        )[`then`]((res) => {
                          const json = res[`json`]();
                          console[`log`]({ json });
                          return json;
                        });
                        console[`log`]({ updatingCharacterExcerpts });
                      }
                      console[`log`]({ updatingCharacterData });
                    };
                    updateCharacterData()
                      [`then`](() => {
                        setDataForForm((prevDataForForm) => {
                          return {
                            ...prevDataForForm,
                            [`forId`]: `DataAnnihilation-characterUpdate`,
                          };
                        });
                      })
                      [`then`](() => {
                        setDataFetchOpts((prevDataFecthOpts) => {
                          return {
                            [`dataIndex`]: mediaDataIds[`charactersIds`][
                              `findIndex`
                            ](
                              (ids) =>
                                ids[`id`] ===
                                mediaDataIds[`current`][`character`][`id`]
                            ),
                            [`dataSetId`]: mediaDataIds[`current`][`class`][
                              `id`
                            ],
                            [`previewDisplay`]: `C2`,
                          };
                        });
                      });
                  }}
                >{`YES`}</div>
              </div>
            );
          } else {
            return (
              <div className={styles[`innerMediaPreviewCharacterConfirmation`]}>
                <div
                  className={
                    styles[`innerMediaPreviewCharacterConfirmationSubTextOne`]
                  }
                >{`CONFIRM NEW CHARACTER "${formPreviewData[`current`][`data`][
                  `test`
                ][`characterName`][
                  `toUpperCase`
                ]()}" FOR CLASS "${formPreviewData[`current`][`data`][`test`][
                  `characterClass`
                ][`toUpperCase`]()}"?`}</div>
                <div
                  className={
                    styles[`innerMediaPreviewCharacterConfirmationSubTextTwo`]
                  }
                  onClick={(event) => {
                    const handleNewCharacterDataUpload = async () => {
                      const initialCharacterUploadFormData = new FormData();
                      const gridPhotosInputsRef =
                        storedRefs[`gridPhotosInputViewRef`][`current`];
                      const modelImagesInputsRef =
                        storedRefs[`photosInputViewRef`][`current`];
                      const retrievedGridPhotoFile =
                        gridPhotosInputsRef &&
                        gridPhotosInputsRef[`childNodes`][0] &&
                        gridPhotosInputsRef[`childNodes`][0][`childNodes`][2] &&
                        gridPhotosInputsRef[`childNodes`][0][`childNodes`][2][
                          `childNodes`
                        ][0]
                          ? gridPhotosInputsRef[`childNodes`][0][
                              `childNodes`
                            ][2][`childNodes`][0][`childNodes`][2][`files`][0]
                          : undefined;
                      const retrievedModelImagesFiles = modelImagesInputsRef[
                        `childNodes`
                      ]
                        ? [][`slice`][`call`](
                            modelImagesInputsRef[`childNodes`]
                          )
                        : undefined;

                      const retrievedGridPhotoPreviewData =
                        formPreviewData[`current`][`data`][`gridPhotos`];
                      const retrievedModelImagesPreviewData =
                        formPreviewData[`current`][`data`][`photos`];
                      const retrievedExcerptPreviewData =
                        formPreviewData[`current`][`data`][`excerpts`];
                      const retrievedVideosPreviewData =
                        formPreviewData[`current`][`data`][`videos`];
                      let modelImagesFilenameHold: Array<string> = [];
                      let retrievedModelImagesFilesContainsData = false;
                      let configuredCharacterData: Record<string, any> = {
                        name:
                          formPreviewData[`current`][`data`][`test`][
                            `characterName`
                          ],
                        description:
                          formPreviewData[`current`][`data`][`test`][
                            `extraText`
                          ],
                      };
                      if (retrievedGridPhotoFile) {
                        initialCharacterUploadFormData[`append`](
                          `gridImage`,
                          retrievedGridPhotoFile
                        );
                      } else if (
                        retrievedGridPhotoPreviewData &&
                        retrievedGridPhotoPreviewData !== {}
                      ) {
                        console.log(
                          `fired grid image configuring character data`
                        );
                        if (
                          retrievedGridPhotoPreviewData[
                            Object[`keys`](retrievedGridPhotoPreviewData)[0]
                          ]
                        ) {
                          configuredCharacterData = {
                            ...configuredCharacterData,
                            [`gridImage`]: retrievedGridPhotoPreviewData[
                              Object[`keys`](retrievedGridPhotoPreviewData)[0]
                            ][`source`][`replace`](
                              `${dataBaseUrl}imagesv2/`,
                              ``
                            ),
                          };
                        }
                      } else {
                        configuredCharacterData = {
                          ...configuredCharacterData,
                          [`gridImage`]: ``,
                        };
                      }
                      if (
                        retrievedModelImagesFiles &&
                        retrievedModelImagesFiles[`length`] > 0
                      ) {
                        retrievedModelImagesFiles[`forEach`]((node: any) => {
                          const retrievedModelImageFile =
                            node[`childNodes`][2][`childNodes`][0][
                              `childNodes`
                            ][2][`files`][0];
                          if (retrievedModelImageFile) {
                            retrievedModelImagesFilesContainsData = true;
                            initialCharacterUploadFormData[`append`](
                              `modelImages`,
                              retrievedModelImageFile
                            );
                          }
                        });
                      }
                      if (
                        !retrievedModelImagesFilesContainsData &&
                        retrievedModelImagesPreviewData &&
                        retrievedModelImagesPreviewData !== {}
                      ) {
                        const retrievedModelImagesPreviewDataKeys = Object[
                          `keys`
                        ](retrievedModelImagesPreviewData);
                        retrievedModelImagesPreviewDataKeys[`forEach`](
                          (key: string) => {
                            const configuredFilename = retrievedModelImagesPreviewData[
                              key
                            ][`source`][`replace`](
                              `${dataBaseUrl}imagesv2/`,
                              ``
                            );
                            modelImagesFilenameHold[`push`](configuredFilename);
                          }
                        );
                        configuredCharacterData = {
                          ...configuredCharacterData,
                          [`modelImages`]: modelImagesFilenameHold,
                        };
                      } else if (!retrievedModelImagesFilesContainsData) {
                        configuredCharacterData = {
                          ...configuredCharacterData,
                          [`modelImages`]: [],
                        };
                      }
                      initialCharacterUploadFormData[`append`](
                        `characterData`,
                        JSON[`stringify`](configuredCharacterData)
                      );

                      const excerptsDataHold = retrievedExcerptPreviewData
                        ? Object[`keys`](retrievedExcerptPreviewData)[`map`](
                            (excerptKey) => {
                              return {
                                [`title`]: retrievedExcerptPreviewData[
                                  excerptKey
                                ][`title`],
                                [`excerpt`]: retrievedExcerptPreviewData[
                                  excerptKey
                                ][`content`],
                                [`webCite`]: retrievedExcerptPreviewData[
                                  excerptKey
                                ][`webCite`],
                              };
                            }
                          )
                        : [];
                      const videosDataHold = retrievedVideosPreviewData
                        ? Object[`keys`](retrievedVideosPreviewData)[`map`](
                            (videoKey) => {
                              return {
                                [`title`]: retrievedVideosPreviewData[videoKey][
                                  `title`
                                ],
                                [`link`]: retrievedVideosPreviewData[videoKey][
                                  `link`
                                ],
                              };
                            }
                          )
                        : [];
                      let newCharacterDataUploadVersion: string = ``;
                      if (
                        retrievedGridPhotoFile &&
                        retrievedModelImagesFiles &&
                        retrievedModelImagesFiles[`length`] > 0 &&
                        retrievedModelImagesFilesContainsData
                      ) {
                        newCharacterDataUploadVersion = `v1`;
                      } else if (retrievedGridPhotoFile) {
                        newCharacterDataUploadVersion = `v2`;
                      } else if (
                        retrievedModelImagesFiles &&
                        retrievedModelImagesFiles[`length`] > 0 &&
                        retrievedModelImagesFilesContainsData
                      ) {
                        newCharacterDataUploadVersion = `v3`;
                      } else {
                        newCharacterDataUploadVersion = `v4`;
                      }

                      const addCharacterData = await fetch(
                        `${dataBaseUrl}characterSet/addCharacter/${newCharacterDataUploadVersion}/${
                          mediaDataIds[`current`][`class`][`id`]
                        }`,
                        newCharacterDataUploadVersion === `v4`
                          ? {
                              [`method`]: `PUT`,
                              [`mode`]: `cors`,
                              [`cache`]: `no-cache`,
                              [`headers`]: {
                                [`Content-Type`]: `application/json`,
                              },
                              [`body`]: JSON[`stringify`]({
                                [`characterData`]: configuredCharacterData,
                              }),
                            }
                          : {
                              [`method`]: `POST`,
                              [`mode`]: `cors`,
                              [`cache`]: `no-cache`,
                              // headers: { [`Content-Type`]: `multipart/form-data` },
                              [`body`]: initialCharacterUploadFormData,
                            }
                      )[`then`]((res) => {
                        const json = res[`json`]();
                        console[`log`](json);
                        return json;
                      });
                      const addExtendedCharacterData = await fetch(
                        `${dataBaseUrl}character/extend/${
                          addCharacterData[`newCharacter`][`_id`]
                        }`,
                        {
                          [`method`]: `POST`,
                          [`mode`]: `cors`,
                          [`cache`]: `no-cache`,
                          [`headers`]: { [`Content-Type`]: `application/json` },
                          [`body`]: JSON[`stringify`]({
                            [`excerpts`]: excerptsDataHold,
                            [`videos`]: videosDataHold,
                          }),
                        }
                      )[`then`]((res) => {
                        const json = res[`json`]();
                        console[`log`](json);
                        return json;
                      });

                      console[`log`]({
                        addCharacterData,
                        addExtendedCharacterData,
                        newCharacterDataUploadVersion,
                        initialCharacterUploadFormData,
                        retrievedGridPhotoFile,
                        retrievedGridPhotoPreviewData,
                        retrievedModelImagesFiles,
                        retrievedModelImagesPreviewData,
                        retrievedExcerptPreviewData,
                        retrievedVideosPreviewData,
                        modelImagesFilenameHold,
                        excerptsDataHold,
                        videosDataHold,
                      });
                    };
                    handleNewCharacterDataUpload()[`then`](() => {
                      setDataForForm((prevDataForForm) => {
                        return {
                          ...prevDataForForm,
                          [`forId`]: `DataAnnihilation`,
                        };
                      });
                      setDataFetchOpts((prevDataFetchOpts) => {
                        return {
                          ...prevDataFetchOpts,
                          [`dataIndex`]: 0,
                          [`dataSetId`]: mediaDataIds[`current`][`class`][`id`],
                          [`previewDisplay`]: `C1`,
                        };
                      });
                    });
                  }}
                >{`YES`}</div>
              </div>
            );
          }
        });
      } else {
        setPreviewDisplay(() => {
          return (
            <div className={styles[`innerMediaPreviewClassConfirmation`]}>
              {mediaDataIds[`current`][`class`] !== `` ? (
                <div
                  className={
                    styles[`innerMediaPreviewClassConfirmationSubTextContainer`]
                  }
                  style={{ width: `32%` }}
                >
                  <div
                    className={
                      styles[`innerMediaPreviewClassConfirmationSubTextOne`]
                    }
                  >{`CONFIRM UPDATING CLASS "${formPreviewData[`current`][
                    `data`
                  ][`test`][`characterName`][
                    `toUpperCase`
                  ]()}" NAME TO "${formPreviewData[`current`][`data`][`test`][
                    `characterClass`
                  ][`toUpperCase`]()}"?`}</div>
                  <div
                    className={
                      styles[`innerMediaPreviewClassConfirmationSubTextTwo`]
                    }
                    onClick={(event) => {
                      const configuredUploadData = {
                        setName: `${
                          formPreviewData[`current`][`data`][`test`][
                            `characterClass`
                          ]
                        }`,
                      };
                      const updateClassName = async (uploadData: {
                        setName: string;
                      }) => {
                        const updatingClassName = await fetch(
                          `${dataBaseUrl}characterSet/update/${
                            mediaDataIds[`current`][`class`][`id`]
                          }`,
                          {
                            [`method`]: `PUT`,
                            [`mode`]: `cors`,
                            [`cache`]: `no-cache`,
                            [`headers`]: {
                              [`Content-Type`]: `application/json`,
                            },
                            [`body`]: JSON[`stringify`](uploadData),
                          }
                        )
                          [`then`]((res) => {
                            const json = res[`json`]();
                            return json;
                          })
                          [`then`]((data) => {
                            console[`log`]({
                              dataFromClassNameUpdateFetch: data,
                            });
                            return data;
                          });
                        setMediaDataIds((prevMediaDataIds) => {
                          const retrievedStoredClasses =
                            prevMediaDataIds[`classesIds`];
                          const retrievedClassIndex = retrievedStoredClasses[
                            `findIndex`
                          ](
                            (ids) =>
                              ids[`id`] ===
                              updatingClassName[`characterSetUpdate`][`_id`]
                          );
                          let configuredUpdatedClassData =
                            retrievedStoredClasses[retrievedClassIndex];
                          configuredUpdatedClassData = {
                            ...configuredUpdatedClassData,
                            [`name`]: `${
                              updatingClassName[`characterSetUpdate`][`setName`]
                            }`,
                          };
                          retrievedStoredClasses[`splice`](
                            retrievedClassIndex,
                            1,
                            configuredUpdatedClassData
                          );

                          return {
                            ...prevMediaDataIds,
                            [`classesIds`]: retrievedStoredClasses,
                            [`current`]: {
                              ...prevMediaDataIds[`current`],
                              [`class`]: {
                                ...prevMediaDataIds[`current`][`class`],
                                [`name`]: `${
                                  updatingClassName[`characterSetUpdate`][
                                    `setName`
                                  ]
                                }`,
                              },
                            },
                          };
                        });
                        setInitialFormValues((prevInitialFormValues) => {
                          return {
                            ...prevInitialFormValues,
                            [`test`]: {
                              ...prevInitialFormValues[`test`],
                              [`characterClass`]: `${
                                updatingClassName[`characterSetUpdate`][
                                  `setName`
                                ]
                              }`,
                            },
                          };
                        });
                        setFormPreviewData((prevFormPreviewData) => {
                          const valuesAreDifferent = checkIfValuesAreDifferent(
                            {
                              values: {
                                ...prevFormPreviewData[`current`][`data`],
                              },
                            },
                            {
                              ...initialFormValues,
                              [`test`]: {
                                ...initialFormValues[`test`],
                                [`characterClass`]: `${
                                  updatingClassName[`characterSetUpdate`][
                                    `setName`
                                  ]
                                }`,
                              },
                            },
                            initialInputs,
                            mediaMiniFormInputs
                          );
                          if (valuesAreDifferent) {
                            return {
                              ...prevFormPreviewData,
                              [`callBackIterationCount`]:
                                prevFormPreviewData[`callBackIterationCount`] +
                                1,
                            };
                          } else {
                            return {
                              ...prevFormPreviewData,
                              [`current`]: {
                                ...prevFormPreviewData[`current`],
                                [`type`]: `C1`,
                              },
                            };
                          }
                        });
                        console[`log`]({ updatingClassName });
                      };
                      updateClassName(configuredUploadData);
                    }}
                  >
                    {`YES`}
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div
                className={
                  styles[`innerMediaPreviewClassConfirmationSubTextContainer`]
                }
                style={
                  mediaDataIds[`current`][`class`] !== ``
                    ? { width: `32%` }
                    : {}
                }
              >
                <div
                  className={
                    styles[`innerMediaPreviewClassConfirmationSubTextOne`]
                  }
                >{`CONFIRM CREATION OF NEW CLASS "${formPreviewData[`current`][
                  `data`
                ][`test`][`characterClass`][`toUpperCase`]()}"?`}</div>
                <div
                  className={
                    styles[`innerMediaPreviewClassConfirmationSubTextTwo`]
                  }
                  onClick={(event) => {
                    const handleNewClassUpload = async (
                      classUploadData: {
                        setName: string;
                      },
                      mediaDataIdsv2: any,
                      setMediaDataIdsv2: Function,
                      setFormPreviewDatav2: Function
                    ) => {
                      const stringifiedClassUploadData = JSON[`stringify`](
                        classUploadData
                      );
                      const addingCharacterSet = await fetch(
                        `${dataBaseUrl}addCharacterSet/`,
                        {
                          method: `POST`,
                          mode: `cors`,
                          cache: `no-cache`,
                          headers: { [`Content-Type`]: `application/json` },
                          body: stringifiedClassUploadData,
                        }
                      )
                        .then((res) => {
                          const json = res.json();
                          return json;
                        })
                        .then(
                          (data: {
                            _id: string;
                            setName: string;
                            charactersId: Array<{
                              _id: string;
                              name: string;
                              id: string;
                            }>;
                            date: Date;
                          }) => {
                            const newClassId = {
                              name: data[`setName`],
                              id: data[`_id`],
                            };
                            const updatedClassesIds =
                              mediaDataIdsv2[`classesIds`];
                            updatedClassesIds[`push`](newClassId);
                            setMediaDataIdsv2((prevMediaDataIds: any) => {
                              return {
                                ...prevMediaDataIds,
                                [`classesIds`]: updatedClassesIds,
                                [`charactersIds`]: data[`charactersId`],
                                [`current`]: {
                                  ...prevMediaDataIds[`current`],
                                  [`class`]: newClassId,
                                },
                              };
                            });
                          }
                        )
                        .then(() => {
                          setFormPreviewDatav2((prevFormPreviewData: any) => {
                            return {
                              ...prevFormPreviewData,
                              [`callBackIterationCount`]:
                                prevFormPreviewData[`callBackIterationCount`] +
                                1,
                            };
                          });
                        });
                    };

                    handleNewClassUpload(
                      {
                        setName:
                          formPreviewData[`current`][`data`][`test`][
                            `characterClass`
                          ],
                      },
                      mediaDataIds,
                      setMediaDataIds,
                      setFormPreviewData
                    );
                  }}
                >{`YES`}</div>
              </div>
              {formPreviewData[`current`][`data`][`test`][`characterName`] &&
              formPreviewData[`current`][`data`][`test`][`characterName`] !==
                `` ? (
                <div
                  className={
                    styles[`innerMediaPreviewClassConfirmationSubTextContainer`]
                  }
                  style={
                    mediaDataIds[`current`][`class`] !== ``
                      ? { width: `32%` }
                      : {}
                  }
                >
                  <div
                    className={
                      styles[`innerMediaPreviewClassConfirmationSubTextOne`]
                    }
                  >{`UPLOAD "${mediaDataIds[`current`][`character`][`name`][
                    `toUpperCase`
                  ]()}"'s DATA TO EXISTING CLASS?`}</div>
                  <div>
                    {mediaDataIds[`classesIds`][`map`]((ids) => {
                      return (
                        <div
                          className={
                            styles[
                              `innerMediaPreviewClassConfirmationSubTextTwo`
                            ]
                          }
                          onClick={async (event) => {
                            const fetchingClassCharactersIds = await fetch(
                              `${dataBaseUrl}characterSet/${ids[`id`]}`,
                              {
                                method: "GET",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                              }
                            )
                              .then((res) => {
                                const json = res.json();
                                return json;
                              })
                              .then(
                                (
                                  data: Array<{
                                    _id: string;
                                    date: string;
                                    description: string;
                                    name: string;
                                    characterImages: {
                                      gridImage: string;
                                      modelImages: Array<string>;
                                    };
                                  }>
                                ) => {
                                  return data[`map`]((item) => {
                                    return {
                                      id: item[`_id`],
                                      name: item[`name`],
                                      gridImage: `${dataBaseUrl}imagesv2/${
                                        item[`characterImages`][`gridImage`]
                                      }`,
                                    };
                                  });
                                }
                              );
                            setDataForForm((prevDataForForm: any) => {
                              return {
                                ...prevDataForForm,
                                [`forId`]: `forStorage-test`,
                                [`forInput`]: `characterClass`,
                                [`inputValue`]: `${ids[`name`]}`,
                              };
                            });
                            setMediaDataIds((prevMediaDataIds) => {
                              return {
                                ...prevMediaDataIds,
                                [`charactersIds`]: fetchingClassCharactersIds,
                                [`current`]: {
                                  ...prevMediaDataIds[`current`],
                                  [`class`]: ids,
                                },
                              };
                            });
                            storedRefs[`selectionSectionCharacterClassRef`][
                              `current`
                            ][`childNodes`][0][`value`] = ids[`name`];
                          }}
                        >{`${ids[`name`][`toUpperCase`]()}`}</div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          );
        });
      }
    } else if (previewType[`includes`](`DataAnnihilation`)) {
      const currentClassId =
        mediaDataIds[`current`][`class`] &&
        mediaDataIds[`current`][`class`] !== `` &&
        mediaDataIds[`current`][`class`][`id`] &&
        mediaDataIds[`current`][`class`][`id`] !== ``
          ? mediaDataIds[`current`][`class`][`id`]
          : undefined;
      const currentCharacterId =
        mediaDataIds[`current`][`character`] &&
        mediaDataIds[`current`][`character`][`id`] &&
        mediaDataIds[`current`][`character`][`id`] !== ``
          ? mediaDataIds[`current`][`character`][`id`]
          : undefined;
      if (previewType[`includes`](`Selection`)) {
        setPreviewDisplay((prevPreviewDisplay) => {
          const annihilateClassConfirmationDisplay = <div></div>;
          const annihilateCharacterConfirmationDisplay = <div></div>;

          if (currentClassId && currentCharacterId) {
            return (
              <div className={styles[`annihilatePreviewDisplay`]}>
                {mediaDataIds[`classesIds`][`length`] > 1 ? (
                  <div
                    className={styles[`annihilateTextContainer`]}
                    style={{ width: `100%`, height: `50%` }}
                  >
                    <div
                      className={styles[`annihilateTextOne`]}
                    >{`ANNIHILATE CLASS "${mediaDataIds[`current`][`class`][
                      `name`
                    ][`toUpperCase`]()}"?`}</div>
                    <div
                      className={styles[`annihilateTextTwo`]}
                      onClick={(event) => {
                        setFormPreviewData((prevFormPreviewData) => {
                          return {
                            ...prevFormPreviewData,
                            [`current`]: {
                              ...prevFormPreviewData[`current`],
                              [`type`]: `DataAnnihilationConfirmationClass`,
                            },
                          };
                        });
                      }}
                    >{`YES`}</div>
                  </div>
                ) : (
                  <></>
                )}
                <div
                  className={styles[`annihilateTextContainer`]}
                  style={{
                    width: `100%`,
                    height:
                      mediaDataIds[`classesIds`][`length`] > 1 ? `50%` : `100%`,
                  }}
                >
                  <div
                    className={styles[`annihilateTextOne`]}
                  >{`ANNIHILATE CHARACTER "${mediaDataIds[`current`][
                    `character`
                  ][`name`][`toUpperCase`]()}"?`}</div>
                  <div
                    className={styles[`annihilateTextTwo`]}
                    onClick={(event) => {
                      setFormPreviewData((prevFormPreviewData) => {
                        return {
                          ...prevFormPreviewData,
                          [`current`]: {
                            ...prevFormPreviewData[`current`],
                            [`type`]: `DataAnnihilationConfirmationCharacter`,
                          },
                        };
                      });
                    }}
                  >{`YES`}</div>
                </div>
              </div>
            );
          } else if (
            currentClassId &&
            mediaDataIds[`classesIds`][`length`] > 1
          ) {
            return (
              <div className={styles[`annihilatePreviewDisplay`]}>
                <div
                  className={styles[`annihilateTextContainer`]}
                  style={{ width: `100%`, height: `100%` }}
                >
                  <div
                    className={styles[`annihilateTextOne`]}
                  >{`ANNIHILATE CLASS "${mediaDataIds[`current`][`class`][
                    `name`
                  ][`toUpperCase`]()}"?`}</div>
                  <div
                    className={styles[`annihilateTextTwo`]}
                    onClick={(event) => {
                      setFormPreviewData((prevFormPreviewData) => {
                        return {
                          ...prevFormPreviewData,
                          [`current`]: {
                            ...prevFormPreviewData[`current`],
                            [`type`]: `DataAnnihilationConfirmationClass`,
                          },
                        };
                      });
                    }}
                  >{`YES`}</div>
                </div>
              </div>
            );
          } else if (currentCharacterId) {
            return (
              <div className={styles[`annihilatePreviewDisplay`]}>
                <div
                  className={styles[`annihilateTextContainer`]}
                  style={{ width: `100%`, height: `100%` }}
                >
                  <div
                    className={styles[`annihilateTextOne`]}
                  >{`ANNIHILATE CHARACTER "${mediaDataIds[`current`][
                    `character`
                  ][`name`][`toUpperCase`]()}"?`}</div>
                  <div
                    className={styles[`annihilateTextTwo`]}
                    onClick={(event) => {
                      setFormPreviewData((prevFormPreviewData) => {
                        return {
                          ...prevFormPreviewData,
                          [`current`]: {
                            ...prevFormPreviewData[`current`],
                            [`type`]: `DataAnnihilationConfirmationCharacter`,
                          },
                        };
                      });
                    }}
                  >{`YES`}</div>
                </div>
              </div>
            );
          } else {
            return prevPreviewDisplay;
          }
        });
      } else if (previewType[`includes`](`Confirmation`)) {
        setPreviewDisplay((prevPreviewDisplay) => {
          if (previewType[`includes`](`Class`)) {
            return (
              <div
                className={styles[`annihilateTextContainer`]}
                style={{ width: `100%`, height: `100%` }}
              >
                <div
                  className={styles[`annihilateTextOne`]}
                >{`!..CONFIRM ANNIHILATING CLASS "${mediaDataIds[`current`][
                  `class`
                ][`name`][`toUpperCase`]()}"..!`}</div>
                <div
                  className={styles[`annihilateTextTwo`]}
                  onClick={(event) => {
                    const performAnnihilation = async () => {
                      const annihilateClassData = await fetch(
                        `${dataBaseUrl}characterSet/annihilateData/${
                          mediaDataIds[`current`][`class`][`id`]
                        }`,
                        {
                          method: `DELETE`,
                          mode: `cors`,
                          cache: `no-cache`,
                          headers: { [`Content-Type`]: `application/json` },
                        }
                      )
                        [`then`]((res) => {
                          const json = res[`json`]();
                          return json;
                        })
                        [`then`]((data) => {
                          setDataForForm((prevDataForForm) => {
                            return {
                              ...prevDataForForm,
                              [`forId`]: `DataAnnihilation-${v4()}`,
                            };
                          });
                          return data;
                        })
                        [`then`]((datav2) => {
                          setDataFetchOpts((prevDataFetchOpts) => {
                            return {
                              ...prevDataFetchOpts,
                              [`dataIndex`]: undefined,
                              [`dataSetId`]: undefined,
                              [`previewDisplay`]: `C1`,
                            };
                          });
                          return datav2;
                        });
                      console.log({ annihilateClassData });
                    };
                    performAnnihilation();
                  }}
                >{`YES`}</div>
                <div
                  className={styles[`annihilateTextThree`]}
                  onClick={(event) => {
                    setFormPreviewData((prevFormPreviewData) => {
                      return {
                        ...prevFormPreviewData,
                        [`current`]: {
                          ...prevFormPreviewData[`current`],
                          [`type`]: `DataAnnihilationSelection`,
                        },
                      };
                    });
                  }}
                >{`REEVALUATE`}</div>
              </div>
            );
          } else if (previewType[`includes`](`Character`)) {
            return (
              <div
                className={styles[`annihilateTextContainer`]}
                style={{ width: `100%`, height: `100%` }}
              >
                <div
                  className={styles[`annihilateTextOne`]}
                >{`!..CONFIRM ANNIHILATING CHARACTER "${mediaDataIds[`current`][
                  `character`
                ][`name`][`toUpperCase`]()}"..!`}</div>
                <div
                  className={styles[`annihilateTextTwo`]}
                  onClick={(event) => {
                    const performAnnihilation = async () => {
                      const annihilateCharacterData = await fetch(
                        `${dataBaseUrl}character/annihilateData/${
                          mediaDataIds[`current`][`character`][`id`]
                        }`,
                        {
                          method: `DELETE`,
                          mode: `cors`,
                          cache: `no-cache`,
                          headers: { [`Content-Type`]: `application/json` },
                        }
                      )
                        [`then`]((res) => {
                          const json = res[`json`]();
                          console.log({ annihilationDataCheck: json });
                          return json;
                        })
                        [`then`]((data) => {
                          setDataForForm((prevDataForForm) => {
                            return {
                              ...prevDataForForm,
                              [`forId`]: `DataAnnihilation-${v4()}`,
                            };
                          });
                          return data;
                        })
                        [`then`]((datav2) => {
                          setDataFetchOpts((prevDataFetchOpts) => {
                            return {
                              ...prevDataFetchOpts,
                              [`dataIndex`]: undefined,
                              [`dataSetId`]: mediaDataIds[`current`][`class`][
                                `id`
                              ],
                              [`previewDisplay`]: `C1`,
                            };
                          });
                          return datav2;
                        });
                      console.log({ annihilateCharacterData });
                    };
                    performAnnihilation();
                  }}
                >{`YES`}</div>
                <div
                  className={styles[`annihilateTextThree`]}
                  onClick={(event) => {
                    setFormPreviewData((prevFormPreviewData) => {
                      return {
                        ...prevFormPreviewData,
                        [`current`]: {
                          ...prevFormPreviewData[`current`],
                          [`type`]: `DataAnnihilationSelection`,
                        },
                      };
                    });
                  }}
                >{`REEVALUATE`}</div>
              </div>
            );
          } else {
            return prevPreviewDisplay;
          }
        });
      }
    }
  }, [formPreviewData]);

  // Handle component return view
  switch (APIPage) {
    case `NewCharacterForm`:
      return (
        <div
          className={styles[`mainDisplayClass`]}
          style={styles[`mainDisplayStyle`]}
        >
          <div
            className={styles[`outterMediaPreviewDisplay`]}
            style={styles[`outterMediaPreviewDisplaySupport`]}
          >
            {previewDisplay}
          </div>
          <BaseForm
            styles={styles}
            dataFetchingOptions={{ dataFetchOpts, setDataFetchOpts }}
            customInitialFormValues={{
              initialFormValues,
              setInitialFormValues,
            }}
            ids={{ mediaDataIds, setMediaDataIds }}
            customFormSchema={{ validSchema, setValidSchema }}
            formFacade={{
              layoutType,
              initialInputs,
              mediaMiniFormInputs,
            }}
            formDataOpts={{ dataForForm, setDataForForm }}
            formPreviewDataOpts={{ formPreviewData, setFormPreviewData }}
            mediaTypeTextOpts={{ mediaTypeText, setMediaTypeText }}
            storedRefs={storedRefs}
          />
        </div>
      );
    default:
      return <div>{`You Don't Belong Here .!.?.!.`}</div>;
  }
};

export default DestktopAPI;
