"use client";
import React, { useState } from "react";

type Event = {
    type: string;
    payload: string;
};

export default function Home() {
    const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
    const [inputMessage, setInputMessage] = useState<string>("");
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const handleInuptMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputMessage(value);
    };

    const handleConnectingSocket = () => {
        if (isConnected) {
            socket?.close();
            return;
        }

        const websocket = new WebSocket("ws://localhost:8080/ws");
        websocket.onopen = () => {
            sendEvent("send_message", "NEW CONNECTION");
            setIsConnected(true);
        };

        websocket.onclose = () => {
            console.log("Connection closed");
            setSocket(undefined);
            setIsConnected(false);
        };

        websocket.onmessage = (event: any) => {
            console.log(event);
        };

        setSocket(websocket);
    };

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
            <div className="flex flex-col justify-center">
                <h3>Connected: {isConnected ? "true" : "false"}</h3>
                <button onClick={handleConnectingSocket}>
                    {!isConnected ? "Connect" : "Disconnect"}
                </button>
            </div>
            <div>
                <input
                    className="border border-black px-4 py-2 m-2 w-full"
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
