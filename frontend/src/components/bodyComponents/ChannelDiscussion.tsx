import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import InputMessage from "./InputMessage";
import UserMessage from "./userMessage";
import OtherUserMessage from "./otherUserMessage";
import { ScrollArea } from "../ui/ui/scroll-area";
import { fetchApi } from "../../lib/api";
import useChannelMessageDisplayStore from "../../store/channelMessageDisplay";
import type { MessagesType } from "../../lib/type";
import { io, Socket } from 'socket.io-client';
import { onCommand } from "../../lib/commands";

const socket: Socket = io('http://localhost:4000');

const fetchMessages = async (id: string): Promise<MessagesType[]> => {
  const data = await fetchApi<MessagesType[]>("GET", `channels/${id}/messages`);
  return data;
};

const ChannelDiscussion = () => {
  const { channelId } = useChannelMessageDisplayStore();
  const [messages, setMessages] = useState<MessagesType[]>([]);
  const lastMessageRef = useRef(null);

  const handleCommand = (command: string, args: string) => {
    const newMessages = onCommand(command, args);
    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
  };

  useEffect(() => {
    if (!channelId) return;

    socket.on('newMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    fetchMessages(channelId).then((data) => {
      setMessages(data);
    });

    return () => {
      socket.off('newMessage');
    };
  }, [channelId]);

  useLayoutEffect(() => {
    if (lastMessageRef.current) {
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col h-[calc(100%-50px)] w-[calc(100%-10px)]">
        <ScrollArea className="h-full w-full">
          {messages.map((message, index) => (
            <div
              key={message._id}
              ref={index === messages.length - 1 ? lastMessageRef : null}
            >
              {message._id === "101" ? (
                <UserMessage
                  id={message._id}
                  username={message.author}
                  text={message.text}
                />
              ) : (
                <OtherUserMessage
                  id={message._id}
                  username={message.author}
                  text={message.text}
                />
              )}
            </div>
          ))}
        </ScrollArea>
      </div>
      <InputMessage onCommand={handleCommand} />
    </div>
  );
};

export default ChannelDiscussion;
