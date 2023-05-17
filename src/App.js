import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Switch } from "react-router-dom";
import Home from './components/Home'
import MapRouteID from "./components/MapRouteID";
import UrlPage from "./components/UrlPage";
import GraphsID from "./components/GraphsID";




import Navigationbar from './components/Navigationbar';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {

  // Kafka messages
  const [messages, setMessages] = useState([]); // messages_out_no_memory
  const [messagesTimestamp, setMessagesTimestamp] = useState([]); // messages_timestamp_out

  // Lectura periodica (cada 1s) de mensajes de servidor node (kafka)
  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch('http://nodeserver:3001/messages');
      const responseTimestamp = await fetch('http://nodeserver:3001/messages-timestamp');
      const messages = await response.json(); 
      const messagesTimestamp = await responseTimestamp.json(); 

      // Almacenamiento de mensajes en estado de react
      setMessages(messages);
      setMessagesTimestamp(messagesTimestamp);

    };

    const intervalId = setInterval(fetchMessages, 1000); // actualiza cada 1000 milisegundos (1 segundo)

    return () => {
      clearInterval(intervalId);
    };
  }, []);


  return (
    <div className="App">
        <Router>
            <Navigationbar />
            <Switch>
            <Route exact path='/' render={() => <Home messages={messages} messagesTimestamp= {messagesTimestamp}/>} />
            <Route exact path='/mapID' render={() => <MapRouteID messagesTimestamp={messagesTimestamp} />} />
            <Route exact path='/graphsID' render={() => <GraphsID messagesTimestamp={messagesTimestamp} />} />
            <Route exact path='/urls' render={() => <UrlPage />} />
            </Switch>
        </Router>
    </div>
  );
}



export default App;