import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  addDoc,
  collection,
  getFirestore,
} from "@react-native-firebase/firestore";

import { buttonStyle } from "@/styles/buttons";
import { textStyle } from "@/styles/text";
import checkDigit from "@/utils/checkDigit";
import Modal from "@/components/Modal";
import DigitInput from "@/components/DigitInput";
import { router } from "expo-router";

export type UserAStartGameModalProps = {
  visible: boolean;
  onClose: () => void;
};

const UserAStartGameModal = ({
  visible,
  onClose,
}: UserAStartGameModalProps) => {
  const [value, setValue] = useState<string>("");
  const isDisabled = value.length < 4;

  const onPress = async () => {
    const db = getFirestore();

    try {
      const docRef = await addDoc(collection(db, "games"), {
        isOpen: true,
        a_digit: value,
      });

      router.push({
        pathname: "/game/[id]",
        params: { id: docRef.id, mode: "start" },
      });
      console.log(docRef.id);
      onClose();
    } catch (error) {
      console.error("Error adding Document: ", error);
    }
  };

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
    <Modal visible={visible} onClose={onModalClose}>
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

export default UserAStartGameModal;
