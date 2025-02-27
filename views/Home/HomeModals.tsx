import React from "react";
import { HowToPlayModal, JoinGameModal, UserAStartGameModal } from "./modals";
import { ModalType } from "../../app";

interface HomeModalsProps {
  onClose: () => void;
  modalOpened: ModalType;
}

const HomeModals = ({ onClose, modalOpened }: HomeModalsProps) => (
  <>
    <UserAStartGameModal visible={modalOpened === "start"} onClose={onClose} />
    <JoinGameModal visible={modalOpened === "join"} onClose={onClose} />
    <HowToPlayModal visible={modalOpened === "help"} onClose={onClose} />
  </>
);

export default HomeModals;
