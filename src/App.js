import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate} from "react-router-dom";
import { FiMenu, FiChevronDown } from "react-icons/fi";
import Home from './components/Home'
import MapRouteID from "./components/MapRouteID";

function App() {

  // Kafka messages
  const [messages, setMessages] = useState([]); // messages_out_no_memory
  const [messagesTimestamp, setMessagesTimestamp] = useState([]); // messages_timestamp_out

  // Menu desplegable
  const [showMenu, setShowMenu] = useState(true);



  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch('http://localhost:3001/messages');
      const responseTimestamp = await fetch('http://localhost:3001/messages-timestamp');
      const messages = await response.json(); //respuesta array con valor string con los ultimos 5 elementos actualizados
      const messagesTimestamp = await responseTimestamp.json(); //respuesta array con valor string con los ultimos 5 elementos actualizados

      setMessages(messages);
      setMessagesTimestamp(messagesTimestamp);

    };

    const intervalId = setInterval(fetchMessages, 1000); // actualiza cada 1000 milisegundos (1 segundo)

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  
  return (
    <Router>

      <div>
        <nav>
          <div className="menu-icon" onClick={toggleMenu}>
            {showMenu ? <FiChevronDown /> : <FiMenu />}
          </div>
          {showMenu && (
            <ul className="menu show">
              <li>
                <Link to="/">Pagina Inicial</Link>
              </li>
              <li>
                <Link to="/mapID">Localización con ID</Link>
              </li>
            </ul>
          )}
        </nav>

        <Routes>
          <Route exact path="/" element={<Home props={{messages: messages, messagesTimestamp: messagesTimestamp}}/>} />
          <Route exact path="/mapID" element={<MapRouteID props={{messagesTimestamp: messagesTimestamp}}/>} />
        </Routes>
      </div>
    </Router>
  );
}



export default App;