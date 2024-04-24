import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: flex-end;
`;

const MessageContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  padding: 20px;
`;

const Message = styled(motion.div)`
  max-width: 70%;
  margin: 10px;
  padding: 15px;
  border-radius: 20px;
  word-wrap: break-word;
  display: inline-block;
`;

const UserMessage = styled(Message)`
  background-color: #4caf50; /* Cor de fundo para as mensagens do usuário */
  align-self: flex-end; /* Alinha as mensagens do usuário à direita */
`;

const AiMessage = styled(Message)`
  background-color: #2196f3; /* Cor de fundo para as mensagens do AI */
  align-self: flex-start; /* Alinha as mensagens do AI à esquerda */
`;

const Form = styled.form`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background-color: #2196f3;
  color: white;
  margin-left: 10px;
  cursor: pointer;
`;

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const client = axios.create({
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_CHATGPT_KEY}`,
    },
  });
  const messageEndRef = useRef(null);

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
          JSON.stringify(data),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.REACT_APP_CHATGPT_KEY}`,
            },
          }
        );

        const response = result.data.choices[0].message.content;

        setMessages([
          ...messages,
          { role: "user", content: promptText },
          { role: "ai", content: response },
        ]);

        setInputText("");
      } catch (error) {
        console.error(error.response ? error.response.data : error);
      }
    }
  };

  return (
    <Container>
      <MessageContainer>
        {messages.map((message, index) => {
          const MessageComponent =
            message.role === "user" ? UserMessage : AiMessage;
          return (
            <MessageComponent key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {message.content}
            </MessageComponent>
          );
        })}
        <div ref={messageEndRef} />
      </MessageContainer>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
        />
        <Button type="submit">Send</Button>
      </Form>
    </Container>
  );
};

export default App;
