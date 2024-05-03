import { io } from "socket.io-client";
import {useEffect, useState} from "react";
import Message from "./components/Message";

const socket = io(import.meta.env.VITE_SERVER);

function App() {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [online, setOnline] = useState(false);
  const [statusText, setStatusText] = useState("red");

  const [status, setStatus] = useState("Online");

  useEffect(() => {
    // Tell everyone you're online
    socket.emit("online", "Babe");
  })

  const sendMessage = (message) => {
  // Send the message to the server
  socket.emit("message", message);

  // Add your message to the messages array
  setMessages([...messages, {msg, sender: "Me"}]);

  // Reset the message
  setMsg("");
}


  // Listen for messages
  socket.on("broadcast", message => {
    if (messages.length > 0){
      setMessages([ ...messages, {message, sender: "Babe"} ]) 
      
    } else if(messages.length  === 0){
      setMessages([{message, sender: "Babe"}])
    }

  })

  // Listen for connected users
  socket.on("connected", (user) => {
    setOnline(true);
    setTimeout(() => setConnectedText(""), 3000)
  })

  // Listen for when someone disconnects
  socket.on("leftchat", () => {
    setOnline(false);
  })

  // Listen for typing alerts
  socket.on("typingAlert", message => {
    setStatus("Typing");

    // Reset the message
    setTimeout(() => setStatus("Online"), 1000)
  })

  return (
    <section className="h-screen relative">
      <article className="px-4 py-4 bg-gray-100/40">
        <article className="flex gap-2 sm:gap-4">
          <img 
            src="/heart.jpg" 
            className="rounded-full w-[50px] h-[50px]"
          />
          <article>
            <h2
              className="text-xl font-semibold sm:text-2xl"
            >
              Babe
            </h2>
              <article
              className="flex gap-[4px] items-center"
              >
                {online ? 
                  status === "Online" ?
                  <article
                  className={`w-[10px] h-[10px] rounded-full bg-green-400`}></article> :
                  <article
                  className={`w-[10px] h-[10px] rounded-full bg-yellow-400`}></article>
                : 
                <article
                className={`w-[10px] h-[10px] rounded-full bg-red-400`}
                >
                </article>
                }
                <p className="text-xs">{online ? status : "Offline"}</p>
              </article>
          </article>
        </article>
      </article>
      <article className="h-[70%] p-2 overflow-y-scroll flex flex-col">
        {
          messages.length > 0 &&
          messages.map((message, index) => {
            const sender = message.sender;
            console.log(message);
            const theMessage = message.sender === "Babe" ? message.message.split(":")[1] : message.msg;
            return (
              <Message
              key={index}
              sender={sender}
              >{theMessage}</Message>
            )
          })
        }
      </article>

      <article className="w-full absolute bottom-2 items-center flex gap-2 px-2">
          <textarea 
          className="border w-[90%] sm:w-[80%] border-gray-500 rounded-full px-4 py-2 focus:outline-blue-700"
          onChange={(e) => {
            // Update the message
            setMsg(e.target.value)
          }}
          onKeyDown={() => {
            // Send the typing event
            socket.emit("typing", socket.id)
          }}
          multiline
          value={msg}
        />

          {
            msg ? <button 
            className="bg-blue-700 rounded-full p-4"
            onClick={() => sendMessage(msg)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>

          </button> :
          <button 
          className="bg-gray-200 rounded-full p-6"
            onClick={() => setMsg("")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 sm:w-6 h-6">
            <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clipRule="evenodd" />
          </svg>
          </button>
        }
      </article>
    </section>
  )
}

export default App