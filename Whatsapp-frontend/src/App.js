//import logo from './logo.svg';
import './App.css';
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import { useEffect, useState } from 'react';
import Pusher from "pusher-js";
import axios from './axios';


function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get('/messages/sync')
      .then(response => {
        console.log(response.data);
        setMessages(response.data);
      })
  }, []);

  useEffect(() => {
    const pusher = new Pusher('8986756af5e695e18be1', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', function (newMessage) {
      console.log('inserted');
   /*    alert(JSON.stringify(newMessage)); */
      setMessages([...messages, newMessage]);
    });

   return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  console.log(messages);

  return (
    <div className="App">
      <div className="app_body">
        <Sidebar />
        <Chat messages={messages}/>
      </div>
    </div>
  );
}

export default App;
