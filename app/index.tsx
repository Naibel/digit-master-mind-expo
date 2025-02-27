import React, { useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";

import GradientBackground from "@/components/GradientBackground";
import HomeModals from "../views/Home/HomeModals";
import HomeButtons from "../views/Home/HomeButtons";

export type ModalType = "start" | "join" | "help" | null;

const HomeScreen = () => {
  const [modalOpened, setModalOpened] = useState<ModalType>(null);

  const route = useRoute<any>();

  useEffect(() => {
    if (route?.params?.startNewGame) {
      setModalOpened("start");
    }
  }, [route]);

  return (
    <GradientBackground>
      <HomeModals
        onClose={() => setModalOpened(null)}
        modalOpened={modalOpened}
      />
      <View style={styles.menu}>
        {/* HAUT DE LA PAGE */}
        <ImageBackground
          style={{ flex: 1, justifyContent: "center" }}
          source={require("../assets/images/clouds.png")}
        >
          <Image
            style={{
              width: 318,
              height: 214,
              alignSelf: "center",
            }}
            source={require("../assets/images/logo.png")}
          />
        </ImageBackground>
        {/* BAS DE LA PAGE */}
        <ImageBackground
          style={{ flex: 1.5, justifyContent: "flex-end", padding: 20 }}
          source={require("../assets/images/grass_bg_high.png")}
          resizeMode="cover"
        >
          <HomeButtons onPress={(value: ModalType) => setModalOpened(value)} />
          <View>
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontFamily: "AutourOne-Regular",
                marginTop: 40,
              }}
            >
              2022-2024 by Chawki & Dorian
            </Text>
          </View>
        </ImageBackground>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  menu: {
    paddingVertical: 10,
    flex: 1,
    justifyContent: "space-around",
    alignItems: "stretch",
    alignContent: "center",
  },
});

export default HomeScreen;
