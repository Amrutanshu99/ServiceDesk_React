import { useState } from 'react';
import { useParams } from "react-router-dom";
import ChatComponent from '../../components/Chatbot/ChatWindow';
export default function ChatContainer() {
    return <ChatComponent 
        title="Corporate Assistant" 
        subtitle="" 
    />;
}