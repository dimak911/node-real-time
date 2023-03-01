import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

const LongPulling = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");

  const subscribe = useCallback(async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/get-messages");
      setMessages((prev) => [data, ...prev]);
      await subscribe();
    } catch (e) {
      setTimeout(() => {
        subscribe();
      }, 500);
    }
  }, [setMessages]);

  useEffect(() => {
    subscribe();
  }, [subscribe]);

  const sendMessage = async () => {
    await axios.post("http://localhost:8080/new-messages", {
      message: value,
      id: Date.now(),
    });
  };

  return (
    <div className="center">
      <div className="form">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <ul className="messages">
        {messages.map((msg) => (
          <li className="message" key={msg.id}>
            {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LongPulling;
