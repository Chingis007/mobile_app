import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import cloneDeep from "lodash/cloneDeep";
import {
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Dimensions, StyleSheet, TextInput } from "react-native";
import Swiper from "react-native-swiper";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useRef, FC } from "react";
import { images } from "../constants";
import { CustomButton, Loader } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
  Directions,
} from "react-native-gesture-handler";
import Animated, {
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  runOnUI,
} from "react-native-reanimated";
import FlipCard from "../app/FlipCard";

// const onSwipePerformed = (action) => {
//   switch (action) {
//     case "left":
//       onSwipeLeft();
//       break;
//     case "right":
//       onSwipeRight();
//       break;
//   }
// };
const { width } = Dimensions.get("screen");

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}
const Welcome = () => {
  const rotationF = useSharedValue(0);
  const rotationB = useSharedValue(180);
  const frontStyle = useAnimatedStyle(() => {
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotationF.value}deg` }],
    };
  });
  const backStyle = useAnimatedStyle(() => {
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotationB.value}deg` }],
    };
  });
  const flipStyle = StyleSheet.create({
    cardContainer: {
      width: "100%",
      height: "100%",
      backgroundColor: "transparent",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    card: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backfaceVisibility: "hidden",
      justifyContent: "center",
      alignItems: "center",
    },
    pressBtn: {
      width: 100,
      height: 50,
      backgroundColor: "#f1f1f1",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#ccc",
    },
  });
  const onAnimate = () => {
    "worklet";
    if (rotationF.value === 180) {
      rotationF.value = withTiming(0, { duration: 1000 });
      rotationB.value = withTiming(180, { duration: 1000 });
      return;
    }
    rotationF.value = withTiming(180, { duration: 1000 });
    rotationB.value = withTiming(360, { duration: 1000 });
  };
  const animate = () => {
    runOnUI(onAnimate)();
  };
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  const [wordsArray, setWordsArray] = useState([
    {
      id: 0,
      arr: [
        { lang1: "ukr", word1: "Привіт", lang2: "eng", word2: "Hello" },
        { lang1: "ukr", word1: "Слон", lang2: "eng", word2: "Elephant" },
        { lang1: "ukr", word1: "Слон", lang2: "eng", word2: "Elephant" },
        { lang1: "ukr", word1: "Слон", lang2: "eng", word2: "Elephant" },
      ],
    },
    {
      id: 1,
      arr: [
        { lang1: "ukr", word1: "Бувай", lang2: "eng", word2: "Bye" },
        { lang1: "ukr", word1: "Бувай", lang2: "eng", word2: "Bye" },
      ],
    },
  ]);
  const [addNew, setAddNew] = useState(false);
  const [selected, setSelected] = useState();
  const [defL1, setDefL1] = useState("ukr");
  const [defL2, setDefL2] = useState("eng");
  const [newTranslation, setNewTranslation] = useState("");
  const [newWord, setNewWord] = useState("");
  const [currentLookingArray, setCurrentLookingArray] = useState();
  const [currentNewWordsArray, setCurrentNewWordsArray] = useState();
  let key = 0;
  let key1 = 0;
  const translateX = useSharedValue(0);
  const startTranslateX = useSharedValue(0);

  const fling = Gesture.Fling()
    .direction(Directions.LEFT | Directions.RIGHT)
    .onBegin((event) => {
      startTranslateX.value = event.x;
    })
    .onStart((event) => {
      // console.log(startTranslateX.value);
      // console.log(translateX.value);
      // console.log(event.x);
      // console.log(width);
      if (startTranslateX.value > event.x) {
        translateX.value = translateX.value - width;
      } else {
        translateX.value = translateX.value + width;
      }
      // translateX.value =
      // withTiming(
      //   clamp(
      //     translateX.value + event.x - startTranslateX.value,
      //     width / -2 + 50,
      //     width / 2 - 50
      //   ),
      //   { duration: 200 }
      // );
    })
    .runOnJS(true);
  const boxAnimatedStyles = useAnimatedStyle(() => ({
    left: translateX.value,
  }));
  // const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     alignItems: "center",
  //     justifyContent: "center",
  //   },
  //   box: {
  //     position: "absolute",
  //     width: "100%",
  //     height: "100%",
  //     borderRadius: 20,
  //     backgroundColor: "#b58df1",
  //     cursor: "grab",
  //     flexDirection: "row",
  //     transition: "all 1s",
  //   },
  // });
  // const flipAnimation = useRef(new Animated.Value(0)).current;

  // const startAnimation = () => {
  //   Animated.timing(flipAnimation, {
  //     toValue: 1,
  //     duration: 1000, // adjust the duration as needed
  //     useNativeDriver: true,
  //   }).start(() => {
  //     // Reset animation after it's done
  //     flipAnimation.setValue(0);
  //   });
  // };

  // const interpolatedRotateAnimation = flipAnimation.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ["0deg", "180deg"],
  // });
  // const flipStyle = StyleSheet.create({
  //   flipCard: {
  //     width: "50%",
  //     height: "50%",
  //     borderRadius: 10,
  //     backfaceVisibility: "hidden",
  //     position: "absolute",
  //   },
  //   flipCardFront: {
  //     perspective: 1000,
  //     justifyContent: "center",
  //     alignItems: "center",
  //     backgroundColor: "#f00",
  //   },
  //   flipCardBack: {
  //     perspective: 1000,
  //     backgroundColor: "#00f",
  //     justifyContent: "center",
  //     alignItems: "center",
  //     // transform: [{ rotateY: "180deg" }],
  //   },
  // });
  // const flipStyle = StyleSheet.create({
  //                     .flipcard.flipped {
  //                     transform: rotatey(-180deg);
  //                     -moz-transform: rotatey(-180deg);
  //                     -webkit-transform: rotatey(-180deg);
  //                 }
  //                 .flipcard .face {
  //                     padding: 1em;
  //                     text-align: center;
  //                     backface-visibility: hidden;
  //                     -moz-backface-visibility: hidden;
  //                     -webkit-backface-visibility: hidden;
  //                 }
  //                 .flipcard .front {
  //                     background: #220000;
  //                     color: white;
  //                     display: block; /* added to fix the problem */
  //                 }
  //                 .flipcard.flipped .front {
  //                     display:none; /* added to fix the problem */
  //                 }
  //                 .flipcard .back {
  //                     background: #66eeff;
  //                     color: black;
  //                     transform: rotateY(180deg);
  //                     -moz-transform: rotateY(180deg);
  //                     -webkit-transform: rotateY(180deg);
  //                     display:none; /* added to fix the problem */
  //                 }
  //                 .flipcard.flipped .back {
  //                     display:block; /* added to fix the problem */
  //                 }
  //                 //     .flipcard.flipped {
  //                 //     transform: rotatey(-180deg);
  //                 //     -moz-transform: rotatey(-180deg);
  //                 //     -webkit-transform: rotatey(-180deg);
  //                 // }
  //                 // .flipcard .face {
  //                 //     padding: 1em;
  //                 //     text-align: center;
  //                 //     backface-visibility: hidden;
  //                 //     -moz-backface-visibility: hidden;
  //                 //     -webkit-backface-visibility: hidden;
  //                 // }
  //                 // .flipcard .front {
  //                 //     background: #220000;
  //                 //     color: white;
  //                 //     display: block; /* added to fix the problem */
  //                 // }
  //                 // .flipcard.flipped .front {
  //                 //     display:none; /* added to fix the problem */
  //                 // }
  //                 // .flipcard .back {
  //                 //     background: #66eeff;
  //                 //     color: black;
  //                 //     transform: rotateY(180deg);
  //                 //     -moz-transform: rotateY(180deg);
  //                 //     -webkit-transform: rotateY(180deg);
  //                 //     display:none; /* added to fix the problem */
  //                 // }
  //                 // .flipcard.flipped .back {
  //                 //     display:block; /* added to fix the problem */
  //                 // }
  // });

  return (
    <SafeAreaView className="h-full bg-[#161622]">
      <Loader isLoading={loading} />

      {/* <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      > */}
      <GestureHandlerRootView className="w-full flex justify-start items-start h-full p-[2px] ">
        <View className="w-full flex justify-start items-start h-[15vh] flex-row mb-[5px]">
          <TouchableOpacity
            className={`w-[22vw] h-full justify-center items-center border-2 bg-[#4e334d] border-[#964f64] rounded mr-[5px] ${
              addNew ? "border-[#fab260]" : "border-[#964f64]"
            }`}
            onPress={() => {
              setSelected();
              setAddNew(!addNew);
              setCurrentLookingArray();
              if (currentNewWordsArray) {
                setCurrentNewWordsArray();
              } else {
                setCurrentNewWordsArray({
                  id: 0,
                  arr: [{ add: true }],
                });
              }
            }}
          >
            <Text className="text-black">+</Text>
          </TouchableOpacity>

          <ScrollView horizontal={true} className="h-full">
            <View className="w-full flex-row h-full">
              {[...wordsArray].reverse().map((word) => {
                return (
                  <TouchableOpacity
                    className={`w-[22vw] h-full justify-center items-center bg-[#4e334d] border-2 rounded mr-[5px] ${
                      selected == word.id
                        ? "border-[#fab260]"
                        : "border-[#964f64]"
                    }`}
                    onPress={() => {
                      if (currentLookingArray) {
                        if (currentLookingArray.id == wordsArray[word.id].id) {
                          setCurrentLookingArray(undefined);
                          setSelected(undefined);
                        } else {
                          if (
                            currentNewWordsArray &&
                            currentNewWordsArray.length >= 1
                          ) {
                          }
                          let arr = cloneDeep(wordsArray[word.id]);
                          arr.arr.push({ add: true });
                          setCurrentLookingArray(arr);
                          setSelected(word.id);
                          setCurrentNewWordsArray();
                          setAddNew(false);

                          setNewWord();
                          setNewTranslation();
                        }
                      } else {
                        let arr = cloneDeep(wordsArray[word.id]);
                        arr.arr.push({ add: true });
                        setCurrentLookingArray(arr);
                        setSelected(word.id);
                        setCurrentNewWordsArray();
                        setAddNew(false);

                        setNewWord();
                        setNewTranslation();
                      }
                    }}
                    key={word.id}
                  >
                    <Text className="text-black ">
                      {word.arr[0] ? word.arr[0].word1 : undefined}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
        {currentNewWordsArray ? (
          <Swiper
            showsButtons={false}
            loop={false}
            showsPagination={true}
            style={{
              backgroundColor: "#4e334d",
              borderColor: "#964f64",
            }}
          >
            {currentNewWordsArray.arr.map((word) => {
              if (word.add) {
                return (
                  <TouchableOpacity
                    key={key1++}
                    className="w-[99vw] h-full justify-center border-2 border-[#964f64] items-center"
                    onPress={() => {}}
                  >
                    <View className="w-full h-full justify-center items-center">
                      <TextInput
                        className="text-3xl w-[99vw] h-[50%] placeholder: text-center"
                        placeholder="[ Word ]"
                        selectionColor={"#d57867"}
                        onChangeText={(newWord) => {
                          setNewWord(newWord);
                        }}
                        onSubmitEditing={() => {
                          if (newWord && newTranslation) {
                            if (currentNewWordsArray.arr[0].add) {
                              setSelected(wordsArray.length);
                              setCurrentLookingArray({
                                id: wordsArray.length,
                                arr: [
                                  {
                                    lang1: defL1,
                                    word1: newWord,
                                    lang2: defL2,
                                    word2: newTranslation,
                                  },
                                  { add: true },
                                ],
                              });
                              let old = [...wordsArray];
                              old.push({
                                id: wordsArray.length,
                                arr: [
                                  {
                                    lang1: defL1,
                                    word1: newWord,
                                    lang2: defL2,
                                    word2: newTranslation,
                                  },
                                ],
                              });
                              setWordsArray(old);
                              setCurrentNewWordsArray();
                              setNewWord();
                              setNewTranslation();
                            }
                            // Alert.alert("New word", `${newText}`, [
                            //   {
                            //     text: "Understood",
                            //     onPress: () => console.log("Alert closed"),
                            //   },
                            // ]);
                          }
                        }}
                      ></TextInput>
                      <TextInput
                        className="text-3xl w-[99vw] h-[50%] placeholder: text-center"
                        placeholder="[ Translation ]"
                        selectionColor={"#d57867"}
                        onChangeText={(newTranslation) =>
                          setNewTranslation(newTranslation)
                        }
                        onSubmitEditing={() => {
                          if (newWord && newTranslation) {
                            if (currentNewWordsArray.arr[0].add) {
                              setSelected(wordsArray.length);
                              setCurrentLookingArray({
                                id: wordsArray.length,
                                arr: [
                                  {
                                    lang1: defL1,
                                    word1: newWord,
                                    lang2: defL2,
                                    word2: newTranslation,
                                  },
                                  { add: true },
                                ],
                              });
                              let old = [...wordsArray];
                              old.push({
                                id: wordsArray.length,
                                arr: [
                                  {
                                    lang1: defL1,
                                    word1: newWord,
                                    lang2: defL2,
                                    word2: newTranslation,
                                  },
                                ],
                              });
                              setWordsArray(old);
                              setCurrentNewWordsArray();
                              setNewWord();
                              setNewTranslation();
                            }
                            // Alert.alert("New word", `${newWord}`, [
                            //   {
                            //     text: "Understood",
                            //     onPress: () => console.log("Alert closed"),
                            //   },
                            // ]);
                          }
                        }}
                      ></TextInput>
                    </View>
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    key={key1++}
                    className="w-[99vw] h-full justify-center border-2 border-[#964f64] items-center"
                    onPress={() => {}}
                  >
                    <View className="w-full h-full justify-center items-center">
                      <Text className="flex flex-column">
                        {word.word1}
                        {word.word2}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }
            })}
          </Swiper>
        ) : currentLookingArray ? (
          <Swiper
            showsButtons={false}
            loop={false}
            showsPagination={true}
            style={{
              backgroundColor: "#4e334d",
              borderColor: "#964f64",
            }}
          >
            {currentLookingArray.arr.map((word) => {
              if (word.add) {
                return (
                  <TouchableOpacity
                    key={key1++}
                    className="w-[99vw] h-full justify-center border-2  border-[#964f64] items-center"
                    onPress={() => {}}
                  >
                    <View className="w-full h-full justify-center items-center gap-20">
                      <TextInput
                        className="text-3xl w-[80vw] h-[20%] border-[1px] rounded-lg placeholder: text-center"
                        placeholder="[ Word ]"
                        selectionColor={"#d57867"}
                        onChangeText={(newWord) => {
                          setNewWord(newWord);
                        }}
                        onSubmitEditing={() => {
                          if (newWord && newTranslation) {
                            let old = [...wordsArray];
                            old[selected].arr.push({
                              lang1: defL1,
                              word1: newWord,
                              lang2: defL2,
                              word2: newTranslation,
                            });
                            setWordsArray(old);
                            let oldCurr = { ...currentLookingArray };
                            oldCurr.arr.pop();
                            oldCurr.arr.push({
                              lang1: defL1,
                              word1: newWord,
                              lang2: defL2,
                              word2: newTranslation,
                            });
                            oldCurr.arr.push({ add: true });
                            setCurrentLookingArray(oldCurr);
                            setNewWord();
                            setNewTranslation();
                            // Alert.alert("New word", `${newText}`, [
                            //   {
                            //     text: "Understood",
                            //     onPress: () => console.log("Alert closed"),
                            //   },
                            // ]);
                          }
                        }}
                      ></TextInput>
                      <TextInput
                        className="text-3xl w-[80vw] h-[20%] border-[1px] rounded-lg placeholder: text-center"
                        placeholder="[ Translation ]"
                        selectionColor={"#d57867"}
                        onChangeText={(newTranslation) => {
                          setNewTranslation(newTranslation);
                        }}
                        onSubmitEditing={() => {
                          if (newWord && newTranslation) {
                            let old = [...wordsArray];
                            old[selected].arr.push({
                              lang1: defL1,
                              word1: newWord,
                              lang2: defL2,
                              word2: newTranslation,
                            });
                            setWordsArray(old);
                            let oldCurr = { ...currentLookingArray };
                            oldCurr.arr.pop();
                            oldCurr.arr.push({
                              lang1: defL1,
                              word1: newWord,
                              lang2: defL2,
                              word2: newTranslation,
                            });
                            oldCurr.arr.push({ add: true });
                            setCurrentLookingArray(oldCurr);
                            setNewWord();
                            setNewTranslation();
                            // Alert.alert("New word", `${newText}`, [
                            //   {
                            //     text: "Understood",
                            //     onPress: () => console.log("Alert closed"),
                            //   },
                            // ]);
                          }
                        }}
                      ></TextInput>
                    </View>
                  </TouchableOpacity>
                );
              } else {
                return (
                  <FlipCard word1={word.word1} word2={word.word2} />
                  // <TouchableOpacity
                  //   key={key1++}
                  //   className={`w-[99vw] h-full justify-center border-2 border-[#964f64] items-center `}
                  //   // style={`${flipThis == key1 ? flip : undefined}`}
                  //   onPress={() => {
                  //     // startAnimation();
                  //     animate();
                  //     // if (flipThis) {
                  //     //   setFlipThis(key1)
                  //     // }else{
                  //     //   setFlipThis()
                  //     // }
                  //   }}
                  // >
                  // {/* <View style={flipStyle.cardContainer}>
                  //   <Animated.View
                  //     style={[
                  //       frontStyle,
                  //       flipStyle.card,
                  //       {
                  //         backgroundColor: "red",
                  //       },
                  //     ]}
                  //   >
                  //     <Text className="flex flex-column">{word.word1}</Text>
                  //   </Animated.View>
                  //   <Animated.View
                  //     style={[
                  //       backStyle,
                  //       flipStyle.card,
                  //       {
                  //         backgroundColor: "blue",
                  //       },
                  //     ]}
                  //   >
                  //     <Text className="flex flex-column">{word.word2}</Text>
                  //   </Animated.View>
                  // </View> */}
                  //   {/*
                  //   <Animated.View
                  //     className="w-full h-full justify-center items-center"
                  //     style={{
                  //       perspective: "1000",
                  //       transform: [{ rotateY: interpolatedRotateAnimation }],
                  //       position: "relative",
                  //     }}
                  //   >
                  //     <View
                  //       style={[flipStyle.flipCard, flipStyle.flipCardFront]}
                  //     >
                  //       <Text className="flex flex-column">{word.word1}</Text>
                  //     </View>
                  //     <View
                  //       style={
                  //         {
                  //           transform: [
                  //             { rotateY: interpolatedRotateAnimation },
                  //           ],
                  //         }[(flipStyle.flipCard, flipStyle.flipCardBack)]
                  //       }
                  //     >
                  //       <Text className="flex flex-column">{word.word2}</Text>
                  //     </View>
                  //   </Animated.View> */}
                  // {/* </TouchableOpacity> */}
                );
              }
            })}
          </Swiper>
        ) : // <View className="h-[83vh] w-[99vw] border-2 rounded">
        //   <GestureDetector gesture={fling}>
        //     <Animated.View style={[styles.box, boxAnimatedStyles]}>

        //     </Animated.View>
        //   </GestureDetector>
        // </View>
        undefined}
      </GestureHandlerRootView>
      {/* <View className="w-full flex justify-center items-center h-full px-4">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />

          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[298px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless{"\n"}
              Possibilities with{" "}
              <Text className="text-secondary-200">Aora</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Where Creativity Meets Innovation: Embark on a Journey of Limitless
            Exploration with Aora
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View> */}
      {/* </ScrollView> */}

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;
