import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Input,
  IconButton,
  Text,
  Avatar,
  useColorModeValue,
  Container,
  Flex,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import axios from "axios";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import FeedbackModal from './FeedbackModal';
import logo from './logo.png';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [feedback, setFeedback] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const client = axios.create({
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_CHATGPT_KEY}`,
    },
  });
  const messageEndRef = useRef(null);
  const bgColor = useColorModeValue('gray.50', 'gray.800');  
  const inputBgColor = useColorModeValue('white', 'gray.700');

  const scrollToBottom = () => {
    messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const promptText = inputText.trim();
    if (promptText) {
      const data = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: promptText }],
      };

      try {
        const result = await client.post(
          "https://api.openai.com/v1/chat/completions",
          data
        );
        const response = result.data.choices[0].message.content;
        setMessages([...messages, { role: "user", content: promptText }, { role: "ai", content: response }]);
        setInputText("");
      } catch (error) {
        console.error(error.response ? error.response.data : error);
      }
    }
  };

  const handleFeedbackSubmit = (feedback) => {
    setFeedback(feedback);
    onClose();
  };

  return (
    <Container maxW="container.xl">
      <ColorModeSwitcher />
      <VStack
        divider={<Box borderColor="gray.200" />}
        spacing={4}
        align="stretch"
        w="100%"
        h="95vh"
        p={5}
        bg={bgColor}
        borderRadius="lg"
        overflowY="auto"
      >
        {messages.map((message, index) => (
          <HStack key={index} alignSelf={message.role === "user" ? "flex-end" : "flex-start"}>
            <Avatar
              size="sm"
              src={message.role === "user" ? "https://avatars.githubusercontent.com/u/115303980?s=48&v=4" : logo}
              name={message.role === "user" ? "User" : "AI"}
            />
            <Text p={3} bg={message.role === "user" ? "blue.500" : "green.500"} color="white" borderRadius="lg">
              {message.content}
            </Text>
          </HStack>
        ))}
        <div ref={messageEndRef} />
      </VStack>
      <Flex as="form" onSubmit={handleSubmit} w="100%" mt={5}>
        <Input
          mr={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          bg={inputBgColor}
        />
        <IconButton
          icon={<ArrowForwardIcon />}
          type="submit"
          colorScheme="blue"
          aria-label="Send message"
        />
        <Button colorScheme="red" ml={3} onClick={onOpen}>Encerrar Sessão e Avaliar</Button>
      </Flex>
      <FeedbackModal isOpen={isOpen} onClose={onClose} onSubmitFeedback={handleFeedbackSubmit} />
    </Container>
  );
};

export default App;
