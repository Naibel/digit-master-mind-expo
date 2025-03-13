import React, { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, ScrollView } from "react-native";
import {
  collection,
  getDocs,
  getFirestore,
} from "@react-native-firebase/firestore";

import { buttonStyle } from "@/styles/buttons";
import { textStyle } from "@/styles/text";
import Modal, { ModalProps } from "@/components/Modal";
import { router } from "expo-router";

const JoinGameModal = ({ visible, onClose }: ModalProps) => {
  const db = getFirestore();
  const [openGames, setOpenGames] = useState<any[]>([]);

  const getCurrentGames = useCallback(async () => {
    const gamesSnapshot = await getDocs(collection(db, "games"));
    gamesSnapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        console.log("New game: ", change.doc.id, change.doc.data());
        change.doc.data().isOpen &&
          setOpenGames([
            {
              id: change.doc.id,
              ...change.doc.data(),
            },
            ...openGames,
          ]);
      }
      if (change.type === "modified") {
        console.log("Modified game: ", change.doc.id, change.doc.data());
        !change.doc.data().isOpen &&
          setOpenGames(openGames.filter((game) => game.id !== change.doc.id));
      }
      if (change.type === "removed") {
        console.log("Removed game: ", change.doc.id, change.doc.data());
        setOpenGames(openGames.filter((game) => game.id !== change.doc.id));
      }
    });
  }, []);

  useEffect(() => {
    getCurrentGames();
  }, []);

  return (
    <Modal visible={visible} onClose={onClose}>
      {openGames && openGames.length > 0 ? (
        <>
          <Text style={textStyle.modalTitle}>
            Choisis la partie à rejoindre
          </Text>
          <ScrollView>
            {openGames.map((game, index) => (
              <TouchableOpacity
                key={index + game.id}
                style={[
                  buttonStyle.button,
                  buttonStyle.dark,
                  { marginBottom: 20 },
                ]}
                onPress={() => {
                  router.push({
                    pathname: "/game/[id]",
                    params: {
                      id: game.id,
                      mode: "join",
                    },
                  });
                  onClose();
                }}
              >
                <Text style={[buttonStyle.whiteText, buttonStyle.text]}>
                  Partie N°{index + 1}
                </Text>
                <Text style={[buttonStyle.whiteText, buttonStyle.smallText]}>
                  Id : {game.id}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      ) : (
        <>
          <Text style={textStyle.modalTitle}>
            Aucune partie en cours pour le moment.
          </Text>
          <Text style={textStyle.h6}>
            (Bon, faut en créer une, maintenant !)
          </Text>
        </>
      )}
    </Modal>
  );
};

export default JoinGameModal;
