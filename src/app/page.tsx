"use client";
import React, { useEffect, useState } from "react";

type Event = {
    type: string;
    payload: string;
};

export default function Home() {
    const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
    const [inputMessage, setInputMessage] = useState<string>("");

    const handleInuptMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputMessage(value);
    };

    const handleConnectingSocket = () => {
        const websocket = new WebSocket("ws://localhost:8080/ws");

        websocket.addEventListener("open", () => {
            sendEvent("send_message", "NEW CONNECTION");
        });

        websocket.addEventListener("close", () => {
            console.log("connection closed");
        });

        websocket.addEventListener("message", (event: any) => {
            console.log(event);
        });

        setSocket(websocket);
    };

    useEffect(() => {
        handleConnectingSocket();
    }, []);

    const sendMessage = () => {
        sendEvent("send_message", inputMessage);
        setInputMessage("");
    };

    const sendEvent = (eventType: string, payload: string) => {
        const event: Event = {
            type: eventType,
            payload: payload,
        };
        socket?.send(JSON.stringify(event));
    };

    return (
        <div className="w-full min-w-80 max-w-96 h-96 mx-auto border-indigo-900">
            <div>
                <input
                    className="border border-black px-4 py-2 m-2"
                    type="text"
                    value={inputMessage}
                    onChange={handleInuptMessage}
                ></input>
                <button
                    className="border border-black px-4 py-2 mx-2"
                    onClick={sendMessage}
                >
                    Send Message
                </button>
            </div>
        </div>
    );
}
