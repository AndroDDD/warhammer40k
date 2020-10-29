import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { visitNode } from "typescript";
import { store, dataBaseUrl } from "../../../routes/routerBlock";

const characterDataSlice = createSlice({
  name: "characterData",
  initialState: {
    charactersQueries: [{ id: ``, name: ``, gridImage: `` }],
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
        state.charactersQueries = payload.preppedCharactersQueries;
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
} = characterDataSlice.actions;

export const fetchCharacterData = async (
  characterIndex?: number,
  callBack?: { opts: string; exe: Function }
) => {
  const fetchingData = await fetch(dataBaseUrl, {
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
          date: string;
          description: string;
          name: string;
          primarchImages: { gridImage: string; modelImage: Array<string> };
        }>
      ) => {
        // Log retrieved data
        console.log({ dataP1: data });
        // Declare variable holding configured characters queries data
        const configgedCharactersQueries = data.map((item) => {
          return {
            id: item._id,
            name: item.name,
            gridImage: `${dataBaseUrl}imagesv2/${item.primarchImages.gridImage}`,
          };
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

        // Declare variable remapping character data primarchImages filename to database url
        const primarchImagesUrlConfig = fetchedPrimaryCharacterData.primarchImages.modelImage.map(
          (filename) => {
            return `${dataBaseUrl}imagesv2/${filename}`;
          }
        );

        // Declare variable holding initial character data
        let tempCharacterDataHold: any = {
          id: fetchedPrimaryCharacterData._id,
          date: fetchedPrimaryCharacterData.date,
          description: fetchedPrimaryCharacterData.description,
          name: fetchedPrimaryCharacterData.name,
          primarchImages: {
            gridImage: `${dataBaseUrl}imagesv2/${fetchedPrimaryCharacterData.primarchImages.gridImage}`,
            modelImage: primarchImagesUrlConfig,
          },
        };
        console.log({ characterDataHoldP1: tempCharacterDataHold });
        // Handle fetching character extended data
        const fetchingExtendedCharacterData = async () => {
          const extendedCharacterData = await fetch(
            `${dataBaseUrl}extendPrimarch/${fetchedPrimaryCharacterData._id}`
          )
            .then((res) => {
              const json = res.json();
              return json;
            })
            .then(
              (
                data: Array<{
                  _id: string;
                  primarchId: string;
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
                const tempWebExcerptsDataHold = data[0].webExcerpts.map(
                  (excerpt) => {
                    return {
                      id: excerpt._id,
                      title: excerpt.title,
                      excerpt: excerpt.excerpt,
                      webCite: excerpt.webCite,
                      date: excerpt.date,
                    };
                  }
                );
                // Declare variable holding configged vieos data
                const tempVideosDataHold = data[0].videos.map((video) => {
                  return {
                    date: video.date,
                    id: video._id,
                    title: video.title,
                    link: video.link,
                  };
                });
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
                      tempCharacterDataHold
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
      }
    );
};

export default characterDataSlice.reducer;

export {};
