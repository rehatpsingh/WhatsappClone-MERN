import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, InsertEmoticon, SearchOutlined } from '@material-ui/icons';
import MicIcon from '@material-ui/icons/Mic';
import MoreVert from '@material-ui/icons/MoreVert';
import React, { useState } from 'react'
import "./Chat.css";
import axios from "./axios";

function Chat({ messages }) {
    const [input, setInput] = useState("");
    const sendMessage = async (e) => {
        e.preventDefault();
        
        await axios.post('/messages/new', {
            message: input,
            name: "Rehat",
            timestamp: "Just Now!",
            received: true
        });

        setInput("");
    }
    return (
        <div className="Chat">
            <div className="Chat_header">
                <Avatar />
                <div className="Chat_headerInfo">
                    <h3>CyberGroup</h3>
                    <p>Last seen at 12:00pm  </p>
                </div>
                <div className="Chat_headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>

                </div>

            </div>
            <div className="Chat_body">
                {messages.map((message) => (

                    <p className={`Chat_message ${message.received && "Chat_receiver"}`} >
                        <span className="chat_name">{message.name}</span>
                        {message.message}
                        < span className="chat_timestamp">{message.timestamp}</span>

                    </p>
                ))}
                

            </div >
            <div className="chat_footer">
                <InsertEmoticon />
                <form>
                <input value={input} onChange={e => setInput(e.target.value)}
                    placeholder="Type a message" type="text" />
                    <button onClick={sendMessage} type="submit">Send a message</button>
                </form>
                <MicIcon />
            </div>

        </div >
    )
}

export default Chat
