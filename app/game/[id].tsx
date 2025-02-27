import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import firestore from "@react-native-firebase/firestore";

import usePlay from "../../hooks/usePlay";
import { UserBStartGameModal } from "../../views/Home/modals";
import { SuccessEndScreen } from "../../views/GameScreen/SuccessEndScreen";
import { Attempts } from "../../views/GameScreen/Attempts";
import { FailureEndScreen } from "../../views/GameScreen/FailureEndScreen";
import checkDigit from "../../utils/checkDigit";
import RetryButton from "../../views/GameScreen/RetryButton";
import GradientBackground from "@/components/GradientBackground";
import DigitInput from "@/components/DigitInput";
import Keyboard from "@/components/Keyboard";

const GameScreen = ({ route, navigation }: any) => {
  const { play } = usePlay();

  const [finished, setFinished] = useState<boolean>(false);
  const [timeleft, setTimeleft] = useState<number>(10);
  const [turn, setTurn] = useState<string>("");
  const [attempt, setAttempt] = useState<string>("");
  const [currentGame, setCurrentGame] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const games = firestore().collection("games");
  const { id, mode } = route.params;

  const notYourTurn =
    (mode === "join" && turn === "a") || (mode === "start" && turn === "b");
  const yourTurn =
    (mode === "start" && turn === "a") || (mode === "join" && turn === "b");
  const isDisabled = attempt.length !== 4 || finished || notYourTurn;
  const hasUserWon =
    (mode === "start" && currentGame.a_win) ||
    (mode === "join" && currentGame.b_win);
  const adversaryNumber =
    mode === "start" ? currentGame.b_digit : currentGame.a_digit;

  const startTurn = () => {
    const timer = setInterval(() => {
      if (turn === (mode === "join" ? "a" : "b")) {
        setTimeleft(0);
        clearInterval(timer);
        return;
      }
      const newCount = timeleft - 1;
      setTimeleft(newCount >= 0 ? newCount : 0);
      console.log("tt ", timeleft);
      if (timeleft === 0) {
        games.doc(id).update({ turn: mode === "join" ? "a" : "b" });
        clearInterval(timer);
      }
    }, 1000);
  };

  useEffect(() => {
    console.log("turn => ", turn);

    if (turn === (mode === "join" ? "b" : "a")) {
      setTimeleft(10);
      startTurn();
    }
  }, [turn]);

  useEffect(() => {
    let unsubscribe = games.doc(id).onSnapshot((doc) => {
      mode === "join" && doc.data()?.isOpen && setIsModalOpen(true);

      setCurrentGame(doc.data());

      if (mode === "join") {
        if (!doc.data()?.b_attempts) {
          games.doc(id).update({
            b_attempts: [],
          });
        }
      } else if (mode === "start") {
        if (!doc.data()?.a_attempts) {
          games.doc(id).update({
            a_attempts: [],
          });
        }
      }

      setTurn(doc.data()?.turn);
      setFinished(doc.data()?.finished);
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAttempt = () => {
    if (mode === "join") {
      games
        .doc(id)
        .update({
          b_attempts: [
            ...currentGame.b_attempts,
            {
              ...play(attempt, currentGame.a_digit),
              attempt,
            },
          ],
          finished: attempt.toString() === currentGame.a_digit.toString(),
          b_win: attempt.toString() === currentGame.a_digit.toString(),
          turn: "a",
        })
        .then(() => {
          setAttempt("");
          setTimeleft(10);
        });
    } else {
      games
        .doc(id)
        .update({
          a_attempts: [
            ...currentGame.a_attempts,
            {
              ...play(attempt, currentGame.b_digit),
              attempt,
            },
          ],
          finished: attempt.toString() === currentGame.b_digit.toString(),
          a_win: attempt.toString() === currentGame.b_digit.toString(),
          turn: "b",
        })
        .then(() => {
          setAttempt("");
          setTimeleft(10);
        });
    }
  };

  const getTurnMessage = () => {
    if (notYourTurn) return "C'est le tour de l'autre !";
    if (yourTurn) return "C'est ton tour !";
  };

  const onButtonPressedChange = (newNumber: string) => {
    const newDigit = attempt + newNumber;
    checkDigit(newDigit, attempt, () => {
      setAttempt(newDigit);
    });
  };

  return (
    <GradientBackground>
      <ImageBackground
        style={{
          flex: 1,
          position: "absolute",
          width: "100%",
          height: 270,
          top: 0,
        }}
        source={require("../../assets/images/clouds.png")}
      />
      <View
        style={{
          paddingTop: 20,
          paddingHorizontal: 20,
          flex: 1,
          alignContent: "stretch",
        }}
      >
        {finished ? (
          hasUserWon() ? (
            <SuccessEndScreen adversaryNumber={adversaryNumber} />
          ) : (
            <FailureEndScreen adversaryNumber={adversaryNumber} />
          )
        ) : (
          <>
            {(mode === "start" || (mode == "join" && !currentGame.isOpen)) && (
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,0.3)",
                  marginBottom: 20,
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <Text style={styles.subtitle}>
                  Votre numéro secret est{" "}
                  {mode === "join" ? currentGame.b_digit : currentGame.a_digit}
                </Text>
              </View>
            )}
            {turn && (
              <Text
                style={[
                  styles.subtitle,
                  {
                    marginBottom: 10,
                  },
                ]}
              >
                {getTurnMessage()}
              </Text>
            )}
            {mode === "start" && currentGame.isOpen ? (
              <View>
                <Text style={styles.text}>En attente d'un autre joueur...</Text>
                <ActivityIndicator size="large" color="white" />
              </View>
            ) : (
              <View style={{ flex: 1, alignContent: "stretch" }}>
                {yourTurn && (
                  <Text style={styles.text}>
                    Il te reste {timeleft} seconde{timeleft > 1 && "s"}.
                  </Text>
                )}
                <View
                  style={{
                    flex: 1,
                    alignContent: "stretch",
                    marginTop: 0,
                    marginBottom: 20,
                  }}
                >
                  <Text style={[styles.text, { marginBottom: 10 }]}>
                    Devinez le numéro de votre adversaire !{" "}
                  </Text>
                  <DigitInput digit={attempt} onDigitChange={() => {}} />
                  <Attempts
                    userData={
                      mode === "join"
                        ? currentGame?.b_attempts
                        : currentGame?.a_attempts
                    }
                  />
                </View>
              </View>
            )}
          </>
        )}
      </View>
      <ImageBackground
        style={{
          height: 200,
          zIndex: -1,
          paddingHorizontal: 20,
          paddingBottom: 20,
          justifyContent: "flex-end",
        }}
        source={require("../../assets/images/grass_bg_low.png")}
      >
        {finished && <RetryButton navigation={navigation} />}
        {finished || (mode === "start" && currentGame.isOpen) ? null : (
          <Keyboard
            digit={attempt}
            onButtonPress={onButtonPressedChange}
            onValidPress={handleAttempt}
            isDisabled={isDisabled}
          />
        )}
      </ImageBackground>
      {mode === "join" && (
        <UserBStartGameModal
          route={route}
          navigation={navigation}
          visible={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
        />
      )}
    </GradientBackground>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  number: {
    fontFamily: "AutourOne-Regular",
    fontSize: 40,
    textAlign: "center",
    color: "white",
  },
  subtitle: {
    fontFamily: "AutourOne-Regular",
    fontSize: 18,
    marginBottom: 0,
    textAlign: "center",
    color: "white",
  },
  text: {
    fontFamily: "AutourOne-Regular",
    textAlign: "center",
    color: "white",
  },
});
