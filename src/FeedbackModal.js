import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  RadioGroup,
  Stack,
  Radio
} from '@chakra-ui/react';

const FeedbackModal = ({ isOpen, onClose, onSubmitFeedback }) => {
  const [value, setValue] = useState('boa');

  const handleSubmit = () => {
    onSubmitFeedback(value);
    onClose(); // Fechar o modal após o envio
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Feedback da Conversa</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <RadioGroup onChange={setValue} value={value}>
            <Stack direction="column">
              <Radio value="boa">Boa</Radio>
              <Radio value="ruim">Ruim</Radio>
              <Radio value="satisfatória">Satisfatória</Radio>
            </Stack>
          </RadioGroup>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Enviar Feedback
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FeedbackModal;
