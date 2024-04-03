"use client";
import React, { useEffect, useRef, useState } from "react";

export default function Home() {
    const connection = useRef(null);
    const [usernameCount, setUsernameCount] = useState(12);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8080/ws`);

        socket.addEventListener("open", (event) => {
            socket.send("connection established");
        });

        socket.addEventListener("message", (event) => {
            console.log("Msg from server", event.data);
        });

        socket.addEventListener("close", (event) => {
            console.log("connection closed");
        });
    }, []);

    const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setUsername(value);
        setUsernameCount(12 - value.length);
    };

    const connectWS = () => {
        const ws = new WebSocket(`ws://localhost:8080/ws`);
        ws.send("from FLOP");
    };

    return (
        <div className="w-full min-w-80 max-w-96 h-96 mx-auto border-indigo-900">
            <form className="mt-4">
                <div className="flex flex-col font-semibold text-lg mb-2">
                    <label className="mb-1 px-2">ROOM CODE</label>
                    <input
                        className="rounded-xl border-2 px-2 py-1"
                        placeholder="ENTER 4-LETTER CODE"
                        maxLength={4}
                        type="text"
                    ></input>
                </div>
                <div className="flex flex-col font-semibold text-lg">
                    <label className="flex flex-row justify-between mb-1 px-2">
                        NAME
                        <span>{usernameCount}</span>
                    </label>
                    <input
                        className="rounded-xl border-2 px-2 py-1 mb-2"
                        placeholder="ENTER YOUR NAME"
                        maxLength={12}
                        type="text"
                        onChange={handleUsername}
                        value={username}
                    ></input>
                </div>
                <div className="flex flex-row justify-center">
                    <button className="bg-slate-500 w-full mx-6 my-2 py-2 font-semibold text-lg rounded-xl">
                        PLAY
                    </button>
                </div>
            </form>
            <div>
                <button onClick={connectWS}>connect</button>
            </div>
        </div>
    );
}
