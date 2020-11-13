import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { gsap, Power3 } from "gsap";
import ReactPlayer from "react-player";

import $ from "jquery";

import { fetchCharacterData } from "../../../Data/CharacterData/CharacterDataSlice";

import "./CharacterDataStyles.scss";

// Declare Function Component handling app processes and views
const CharacterData: React.FC = () => {
  // Handle screen resize view updates
  const [screenHeight, setScreenHeight] = React.useState(() => {
    return Dimensions.get("window").height;
  });
  const [screenWidth, setScreenWidth] = React.useState(() => {
    return Dimensions.get("window").width;
  });

  $(window).on("resize", () => {
    setScreenHeight(() => {
      return Dimensions.get("window").height;
    });

    setScreenWidth(() => {
      return Dimensions.get("window").width;
    });
  });

  React.useEffect(() => {
    // Handle general view screen size updates
    setStyles(() => {
      return {
        ...styles,
        mainDisplaySupport: {
          ...styles.mainDisplaySupport,
          height: screenHeight,
        },
        characterDataViewSupport: {
          ...styles.characterDataViewSupport,
          height: screenHeight - 100,
        },
        mainCharDataViewsSupport: {
          ...styles.mainCharDataViewsSupport,
          height: screenHeight - 155,
        },
        mainCharWebExcerptContentSupport: {
          ...styles.mainCharWebExcerptContentSupport,
          height: screenHeight - 235,
        },
      };
    });

    // Handle character cover image size update
    const heightOfDataCoverView =
      characterDataCoverViewRef.current.offsetHeight;
    characterCoverImageRef.current.height = heightOfDataCoverView * 100 * 0.01;
    characterCoverImageRef.current.width = heightOfDataCoverView * 100 * 0.01;

    // Handle character model photo size update
    if (mainCharModelPhotoRef) {
      const handleModelPhotoSizeUpdate = () => {
        let trueImageHeight = mainCharModelPhotoRef.current.naturalHeight;
        let trueImageWidth = mainCharModelPhotoRef.current.naturalWidth;
        let sudoImageHeight = mainCharModelPhotoRef.current.offsetHeight;
        let sudoImageWidth = mainCharModelPhotoRef.current.offsetWidth;
        let containerHeight = mainCharPhotosViewRef.current.offsetHeight;
        let containerWidth = mainCharPhotosViewRef.current.offsetWidth;
        if (trueImageHeight > trueImageWidth) {
          let heightRatio = containerHeight / trueImageHeight;
          let configgedImageWidth = heightRatio * trueImageWidth;
          mainCharModelPhotoRef.current.height = containerHeight;
          mainCharModelPhotoRef.current.width = configgedImageWidth;
          if (configgedImageWidth > containerWidth) {
            let widthRatio = containerWidth / configgedImageWidth;
            let configgedImageHeight = widthRatio * containerHeight;
            mainCharModelPhotoRef.current.height = configgedImageHeight;
            mainCharModelPhotoRef.current.width = containerWidth;
          }
        } else if (trueImageHeight < trueImageWidth) {
          let widthRatio = containerWidth / trueImageWidth;
          let configgedImageHeight = widthRatio * trueImageHeight;
          mainCharModelPhotoRef.current.height = configgedImageHeight;
          mainCharModelPhotoRef.current.width = containerWidth;
          if (configgedImageHeight > containerHeight) {
            let heightRatio = containerHeight / configgedImageHeight;
            let configgedImageWidth = heightRatio * containerWidth;
            mainCharModelPhotoRef.current.height = containerHeight;
            mainCharModelPhotoRef.current.width = configgedImageWidth;
          }
        } else {
          mainCharModelPhotoRef.current.height = containerHeight;
          mainCharModelPhotoRef.current.width = containerHeight;
        }
      };
      handleModelPhotoSizeUpdate();
    }
    // Handle character navigation bar updates on screen size change
    let configgedNumberOfCharButtons = Math.floor((screenWidth - 50) / 100);
    const lastCharactersInArrayIndex =
      charactersNavButtonsIndexes[charactersNavButtonsIndexes.length - 1];
    const navCharactersQueriesLength = charactersQueries.length - 1;

    if (configgedNumberOfCharButtons !== numberOfCharButtons) {
      setNumberOfCharButtons(() => {
        return configgedNumberOfCharButtons;
      });

      setCharactersNavButtonsIndexes(() => {
        let tempCharNavIndexesHold = [];
        for (let i = 0; i < configgedNumberOfCharButtons; i++) {
          tempCharNavIndexesHold.push(i);
        }
        tempCharNavIndexesHold = tempCharNavIndexesHold.map(
          (characterIndex) => {
            console.log({
              charactersNavButtonsIndexesLength:
                charactersNavButtonsIndexes.length,
            });
            const newCharacterIndex =
              charactersNavButtonsIndexes[
                charactersNavButtonsIndexes.length - 1
              ] +
              characterIndex -
              charactersNavButtonsIndexes.length +
              1;
            const newCharacterIndexv2 =
              newCharacterIndex - navCharactersQueriesLength - 1;
            if (charactersNavButtonsIndexes[characterIndex] !== undefined) {
              console.log(`index not undefined`);
              return charactersNavButtonsIndexes[characterIndex];
            } else if (newCharacterIndex > navCharactersQueriesLength) {
              console.log(`conditional works`);
              if (newCharacterIndexv2 === 0 || newCharacterIndexv2 === 1) {
                console.log({ navCharactersQueriesLength });
                console.log({ newCharacterIndex });
                console.log({ newCharacterIndexv2 });
              }
              return newCharacterIndexv2;
            } else {
              console.log(`setting undefined to defined`);
              return newCharacterIndex;
            }
          }
        );
        console.log({ tempCharNavIndexesHold });
        return tempCharNavIndexesHold;
      });
    }
  }, [screenHeight, screenWidth]);

  // Declare stylesheet for manipulation
  const [styles, setStyles] = React.useState({
    mainDisplay: styles2.mainDisplay,
    mainDisplaySupport: { width: "100%", height: screenHeight },
    mainDisplaySubSupport: `mainDisplaySubSupport`,
    mainCharDataView: styles2.mainCharDataView,
    mainCharDataViewsSupport: { height: screenHeight - 155 },
    mainCharVideosView: styles2.mainCharVideosView,
    mainCharPhotosView: styles2.mainCharPhotosView,
    mainCharModelPhoto: `mainCharModelPhoto`,
    mainCharWebExcerptsView: styles2.mainCharWebExcerptsView,
    mainCharWebExcerptHeader: styles2.mainCharWebExcerptHeader,
    mainCharWebExcerptContent: styles2.mainCharWebExcerptContent,
    mainCharWebExcerptContentSupport: { height: screenHeight - 235 },
    mainCharWebExcerptContentSupportv2: `mainCharWebExcerptContentSupportv2`,
    mainCharWebExcerptTitle: styles2.mainCharWebExcerptTitle,
    mainCharWebExcerptReference: styles2.mainCharWebExcerptReference,
    mainCharWebExcerpt: styles2.mainCharWebExcerpt,
    mainCharDataViewNav: styles2.mainCharDataViewNav,
    mainCharSwitchDataViewNav: styles2.mainCharSwitchDataViewNav,
    mainCharSwitchDataViewNavButton: `mainCharSwitchDataViewNavButton`,
    mainCharSwitchIndexViewNavButton: `mainCharSwitchIndexViewNavButton`,
    mainCharSwitchIndexViewNav: styles2.mainCharSwitchIndexViewNav,
    characterDataView: styles2.characterDataView,
    characterDataViewSupport: { height: screenHeight - 100 },
    characterDataCoverView: styles2.characterDataCoverView,
    characterCoverImage: `characterCoverImage`,
    charactersNavbarView: styles2.charactersNavbarView,
    charactersNavbarViewSupport: { height: 100 },
    charactersNavbarViewCover: styles2.charactersNavbarViewCover,
    charactersNavbarViewCoverImage: `charactersNavbarViewCoverImage`,
    charactersNavbarViewCoverImageSupport: `charactersNavbarViewCoverImageSupport`,
    charactersNavbarViewCoverText: styles2.charactersNavbarViewCoverText,
    charactersNavbarViewDataLoad: styles2.charactersNavbarViewDataLoad,
    charactersNavbarViewDataLoadImage: `charactersNavbarViewDataLoadImage`,
    charactersNavbarViewDataLoadImageSupport: `charactersNavbarViewDataLoadImageSupport`,
    characterNavButton: `characterNavButton`,
    prevCharacterNavButton: `prevCharacterNavButton`,
    nextCharacterNavButton: `nextCharacterNavButton`,
    defaultIconStyle: `defaultIconStyle`,
    genericText: styles2.genericText,
  });

  // Declare ref for jsx manipulation
  const mainDisplayRef = React.useRef<any>();
  const mainCharDataViewRef = React.useRef<any>();
  const mainCharDataViewNavRef = React.useRef<any>();
  const mainCharVideosViewRef = React.useRef<any>();
  const mainCharPhotosViewRef = React.useRef<any>();
  const mainCharModelPhotoRef = React.useRef<any>();
  const mainCharWebExcerptsViewRef = React.useRef<any>();
  const characterDataViewRef = React.useRef<any>();
  const characterDataCoverViewRef = React.useRef<any>();
  const characterCoverImageRef = React.useRef<any>();
  const charactersNavBarViewRef = React.useRef<any>();
  const charactersNavbarViewCoverRef = React.useRef<any>();
  const charactersNavbarViewDataLoadRef = React.useRef<any>();
  const prevCharacterNavButtonRef = React.useRef<any>();
  const nextCharacterNavButtonRef = React.useRef<any>();
  const gsapTimelineRef = React.useRef<any>();

  // Declare variable holding characters queries data
  const [charactersQueries, setCharactersQueries] = React.useState([
    { id: ``, name: ``, gridImage: `` },
  ]);

  // Declare variable holding character data
  const [characterData, setCharacterData] = React.useState(() => {
    return {
      id: ``,
      date: ``,
      description: ``,
      name: ``,
      primarchImages: {
        gridImage: `https://vignette.wikia.nocookie.net/warhammer40k/images/a/a8/AquilaBlack.jpg/revision/latest?cb=20170423020507`,
        modelImage: [``],
      },
      webExcerpts: [{ id: ``, title: ``, excerpt: ``, webCite: ``, date: `` }],
      videos: [{ date: ``, id: ``, title: ``, link: `` }],
    };
  });

  // Declare variable holding previous character data
  const [previousCharacterData, setPreviousCharacterData] = React.useState(
    () => {
      return {
        id: ``,
        date: ``,
        description: ``,
        name: ``,
        primarchImages: {
          gridImage: `https://vignette.wikia.nocookie.net/warhammer40k/images/a/a8/AquilaBlack.jpg/revision/latest?cb=20170423020507`,
          modelImage: [``],
        },
        webExcerpts: [
          { id: ``, title: ``, excerpt: ``, webCite: ``, date: `` },
        ],
        videos: [{ date: ``, id: ``, title: ``, link: `` }],
      };
    }
  );

  // Declare variable tracking current main character data view
  const [currentCharDataView, setCurrentCharDataView] = React.useState(
    `videos`
  );

  // Declare variable tracking previous main character data view
  const [previousCharDataView, setPreviousCharDataView] = React.useState(``);

  // Declare variable tracking current character data view index for videos, webExcerpts, photos
  const [currentCharVideosIndex, setCurrentCharVideosIndex] = React.useState(0);
  const [
    currentCharWebExcerptsIndex,
    setCurrentCharWebExcerptsIndex,
  ] = React.useState(0);
  const [currentCharPhotosIndex, setCurrentCharPhotosIndex] = React.useState(0);

  // Declare variable holding index of currently selected character
  const [selectedCharacterIndex, setSelectedCharacterIndex] = React.useState<
    number
  >();

  // Declare variable holding character cover image src
  const [prevCharacterCoverImage, setPrevCharacterCoverImage] = React.useState(
    () => {
      return characterData.primarchImages.gridImage;
    }
  );

  // Declare variable holding cover image alt tage
  const [
    prevCharacterCoverImageAlt,
    setPrevCharacterCoverImageAlt,
  ] = React.useState(() => {
    return ``;
  });

  // Declare variable tracking if cover image is changing
  const [isCoverImageChanging, setIsCoverImageChanging] = React.useState(false);
  // Declare cariable tracking if character data view is changing
  const [isCharDataViewChanging, setIsCharDataViewChanging] = React.useState(
    false
  );
  // Declare variable tracking if cover is unwrapped
  const [isCoverUnwrapped, setIsCoverUnwrapped] = React.useState(true);
  // Declare variable tracking if characters navigation bar is uncovered
  const [isNavbarUncovered, setIsNavbarUncovered] = React.useState(false);
  // Declare variable holding characters navbar buttons
  const [charactersNavButtons, setCharactersNavButtons] = React.useState([
    <button key={`initial`}></button>,
  ]);

  // Declare variable holding navbar button indexes
  const [
    charactersNavButtonsIndexes,
    setCharactersNavButtonsIndexes,
  ] = React.useState([0]);

  // Declare variable holding number of characters navbar buttons displayed
  const [numberOfCharButtons, setNumberOfCharButtons] = React.useState(() => {
    let configgedNumberOfCharButtons = Math.floor(screenWidth / 100);
    return configgedNumberOfCharButtons;
  });

  // Declare variable tracking if video is playing
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(() => {
    return false;
  });

  // Declare function handling initial data retrieval for component view/s setup
  const initializeCharacterDataRetrieval = (
    characterIndexToRetrieve?: number
  ) => {
    console.log({
      initializationFunctionCharIndexv1: characterIndexToRetrieve,
    });
    fetchCharacterData(characterIndexToRetrieve, {
      opts: "updateLocalState",
      exe: (retrievedCharactersQueries: any, retrievedCharacterData: any) => {
        console.log({
          initializationFunctionCharIndexv2: characterIndexToRetrieve,
        });
        if (charactersQueries[0].id === ``) {
          setCharactersQueries(retrievedCharactersQueries);
        }
        if (characterIndexToRetrieve || characterIndexToRetrieve === 0) {
          console.log({
            initializationFunctionCharIndexv3: characterIndexToRetrieve,
          });
          setPreviousCharacterData(retrievedCharacterData);
        }
      },
    });
  };

  // Handle initial character data retrieval
  React.useEffect(() => {
    // Execute initialization
    initializeCharacterDataRetrieval();
  }, []);

  // Handle etc... updates on character data change
  React.useEffect(() => {
    // Handle holding previous character cover image for cover image transition on data change
    setPrevCharacterCoverImage(() => {
      let prevCoverImageToSave = characterData.primarchImages.gridImage;
      console.log({ characterDataChangeEtcProcesses: prevCoverImageToSave });
      return prevCoverImageToSave;
    });

    // Declare variable holding mapped navbar characters buttons view
    const configgedCharactersNavButtons = charactersQueries.map(
      (query, index) => {
        const charButton = (
          <button
            key={query.id}
            className={styles.characterNavButton}
            onClick={(event) => {
              if (index !== selectedCharacterIndex) {
                setSelectedCharacterIndex(index);
                initializeCharacterDataRetrieval(index);
              }
            }}
          >
            <img
              src={query.gridImage}
              alt={query.name}
              width={`100%`}
              height={`100%`}
            />
          </button>
        );
        return charButton;
      }
    );
    setCharactersNavButtons(configgedCharactersNavButtons);
  }, [characterData]);

  // Handle updating alt tag on cover image change
  React.useEffect(() => {
    setPrevCharacterCoverImageAlt(() => {
      let prevCoverImageAltToSave = characterCoverImageRef.current.alt;
      console.log({ characterCoverImageAltChange: prevCoverImageAltToSave });
      return prevCoverImageAltToSave;
    });
  }, [characterCoverImageRef.current]);

  // Handle characters navbar cover toggle
  React.useEffect(() => {
    if (isNavbarUncovered) {
      gsapTimelineRef.current = gsap
        .timeline()
        .to(charactersNavbarViewCoverRef.current, {
          duration: 3,
          bottom: "-105%",
        });
    }
  }, [isNavbarUncovered]);

  // Update characters navbar view on characters queries data change
  React.useEffect(() => {
    console.log({
      charactersQueries,
      characterDataFromComponent: characterData,
      numberOfCharButtons,
    });

    // Declare variable holding mapped navbar characters buttons view
    const configgedCharactersNavButtons = charactersQueries.map(
      (query, index) => {
        const charButton = (
          <button
            key={query.id}
            className={styles.characterNavButton}
            onClick={(event) => {
              if (index !== selectedCharacterIndex) {
                setSelectedCharacterIndex(index);
                initializeCharacterDataRetrieval(index);
              }
            }}
          >
            <img
              src={query.gridImage}
              alt={query.name}
              width={`100%`}
              height={`100%`}
            />
          </button>
        );
        return charButton;
      }
    );

    // Declare variable holding mapped navbar characters indexes
    const configgedCharactersNavButtonsIndexes = charactersQueries.map(
      (query, index) => {
        return index;
      }
    );
    const splicedCharNavButIndexes = configgedCharactersNavButtonsIndexes.splice(
      numberOfCharButtons
    );
    console.log({ splicedCharNavButIndexes });

    // Handle local state updates
    console.log({ configgedCharactersNavButtonsIndexes });
    setCharactersNavButtons(configgedCharactersNavButtons);
    setCharactersNavButtonsIndexes(configgedCharactersNavButtonsIndexes);
  }, [charactersQueries]);

  // Handle character cover view gsap manipulations and image src updates
  React.useEffect(() => {
    console.log({ characterDataName: previousCharacterData.name });
    if (previousCharacterData.name !== ``) {
      setIsVideoPlaying(() => {
        return false;
      });
      const tl = gsap.timeline();
      if (characterDataCoverViewRef) {
        tl.set(characterCoverImageRef.current, {
          cursor: "not-allowed",
          pointerEvents: "none",
          attr: {
            src: prevCharacterCoverImage,
            alt: `UnLoading`,
          },
        })
          .set(charactersNavbarViewDataLoadRef.current, {
            zIndex: 0,
            opacity: 0,
          })
          .to(charactersNavbarViewDataLoadRef.current, {
            duration: 1,
            opacity: 1,
          })
          .call(() => {
            if (isCoverUnwrapped) {
              tl.to(characterDataCoverViewRef.current, {
                visibility: "visible",
                zIndex: 10,
              })
                .to(characterDataCoverViewRef.current, {
                  duration: 1.5,
                  opacity: 1,
                })
                .to(
                  [
                    mainCharDataViewRef.current,
                    characterDataCoverViewRef.current,
                  ],
                  {
                    duration: 1,
                    bottom: "-200%",
                    delay: 1,
                  }
                )
                .set(characterCoverImageRef.current, {
                  attr: {
                    src: characterData.primarchImages.gridImage,
                    alt: characterData.name,
                  },
                })
                .call(() => {
                  setCurrentCharDataView(`videos`);
                  setCurrentCharVideosIndex(0);
                  setCurrentCharWebExcerptsIndex(0);
                  setCurrentCharPhotosIndex(0);
                  setCharacterData(() => {
                    return { ...previousCharacterData };
                  });
                })
                .call(() => {
                  setIsCoverImageChanging(true);
                })
                .call(() => {
                  setIsCoverUnwrapped(false);
                });
            } else {
              tl.set(characterCoverImageRef.current, {
                cursor: "pointer",
                pointerEvents: "none",
              })
                .to(
                  [
                    mainCharDataViewRef.current,
                    characterDataCoverViewRef.current,
                  ],
                  {
                    duration: 1,
                    bottom: "-200%",
                  }
                )
                .set(characterCoverImageRef.current, {
                  attr: {
                    src: characterData.primarchImages.gridImage,
                    alt: characterData.name,
                  },
                })
                .call(() => {
                  setCharacterData(() => {
                    setCurrentCharDataView(`videos`);
                    setCurrentCharVideosIndex(0);
                    setCurrentCharWebExcerptsIndex(0);
                    setCurrentCharPhotosIndex(0);
                    return { ...previousCharacterData };
                  });
                })
                .call(() => {
                  setIsCoverImageChanging(true);
                });
            }
          });
      }
    }
  }, [previousCharacterData]);

  // Handle disabling of buttons on  character data and cover image changes
  React.useEffect(() => {
    $(".characterNavButton").css({
      cursor: "not-allowed",
      "pointer-events": "none",
    });
  }, [previousCharacterData]);

  React.useEffect(() => {
    if (!isCoverImageChanging) {
      $(".characterNavButton").css({
        cursor: "pointer",
        "pointer-events": "auto",
      });
    } else {
      $(".characterNavButton").css({
        cursor: "not-allowed",
        "pointer-events": "none",
      });
    }
  }, [isCoverImageChanging]);

  // Handle main character data view switch
  React.useEffect(() => {
    console.log({
      initialCheckPrevCharDataView: previousCharDataView,
      initialCheckCurCharDataView: currentCharDataView,
    });
    const initiatCharacterDataTransition = () => {
      let gsapSelectedStyle = {};
      const gsapStylesHold = {
        mainCharVideosView: {
          left: "105%",
          visibility: "visible",
        },
        mainCharWebExcerptsView: {
          left: "105%",
          visibility: "visible",
        },
        mainCharPhotosView: {
          left: "105%",
          visibility: "visible",
        },
      };
      const prevCharDataViewToTransit = () => {
        console.log(`clarifying prev character data view`);
        if (previousCharDataView === `videos`) {
          console.log(`pcdv videos`);
          return mainCharVideosViewRef.current;
        } else if (previousCharDataView === `webExcerpts`) {
          console.log(`pcdv excerpts`);
          return mainCharWebExcerptsViewRef.current;
        } else if (previousCharDataView === `photos`) {
          console.log(`pcdv photos`);
          return mainCharPhotosViewRef.current;
        }
      };
      const currentCharDataViewToTransit = () => {
        console.log(`clarifying cur character data view`);
        if (currentCharDataView === `videos`) {
          console.log(`cur view is videos`);
          console.log(mainCharVideosViewRef);
          gsapSelectedStyle = gsapStylesHold.mainCharVideosView;
          return mainCharVideosViewRef.current;
        } else if (currentCharDataView === `webExcerpts`) {
          console.log(`cur view is web excerpts`);
          console.log(mainCharWebExcerptsViewRef.current);
          gsapSelectedStyle = gsapStylesHold.mainCharWebExcerptsView;
          return mainCharWebExcerptsViewRef.current;
        } else if (currentCharDataView === `photos`) {
          console.log(`cur view is photos`);
          console.log(mainCharPhotosViewRef.current);
          gsapSelectedStyle = gsapStylesHold.mainCharPhotosView;
          return mainCharPhotosViewRef.current;
        }
      };

      const clarifiedPrevCharView = prevCharDataViewToTransit();
      const clarifiedCurCharView = currentCharDataViewToTransit();
      console.log({ gsapSelectedStyle });
      gsapTimelineRef.current = gsap
        .timeline()
        .set(clarifiedCurCharView, {
          css: gsapSelectedStyle,
        })
        .to(clarifiedCurCharView, { duration: 2, left: "0%" })
        .fromTo(
          clarifiedPrevCharView,
          {
            left: "0%",
          },
          {
            duration: 2,
            left: "-105%",
            delay: -2,
          }
        )
        .call(() => {
          if (clarifiedPrevCharView) {
            clarifiedPrevCharView.style.left = "105%";
          }
          console.log({
            prevCharDataView: previousCharDataView,
            curCharDataView: currentCharDataView,
            prevCharDataRef: clarifiedPrevCharView?.style,
            curCharDataRef: clarifiedCurCharView?.style,
          });
          if (currentCharDataView === `videos`) {
            setPreviousCharDataView(`videos`);
          } else if (currentCharDataView === `webExcerpts`) {
            setPreviousCharDataView(`webExcerpts`);
          } else if (currentCharDataView === `photos`) {
            setPreviousCharDataView(`photos`);
          } else {
            setPreviousCharDataView(`videos`);
          }
          setIsCharDataViewChanging(false);
        });
    };
    initiatCharacterDataTransition();
  }, [currentCharDataView]);

  // Handle character data switching buttons on data view change
  React.useEffect(() => {
    if (isCharDataViewChanging) {
      console.log(`disabling char data switch buttons`);
      $(".mainCharSwitchDataViewNavButton").css({
        cursor: "not-allowed",
        "pointer-events": "none",
      });
    } else {
      console.log(`enabling char data switch buttons`);
      $(".mainCharSwitchDataViewNavButton").css({
        cursor: "pointer",
        "pointer-events": "auto",
      });
    }
  }, [isCharDataViewChanging]);

  // Handle component return view
  return (
    <View
      ref={mainDisplayRef}
      style={[styles.mainDisplay, styles.mainDisplaySupport]}
    >
      <div className={styles.mainDisplaySubSupport}>
        <View
          ref={characterDataViewRef}
          style={[styles.characterDataView, styles.characterDataViewSupport]}
        >
          <View
            ref={characterDataCoverViewRef}
            style={[
              styles.characterDataCoverView,
              characterData.name === ``
                ? { backgroundColor: "rgba(0, 0, 0, 1)" }
                : { backgroundColor: "rgba(0, 15, 85, 0.5)" },
            ]}
          >
            <img
              ref={characterCoverImageRef}
              src={prevCharacterCoverImage}
              alt={prevCharacterCoverImageAlt}
              className={styles.characterCoverImage}
              style={
                characterData.name === ``
                  ? {
                      backgroundColor: "rgba(0, 15, 85, 1)",
                      cursor: "not-allowed",
                      pointerEvents: "none",
                    }
                  : { cursor: "pointer", pointerEvents: "auto" }
              }
              onLoad={(event) => {
                let retrievedImageHeight =
                  characterDataCoverViewRef.current.offsetHeight;
                event.currentTarget.height = retrievedImageHeight * 100 * 0.01;
                event.currentTarget.width = retrievedImageHeight * 100 * 0.01;
                if (isCoverImageChanging) {
                  gsap
                    .timeline()
                    .set(characterCoverImageRef.current, {
                      cursor: "pointer",
                      pointerEvents: "auto",
                    })
                    .to(
                      [
                        mainCharDataViewRef.current,
                        characterDataCoverViewRef.current,
                      ],
                      {
                        duration: 4,
                        bottom: "0%",
                        ease: Power3.easeInOut,
                        delay: 0,
                      }
                    )
                    .to(charactersNavbarViewDataLoadRef.current, {
                      duration: 2,
                      opacity: 0,
                    })
                    .set(charactersNavbarViewDataLoadRef.current, {
                      zIndex: -10,
                    });
                  setIsCoverImageChanging(false);
                }
              }}
              onClick={(event) => {
                setIsCoverImageChanging(true);
                gsap
                  .timeline()
                  .to(characterDataCoverViewRef.current, {
                    duration: 3,
                    opacity: 0,
                  })
                  .to(characterDataCoverViewRef.current, {
                    visibility: "hidden",
                    zIndex: 0,
                  })
                  .call(() => {
                    setIsCoverUnwrapped(true);
                    setIsCoverImageChanging(false);
                  });
              }}
            />
          </View>
          <View ref={mainCharDataViewRef} style={styles.mainCharDataView}>
            <View
              ref={mainCharVideosViewRef}
              style={[
                styles.mainCharVideosView,
                styles.mainCharDataViewsSupport,
              ]}
            >
              <ReactPlayer
                width={"100%"}
                height={"100%"}
                controls
                url={characterData.videos[currentCharVideosIndex].link}
                config={{
                  youtube: {
                    playerVars: { start: 0 },
                  },
                }}
                playing={isVideoPlaying}
                onStart={() => {
                  setIsVideoPlaying(() => {
                    return true;
                  });
                  console.log(`React Player has loaded with message: Started`);
                }}
                onPlay={() => {}}
                onPause={() => {
                  setIsVideoPlaying(() => {
                    return false;
                  });
                }}
                onEnded={() => {
                  setIsVideoPlaying(() => {
                    return false;
                  });
                }}
                onProgress={() => {}}
              />
            </View>
            <View
              ref={mainCharWebExcerptsViewRef}
              style={[
                styles.mainCharWebExcerptsView,
                styles.mainCharDataViewsSupport,
              ]}
            >
              <View style={styles.mainCharWebExcerptHeader}>
                <Text style={styles.mainCharWebExcerptTitle}>
                  {characterData.webExcerpts[currentCharWebExcerptsIndex].title}
                </Text>
                <Text style={styles.mainCharWebExcerptReference}>
                  {
                    characterData.webExcerpts[currentCharWebExcerptsIndex]
                      .webCite
                  }
                </Text>
              </View>
              <View
                style={[
                  styles.mainCharWebExcerptContent,
                  styles.mainCharWebExcerptContentSupport,
                ]}
              >
                <div className={styles.mainCharWebExcerptContentSupportv2}>
                  <Text style={styles.mainCharWebExcerpt}>
                    {
                      characterData.webExcerpts[currentCharWebExcerptsIndex]
                        .excerpt
                    }
                  </Text>
                </div>
              </View>
            </View>
            <View
              ref={mainCharPhotosViewRef}
              style={[
                styles.mainCharPhotosView,
                styles.mainCharDataViewsSupport,
              ]}
            >
              <img
                ref={mainCharModelPhotoRef}
                src={
                  characterData.primarchImages.modelImage[
                    currentCharPhotosIndex
                  ]
                }
                alt={`${characterData.name} model`}
                className={styles.mainCharModelPhoto}
                onLoad={(event) => {
                  let trueImageHeight = event.currentTarget.naturalHeight;
                  let trueImageWidth = event.currentTarget.naturalWidth;
                  let sudoImageHeight = event.currentTarget.offsetHeight;
                  let sudoImageWidth = event.currentTarget.offsetWidth;
                  let containerHeight =
                    mainCharPhotosViewRef.current.offsetHeight;
                  let containerWidth =
                    mainCharPhotosViewRef.current.offsetWidth;
                  console.log({
                    TIHv1: trueImageHeight,
                    TIWv1: trueImageWidth,
                    SIHv1: sudoImageHeight,
                    SIWv1: sudoImageWidth,
                    CHv1: containerHeight,
                    CWv1: containerWidth,
                  });
                  if (trueImageHeight > trueImageWidth) {
                    let heightRatio = containerHeight / trueImageHeight;
                    let configgedImageWidth = heightRatio * trueImageWidth;
                    event.currentTarget.height = containerHeight;
                    event.currentTarget.width = configgedImageWidth;
                    if (configgedImageWidth > containerWidth) {
                      let widthRatio = containerWidth / configgedImageWidth;
                      let configgedImageHeight = widthRatio * containerHeight;
                      event.currentTarget.height = configgedImageHeight;
                      event.currentTarget.width = containerWidth;
                    }
                  } else if (trueImageHeight < trueImageWidth) {
                    let widthRatio = containerWidth / trueImageWidth;
                    let configgedImageHeight = widthRatio * trueImageHeight;
                    event.currentTarget.height = configgedImageHeight;
                    event.currentTarget.width = containerWidth;
                    if (configgedImageHeight > containerHeight) {
                      let heightRatio = containerHeight / configgedImageHeight;
                      let configgedImageWidth = heightRatio * containerWidth;
                      event.currentTarget.height = containerHeight;
                      event.currentTarget.width = configgedImageWidth;
                    }
                  } else {
                    event.currentTarget.height = containerHeight;
                    event.currentTarget.width = containerHeight;
                  }
                  console.log({
                    TIHv2: trueImageHeight,
                    TIWv2: trueImageWidth,
                    SIHv2: sudoImageHeight,
                    SIWv2: sudoImageWidth,
                    CHv2: containerHeight,
                    CWv2: containerWidth,
                  });
                }}
              />
            </View>
            <View
              ref={mainCharDataViewNavRef}
              style={styles.mainCharDataViewNav}
            >
              <View style={styles.mainCharSwitchDataViewNav}>
                <button
                  className={styles.mainCharSwitchDataViewNavButton}
                  onClick={(event) => {
                    if (currentCharDataView !== `videos`) {
                      setIsCharDataViewChanging(true);
                      setCurrentCharDataView(`videos`);
                      console.log(`switched data view to videos`);
                    }
                  }}
                >{`VIDEOS`}</button>
                <button
                  className={styles.mainCharSwitchDataViewNavButton}
                  onClick={(event) => {
                    if (currentCharDataView !== `webExcerpts`) {
                      setIsCharDataViewChanging(true);
                      setCurrentCharDataView(`webExcerpts`);
                      console.log(`switched data view to webExcerpts`);
                    }
                  }}
                >{`EXCERPTS`}</button>
                <button
                  className={styles.mainCharSwitchDataViewNavButton}
                  onClick={(event) => {
                    if (currentCharDataView !== `photos`) {
                      setIsCharDataViewChanging(true);
                      setCurrentCharDataView(`photos`);
                      console.log(`switched data view to photos`);
                    }
                  }}
                >{`PHOTOS`}</button>
              </View>
              <View style={styles.mainCharSwitchIndexViewNav}>
                <button
                  className={styles.mainCharSwitchIndexViewNavButton}
                  onClick={() => {
                    if (currentCharDataView === `videos`) {
                      console.log(`switching videos index`);
                      setCurrentCharVideosIndex(() => {
                        if (
                          currentCharVideosIndex <
                          characterData.videos.length - 1
                        ) {
                          return currentCharVideosIndex + 1;
                        } else {
                          return 0;
                        }
                      });
                    } else if (currentCharDataView === `webExcerpts`) {
                      console.log(`switching web excerpts index`);
                      setCurrentCharWebExcerptsIndex(() => {
                        if (
                          currentCharWebExcerptsIndex <
                          characterData.webExcerpts.length - 1
                        ) {
                          return currentCharWebExcerptsIndex + 1;
                        } else {
                          return 0;
                        }
                      });
                    } else if (currentCharDataView === `photos`) {
                      console.log(`switching photos index`);
                      setCurrentCharPhotosIndex(() => {
                        if (
                          currentCharPhotosIndex <
                          characterData.primarchImages.modelImage.length - 1
                        ) {
                          return currentCharPhotosIndex + 1;
                        } else {
                          return 0;
                        }
                      });
                    }
                  }}
                >
                  <img
                    src={require("../../../Media/Icons/expand_less-24px.svg")}
                    alt={`next index`}
                    className={styles.defaultIconStyle}
                  />
                </button>
                <button
                  className={styles.mainCharSwitchIndexViewNavButton}
                  onClick={() => {
                    if (currentCharDataView === `videos`) {
                      console.log(`switching videos index`);
                      setCurrentCharVideosIndex(() => {
                        if (currentCharVideosIndex > 0) {
                          return currentCharVideosIndex - 1;
                        } else {
                          return characterData.videos.length - 1;
                        }
                      });
                    } else if (currentCharDataView === `webExcerpts`) {
                      console.log(`switching web excerpts index`);
                      setCurrentCharWebExcerptsIndex(() => {
                        if (currentCharWebExcerptsIndex > 0) {
                          return currentCharWebExcerptsIndex - 1;
                        } else {
                          return characterData.webExcerpts.length - 1;
                        }
                      });
                    } else if (currentCharDataView === `photos`) {
                      console.log(`switching photos index`);
                      setCurrentCharPhotosIndex(() => {
                        if (currentCharPhotosIndex > 0) {
                          return currentCharPhotosIndex - 1;
                        } else {
                          return (
                            characterData.primarchImages.modelImage.length - 1
                          );
                        }
                      });
                    }
                  }}
                >
                  <img
                    src={require("../../../Media/Icons/expand_more-24px.svg")}
                    alt={`previous index`}
                    className={styles.defaultIconStyle}
                  />
                </button>
              </View>
            </View>
          </View>
        </View>
        <View
          ref={charactersNavBarViewRef}
          style={[
            styles.charactersNavbarView,
            styles.charactersNavbarViewSupport,
          ]}
        >
          <button
            ref={prevCharacterNavButtonRef}
            className={styles.prevCharacterNavButton}
            onClick={(event) => {
              console.log(`clicking`);
              let trueLastCharIndex = charactersQueries.length - 1;
              let tempCharNavButIndexesHold = charactersNavButtonsIndexes.map(
                (characterIndex) => {
                  console.log(`in range`);
                  if (
                    characterIndex > 0 &&
                    characterIndex <= trueLastCharIndex
                  ) {
                    return characterIndex - 1;
                  } else {
                    console.log(`out of range`);
                    return trueLastCharIndex;
                  }
                }
              );
              setCharactersNavButtonsIndexes(tempCharNavButIndexesHold);
            }}
          >
            <img
              src={require("../../../Media/Icons/chevron_left-24px.svg")}
              alt={`view previous character`}
              className={styles.defaultIconStyle}
            />
          </button>
          {charactersNavButtonsIndexes.map((characterIndex) => {
            return charactersNavButtons[characterIndex];
          })}
          <button
            ref={nextCharacterNavButtonRef}
            className={styles.nextCharacterNavButton}
            onClick={(event) => {
              let trueLastCharIndex = charactersQueries.length - 1;
              let tempCharNavButIndexesHold = charactersNavButtonsIndexes.map(
                (characterIndex) => {
                  if (
                    characterIndex < trueLastCharIndex &&
                    characterIndex >= 0
                  ) {
                    return characterIndex + 1;
                  } else {
                    return 0;
                  }
                }
              );
              setCharactersNavButtonsIndexes(tempCharNavButIndexesHold);
            }}
          >
            <img
              src={require("../../../Media/Icons/chevron_right-24px.svg")}
              alt={`view next character`}
              className={styles.defaultIconStyle}
            />
          </button>
          <View
            ref={charactersNavbarViewCoverRef}
            style={styles.charactersNavbarViewCover}
          >
            <div className={styles.charactersNavbarViewCoverImageSupport}>
              <img
                src={
                  "https://th.bing.com/th/id/OIP.3k2-k9G9XbN6f21R-e_CcQHaEQ?pid=Api&rs=1"
                }
                alt={"characters navigation cover"}
                height={"90px"}
                className={styles.charactersNavbarViewCoverImage}
                onLoad={(event) => {
                  let heightRatio = 90 / event.currentTarget.naturalHeight;
                  let configgedImageWidth =
                    heightRatio * event.currentTarget.naturalWidth;
                  event.currentTarget.width = configgedImageWidth;
                }}
                onClick={() => {
                  setIsNavbarUncovered(true);
                }}
              />
            </div>
          </View>
          <View
            ref={charactersNavbarViewDataLoadRef}
            style={styles.charactersNavbarViewDataLoad}
          >
            <div className={styles.charactersNavbarViewDataLoadImageSupport}>
              <img
                src={
                  "https://file.mockplus.com/image/2018/04/5fc8b569-d76f-4d5d-809a-6dc6968e28f7.gif"
                }
                alt={"characters data load"}
                height={"90px"}
                className={styles.charactersNavbarViewDataLoadImage}
                onLoad={(event) => {
                  let heightRatio = 90 / event.currentTarget.naturalHeight;
                  let configgedImageWidth =
                    heightRatio * event.currentTarget.naturalWidth;
                  event.currentTarget.width = configgedImageWidth;
                }}
              />
            </div>
          </View>
        </View>
      </div>
    </View>
  );
};

// Declare stylesheet for react native components
const styles2 = StyleSheet.create({
  mainDisplay: {
    overflow: "hidden",
  },
  mainCharDataView: {
    position: "absolute",
    alignItems: "center",
    width: "100%",
    height: "100%",
    border: "1px solid rgba(231, 201, 169, 1)",
    overflow: "hidden",
  },
  mainCharVideosView: {
    position: "absolute",
    left: "105%",
    width: "100%",
    backgroundColor: "blue",
    border: "1px solid rgba(231, 201, 169, 0.75)",
  },
  mainCharPhotosView: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    left: "105%",
    width: "100%",
    backgroundColor: "black",
    border: "1px solid rgba(231, 201, 169, 0.75)",
    overflow: "hidden",
  },
  mainCharWebExcerptsView: {
    position: "absolute",
    justifyContent: "space-between",
    left: "105%",
    width: "100%",
    backgroundColor: "rgba(31, 0, 51, 1)",
    border: "1px solid rgba(231, 201, 169, 0.75)",
    overflow: "hidden",
  },
  mainCharWebExcerptHeader: {
    paddingTop: 1,
    paddingBottom: 3,
    width: "100%",
    height: "75px",
    justifyContent: "space-evenly",
    alignItems: "center",
    border: "1px solid rgba(231, 201, 169, 1)",
  },
  mainCharWebExcerptContent: {
    width: "100%",
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 5,
    paddingTop: 10,
    border: "1px solid rgba(231, 201, 169, 1)",
  },
  mainCharWebExcerptTitle: {
    color: "rgba(0, 255, 255, 1)",
    textShadowColor: "rgba(112, 128, 144, 0.9)",
    textShadowRadius: 5,
    textAlign: "center",
    fontFamily: "Consolas, monospace",
    fontWeight: "800",
    fontSize: 16,
  },
  mainCharWebExcerptReference: {
    color: "rgba(112, 128, 144, 1)",
    textAlign: "center",
    textShadowColor: "rgba(112, 128, 144, 0.9)",
    textShadowRadius: 5,
    fontFamily: "Consolas, monospace",
    fontWeight: "600",
    fontSize: 14,
  },
  mainCharWebExcerpt: {
    color: "rgba(231, 201, 169, 0.9)",
    textShadowColor: "rgba(0, 15, 85, 1)",
    textShadowRadius: 5,
    fontFamily: "Consolas, monospace",
    fontWeight: "700",
    fontSize: 18,
  },
  mainCharDataViewNav: {
    flexDirection: "row",
    position: "absolute",
    bottom: "0%",
    width: "100%",
    height: "50px",
    border: "1px solid rgba(231, 201, 169, 0.75)",
  },
  mainCharSwitchDataViewNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
    height: "100%",
    border: "1px solid rgba(231, 201, 169, 0.75)",
  },
  mainCharSwitchIndexViewNav: {
    width: "50%",
    height: "100%",
    border: "1px solid rgba(231, 201, 169, 0.75)",
  },
  characterDataView: {
    width: "100%",
    border: "1px solid rgba(231, 201, 169, 1)",
  },
  characterDataCoverView: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(231, 201, 169, 1)",
    zIndex: 10,
    overflow: "hidden",
  },
  charactersNavbarView: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    border: "1px solid rgba(1, 4, 106, 0.9)",
  },
  charactersNavbarViewCover: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(112, 128, 144, 0.75)",
    border: "1px, solid orange",
  },
  charactersNavbarViewDataLoad: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    border: "1px, solid rgba(0, 15, 85, 0.75)",
    zIndex: -10,
  },
  charactersNavbarViewCoverText: {
    width: "100%",
    height: "100%",
    textAlign: "center",
  },
  genericText: { color: "rgba(231, 201, 169, 1)", textAlign: "center" },
});

export default CharacterData;
