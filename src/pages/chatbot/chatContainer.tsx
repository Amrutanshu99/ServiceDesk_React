import { useState } from 'react';
import { useParams } from "react-router-dom";
import ChatComponent from '../../components/Chatbot/ChatWindow';
export default function ChatContainer() {
//     return (
//     <div>
//       <h1>🏠 Home</h1>
//       <p>Welcome to CorpApp</p>

//     </div>
//   );
    return <ChatComponent 
        title="Corporate Assistant" 
        subtitle="" 
    />;
}