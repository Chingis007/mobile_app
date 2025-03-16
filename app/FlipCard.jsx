import React, { FC } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import Animated, {
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const FlipCard = (props) => {
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
  return (
    <>
      <TouchableOpacity onPress={animate} style={styles.cardContainer}>
        <Animated.View
          style={[
            frontStyle,
            styles.card,
            {
              backgroundColor: "red",
            },
          ]}
        >
          <Text className="flex flex-column">{props.word1}</Text>
        </Animated.View>
        <Animated.View
          style={[
            backStyle,
            styles.card,
            {
              backgroundColor: "blue",
            },
          ]}
        >
          <Text className="flex flex-column">{props.word2}</Text>
        </Animated.View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
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

export default FlipCard;
