"use client";
import React, { ChangeEvent, useEffect, useState } from "react";

type Event = {
    type: string;
    payload: SendMessageEvent | BroadcastMessageEvent;
};

type SendMessageEvent = {
    message: string;
    from: string;
};

type BroadcastMessageEvent = {
    message: string;
    from: string;
    sentDate: string;
};

type Message = {
    content: string;
    date: Date;
    username: string;
    type: "self" | "other";
};

export default function Home() {
    const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
    const [inputMessage, setInputMessage] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [chatRoom, setChatRoom] = useState<string>("Default");
    const [messages, setMessages] = useState<Array<Message>>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const connectedColor = isConnected ? "#03a10d" : "#ff0000";

    const handleInuptMessage = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputMessage(value);
    };

    const handleUsername = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setUsername(value);
    };

    const handleChatRoom = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setChatRoom(value);
    };

    const handleConnectingSocket = () => {
        if (isConnected) {
            socket?.close();
            return;
        }

        const websocket = new WebSocket("ws://localhost:8080/ws");
        websocket.onopen = () => {
            const msg: SendMessageEvent = {
                message: "new connection",
                from: "new",
            };
            const newEvent: Event = {
                type: "new_connection",
                payload: msg,
            };
            socket?.send(JSON.stringify(newEvent));
            setIsConnected(true);
        };

        websocket.onclose = () => {
            console.log("Connection closed");
            setSocket(undefined);
            setIsConnected(false);
        };

        // websocket.onmessage = (event: WebSocketEventMap["message"]) => {
        //     const data = JSON.parse(event.data);
        //     const msg: BroadcastMessageEvent = {
        //         type: data.type,
        //         content: data.payload.message,
        //         username: data.payload.from,
        //         sentDate: data.payload.sent,
        //     };

        //     routeEvent(msg);
        // };

        setSocket(websocket);
    };

    // const routeEvent = (msg: BroadcastMessageEvent): void => {
    //     if (msg.type === undefined) {
    //         alert("no type from message");
    //     }

    //     console.log("routeEvent: ", msg.content);

    //     switch (msg.type) {
    //         case "new_message":
    //             setMessages([...messages, msg]);
    //             break;
    //         default:
    //             alert("unsupported message");
    //             break;
    //     }

    //     console.log(messages);
    // };

    useEffect(() => {
        if (socket === undefined) {
            return;
        }

        socket.onmessage = (event: WebSocketEventMap["message"]) => {
            const data: Event = JSON.parse(event.data);
            const payload: BroadcastMessageEvent =
                data.payload as BroadcastMessageEvent;

            if (data.type === "new_message") {
                const msg: Message = {
                    content: payload.message,
                    username: payload.from,
                    date: new Date(payload.sentDate),
                    type: username === payload.from ? "self" : "other",
                };

                setMessages([...messages, msg]);
            }
        };
    }, [socket, messages, username]);

    const sendMessage = () => {
        const outGoingMessage: SendMessageEvent = {
            message: inputMessage,
            from: username,
        };

        const event: Event = {
            type: "send_message",
            payload: outGoingMessage,
        };
        socket?.send(JSON.stringify(event));
        setInputMessage("");
    };

    return (
        <div className="w-full px-2 min-w-80 max-w-96 h-96 mx-auto border-indigo-900">
            <section className="flex flex-col items-center">
                <div>
                    <button
                        className="flex flex-row items-center p-2 m-2 rounded-lg bg-slate-200 hover:shadow-lg"
                        onClick={handleConnectingSocket}
                    >
                        Websocket Connection:
                        <div
                            className="w-5 h-5 rounded mx-2"
                            style={{ backgroundColor: connectedColor }}
                        ></div>
                    </button>
                </div>
                <div>
                    <span>Current chat room: {chatRoom}</span>
                </div>
            </section>
            <section className="flex flex-col justify-around items-center">
                <div className="flex flex-row justify-around items-center my-2">
                    <div>Username:</div>
                    <input
                        className="border border-black rounded-lg px-4 py-2"
                        value={username}
                        onChange={handleUsername}
                    ></input>
                </div>
                <div className="flex flex-row justify-around items-center my-2">
                    <div>Change chat room:</div>
                    <input
                        className="border border-black rounded-lg px-4 py-2"
                        value={chatRoom}
                        onChange={handleChatRoom}
                    ></input>
                </div>
            </section>
            <section className="container flex-grow border border-black rounded-lg px-4 pb-4 h-52 overflow-y-auto">
                {messages.map((msg, index: number) => {
                    const sentDate = msg.date;

                    if (msg.type === "self") {
                        return (
                            <div
                                key={index}
                                className="flex flex-col mt-2 text-right justify-end"
                            >
                                <div>{msg.username}</div>
                                <div>{msg.content}</div>
                            </div>
                        );
                    }

                    return (
                        <div key={index} className="flex flex-col mt-2">
                            <div>{msg.username}</div>
                            <div>{msg.content}</div>
                        </div>
                    );
                })}
            </section>
            <section>
                <input
                    className="border border-black rounded-lg px-4 py-2 my-2 w-full"
                    type="text"
                    value={inputMessage}
                    onChange={handleInuptMessage}
                ></input>
                <button
                    className="bg-slate-200 rounded-lg px-4 py-2 hover:shadow-md"
                    onClick={sendMessage}
                >
                    Send Message
                </button>
            </section>
        </div>
    );
}
