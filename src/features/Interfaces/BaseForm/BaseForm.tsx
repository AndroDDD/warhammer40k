import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { v4 } from "uuid";

// Handle styling of currently selected media data inputs
export const handleCurrentMediaInputsSelectedStyle = (
  childNodesForStyling: Array<HTMLDivElement>,
  selectedChildId: string,
  mediaType: string
) => {
  for (let q = 0; q < childNodesForStyling.length; q++) {
    let childNodeTyped = (childNodesForStyling[q] as unknown) as HTMLDivElement;
    if (childNodeTyped.id.includes(selectedChildId)) {
      childNodeTyped.style.display = `flex`;
    } else {
      childNodeTyped.style.display = `none`;
    }
  }
};

// Declare function for switching between media inputs view for form
export const switchMediaMiniForm = (
  switchTo: string,
  storedRefs: any,
  setMediaTypeText: Function
) => {
  for (let x in storedRefs) {
    let checkedIfMediaInputView = RegExp(`InputViewRef`).test(x);
    if (checkedIfMediaInputView) {
      let checkedIfFormMatches = RegExp(switchTo).test(x);
      console.log({ storedRefs, x });
      if (checkedIfFormMatches) {
        storedRefs[x].current.style.display = `flex`;
        setMediaTypeText(() => {
          return switchTo;
        });
      } else {
        storedRefs[x].current.style.display = `none`;
      }
    }
  }
};

// Check if form values are different from initial values
export const checkIfValuesAreDifferent = (
  formikConfHold: any,
  initialFormValuesHold: any,
  initialInputsv2: Array<any>,
  mediaMiniFormInputsv2: Array<any>
) => {
  let dataIsDifferent = false;

  initialInputsv2[`forEach`]((opts) => {
    const retrievedData = formikConfHold[`values`][`test`][opts[`name`]];
    const valuesToCompare = initialFormValuesHold[`test`][opts[`name`]];
    console.log({ retrievedData, valuesToCompare });
    if (retrievedData !== valuesToCompare) {
      dataIsDifferent = true;
      console.log(`testData-${opts[`name`]} is different`);
    }
  });

  mediaMiniFormInputsv2[`forEach`]((opts) => {
    if (
      formikConfHold[`values`][`${opts[`mediaType`]}s`] &&
      initialFormValuesHold[`${opts[`mediaType`]}s`]
    ) {
      const formikValuesLength = Object.keys(
        formikConfHold[`values`][`${opts[`mediaType`]}s`]
      ).length;
      const valuesToCompareLength = Object.keys(
        initialFormValuesHold[`${opts[`mediaType`]}s`]
      ).length;
      for (let dataId in initialFormValuesHold[`${opts[`mediaType`]}s`]) {
        const retrievedData =
          formikConfHold[`values`][`${opts[`mediaType`]}s`][dataId];
        const valuesToCompare =
          initialFormValuesHold[`${opts[`mediaType`]}s`][dataId];
        console.log({ retrievedData, valuesToCompare });
        for (let dataKey in retrievedData) {
          if (retrievedData[dataKey] !== valuesToCompare[dataKey]) {
            dataIsDifferent = true;
            console.log(`${dataId}-${dataKey} is different`);
          }
        }
      }

      if (
        valuesToCompareLength < formikValuesLength ||
        valuesToCompareLength > formikValuesLength
      ) {
        dataIsDifferent = true;
      }
    }
  });

  if (dataIsDifferent) {
    console.log(`values are different`);
  } else {
    console.log(`values are the same`);
  }
  return dataIsDifferent;
};

interface FormConfigurationInterface {
  styles: any;
  customInitialFormValues: {
    initialFormValues: any;
    setInitialFormValues: Function;
  };
  ids: {
    mediaDataIds: Record<string, any> & {
      classesIds: Array<{ name: string; id: string }>;
      charactersIds: Array<{ name: string; id: string; gridImage: string }>;
      current: Record<string, any>;
      /*
      & {
        video: string | number;
        galleryPhoto: string | number;
        passage: string | number;
      };
      */
    };
    setMediaDataIds: React.Dispatch<
      React.SetStateAction<{
        classesIds: Array<{ name: string; id: string }>;
        charactersIds: Array<{ name: string; id: string; gridImage: string }>;
        current: Record<string, any>;
      }>
    >;
  };
  formFacade: {
    layoutType: string;
    initialInputs: Array<{
      name: string;
      inputType: string;
      placeholder: string;
    }>;
    mediaMiniFormInputs: Array<{
      mediaType: string;
      addButtonText: string;
      inputsOpts: Array<{
        key: string;
        typeOfInput: string;
        childrenElements?: Array<any>;
        initialValue?: any;
      }>;
      inputsDeletionCallback: Function;
    }>;
  };
  formPreviewDataOpts: {
    formPreviewData: {
      callBackIterationCount: number;
      stored: any;
      current: { type: string; data: any };
    };
    setFormPreviewData: React.Dispatch<
      React.SetStateAction<{
        callBackIterationCount: number;
        stored: any;
        current: {
          type: string;
          data: any;
        };
      }>
    >;
  };
  customFormSchema: {
    validSchema: any;
    setValidSchema: Function;
  };
  storedRefs: Record<string, React.MutableRefObject<any>>;
  formDataOpts: { dataForForm: any; setDataForForm: Function };
  mediaTypeTextOpts: { mediaTypeText: any; setMediaTypeText: Function };
  dataFetchingOptions: { dataFetchOpts: any; setDataFetchOpts: Function };
}

interface genericObject extends Record<string, any> {}

const BaseForm: React.FC<FormConfigurationInterface> = ({
  styles,
  customInitialFormValues,
  ids,
  formFacade,
  formPreviewDataOpts,
  customFormSchema,
  storedRefs,
  formDataOpts,
  mediaTypeTextOpts,
  dataFetchingOptions,
}) => {
  // Destructure incoming props
  const { initialFormValues, setInitialFormValues } = customInitialFormValues;
  const { validSchema, setValidSchema } = customFormSchema;
  const { mediaDataIds, setMediaDataIds } = ids;
  const { layoutType, initialInputs, mediaMiniFormInputs } = formFacade;
  const { formPreviewData, setFormPreviewData } = formPreviewDataOpts;
  const { dataForForm, setDataForForm } = formDataOpts;
  const { mediaTypeText, setMediaTypeText } = mediaTypeTextOpts;
  const { dataFetchOpts, setDataFetchOpts } = dataFetchingOptions;

  const [switchFormDataConfig, setSwitchFormDataConfig] = React.useState<{
    forId: string;
    inputValue: any;
  }>(() => {
    return { forId: ``, inputValue: undefined };
  });

  // Handle Form Submission
  const handleFormSubmission = (values: genericObject) => {
    console.log({ values, validSchema });
    const isValuesDifferent = checkIfValuesAreDifferent(
      formikConf,
      initialFormValues,
      initialInputs,
      mediaMiniFormInputs
    );
    if (isValuesDifferent) {
      setFormPreviewData((previousFormPreviewData) => {
        return {
          ...previousFormPreviewData,
          current: {
            ...previousFormPreviewData[`current`],
            type: "newData",
            data: values,
          },
        };
      });
      formikConf.resetForm(formikConf);
    }
  };

  // Handle switching of forms
  const switchFormData = (
    event?: any,
    dataIndex?: number | string,
    previewDisplayType?: string
  ) => {
    console.log({ formikConf, validSchema });
    setDataForForm((prevFormData: any) => {
      return { ...prevFormData, forId: `DataAnnihilation` };
    });
    if (dataIndex || dataIndex === 0) {
      if (typeof dataIndex === `number`) {
        setDataFetchOpts((prevDataFetchOpts: any) => {
          return {
            dataIndex,
            dataSetId: mediaDataIds[`current`][`class`][`id`],
            previewDisplay: previewDisplayType,
          };
        });
      } else if (typeof dataIndex === `string`) {
        setSwitchFormDataConfig((prevDataForForm: any) => {
          return {
            ...prevDataForForm,
            forId: `freshForm`,
            inputValue: dataIndex,
          };
        });
      }
    }
  };

  // Handle disabling of C1 and C2 buttons when form values change
  const disableC1C2NavButtons = (disable: boolean) => {
    if (disable) {
      storedRefs[`nextSelectionButtonC1Ref`][`current`][`style`][
        `cursor`
      ] = `default`;
      storedRefs[`prevSelectionButtonC1Ref`][`current`][`style`][
        `cursor`
      ] = `default`;
      storedRefs[`addSelectionButtonC1Ref`][`current`][`style`][
        `cursor`
      ] = `default`;
      storedRefs[`nextSelectionButtonC2Ref`][`current`][`style`][
        `cursor`
      ] = `default`;
      storedRefs[`prevSelectionButtonC2Ref`][`current`][`style`][
        `cursor`
      ] = `default`;
      storedRefs[`addSelectionButtonC2Ref`][`current`][`style`][
        `cursor`
      ] = `default`;
    } else {
      storedRefs[`nextSelectionButtonC1Ref`][`current`][`style`][
        `cursor`
      ] = `pointer`;
      storedRefs[`prevSelectionButtonC1Ref`][`current`][`style`][
        `cursor`
      ] = `pointer`;
      storedRefs[`addSelectionButtonC1Ref`][`current`][`style`][
        `cursor`
      ] = `pointer`;
      storedRefs[`nextSelectionButtonC2Ref`][`current`][`style`][
        `cursor`
      ] = `pointer`;
      storedRefs[`prevSelectionButtonC2Ref`][`current`][`style`][
        `cursor`
      ] = `pointer`;
      storedRefs[`addSelectionButtonC2Ref`][`current`][`style`][
        `cursor`
      ] = `pointer`;
    }
  };

  // Generate new form input
  const newFormElement = (
    whatType: string,
    mediaType: string,
    mediaKeyRef: string,
    dataKeyRefId: string | number | undefined,
    classNameForStyle: string,
    childElements?: Array<any>,
    dataConfigObject?: object,
    initialInputValue?: any,
    inputsDeletionCallBack?: Function
  ) => {
    const generatedSubId = v4();

    const createNewInputLabelId = () => {
      if (whatType === `textInputWithSubIndex`) {
        return `${mediaType}-${mediaKeyRef}-label-id-${dataKeyRefId}-subId-${generatedSubId}`;
      }

      if (mediaKeyRef === `data`) {
        return `${mediaType}-${mediaKeyRef}-label-id-${dataKeyRefId}`;
      } else {
        return `${mediaType}-${mediaKeyRef}-label-id-${dataKeyRefId}`;
      }
    };

    const createNewInputLabelText = () => {
      if (whatType === `textInputWithSubIndex`) {
        const clarifyingText = () => {
          return `${mediaKeyRef}:${String(generatedSubId).slice(0, 6)}`;
        };
        const clarifiedText = clarifyingText();
        return clarifiedText;
      }
      if (mediaKeyRef === `data`) {
        const clarifyingText = () => {
          return `${mediaType}:${String(dataKeyRefId).slice(0, 6)}`;
        };
        const clarifiedText = clarifyingText();
        return clarifiedText;
      } else {
        return mediaKeyRef;
      }
    };

    let newFormElementLabel = document.createElement("div");
    newFormElementLabel.id = createNewInputLabelId();
    newFormElementLabel.className = `${classNameForStyle}-label`;
    newFormElementLabel.innerHTML = createNewInputLabelText();

    let newFormElementsRemoveButton = document.createElement("div");

    let newFormElementsContainer = document.createElement("div");

    let newFormElement: any;

    if (whatType === `textInput`) {
      newFormElementsContainer.className = `${classNameForStyle}-text-input-container`;
      newFormElementsRemoveButton.className = `${classNameForStyle}-text-input-remove-button`;

      let newFormInputElement = document.createElement("input");
      newFormInputElement.id = `${mediaType}s.${mediaType}Data-${dataKeyRefId}.${mediaKeyRef}`;
      newFormInputElement.name = `${mediaType}s.${mediaType}Data-${dataKeyRefId}.${mediaKeyRef}`;
      newFormInputElement.type = `text`;
      newFormInputElement.className = `${classNameForStyle}-text-input`;

      newFormInputElement.onblur = (event) => {
        formikConf.handleBlur(event);
      };

      newFormInputElement.onkeyup = (event) => {
        const eventTyped = (event as unknown) as React.ChangeEvent<HTMLInputElement>;
        formikConf.handleChange(eventTyped);
        formikConf.handleBlur(event);
        setFormPreviewData((previousFormPreviewData: any) => {
          return {
            ...previousFormPreviewData,
            [`stored`]: {
              ...previousFormPreviewData[`stored`],
              [`${mediaType}s`]: {
                ...previousFormPreviewData[`stored`][`${mediaType}s`],
                [`${mediaType}Data-${dataKeyRefId}`]: {
                  ...previousFormPreviewData[`stored`][`${mediaType}s`][
                    `${mediaType}Data-${dataKeyRefId}`
                  ],
                  [mediaKeyRef]: eventTyped.target.value,
                },
              },
            },
          };
        });
      };
      if (initialInputValue) {
        newFormInputElement.value = initialInputValue;
      }

      setValidSchema((prevYupSchema: any) => {
        let updatedSchema = createYupSchema({
          schema: prevYupSchema,
          config: {
            id: {
              mediaType: `${mediaType}s`,
              dataRefId: `${mediaType}Data-${dataKeyRefId}`,
              inputKeyRef: `${mediaKeyRef}`,
            },
            validationType: `string`,
            validations: [
              { type: `required`, params: `Please enter ${mediaKeyRef}` },
            ],
          },
        });
        return updatedSchema;
      });

      newFormElement = newFormInputElement;
    } else if (whatType === `textInputWithSubIndex`) {
      newFormElementsContainer.className = `${classNameForStyle}-text-input-container`;
      newFormElementsContainer.id = `${mediaType}-${mediaKeyRef}-${dataKeyRefId}-subId-${generatedSubId}`;
      newFormElementsRemoveButton.className = `${classNameForStyle}-text-input-remove-button`;

      let newFormInputElement = document.createElement("input");
      newFormInputElement.id = `${mediaType}s.${mediaType}Data-${dataKeyRefId}.${mediaKeyRef}-${generatedSubId}`;
      newFormInputElement.name = `${mediaType}s.${mediaType}Data-${dataKeyRefId}.${mediaKeyRef}-${generatedSubId}`;
      newFormInputElement.type = `text`;
      newFormInputElement.className = `${classNameForStyle}-text-input`;

      newFormInputElement.onblur = (event) => {
        formikConf.handleBlur(event);
      };
      newFormInputElement.onkeyup = (event) => {
        let eventTyped = (event as unknown) as React.ChangeEvent<HTMLInputElement>;
        let extractedValue = eventTyped.target.value;
        let allRetrievedSubInputs = (eventTyped.target.parentNode?.parentNode
          ?.childNodes as unknown) as Array<HTMLDivElement>;
        let allRetrievedSubInputsConverted = Array.prototype.slice.call(
          allRetrievedSubInputs
        );

        let retrievedElementIndex = allRetrievedSubInputsConverted.findIndex(
          (element) =>
            element.id ===
            `${mediaType}-${mediaKeyRef}-${dataKeyRefId}-subId-${generatedSubId}`
        );

        let retrievedPreviousFormValuesForSubInputs: Array<string> = [];
        for (let i = 0; i < allRetrievedSubInputsConverted.length; i++) {
          retrievedPreviousFormValuesForSubInputs.push(
            allRetrievedSubInputsConverted[i].childNodes[2][`value`]
          );
        }

        if (retrievedElementIndex && retrievedElementIndex > 0) {
          retrievedPreviousFormValuesForSubInputs.splice(
            retrievedElementIndex,
            1,
            extractedValue
          );
        } else if (retrievedElementIndex === 0) {
          if (allRetrievedSubInputsConverted.length > 1) {
            retrievedPreviousFormValuesForSubInputs.shift();
            retrievedPreviousFormValuesForSubInputs.unshift(extractedValue);
          } else {
            retrievedPreviousFormValuesForSubInputs = [`${extractedValue}`];
          }
        }

        formikConf.setFieldValue(
          `${mediaType}s.${mediaType}Data-${dataKeyRefId}.${mediaKeyRef}s`,
          retrievedPreviousFormValuesForSubInputs
        );

        setFormPreviewData((previousFormPreviewData: any) => {
          return {
            ...previousFormPreviewData,
            [`stored`]: {
              ...previousFormPreviewData[`stored`],
              [`${mediaType}s`]: {
                ...previousFormPreviewData[`stored`][`${mediaType}s`],
                [`${mediaType}Data-${dataKeyRefId}`]: {
                  ...previousFormPreviewData[`stored`][`${mediaType}s`][
                    `${mediaType}Data-${dataKeyRefId}`
                  ],
                  [`${mediaKeyRef}s`]: retrievedPreviousFormValuesForSubInputs,
                },
              },
            },
          };
        });
      };

      if (initialInputValue) {
        newFormInputElement.value = initialInputValue;
      }

      newFormElement = newFormInputElement;
    } else if (whatType === `listInput`) {
      newFormElementsContainer.className = `${classNameForStyle}-list-input-container`;
      newFormElementsContainer.id = `${mediaType}-${mediaKeyRef}-${dataKeyRefId}-subId-${generatedSubId}`;
      newFormElementsRemoveButton.className = `${classNameForStyle}-list-remove-button`;

      let newFormListElement = document.createElement("li");
      newFormListElement.id = `${mediaType}-${mediaKeyRef}-input-id-${dataKeyRefId}-subId-${generatedSubId}`;
      newFormListElement.className = `${classNameForStyle}-list`;

      if (childElements) {
        childElements.forEach((value) => {
          let newFormListInputElement = document.createElement("input");
          newFormListInputElement.type = `radio`;
          newFormListInputElement.className = `${classNameForStyle}-list-input-radio`;
          newFormListInputElement.name = `${mediaType}s.${mediaType}Data-${dataKeyRefId}.${mediaKeyRef}`;
          newFormListInputElement.value = `${value}`;
          newFormListInputElement.onchange = (event) => {
            const eventTyped = (event as unknown) as React.ChangeEvent<HTMLInputElement>;
            formikConf.handleChange(eventTyped);
            formikConf.handleBlur(event);
            setFormPreviewData((previousFormPreviewData: any) => {
              return {
                ...previousFormPreviewData,
                [`stored`]: {
                  ...previousFormPreviewData[`stored`],

                  [`${mediaType}s`]: {
                    ...previousFormPreviewData[`stored`][`${mediaType}s`],
                    [`${mediaType}Data-${dataKeyRefId}`]: {
                      ...previousFormPreviewData[`stored`][`${mediaType}s`][
                        `${mediaType}Data-${dataKeyRefId}`
                      ],
                      [mediaKeyRef]: eventTyped.target.value,
                    },
                  },
                },
              };
            });
          };

          if (initialInputValue && value === initialInputValue) {
            newFormListInputElement.checked = true;
          }

          let newFormListInputElementLabel = document.createElement("div");
          newFormListInputElementLabel.className = `${classNameForStyle}-list-input-label`;
          newFormListInputElementLabel.innerHTML = `${value}`;

          let newFormListInputElementContainer = document.createElement("div");
          newFormListInputElementContainer.className = `${classNameForStyle}-list-input-container`;
          newFormListInputElementContainer.appendChild(newFormListInputElement);
          newFormListInputElementContainer.appendChild(
            newFormListInputElementLabel
          );

          newFormListElement.appendChild(newFormListInputElementContainer);
        });
      }

      setValidSchema((prevYupSchema: any) => {
        let updatedSchema = createYupSchema({
          schema: prevYupSchema,
          config: {
            id: {
              mediaType: `${mediaType}s`,
              dataRefId: `${mediaType}Data-${dataKeyRefId}`,
              inputKeyRef: `${mediaKeyRef}`,
            },
            validationType: `string`,
            validations: [
              { type: `required`, params: `Please enter ${mediaKeyRef}` },
            ],
          },
        });
        return updatedSchema;
      });

      newFormElement = newFormListElement;
    } else if (whatType === `fileInput`) {
      console.log(`file input created`);
      newFormElementsContainer.className = `${classNameForStyle}-file-input-container`;
      newFormElementsContainer.id = `${mediaType}-${mediaKeyRef}-${dataKeyRefId}`;
      newFormElementsRemoveButton.className = `${classNameForStyle}-file-input-remove-button`;

      let newFormFileInputElement = document.createElement("input");
      newFormFileInputElement.type = "file";
      newFormFileInputElement.name = `${mediaType}s.${mediaType}Data-${dataKeyRefId}.${mediaKeyRef}`;
      newFormFileInputElement.className = `${classNameForStyle}-file-input`;

      newFormFileInputElement.onchange = (event) => {
        console.log({ event });
        const eventTyped = (event as unknown) as React.ChangeEvent<HTMLInputElement>;
        let fileToURL = eventTyped[`target`][`files`]
          ? URL.createObjectURL(eventTyped[`target`][`files`][0])
          : undefined;
        formikConf.setFieldValue(
          `${mediaType}s.${mediaType}Data-${dataKeyRefId}.${mediaKeyRef}`,
          fileToURL
        );
        formikConf.handleBlur(event);
        setFormPreviewData((previousFormPreviewData: any) => {
          return {
            ...previousFormPreviewData,
            [`stored`]: {
              ...previousFormPreviewData[`stored`],

              [`${mediaType}s`]: {
                ...previousFormPreviewData[`stored`][`${mediaType}s`],
                [`${mediaType}Data-${dataKeyRefId}`]: {
                  ...previousFormPreviewData[`stored`][`${mediaType}s`][
                    `${mediaType}Data-${dataKeyRefId}`
                  ],
                  [mediaKeyRef]: fileToURL,
                },
              },
            },
          };
        });
      };

      if (initialInputValue) {
        newFormFileInputElement.defaultValue = initialInputValue;
      }

      setValidSchema((prevYupSchema: any) => {
        let updatedSchema = createYupSchema({
          schema: prevYupSchema,
          config: {
            id: {
              mediaType: `${mediaType}s`,
              dataRefId: `${mediaType}Data-${dataKeyRefId}`,
              inputKeyRef: `${mediaKeyRef}`,
            },
            validationType: `string`,
            validations: [
              { type: `required`, params: `Please enter ${mediaKeyRef}` },
            ],
          },
        });
        return updatedSchema;
      });

      newFormElement = newFormFileInputElement;
    } else if (whatType === `inputsContainer`) {
      newFormElementsContainer.className = `${classNameForStyle}-outter-inputs-container`;
      newFormElementsContainer.id = `${mediaType}Data-${dataKeyRefId}`;

      newFormElementsRemoveButton.className = `${classNameForStyle}-inputs-remove-button`;

      let newFormInputsContainerElement = document.createElement("div");
      newFormInputsContainerElement.id = `${mediaType}-${mediaKeyRef}-inputs-container-id-${dataKeyRefId}`;

      newFormInputsContainerElement.className = `${classNameForStyle}-inner-inputs-container`;

      if (childElements) {
        for (let i = 0; i < childElements.length; i++) {
          newFormInputsContainerElement.appendChild(childElements[i]);
        }
      }

      newFormElement = newFormInputsContainerElement;
    } else {
      newFormElementsContainer.className = `${classNameForStyle}-unknown-element-container`;

      let newFormUnknownElement = document.createElement("div");
      newFormUnknownElement.id = `${mediaType}:${mediaKeyRef}:unknown-element:id:${dataKeyRefId}`;

      newFormUnknownElement.className = `${classNameForStyle}-unknown-element`;

      newFormElement = newFormUnknownElement;
    }

    if (whatType === `textInputWithSubIndex`) {
      newFormElementsRemoveButton.innerHTML = `-`;
      newFormElementsRemoveButton.onclick = (event) => {
        let eventTyped = (event as unknown) as React.ChangeEvent<HTMLInputElement>;

        let allRetrievedSubInputs = (eventTyped.target.parentNode?.parentNode
          ?.childNodes as unknown) as Array<HTMLDivElement>;

        let allRetrievedSubInputsConverted = Array.prototype.slice.call(
          allRetrievedSubInputs
        );

        let retrievedElementIndex = allRetrievedSubInputsConverted.findIndex(
          (element) =>
            element.id ===
            `${mediaType}-${mediaKeyRef}-${dataKeyRefId}-subId-${generatedSubId}`
        );

        let updatedSubInputsValues: Array<string> = [];

        allRetrievedSubInputs.forEach((referenceElement) => {
          let typedSubInputElement = (referenceElement
            .childNodes[2] as unknown) as HTMLInputElement;
          updatedSubInputsValues.push(typedSubInputElement.value);
        });

        if (updatedSubInputsValues.length >= 1) {
          if (
            retrievedElementIndex > 0 &&
            retrievedElementIndex < updatedSubInputsValues.length - 1
          ) {
            updatedSubInputsValues.splice(retrievedElementIndex, 1);
          } else if (
            retrievedElementIndex === updatedSubInputsValues.length - 1 &&
            retrievedElementIndex !== 0
          ) {
            updatedSubInputsValues.pop();
          } else if (retrievedElementIndex === 0) {
            updatedSubInputsValues.shift();
          }
        }

        formikConf.setFieldValue(
          `${mediaType}s.${mediaType}Data-${dataKeyRefId}.${mediaKeyRef}s`,
          updatedSubInputsValues
        );

        console.log({
          subIndexCheckForRemoving: allRetrievedSubInputs.length - 1,
        });

        setValidSchema((prevYupSchema: any) => {
          let updatedSchema = createYupSchema({
            schema: prevYupSchema,
            config: {
              id: {
                mediaType: `${mediaType}s`,
                dataRefId: `${mediaType}Data-${dataKeyRefId}`,
                inputKeyRef: `${mediaKeyRef}s`,
              },
              validationType: `array`,
              validations: [
                {
                  type: `of`,
                  params: yup.string().required(),
                },
                {
                  type: `length`,
                  params: allRetrievedSubInputs.length - 1,
                },
              ],
            },
          });
          return updatedSchema;
        });

        console.log({ allRetrievedSubInputs, updatedSubInputsValues });

        eventTyped.target.parentNode?.parentNode?.removeChild(
          eventTyped.target.parentNode
        );
      };
    } else {
      newFormElementsRemoveButton.innerHTML = `-`;
      newFormElementsRemoveButton.onclick = (event: any) => {
        let eventTyped = (event as unknown) as React.ChangeEvent<HTMLInputElement>;
        const convertedChildNodesToArray = Array.from(
          storedRefs[`${mediaType}sInputViewRef`][`current`][`childNodes`]
        );
        let prevInputsIndex = convertedChildNodesToArray[`findIndex`](
          (element: any) => element[`id`] === event[`path`][1][`id`]
        );
        prevInputsIndex = prevInputsIndex - 1 < 0 ? 1 : prevInputsIndex - 1;
        if (convertedChildNodesToArray[`length`] <= 1) {
          storedRefs[`${mediaType}sInputViewRef`][`current`][`removeChild`](
            storedRefs[`${mediaType}sInputViewRef`][`current`][`firstChild`]
          );
        } else {
          handleCurrentMediaInputsSelectedStyle(
            storedRefs[`${mediaType}sInputViewRef`].current.childNodes,
            `${
              storedRefs[`${mediaType}sInputViewRef`].current.childNodes[
                prevInputsIndex
              ].id
            }`,
            `${mediaType}s`
          );
        }

        formikConf.setFieldValue(
          `${mediaType}s.${mediaType}Data-${dataKeyRefId}`,
          undefined
        );

        setValidSchema((prevSchema: any) => {
          let updatedSchema = { ...prevSchema };
          let updatedSchemaFields = updatedSchema[`fields`];
          delete updatedSchemaFields[`${mediaType}s`][`fields`][
            `${mediaType}Data-${dataKeyRefId}`
          ];
          let updatedSchemaFinalized = yup[`object`]()[`shape`]({
            ...updatedSchemaFields,
          });
          return updatedSchemaFinalized;
        });

        eventTyped.target.parentNode?.parentNode?.removeChild(
          eventTyped.target.parentNode
        );
        setFormPreviewData((previousFormPreviewData) => {
          if (inputsDeletionCallBack) {
            let dataReset = inputsDeletionCallBack();
            return {
              ...previousFormPreviewData,
              [`stored`]: {
                ...previousFormPreviewData[`stored`],
                [`${mediaType}s`]: previousFormPreviewData[`stored`][
                  `${mediaType}s`
                ]
                  ? {
                      ...previousFormPreviewData[`stored`][`${mediaType}s`],
                      [`${mediaType}Data-${dataKeyRefId}`]: {
                        ...previousFormPreviewData[`stored`][`${mediaType}s`][
                          `${mediaType}Data-${dataKeyRefId}`
                        ],
                        [`${mediaKeyRef}`]: dataReset,
                      },
                    }
                  : {},
              },
            };
          } else {
            return previousFormPreviewData;
          }
        });
        setMediaDataIds((previousMediaDataIds) => {
          let idsConfig = {
            ...previousMediaDataIds,
            [`current`]: {
              ...previousMediaDataIds[`current`],
              [mediaType]: ``,
            },
          };
          return idsConfig;
        });
      };
    }

    if (whatType === `textInputWithSubIndex`) {
      newFormElementsContainer.append(newFormElementsRemoveButton);
      newFormElementsContainer.appendChild(newFormElementLabel);
      newFormElementsContainer.appendChild(newFormElement);
    } else {
      newFormElementsContainer.appendChild(newFormElementLabel);
      newFormElementsContainer.append(newFormElementsRemoveButton);
      newFormElementsContainer.appendChild(newFormElement);
    }
    return newFormElementsContainer;
  };

  // Handle addition of new form inputs
  const addNewInputs = (
    whichMediaType: string,
    inputElementsKeyRefs: Array<{
      key: string;
      typeOfInput: string;
      childrenElements?: Array<any>;
      initialValue?: any;
    }>,
    inputsDeletionCallback: Function,
    elementToAppendTo?: HTMLElement,
    inputId?: string
  ) => {
    let newFormInputs;

    let newFormInputElementsHold = [];

    let newFormInputElementsForSubInputsHold: Record<string, Array<any>> = {};

    inputElementsKeyRefs.forEach((keyRef) => {
      if (keyRef.typeOfInput === `textInputWithSubIndex`) {
        newFormInputElementsForSubInputsHold = {
          ...newFormInputElementsForSubInputsHold,
          [`${keyRef.key}`]: [],
        };
      }
    });

    let newSubInputsId = v4();

    let dataConfigObject: object = {};

    for (let i = 0; i < inputElementsKeyRefs.length; i++) {
      /*
      let mediaKeyRefFirstLetterCapitalized =
        inputElementsKeyRefs[i].key[0].toUpperCase() +
        inputElementsKeyRefs[i].key.slice(1);
        */

      if (inputElementsKeyRefs[i].typeOfInput === `textInputWithSubIndex`) {
        newFormInputElementsForSubInputsHold[
          `${inputElementsKeyRefs[i].key}`
        ].push(
          newFormElement(
            `${inputElementsKeyRefs[i].typeOfInput}`,
            `${whichMediaType}`,
            `${inputElementsKeyRefs[i].key}`,
            inputId ? inputId : newSubInputsId,
            `${whichMediaType}-${inputElementsKeyRefs[i].key}`,
            undefined,
            undefined,
            inputElementsKeyRefs[i][`initialValue`]
              ? inputElementsKeyRefs[i][`initialValue`]
              : undefined
          )
        );
      } else if (inputElementsKeyRefs[i].typeOfInput === `textInput`) {
        newFormInputElementsHold.push(
          newFormElement(
            `${inputElementsKeyRefs[i].typeOfInput}`,
            `${whichMediaType}`,
            `${inputElementsKeyRefs[i].key}`,
            inputId ? inputId : newSubInputsId,
            `${whichMediaType}-${inputElementsKeyRefs[i].key}`,
            undefined,
            undefined,
            inputElementsKeyRefs[i][`initialValue`]
              ? inputElementsKeyRefs[i][`initialValue`]
              : undefined
          )
        );
        dataConfigObject = {
          ...dataConfigObject,
          [`${inputElementsKeyRefs[i].key}`]: undefined,
        };
      } else if (inputElementsKeyRefs[i].typeOfInput === `fileInput`) {
        newFormInputElementsHold.push(
          newFormElement(
            `${inputElementsKeyRefs[i].typeOfInput}`,
            `${whichMediaType}`,
            `${inputElementsKeyRefs[i].key}`,
            inputId ? inputId : newSubInputsId,
            `${whichMediaType}-${inputElementsKeyRefs[i].key}`,
            undefined,
            undefined,
            inputElementsKeyRefs[i][`initialValue`]
              ? inputElementsKeyRefs[i][`initialValue`]
              : undefined
          )
        );
        dataConfigObject = {
          ...dataConfigObject,
          [`${inputElementsKeyRefs[i].key}`]: undefined,
        };
      } else if (inputElementsKeyRefs[i].typeOfInput === `listInput`) {
        newFormInputElementsHold.push(
          newFormElement(
            `${inputElementsKeyRefs[i].typeOfInput}`,
            `${whichMediaType}`,
            `${inputElementsKeyRefs[i].key}`,
            inputId ? inputId : newSubInputsId,
            `${whichMediaType}-${inputElementsKeyRefs[i].key}`,
            inputElementsKeyRefs[i].childrenElements,
            undefined,
            inputElementsKeyRefs[i][`initialValue`]
              ? inputElementsKeyRefs[i][`initialValue`]
              : undefined
          )
        );
        dataConfigObject = {
          ...dataConfigObject,
          [`${inputElementsKeyRefs[i].key}`]: undefined,
        };
      } else {
        setValidSchema((prevYupSchema: any) => {
          let updatedSchema = createYupSchema({
            schema: prevYupSchema,
            config: {
              id: {
                mediaType: `${whichMediaType}s`,
                dataRefId: `${whichMediaType}Data-${
                  inputId ? inputId : newSubInputsId
                }`,
                inputKeyRef: `${inputElementsKeyRefs[i].key}`,
              },
              validationType: `string`,
              validations: [
                {
                  type: `required`,
                  params: `Please enter ${inputElementsKeyRefs[i].key}`,
                },
              ],
            },
          });
          return updatedSchema;
        });
        dataConfigObject = {
          ...dataConfigObject,
          [`${inputElementsKeyRefs[i].key}`]: undefined,
        };
      }
    }

    for (let sI in newFormInputElementsForSubInputsHold) {
      let subInputsLength = newFormInputElementsForSubInputsHold[sI].length;
      console.log({ subInputsLength });
      if (subInputsLength > 0) {
        dataConfigObject = { ...dataConfigObject, [`${sI}s`]: undefined };

        let initialSubInputsFragment = document.createElement("div");
        initialSubInputsFragment.className = `elementAdjustmentsForSubInputs`;

        let addSubInputButton = document.createElement("div");
        addSubInputButton.className = `${whichMediaType}-add-${sI}-button`;
        addSubInputButton.innerHTML = `+`;
        addSubInputButton.onclick = (event) => {
          let eventTyped = (event as unknown) as React.ChangeEvent<HTMLInputElement>;

          const retrievingNewSubIndex = () => {
            let clarifiedNewSubIndex =
              eventTyped.target.parentNode?.childNodes[3].childNodes.length;
            return clarifiedNewSubIndex;
          };
          const retrievedNewSubIndex = retrievingNewSubIndex();
          console.log({
            subIndexCheckForAdding: retrievedNewSubIndex
              ? retrievedNewSubIndex + 1
              : -1,
          });

          let addedSubInputElement = newFormElement(
            `textInputWithSubIndex`,
            `${whichMediaType}`,
            `${sI}`,
            inputId ? inputId : newSubInputsId,
            `${whichMediaType}-${sI}`
          );

          setValidSchema((prevYupSchema: any) => {
            let updatedSchema = createYupSchema({
              schema: prevYupSchema,
              config: {
                id: {
                  mediaType: `${whichMediaType}s`,
                  dataRefId: `${whichMediaType}Data-${
                    inputId ? inputId : newSubInputsId
                  }`,
                  inputKeyRef: `${sI}s`,
                },
                validationType: `array`,
                validations: [
                  {
                    type: `of`,
                    params: yup.string().required(),
                  },
                  {
                    type: `length`,
                    params: retrievedNewSubIndex ? retrievedNewSubIndex + 1 : 1,
                  },
                ],
              },
            });
            console.log(`checking if logic is firing for adding subInputs`, {
              retrievedNewSubIndex,
              updatedSchema,
            });
            return updatedSchema;
          });

          eventTyped.target.parentNode?.childNodes[3].appendChild(
            addedSubInputElement
          );

          addedSubInputElement.scrollIntoView(false);
        };

        let initialSubInputs = newFormElement(
          `inputsContainer`,
          `${whichMediaType}`,
          `${sI}s`,
          inputId ? inputId : newSubInputsId,
          `${whichMediaType}-${sI}s`,
          newFormInputElementsForSubInputsHold[sI]
        );

        initialSubInputs.firstChild?.after(addSubInputButton);

        newFormInputElementsHold.push(initialSubInputs);

        setValidSchema((prevYupSchema: any) => {
          let updatedSchema = createYupSchema({
            schema: prevYupSchema,
            config: {
              id: {
                mediaType: `${whichMediaType}s`,
                dataRefId: `${whichMediaType}Data-${
                  inputId ? inputId : newSubInputsId
                }`,
                inputKeyRef: `${sI}s`,
              },
              validationType: `array`,
              validations: [
                {
                  type: `of`,
                  params: yup.string().required(),
                },
                {
                  type: `length`,
                  params: subInputsLength,
                },
              ],
            },
          });
          return updatedSchema;
        });
      }
    }

    console.log({ inputsDeletionCallBackp1: inputsDeletionCallback() });

    newFormInputs = newFormElement(
      `inputsContainer`,
      `${whichMediaType}`,
      `data`,
      inputId ? inputId : newSubInputsId,
      `${whichMediaType}`,
      newFormInputElementsHold,
      dataConfigObject,
      undefined,
      inputsDeletionCallback
    );

    if (elementToAppendTo) {
      elementToAppendTo.appendChild(newFormInputs);
      newFormInputs.scrollIntoView(false);
    }
    return {
      id: `${whichMediaType}Data-${inputId ? inputId : newSubInputsId}`,
      inputs: newFormInputs,
    };
  };

  // Hanlde creation and updates to form yup validation schema
  const createYupSchema = (opts?: {
    schema: any;
    config: {
      id: { mediaType: string; dataRefId: string; inputKeyRef: string };
      validationType: any;
      validations: Array<{ type: string; params: any }>;
    };
  }) => {
    const yupv2 = yup as any;

    if (opts) {
      let updatedSchema = { ...opts[`schema`] };
      let updatedSchemaFields = updatedSchema[`fields`];
      const { id, validationType, validations } = opts[`config`];
      if (!yupv2[validationType]) {
        return updatedSchema;
      }
      let validator = yupv2[validationType]();
      validations.forEach((validation) => {
        const { type, params } = validation;
        if (!validator[type]) {
          return;
        }
        validator = validator[type](params);
      });

      updatedSchemaFields[id[`mediaType`]] = yup.object().shape(
        updatedSchemaFields[id[`mediaType`]] &&
          updatedSchemaFields[id[`mediaType`]][`fields`]
          ? {
              ...updatedSchemaFields[id[`mediaType`]][`fields`],
              [id[`dataRefId`]]:
                id[`inputKeyRef`] === ``
                  ? validator
                  : yup.object().shape(
                      updatedSchemaFields[id[`mediaType`]][`fields`][
                        id[`dataRefId`]
                      ] &&
                        updatedSchemaFields[id[`mediaType`]][`fields`][
                          id[`dataRefId`]
                        ][`fields`]
                        ? {
                            ...updatedSchemaFields[id[`mediaType`]][`fields`][
                              id[`dataRefId`]
                            ][`fields`],
                            [id[`inputKeyRef`]]: validator,
                          }
                        : {
                            [id[`inputKeyRef`]]: validator,
                          }
                    ),
            }
          : {
              [id[`dataRefId`]]: yup.object().shape({
                [id[`inputKeyRef`]]: validator,
              }),
            }
      );

      let updatedSchemaFinalized = yup[`object`]()[`shape`]({
        ...updatedSchemaFields,
      });
      return updatedSchemaFinalized;
    }
  };

  // Configurations for form
  let formikConf = useFormik({
    initialValues: initialFormValues,
    validationSchema: validSchema,
    onSubmit: (props) => {
      handleFormSubmission({ ...props });
    },
  });

  // Handle incoming data for form
  React.useEffect(() => {
    if (dataForForm[`forId`] !== `` && dataForForm[`forId`] !== undefined) {
      if (dataForForm[`forId`][`includes`](`forStorage`)) {
        console.log(`includes for storage`);
        let dataId = dataForForm[`forId`];
        let idExtracted = dataId.slice(11);
        let extractedKey = dataId[`includes`](`Data`)
          ? dataId.substring(11, dataId.lastIndexOf(`Data`))
          : undefined;
        console.log({ idExtracted, extractedKey, dataForForm });
        formikConf.setFieldValue(
          extractedKey
            ? `${extractedKey}s.${idExtracted}.${dataForForm[`forInput`]}`
            : `${idExtracted}.${dataForForm[`forInput`]}`,
          dataForForm[`inputValue`]
        );
        setFormPreviewData((previousFormPreviewData) => {
          console.log({
            previousFormPreviewDataCheckText: previousFormPreviewData,
          });
          return {
            ...previousFormPreviewData,
            stored: extractedKey
              ? {
                  ...previousFormPreviewData[`stored`],
                  [`${extractedKey}s`]: {
                    ...previousFormPreviewData[`stored`][`${extractedKey}s`],
                    [`${idExtracted}`]: {
                      ...previousFormPreviewData[`stored`][`${extractedKey}s`][
                        `${idExtracted}`
                      ],
                      [`${dataForForm[`forInput`]}`]: dataForForm[`inputValue`],
                    },
                  },
                }
              : {
                  ...previousFormPreviewData[`stored`],
                  [`${idExtracted}`]: {
                    ...previousFormPreviewData[`stored`][`${idExtracted}`],
                    [dataForForm[`forInput`]]: dataForForm[`inputValue`],
                  },
                },
            current:
              previousFormPreviewData[`current`][`data`] &&
              previousFormPreviewData[`current`][`data`] !== `` &&
              previousFormPreviewData[`current`][`data`] !== {}
                ? {
                    ...previousFormPreviewData[`current`],
                    [`data`]: extractedKey
                      ? {
                          ...previousFormPreviewData[`current`][`data`],
                          [`${extractedKey}s`]: {
                            ...previousFormPreviewData[`current`][`data`][
                              `${extractedKey}s`
                            ],
                            [`${idExtracted}`]: {
                              ...previousFormPreviewData[`current`][`data`][
                                `${extractedKey}s`
                              ][`${idExtracted}`],
                              [dataForForm[`forInput`]]:
                                dataForForm[`inputValue`],
                            },
                          },
                        }
                      : {
                          ...previousFormPreviewData[`current`][`data`],
                          [`${idExtracted}`]: {
                            ...previousFormPreviewData[`current`][`data`][
                              `${idExtracted}`
                            ],
                            [dataForForm[`forInput`]]:
                              dataForForm[`inputValue`],
                          },
                        },
                  }
                : { ...previousFormPreviewData[`current`] },
          };
        });
      } else if (dataForForm[`forId`][`includes`](`DataAnnihilation`)) {
        console.log(`Data annihilation initiated`);
        initialInputs.forEach((values) => {
          formikConf.setFieldValue(`test.${values.name}`, ``);
        });
        mediaMiniFormInputs.forEach((values) => {
          formikConf.setFieldValue(`${values.mediaType}s`, {});
          while (
            storedRefs[`${values.mediaType}sInputViewRef`][`current`][
              `firstChild`
            ]
          ) {
            storedRefs[`${values.mediaType}sInputViewRef`][`current`][
              `removeChild`
            ](
              storedRefs[`${values.mediaType}sInputViewRef`][`current`][
                `firstChild`
              ]
            );
          }
        });
        if (
          storedRefs[`selectionSectionCharacterRef`][`current`][`childNodes`]
        ) {
          while (
            storedRefs[`selectionSectionCharacterRef`][`current`][`firstChild`]
          ) {
            storedRefs[`selectionSectionCharacterRef`][`current`][
              `removeChild`
            ](
              storedRefs[`selectionSectionCharacterRef`][`current`][
                `firstChild`
              ]
            );
          }
        }
        if (
          storedRefs[`selectionSectionCharacterClassRef`][`current`][
            `childNodes`
          ]
        ) {
          while (
            storedRefs[`selectionSectionCharacterClassRef`][`current`][
              `firstChild`
            ]
          ) {
            storedRefs[`selectionSectionCharacterClassRef`][`current`][
              `removeChild`
            ](
              storedRefs[`selectionSectionCharacterClassRef`][`current`][
                `firstChild`
              ]
            );
          }
        }
        setValidSchema((prevValidSchema: any) => {
          console.log({ prevValidSchemaForDataAnnihilation: prevValidSchema });
          const schemaReset = yup.object().shape({
            test: yup.object().shape({}),
          });
          return schemaReset;
        });
        setInitialFormValues((prevInitialFormValues: any) => {
          return {
            test: {},
            videos: {},
            photos: {},
            excerpts: {},
          };
        });
      } else if (dataForForm[`forId`][`includes`](`fetchedCharacterData`)) {
        console.log(`fetched project data for form process initiated`, {
          dataForForm,
        });

        initialInputs.forEach((values, index) => {
          if (dataForForm[`inputValue`][`test`][`${values.name}`]) {
            console.log({
              initialInputValuesCheck:
                dataForForm[`inputValue`][`test`][`${values.name}`],
            });
            const initialInputElement = document.createElement("input");
            initialInputElement.className = `initialInput-${values.name}`;
            initialInputElement.name = `test.${values.name}`;
            initialInputElement.value = `${
              dataForForm[`inputValue`][`test`][`${values.name}`]
            }`;
            initialInputElement.onkeyup = (event) => {
              const eventTyped = (event as unknown) as React.ChangeEvent<HTMLInputElement>;
              formikConf.handleChange(event);
              formikConf.handleBlur(event);
              setFormPreviewData((prevFormPreviewData) => {
                return {
                  ...prevFormPreviewData,
                  [`stored`]: {
                    ...prevFormPreviewData[`stored`],
                    [`test`]: {
                      ...prevFormPreviewData[`stored`][`test`],
                      [values[`name`]]: `${eventTyped.target.value}`,
                    },
                  },
                };
              });
            };
            if (index === 0) {
              storedRefs[`selectionSectionCharacterClassRef`][`current`][
                `appendChild`
              ](initialInputElement);
            } else {
              storedRefs[`selectionSectionCharacterRef`][`current`][
                `appendChild`
              ](initialInputElement);
            }

            formikConf.setFieldValue(
              `test.${values.name}`,
              dataForForm[`inputValue`][`test`][`${values.name}`]
            );
            setValidSchema((prevValidSchema: any) => {
              const updatedSchema = createYupSchema({
                schema: prevValidSchema,
                config: {
                  id: {
                    mediaType: `test`,
                    dataRefId: `${values.name}`,
                    inputKeyRef: ``,
                  },
                  validationType: `string`,
                  validations: [
                    {
                      type: `required`,
                      params: `Please enter ${values.placeholder}`,
                    },
                  ],
                },
              });
              return updatedSchema;
            });
          }
        });

        mediaMiniFormInputs.forEach((values) => {
          if (dataForForm[`inputValue`][`${values.mediaType}s`]) {
            for (let k in dataForForm[`inputValue`][`${values.mediaType}s`]) {
              let dataExtracted =
                dataForForm[`inputValue`][`${values.mediaType}s`][k];
              let configgedInputOpts = values.inputsOpts.map((opts) => {
                let retrievedIndexedData =
                  dataExtracted[
                    opts.typeOfInput === `textInputWithSubIndex`
                      ? `${opts.key}s`
                      : opts.key
                  ];
                console.log({ opts, dataExtracted, id: dataExtracted[`id`] });
                const returnData = {
                  ...opts,
                  initialValue:
                    typeof retrievedIndexedData === `object`
                      ? retrievedIndexedData[0]
                      : retrievedIndexedData,
                };
                return returnData;
              });

              const { id } = addNewInputs(
                `${values.mediaType}`,
                configgedInputOpts,
                values.inputsDeletionCallback,
                storedRefs[`${values.mediaType}sInputViewRef`].current,
                dataExtracted[`id`]
              );
              let configgedFormValues = {};
              for (let d in dataExtracted) {
                if (d !== `id`) {
                  configgedFormValues = {
                    ...configgedFormValues,
                    [`${d}`]: dataExtracted[`${d}`],
                  };
                }
              }
              formikConf.setFieldValue(
                `${values.mediaType}s.${id}`,
                configgedFormValues
              );
              console.log({ configgedInputOpts, id });
            }
          }
        });
        console.log({
          validSchema,
          dataForForm,
        });

        switchMediaMiniForm(
          `${mediaMiniFormInputs[0][`mediaType`]}`,
          storedRefs,
          setMediaTypeText
        );
        if (
          storedRefs[`${mediaMiniFormInputs[0][`mediaType`]}sInputViewRef`]
            .current.childNodes[0]
        ) {
          handleCurrentMediaInputsSelectedStyle(
            storedRefs[`${mediaMiniFormInputs[0][`mediaType`]}sInputViewRef`]
              .current.childNodes,
            `${
              storedRefs[`${mediaMiniFormInputs[0][`mediaType`]}sInputViewRef`]
                .current.childNodes[0].id
            }`,
            `${mediaMiniFormInputs[0][`mediaType`]}s`
          );
        }
      }
    }
  }, [dataForForm]);

  // Handle extended processes for switching form data
  React.useEffect(() => {
    if (switchFormDataConfig[`forId`] === `freshForm`) {
      console.log(`switchformdataconfig effect fired..!!`);
      initialInputs.forEach((values, index) => {
        const initialInputElement = document.createElement("input");
        initialInputElement.className = `initialInput-${values.name}`;
        initialInputElement.name = `test.${values.name}`;
        initialInputElement.value =
          index === 0
            ? switchFormDataConfig[`inputValue`] === `addC1`
              ? ``
              : `${
                  mediaDataIds[`current`][
                    Object.keys(mediaDataIds[`current`])[0]
                  ][`name`]
                }`
            : ``;

        initialInputElement.onkeyup = (event) => {
          const eventTyped = (event as unknown) as React.ChangeEvent<HTMLInputElement>;
          formikConf.handleChange(event);
          formikConf.handleBlur(event);
          setFormPreviewData((prevFormPreviewData) => {
            return {
              ...prevFormPreviewData,
              [`stored`]: {
                ...prevFormPreviewData[`stored`],
                [`test`]: {
                  ...prevFormPreviewData[`stored`][`test`],
                  [values[`name`]]: `${eventTyped.target.value}`,
                },
              },
            };
          });
        };

        if (index === 0) {
          if (switchFormDataConfig[`inputValue`] === `addC2`) {
            console.log({
              checkSwitchFormDataEffect:
                mediaDataIds[`current`][
                  Object.keys(mediaDataIds[`current`])[index]
                ],
            });
            formikConf.setFieldValue(
              `test.${values.name}`,
              `${
                mediaDataIds[`current`][
                  Object.keys(mediaDataIds[`current`])[index]
                ][`name`]
              }`
            );
          }
          storedRefs[`selectionSectionCharacterClassRef`][`current`][
            `appendChild`
          ](initialInputElement);
        } else {
          if (switchFormDataConfig[`inputValue`] === `addC2`) {
            setInitialFormValues((prevInitialFormValues: any) => {
              return {
                test: {
                  characterClass: `${
                    mediaDataIds[`current`][
                      Object.keys(mediaDataIds[`current`])[0]
                    ][`name`]
                  }`,
                },
              };
            });
          }
          storedRefs[`selectionSectionCharacterRef`][`current`][`appendChild`](
            initialInputElement
          );
        }

        setValidSchema((prevValidSchema: any) => {
          const updatedSchema = createYupSchema({
            schema: prevValidSchema,
            config: {
              id: {
                mediaType: `test`,
                dataRefId: `${values[`name`]}`,
                inputKeyRef: ``,
              },
              validationType: `string`,
              validations: [
                {
                  type: `required`,
                  params: `Please enter ${values[`placeholder`]}`,
                },
              ],
            },
          });
          console.log({ updatedSchemaForNewSelection: updatedSchema });
          return updatedSchema;
        });
      });
      setFormPreviewData((prevFormPreviewData: any) => {
        let mediaDataReset = { [`test`]: {} };
        initialInputs[`forEach`]((opts) => {
          mediaDataReset = {
            ...mediaDataReset,
            [`test`]: { ...mediaDataReset[`test`], [`${opts[`name`]}`]: `` },
          };
        });
        mediaMiniFormInputs[`forEach`]((opts) => {
          mediaDataReset = { ...mediaDataReset, [`${opts[`mediaType`]}s`]: {} };
        });
        return {
          ...prevFormPreviewData,
          [`stored`]:
            switchFormDataConfig[`inputValue`] === `addC1`
              ? { ...mediaDataReset }
              : {
                  ...mediaDataReset,
                  [`test`]: {
                    ...mediaDataReset[`test`],
                    [Object.keys(mediaDataReset[`test`])[0]]:
                      mediaDataIds[`current`][
                        Object.keys(mediaDataIds[`current`])[0]
                      ][`name`],
                  },
                },
          [`current`]: {
            ...prevFormPreviewData[`current`],
            [`type`]:
              switchFormDataConfig[`inputValue`] === `addC1` ? `C1` : `C2`,
          },
        };
      });
    }
    setMediaDataIds((prevMediaDataIds: any) => {
      if (switchFormDataConfig[`inputValue`] === `addC1`) {
        return {
          ...prevMediaDataIds,
          [`charactersIds`]: [],
          [`current`]: {
            ...prevMediaDataIds[`current`],
            class: ``,
            character: {
              name: ``,
              id: ``,
            },
          },
        };
      }
      if (switchFormDataConfig[`inputValue`] === `addC2`) {
        return {
          ...prevMediaDataIds,
          [`current`]: {
            ...prevMediaDataIds[`current`],
            character: {
              name: ``,
              id: ``,
            },
          },
        };
      } else {
        return { ...prevMediaDataIds };
      }
    });
  }, [switchFormDataConfig]);

  // Handle component return view
  switch (layoutType) {
    case `v2`:
      return (
        <div className={styles.formEmbedder}>
          <form onSubmit={formikConf.handleSubmit}>
            <div
              ref={storedRefs[`innerFormDisplayRef`]}
              className={styles.innerFormMainDisplay}
              style={styles.innerFormDisplaySupport}
            >
              <div className={styles.selectionSection}>
                <div
                  className={styles.selectionSectionNavigationBar}
                  onMouseEnter={(event) => {
                    const isValuesDifferent = checkIfValuesAreDifferent(
                      formikConf,
                      initialFormValues,
                      initialInputs,
                      mediaMiniFormInputs
                    );
                    disableC1C2NavButtons(isValuesDifferent);
                  }}
                >
                  <div
                    ref={storedRefs[`nextSelectionButtonC1Ref`]}
                    className={styles.nextSelectionButton}
                    onClick={(event) => {
                      const isValuesDifferent = checkIfValuesAreDifferent(
                        formikConf,
                        initialFormValues,
                        initialInputs,
                        mediaMiniFormInputs
                      );
                      if (!isValuesDifferent) {
                        const classesIds = mediaDataIds.classesIds;
                        const currentClassIndex = mediaDataIds.classesIds.findIndex(
                          (ids) => ids.id === mediaDataIds.current.class?.id
                        );
                        const nextClassIndex = currentClassIndex + 1;
                        const clarifiedClassIndex =
                          nextClassIndex < classesIds.length &&
                          nextClassIndex > -1
                            ? nextClassIndex
                            : 0;
                        setMediaDataIds((prevMediaDataIds) => {
                          return {
                            ...prevMediaDataIds,
                            [`current`]: {
                              ...prevMediaDataIds[`current`],
                              class: classesIds[clarifiedClassIndex],
                            },
                          };
                        });
                        setDataForForm((prevDataForForm: any) => {
                          return {
                            ...prevDataForForm,
                            forId: `DataAnnihilation`,
                          };
                        });
                        setDataFetchOpts(
                          (prevDataFetchOpts: {
                            dataIndex: number;
                            dataSetId: string;
                            previewDisplay: string;
                          }) => {
                            return {
                              ...prevDataFetchOpts,
                              dataIndex: 0,
                              dataSetId: classesIds[clarifiedClassIndex][`id`],
                              previewDisplay: `C1`,
                            };
                          }
                        );

                        console.log({ classesIds, currentClassIndex });
                      }
                    }}
                  >
                    <img
                      src={require("../../Media/Icons/expand_less-24px.svg")}
                      alt={`next selection`}
                      className={styles.nextSelectionIcon}
                    />
                  </div>
                  <div
                    ref={storedRefs[`addSelectionButtonC1Ref`]}
                    className={styles.addSelectionButton}
                  >
                    <img
                      src={require("../../Media/Icons/addition-icon-v2.svg")}
                      alt={`add selection`}
                      className={styles.addSelectionIcon}
                      onClick={(event) => {
                        const didValuesChange = checkIfValuesAreDifferent(
                          formikConf,
                          initialFormValues,
                          initialInputs,
                          mediaMiniFormInputs
                        );
                        if (!didValuesChange) {
                          switchFormData(event, `addC1`, `C1`);
                        }
                      }}
                    />
                  </div>
                  <div
                    ref={storedRefs[`prevSelectionButtonC1Ref`]}
                    className={styles.prevSelectionButton}
                    onClick={(event) => {
                      const isValuesDifferent = checkIfValuesAreDifferent(
                        formikConf,
                        initialFormValues,
                        initialInputs,
                        mediaMiniFormInputs
                      );
                      if (!isValuesDifferent) {
                        const classesIds = mediaDataIds.classesIds;
                        const currentClassIndex = mediaDataIds.classesIds.findIndex(
                          (ids) => ids.id === mediaDataIds.current.class?.id
                        );
                        const prevClassIndex = currentClassIndex - 1;
                        const clarifiedClassIndex =
                          prevClassIndex > -1 &&
                          prevClassIndex < classesIds.length
                            ? prevClassIndex
                            : classesIds.length - 1;
                        setMediaDataIds((prevMediaDataIds) => {
                          return {
                            ...prevMediaDataIds,
                            [`current`]: {
                              ...prevMediaDataIds[`current`],
                              class: classesIds[clarifiedClassIndex],
                            },
                          };
                        });
                        setDataForForm((prevDataForForm: any) => {
                          return {
                            ...prevDataForForm,
                            forId: `DataAnnihilation`,
                          };
                        });
                        setDataFetchOpts(
                          (prevDataFetchOpts: {
                            dataIndex: number;
                            dataSetId: string;
                            previewDisplay: string;
                          }) => {
                            return {
                              ...prevDataFetchOpts,
                              dataIndex: 0,
                              dataSetId: classesIds[clarifiedClassIndex][`id`],
                              previewDisplay: `C1`,
                            };
                          }
                        );
                        console.log({ classesIds, currentClassIndex });
                      }
                    }}
                  >
                    <img
                      src={require("../../Media/Icons/expand_more-24px.svg")}
                      alt={`previous selection`}
                      className={styles.prevSelectionIcon}
                    />
                  </div>
                </div>
                <div
                  ref={storedRefs[`selectionSectionCharacterClassRef`]}
                  className={styles.selectionSectionCharacterClass}
                  onClick={(event) => {
                    setFormPreviewData((prevFormPreviewData: any) => {
                      return {
                        ...prevFormPreviewData,
                        [`current`]: {
                          ...prevFormPreviewData[`current`],
                          [`type`]: `C1`,
                        },
                      };
                    });
                  }}
                ></div>
              </div>
              <div className={styles.selectionSection}>
                <div
                  className={styles.selectionSectionNavigationBar}
                  onClick={(event) => {
                    const isValuesDifferent = checkIfValuesAreDifferent(
                      formikConf,
                      initialFormValues,
                      initialInputs,
                      mediaMiniFormInputs
                    );
                    disableC1C2NavButtons(isValuesDifferent);
                  }}
                  onMouseEnter={(event) => {
                    const isValuesDifferent = checkIfValuesAreDifferent(
                      formikConf,
                      initialFormValues,
                      initialInputs,
                      mediaMiniFormInputs
                    );
                    disableC1C2NavButtons(isValuesDifferent);
                  }}
                >
                  <div
                    ref={storedRefs[`nextSelectionButtonC2Ref`]}
                    className={styles.nextSelectionButton}
                    onClick={(event) => {
                      const isValuesDifferent = checkIfValuesAreDifferent(
                        formikConf,
                        initialFormValues,
                        initialInputs,
                        mediaMiniFormInputs
                      );
                      if (!isValuesDifferent) {
                        let nextDataIndex = mediaDataIds[`charactersIds`][
                          `findIndex`
                        ](
                          (data) =>
                            data[`id`] ===
                            mediaDataIds[`current`][`character`][`id`]
                        );
                        if (
                          nextDataIndex + 1 >=
                          mediaDataIds[`charactersIds`][`length`]
                        ) {
                          nextDataIndex = 0;
                        } else if (
                          nextDataIndex + 1 <
                          mediaDataIds[`charactersIds`][`length`]
                        ) {
                          nextDataIndex = nextDataIndex + 1;
                        }
                        switchFormData(event, nextDataIndex, `C2`);
                      }
                    }}
                  >
                    <img
                      src={require("../../Media/Icons/expand_less-24px.svg")}
                      alt={`next selection`}
                      className={styles.nextSelectionIcon}
                    />
                  </div>
                  <div
                    ref={storedRefs[`addSelectionButtonC2Ref`]}
                    className={styles.addSelectionButton}
                  >
                    <img
                      src={require("../../Media/Icons/addition-icon-v2.svg")}
                      alt={`add selection`}
                      className={styles.addSelectionIcon}
                      onClick={(event) => {
                        const didValuesChange = checkIfValuesAreDifferent(
                          formikConf,
                          initialFormValues,
                          initialInputs,
                          mediaMiniFormInputs
                        );
                        if (!didValuesChange) {
                          switchFormData(event, `addC2`, `C2`);
                        }
                      }}
                    />
                  </div>
                  <div
                    ref={storedRefs[`prevSelectionButtonC2Ref`]}
                    className={styles.prevSelectionButton}
                    onClick={(event) => {
                      const isValuesDifferent = checkIfValuesAreDifferent(
                        formikConf,
                        initialFormValues,
                        initialInputs,
                        mediaMiniFormInputs
                      );
                      if (!isValuesDifferent) {
                        let prevDataIndex = mediaDataIds[`charactersIds`][
                          `findIndex`
                        ](
                          (data) =>
                            data[`id`] ===
                            mediaDataIds[`current`][`character`][`id`]
                        );
                        if (prevDataIndex - 1 < 0) {
                          prevDataIndex =
                            mediaDataIds[`charactersIds`][`length`] - 1;
                        } else if (prevDataIndex - 1 >= 0) {
                          prevDataIndex = prevDataIndex - 1;
                        }
                        switchFormData(event, prevDataIndex, `C2`);
                      }
                    }}
                  >
                    <img
                      src={require("../../Media/Icons/expand_more-24px.svg")}
                      alt={`previous selection`}
                      className={styles.prevSelectionIcon}
                    />
                  </div>
                </div>
                <div
                  ref={storedRefs[`selectionSectionCharacterRef`]}
                  className={styles.selectionSectionCharacter}
                  onClick={(event) => {
                    setFormPreviewData((prevFormPreviewData: any) => {
                      return {
                        ...prevFormPreviewData,
                        [`current`]: {
                          ...prevFormPreviewData[`current`],
                          [`type`]: `C2`,
                        },
                      };
                    });
                  }}
                ></div>
              </div>
              <div className={styles.selectionSection}>
                <div className={styles.selectionSectionNavigationBar}>
                  <div
                    ref={storedRefs[`nextSelectionButtonC3Ref`]}
                    className={styles.nextSelectionButton}
                    onClick={(event) => {
                      const retrievedMiniFormChildNodes =
                        storedRefs[`miniForm`][`current`][`childNodes`];
                      let currentActiveChildNodeIndex = -1;
                      let nextActiveChildNodeIndex = -1;
                      retrievedMiniFormChildNodes.forEach(
                        (node: any, index: number) => {
                          if (node.style.display === `flex`) {
                            currentActiveChildNodeIndex = index;
                            if (
                              index + 1 >=
                              retrievedMiniFormChildNodes.length
                            ) {
                              nextActiveChildNodeIndex = 0;
                            } else if (
                              index + 1 <
                              retrievedMiniFormChildNodes.length
                            ) {
                              nextActiveChildNodeIndex = index + 1;
                            }
                          }
                        }
                      );
                      switchMediaMiniForm(
                        `${
                          mediaMiniFormInputs[nextActiveChildNodeIndex][
                            `mediaType`
                          ]
                        }`,
                        storedRefs,
                        setMediaTypeText
                      );
                      if (
                        storedRefs[
                          `${
                            mediaMiniFormInputs[nextActiveChildNodeIndex][
                              `mediaType`
                            ]
                          }sInputViewRef`
                        ][`current`][`childNodes`][`length`] >= 1
                      ) {
                        handleCurrentMediaInputsSelectedStyle(
                          storedRefs[
                            `${
                              mediaMiniFormInputs[nextActiveChildNodeIndex][
                                `mediaType`
                              ]
                            }sInputViewRef`
                          ].current.childNodes,
                          `${
                            storedRefs[
                              `${
                                mediaMiniFormInputs[nextActiveChildNodeIndex][
                                  `mediaType`
                                ]
                              }sInputViewRef`
                            ].current.childNodes[0].id
                          }`,
                          `${
                            mediaMiniFormInputs[nextActiveChildNodeIndex][
                              `mediaType`
                            ]
                          }s`
                        );
                      }
                      setFormPreviewData((prevFormPreviewData: any) => {
                        return {
                          ...prevFormPreviewData,
                          [`current`]: {
                            ...prevFormPreviewData[`current`],
                            [`type`]: `C3`,
                          },
                        };
                      });
                      console.log({
                        retrievedMiniFormChildNodes,
                        currentActiveChildNodeIndex,
                        nextActiveChildNodeIndex,
                      });
                    }}
                  >
                    <img
                      src={require("../../Media/Icons/expand_less-24px.svg")}
                      alt={`next selection`}
                      className={styles.nextSelectionIcon}
                    />
                  </div>
                  <div
                    ref={storedRefs[`prevSelectionButtonC3Ref`]}
                    className={styles.prevSelectionButton}
                    onClick={(event) => {
                      const retrievedMiniFormChildNodes =
                        storedRefs[`miniForm`][`current`][`childNodes`];
                      let currentActiveChildNodeIndex = -1;
                      let prevActiveChildNodeIndex = -1;
                      retrievedMiniFormChildNodes.forEach(
                        (node: any, index: number) => {
                          if (node.style.display === `flex`) {
                            currentActiveChildNodeIndex = index;
                            if (index - 1 < 0) {
                              prevActiveChildNodeIndex =
                                retrievedMiniFormChildNodes.length - 1;
                            } else if (index - 1 >= 0) {
                              prevActiveChildNodeIndex = index - 1;
                            }
                          }
                        }
                      );
                      switchMediaMiniForm(
                        `${
                          mediaMiniFormInputs[prevActiveChildNodeIndex][
                            `mediaType`
                          ]
                        }`,
                        storedRefs,
                        setMediaTypeText
                      );
                      if (
                        storedRefs[
                          `${
                            mediaMiniFormInputs[prevActiveChildNodeIndex][
                              `mediaType`
                            ]
                          }sInputViewRef`
                        ][`current`][`childNodes`][`length`] >= 1
                      ) {
                        handleCurrentMediaInputsSelectedStyle(
                          storedRefs[
                            `${
                              mediaMiniFormInputs[prevActiveChildNodeIndex][
                                `mediaType`
                              ]
                            }sInputViewRef`
                          ].current.childNodes,
                          `${
                            storedRefs[
                              `${
                                mediaMiniFormInputs[prevActiveChildNodeIndex][
                                  `mediaType`
                                ]
                              }sInputViewRef`
                            ].current.childNodes[0].id
                          }`,
                          `${
                            mediaMiniFormInputs[prevActiveChildNodeIndex][
                              `mediaType`
                            ]
                          }s`
                        );
                      }
                      setFormPreviewData((prevFormPreviewData: any) => {
                        return {
                          ...prevFormPreviewData,
                          [`current`]: {
                            ...prevFormPreviewData[`current`],
                            [`type`]: `C3`,
                          },
                        };
                      });
                      console.log({
                        retrievedMiniFormChildNodes,
                        currentActiveChildNodeIndex,
                        prevActiveChildNodeIndex,
                      });
                    }}
                  >
                    <img
                      src={require("../../Media/Icons/expand_more-24px.svg")}
                      alt={`previous selection`}
                      className={styles.prevSelectionIcon}
                    />
                  </div>
                </div>
                <div
                  onClick={(event) => {
                    setFormPreviewData((prevFormPreviewData: any) => {
                      return {
                        ...prevFormPreviewData,
                        [`current`]: {
                          ...prevFormPreviewData[`current`],
                          [`type`]: `C3`,
                        },
                      };
                    });
                  }}
                  className={styles.selectionSectionMediaType}
                >
                  {`${mediaTypeText}s`}
                </div>
              </div>
              <div className={styles.selectionSection}>
                <div className={styles.selectionSectionNavigationBar}>
                  <div
                    ref={storedRefs[`nextSelectionButtonC4Ref`]}
                    className={styles.nextSelectionButton}
                    onClick={(event) => {
                      if (
                        storedRefs[`${mediaTypeText}sInputViewRef`][`current`][
                          `childNodes`
                        ][`length`] >= 1
                      ) {
                        let nextInputsIndex = -1;
                        for (
                          let c = 0;
                          c <
                          storedRefs[`${mediaTypeText}sInputViewRef`].current
                            .childNodes.length;
                          c++
                        ) {
                          if (
                            storedRefs[`${mediaTypeText}sInputViewRef`].current
                              .childNodes[c].style.display === `flex`
                          ) {
                            if (
                              c + 1 >=
                              storedRefs[`${mediaTypeText}sInputViewRef`]
                                .current.childNodes.length
                            ) {
                              nextInputsIndex = 0;
                            } else if (
                              c + 1 <
                              storedRefs[`${mediaTypeText}sInputViewRef`]
                                .current.childNodes.length
                            ) {
                              nextInputsIndex = c + 1;
                            }
                          }
                        }
                        handleCurrentMediaInputsSelectedStyle(
                          storedRefs[`${mediaTypeText}sInputViewRef`].current
                            .childNodes,
                          `${
                            storedRefs[`${mediaTypeText}sInputViewRef`].current
                              .childNodes[nextInputsIndex].id
                          }`,
                          `${mediaTypeText}s`
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
                        console.log({
                          storedRefs,
                        });
                      }
                    }}
                  >
                    <img
                      src={require("../../Media/Icons/expand_less-24px.svg")}
                      alt={`next selection`}
                      className={styles.nextSelectionIcon}
                    />
                  </div>
                  <div className={styles.addSelectionButton}>
                    <img
                      src={require("../../Media/Icons/addition-icon-v2.svg")}
                      alt={`add selection`}
                      className={styles.addSelectionIcon}
                      onClick={(event) => {
                        const retrievedMiniFormOpts = mediaMiniFormInputs[
                          `find`
                        ]((opts) => opts[`mediaType`] === mediaTypeText);
                        if (retrievedMiniFormOpts) {
                          const { id } = addNewInputs(
                            `${retrievedMiniFormOpts.mediaType}`,
                            retrievedMiniFormOpts.inputsOpts,
                            retrievedMiniFormOpts.inputsDeletionCallback,
                            storedRefs[
                              `${retrievedMiniFormOpts.mediaType}sInputViewRef`
                            ].current
                          );
                          handleCurrentMediaInputsSelectedStyle(
                            storedRefs[
                              `${
                                retrievedMiniFormOpts[`mediaType`]
                              }sInputViewRef`
                            ].current.childNodes,
                            `${id}`,
                            `${mediaTypeText}s`
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
                        }
                      }}
                    />
                  </div>
                  <div
                    ref={storedRefs[`prevSelectionButtonC4Ref`]}
                    className={styles.prevSelectionButton}
                    onClick={(event) => {
                      if (
                        storedRefs[`${mediaTypeText}sInputViewRef`][`current`][
                          `childNodes`
                        ][`length`] >= 1
                      ) {
                        let prevInputsIndex = -1;
                        for (
                          let c = 0;
                          c <
                          storedRefs[`${mediaTypeText}sInputViewRef`].current
                            .childNodes.length;
                          c++
                        ) {
                          if (
                            storedRefs[`${mediaTypeText}sInputViewRef`].current
                              .childNodes[c].style.display === `flex`
                          ) {
                            if (c - 1 < 0) {
                              prevInputsIndex =
                                storedRefs[`${mediaTypeText}sInputViewRef`]
                                  .current.childNodes.length - 1;
                            } else if (c - 1 >= 0) {
                              prevInputsIndex = c - 1;
                            }
                          }
                        }
                        handleCurrentMediaInputsSelectedStyle(
                          storedRefs[`${mediaTypeText}sInputViewRef`].current
                            .childNodes,
                          `${
                            storedRefs[`${mediaTypeText}sInputViewRef`].current
                              .childNodes[prevInputsIndex].id
                          }`,
                          `${mediaTypeText}s`
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
                        console.log({
                          storedRefs,
                        });
                      }
                    }}
                  >
                    <img
                      src={require("../../Media/Icons/expand_more-24px.svg")}
                      alt={`previous selection`}
                      className={styles.prevSelectionIcon}
                    />
                  </div>
                </div>
                <div
                  className={styles.selectionSectionMediaInputs}
                  onClick={(event) => {
                    setFormPreviewData((prevFormPreviewData: any) => {
                      return {
                        ...prevFormPreviewData,
                        [`current`]: {
                          ...prevFormPreviewData[`current`],
                          [`type`]: `C4`,
                        },
                      };
                    });
                  }}
                >
                  <div className={styles.miniForm} ref={storedRefs[`miniForm`]}>
                    {mediaMiniFormInputs.map((opts) => {
                      return (
                        <div
                          key={`${opts[`mediaType`]}sInputsKey`}
                          className={styles[`${opts[`mediaType`]}sInputs`]}
                          ref={storedRefs[`${opts[`mediaType`]}sInputViewRef`]}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className={styles.selectionOptions}>
                <div
                  className={styles.cancelEditButton}
                  onClick={(event) => {
                    const mediaDataKeys = Object.keys(mediaDataIds);
                    const currentDataIndex = mediaDataIds[mediaDataKeys[1]][
                      `findIndex`
                    ](
                      (ids: any) =>
                        mediaDataIds[mediaDataKeys[2]][
                          Object.keys(mediaDataIds[mediaDataKeys[2]])[1]
                        ][`id`] === ids[`id`]
                    );
                    switchFormData(
                      event,
                      currentDataIndex > -1 ? currentDataIndex : 0,
                      `C1`
                    );
                    console.log({
                      mediaDataIds,
                      currentDataIndex,
                      test: Object.keys(mediaDataIds[mediaDataKeys[2]]),
                    });
                  }}
                >{`CANCEL EDIT`}</div>
                <div
                  className={styles[`annihilateButton`]}
                  onClick={(event) => {
                    console[`log`]({ mediaDataIds });
                    if (
                      mediaDataIds[`current`][`class`] !== `` &&
                      mediaDataIds[`current`][`class`] !== undefined &&
                      mediaDataIds[`current`][`class`][`id`] !== undefined &&
                      mediaDataIds[`current`][`class`][`id`] !== `` &&
                      mediaDataIds[`current`][`character`][`id`] !==
                        undefined &&
                      mediaDataIds[`current`][`character`][`id`] !== ``
                    ) {
                      setFormPreviewData((prevFormPreviewData: any) => {
                        return {
                          ...prevFormPreviewData,
                          [`current`]: {
                            ...prevFormPreviewData[`current`],
                            [`type`]: `DataAnnihilationSelection`,
                          },
                        };
                      });
                    }
                  }}
                >{`ANNIHILATE`}</div>
                <button
                  className={styles[`saveEditButton`]}
                  type={`submit`}
                  onMouseOver={(event) => {
                    const isValuesDifferent = checkIfValuesAreDifferent(
                      formikConf,
                      initialFormValues,
                      initialInputs,
                      mediaMiniFormInputs
                    );
                    if (isValuesDifferent) {
                      event[`currentTarget`][`style`][`cursor`] = `pointer`;
                    } else {
                      event[`currentTarget`][`style`][`cursor`] = `default`;
                    }
                  }}
                >{`SAVE`}</button>
              </div>
            </div>
          </form>
        </div>
      );
    default:
      return (
        <div>{`This form layout is of default and non-existent. A mistake has been made.?.`}</div>
      );
  }
};

export default BaseForm;
