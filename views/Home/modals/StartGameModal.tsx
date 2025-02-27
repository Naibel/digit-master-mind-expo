import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import firestore from "@react-native-firebase/firestore";

import { buttonStyle } from "@/styles/buttons";
import { textStyle } from "@/styles/text";
import checkDigit from "@/utils/checkDigit";
import DigitInput from "@/components/DigitInput";
import Modal from "@/components/Modal";

export type StartGameModalProps = {
  navigation?: any;
  visible: boolean;
  onClose: () => void;
  onPress: () => void;
};

export type UserBStartGameModalProps = StartGameModalProps & {
  route: any;
};

const StartGameModal = ({ visible, onClose, onPress }: StartGameModalProps) => {
  const [value, setValue] = useState<string>("");
  const isDisabled = value.length < 4;

  const onChange = (newDigit: string) => {
    checkDigit(newDigit, value, () => {
      setValue(newDigit);
    });
  };

  const onModalClose = () => {
    setValue("");
    onClose();
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <Text style={textStyle.modalTitle}>
        Allez hop ! Donnez-nous votre numéro secret !
      </Text>
      <DigitInput digit={value} onDigitChange={onChange} />
      <View style={{ marginVertical: 20 }}>
        <Text style={textStyle.h6}>
          1. Choisissez un nombre à quatres chiffres.
        </Text>
        <Text style={textStyle.h6}>2. Tous les chiffres sont uniques.</Text>
        <Text style={textStyle.h6}>
          3. Le nombre ne doit pas commencer par zéro.
        </Text>
      </View>
      <View style={{ flex: 1 }} />
      <TouchableOpacity
        style={[
          buttonStyle.button,
          buttonStyle.dark,
          isDisabled && buttonStyle.disabled,
        ]}
        disabled={isDisabled}
        onPress={onPress}
      >
        <Text style={[buttonStyle.text, buttonStyle.whiteText]}>
          On commence !
        </Text>
      </TouchableOpacity>
    </Modal>
  );
};

// export const UserAStartGameModal = ({
//   navigation,
//   onClose,
//   visible,
// }: StartGameModalProps) => {
//   const [value, setValue] = useState<string>("");

//   const games = firestore().collection("games");

//   const onPress = () => {
//     games
//       .add({
//         isOpen: true,
//         a_digit: value,
//       })
//       .then((docRef) => {
//         navigation.navigate("GameScreen", {
//           id: docRef.id,
//           mode: "start",
//         });
//         console.log(docRef.id);
//         onClose();
//       })
//       .catch((error) => console.error("Error adding Tutorial: ", error));
//   };

//   return (
//     <StartGameModal
//       visible={visible}
//       onClose={onModalClose}
//       onPress={onPress}
//     />
//   );
// };

// export const UserBStartGameModal = ({
//   route,
//   navigation,
//   visible,
//   onClose,
// }: UserBStartGameModalProps) => {
//   const { id } = route.params;

//   const games = firestore().collection("games");

//   const [value, setValue] = useState<string>("");

//   const onChange = (newDigit: string) => {
//     checkDigit(newDigit, value, () => {
//       setValue(newDigit);
//     });
//   };

//   //Only when joining a game
//   const onPress = () => {
//     games.doc(id).update({
//       isOpen: false,
//       b_digit: value,
//     });
//     onClose();
//   };

//   const onModalClose = () => {
//     setValue("");
//     onClose();
//     navigation.goBack();
//   };

//   return (
//     <StartGameModal
//       visible={visible}
//       onClose={onModalClose}
//       onPress={onPress}
//     />
//   );
// };

export default StartGameModal;
