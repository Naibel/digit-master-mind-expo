import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { buttonStyle } from "../../styles/buttons";

const RetryButton = ({ navigation }: { navigation: any }) => {
  return (
    <View>
      <TouchableOpacity
        style={[
          buttonStyle.button,
          buttonStyle.light,
          buttonStyle.shadow,
          buttonStyle.flexRow,
        ]}
        onPress={() =>
          navigation.navigate("Home", {
            startNewGame: true,
          })
        }
      >
        <Image
          style={{ marginRight: 10 }}
          source={require("../../assets/images/refresh.png")}
        />
        <Text style={[buttonStyle.lightText, buttonStyle.text]}>
          On refait une partie ?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RetryButton;
