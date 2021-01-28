import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { visitNode } from "typescript";
import { store, dataBaseUrl } from "../../../routes/routerBlock";

const characterDataSlice = createSlice({
  name: "characterData",
  initialState: {
    charactersQueries: {
      class: { name: ``, id: `` },
      ids: [{ id: ``, name: ``, gridImage: `` }],
    },
    characterData: {
      id: ``,
      date: ``,
      description: ``,
      name: ``,
      primarchImages: { gridImage: ``, modelImage: [``] },
      webExcerpts: [{ id: ``, title: ``, excerpt: ``, webCite: ``, date: `` }],
      videos: [{ date: ``, id: ``, title: ``, link: `` }],
    },
  },
  reducers: {
    charactersClassRetrieved: {
      reducer: (
        state,
        {
          payload,
        }: PayloadAction<{
          preppedCharactersClass: { name: string; id: string };
        }>
      ) => {
        state.charactersQueries.class = payload.preppedCharactersClass;
      },
      prepare: ({
        preppedCharactersClass,
      }: {
        preppedCharactersClass: { name: string; id: string };
      }) => ({
        payload: { preppedCharactersClass },
      }),
    },
    charactersQueriesRetrieved: {
      reducer: (
        state,
        {
          payload,
        }: PayloadAction<{
          preppedCharactersQueries: Array<{
            id: string;
            name: string;
            gridImage: string;
          }>;
        }>
      ) => {
        state.charactersQueries.ids = payload.preppedCharactersQueries;
      },
      prepare: ({
        preppedCharactersQueries,
      }: {
        preppedCharactersQueries: Array<{
          id: string;
          name: string;
          gridImage: string;
        }>;
      }) => ({ payload: { preppedCharactersQueries } }),
    },
    characterDataRetrieved: {
      reducer: (
        state,
        {
          payload,
        }: PayloadAction<{
          preppedCharacterData: {
            id: string;
            date: string;
            description: string;
            name: string;
            primarchImages: {
              gridImage: string;
              modelImage: Array<string>;
            };
            webExcerpts: Array<{
              id: string;
              title: string;
              excerpt: string;
              webCite: string;
              date: string;
            }>;
            videos: Array<{
              date: string;
              id: string;
              title: string;
              link: string;
            }>;
          };
        }>
      ) => {
        state.characterData = payload.preppedCharacterData;
      },
      prepare: ({
        preppedCharacterData,
      }: {
        preppedCharacterData: {
          id: string;
          date: string;
          description: string;
          name: string;
          primarchImages: {
            gridImage: string;
            modelImage: Array<string>;
          };
          webExcerpts: Array<{
            id: string;
            title: string;
            excerpt: string;
            webCite: string;
            date: string;
          }>;
          videos: Array<{
            date: string;
            id: string;
            title: string;
            link: string;
          }>;
        };
      }) => ({ payload: { preppedCharacterData } }),
    },
  },
});

export const {
  characterDataRetrieved,
  charactersQueriesRetrieved,
  charactersClassRetrieved,
} = characterDataSlice.actions;

export const fetchCharacterData = async (
  characterIndex?: number,
  callBack?: { opts: string; exe: Function },
  characterSet?: string
) => {
  const fetchingClassData = await fetch(`${dataBaseUrl}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      const json = res.json();
      return json;
    })
    .then(
      (
        data: Array<{
          _id: string;
          setName: string;
          charactersId: Array<{ _id: string; name: string; id: string }>;
          date: Date;
        }>
      ) => {
        const allDataSets = data.map((d) => {
          return { name: d.setName, id: d._id };
        });
        const verifiedCharactersSet = data.find((d) => d._id === characterSet);
        const clarifiedCharactersSet = verifiedCharactersSet
          ? {
              name: verifiedCharactersSet.setName,
              id: verifiedCharactersSet._id,
            }
          : { name: data[0].setName, id: data[0]._id };
        store.dispatch(
          charactersClassRetrieved({
            preppedCharactersClass: clarifiedCharactersSet,
          })
        );
        return { all: allDataSets, specified: clarifiedCharactersSet };
      }
    );
  const fetchingInitialCharacterData = await fetch(
    `${dataBaseUrl}characterSet/${fetchingClassData.specified.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      const json = res.json();
      console.log({ res, json });
      return json;
    })
    .then(
      (
        data: Array<{
          _id: string;
          date: string;
          description: string;
          name: string;
          characterImages: { gridImage: string; modelImages: Array<string> };
        }>
      ) => {
        // Log retrieved data
        console[`log`]({ dataP1: data });
        if (data && data[`length`] > 0) {
          // Declare variable holding configured characters queries data
          const configgedCharactersQueries: Array<{
            id: string;
            name: string;
            gridImage: string;
          }> = [];
          data[`forEach`]((item) => {
            if (item) {
              configgedCharactersQueries[`push`]({
                id: item._id,
                name: item.name,
                gridImage: `${dataBaseUrl}imagesv2/${item.characterImages.gridImage}`,
              });
            }
          });
          console.log({ configgedCharactersQueries });
          // Handle store dispatch for characters queries data
          store.dispatch(
            charactersQueriesRetrieved({
              preppedCharactersQueries: configgedCharactersQueries,
            })
          );

          // Handle index clarification and verification for character data
          const characterIndexClarified = () => {
            let dataLength = data.length;
            if (characterIndex) {
              if (characterIndex < data.length && characterIndex > -1) {
                return characterIndex;
              } else if (characterIndex <= -1) {
                return 0;
              } else if (characterIndex >= dataLength) {
                return dataLength - 1;
              }
            } else {
              return 0;
            }
          };
          let characterIndexVerified = characterIndexClarified();
          // Declare variable storing selected character data
          const fetchedPrimaryCharacterData =
            data[characterIndexVerified ? characterIndexVerified : 0];

          if (fetchedPrimaryCharacterData) {
            // Declare variable remapping character data primarchImages filename to database url
            const characterImagesUrlConfig =
              fetchedPrimaryCharacterData.characterImages &&
              fetchedPrimaryCharacterData.characterImages.modelImages &&
              fetchedPrimaryCharacterData.characterImages.modelImages.length > 0
                ? fetchedPrimaryCharacterData.characterImages.modelImages.map(
                    (filename) => {
                      return `${dataBaseUrl}imagesv2/${filename}`;
                    }
                  )
                : [];

            // Declare variable holding initial character data
            let tempCharacterDataHold: any = {
              id: fetchedPrimaryCharacterData._id,
              date: fetchedPrimaryCharacterData.date,
              description: fetchedPrimaryCharacterData.description,
              name: fetchedPrimaryCharacterData.name,
              characterImages: {
                gridImage: `${dataBaseUrl}imagesv2/${fetchedPrimaryCharacterData.characterImages.gridImage}`,
                modelImage: characterImagesUrlConfig,
              },
            };
            console.log({ characterDataHoldP1: tempCharacterDataHold });
            // Handle fetching character extended data
            const fetchingExtendedCharacterData = async () => {
              const extendedCharacterData = await fetch(
                `${dataBaseUrl}extendCharacter/${fetchedPrimaryCharacterData._id}`
              )
                .then((res) => {
                  const json = res.json();
                  return json;
                })
                .then(
                  (
                    data: Array<{
                      _id: string;
                      characterId: string;
                      videos: Array<{
                        date: string;
                        link: string;
                        title: string;
                        _id: string;
                      }>;
                      webExcerpts: Array<{
                        date: string;
                        excerpt: string;
                        title: string;
                        webCite: string;
                        _id: string;
                      }>;
                    }>
                  ) => {
                    console.log({ dataP2: data[0] });
                    // Declare variable holding configged web excerpts data
                    const tempWebExcerptsDataHold =
                      data[0] &&
                      data[0].webExcerpts &&
                      data[0].webExcerpts.length > 0
                        ? data[0].webExcerpts.map((excerpt) => {
                            return {
                              id: excerpt._id,
                              title: excerpt.title,
                              excerpt: excerpt.excerpt,
                              webCite: excerpt.webCite,
                              date: excerpt.date,
                            };
                          })
                        : [];
                    // Declare variable holding configged vieos data
                    const tempVideosDataHold =
                      data[0] && data[0].videos && data[0].videos.length > 0
                        ? data[0].videos.map((video) => {
                            return {
                              date: video.date,
                              id: video._id,
                              title: video.title,
                              link: video.link,
                            };
                          })
                        : [];
                    tempCharacterDataHold = {
                      ...tempCharacterDataHold,
                      webExcerpts: tempWebExcerptsDataHold,
                      videos: tempVideosDataHold,
                    };
                    console.log({ characterDataHoldP2: tempCharacterDataHold });
                    store.dispatch(
                      characterDataRetrieved({
                        preppedCharacterData: tempCharacterDataHold,
                      })
                    );
                    if (callBack) {
                      if (callBack.opts === `updateLocalState`) {
                        callBack.exe(
                          configgedCharactersQueries,
                          tempCharacterDataHold,
                          fetchingClassData
                        );
                      } else if (callBack.opts === `updateAPIState`) {
                        callBack.exe(
                          configgedCharactersQueries,
                          tempCharacterDataHold,
                          fetchingClassData
                        );
                      }
                    }
                  }
                );
            };
            fetchingExtendedCharacterData();
            console.log({
              data: data[characterIndexVerified ? characterIndexVerified : 0],
              characterIndexVerified,
            });
          } else {
            if (callBack) {
              if (callBack.opts === `updateLocalState`) {
                callBack.exe([], {});
              } else if (callBack.opts === `updateAPIState`) {
                callBack.exe([], {}, fetchingClassData);
              }
            }
          }
        } else {
          if (callBack) {
            if (callBack.opts === `updateLocalState`) {
              callBack.exe([], {});
            } else if (callBack.opts === `updateAPIState`) {
              callBack.exe([], {}, fetchingClassData);
            }
          }
        }
      }
    );
};

export default characterDataSlice.reducer;

export {};
