import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../AuthContext';
import c from './Chat.module.scss'

import ChatTab from './img/mail-open-arrow-up-svgrepo-com.svg'

import axios from 'axios';
import ChatUser from './ChatUser';
import ChatMessage from './ChatMessage';
import ChatUserSupport from './ChatUserSupport';



export default function Chat ({NameUser}) {

  const apiUrl = process.env.REACT_APP_API_URL;

  const apiCHAT = process.env.REACT_APP_API_CHAT;

  const apiChatWebsoket = process.env.REACT_APP_API_CHATWS;

  const token = localStorage.getItem('access_token');

  const { refreshToken } = useAuth();

  const [myChat, setMyChat] = useState([]);

  const [messages, setMessages] = useState([]);

  const [messagesTEST, setmessagesTEST] = useState([]);

  const [messageText, setMessageText] = useState('');

  const [ChatSupport , setChatSupport ] = useState([])

  let [selectedChatId, setSelectedChatId] = useState(null); // Id 

  const [selectedChatIdSupport, setSelectedChatIdSupport] = useState(null); // id ticet

  const [roomIdSupport , setroomIdSupport ] = useState([])

  const [socket, setSocket] = useState(null);

  const [socketTwo, setSocketTwo] = useState(null);

  const addMessage = (newMessage) => {
    setMessages((prevMessages) => [newMessage, ...prevMessages]);
  };



  function takeTicketInWork(ticketId) {

    if (!socket) {
      console.error('WebSocket is not initialized');
      return;
    }
  
    const message = {
      type: "start_conversation",
      room_id: ticketId
    };
  
    socket.send(JSON.stringify(message));

  };

  function messageVhod(messageId) {

    if (!socket) {
      console.error('WebSocket is not initialized');
      return;
    }
  
    const messageVhod = {
      type: "get_messages",
      room_id: messageId,
      limit: 100
    };

    // const messageRead = {
    //   type: "read_messages",
    //   room_id: messageId,
    //   limit: 100
    // };
    socket.send(JSON.stringify(messageVhod));

    // socket.send(JSON.stringify(messageRead));

  };

  function messageRead(chatId) {
    if (!socket) {
      console.error('WebSocket is not initialized');
      return;
    }
    // Ищем текущий чат по _id
    const currentChat = myChat.find(item => item._id === chatId);

    // Проверяем, существует ли currentChat и есть ли новые сообщения
    if (currentChat && currentChat.count_new_messages > 0) {
      // Создаем объект сообщения для чтения
      const messageRead = {
        type: "read_messages",
        room_id: chatId,
        limit: 100
      };

      socket.send(JSON.stringify(messageRead));
      
    }
  };

  const handleSelectMessage = (messageId) => {
    setSelectedChatId(messageId);
    NowRoomId.current = messageId
    messageVhod(messageId);
  };

  // console.log(selectedChatId);

  const messagesRef = useRef();

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  const [isSending, setIsSending] = useState(false);

  const [selectedFile, setSelectedFile] = useState([]);

  let uploadedImageId = null; // Объявляем переменную для сохранения image_id

  const handleFileChange = async (e) => {
      const files = e.target.files;
      [...files].forEach(file => uploadFile(file));
  };
  
  const uploadFile = async (file, apiUrl) => {
      try {
          const formData = new FormData();
          formData.append('document', file);
  
          const response = await axios.post(`${apiCHAT}/api/chat/upload/single_file`, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer ${token}`
              }
          });
  
          console.log(response.data);
  
          uploadedImageId = response.data.image_id; // Сохраняем image_id
  
          return response.data;
      } catch (error) {
          console.error(error);
          throw error.response?.data?.detail || 'An error occurred while uploading file.';
      }
  };
  
  const messageSend = async (messageId) => {
      if (messageText.trim() === '' || isSending) {
          return;
      }
  
      if (!socket) {
          console.error('WebSocket is not initialized');
          return;
      }
  
      try {
          const messageToSend = {
              type: "send_message",
              room_id: messageId,
              text: messageText,
              attachments: [uploadedImageId] // Используем сохраненное значение image_id
          };
  
          socket.send(JSON.stringify(messageToSend));
  
          setMessageText('');
          setSelectedFile([]);
  
      } catch (error) {
          console.error('Error sending message:', error);
      }
  };
  
  
  const ExitChat = () => {
    setMessages([]);
    setSelectedChatId(null);
    NowRoomId.current = null
  };

  function updateMyChat(setMyChat, newChatObject, up) {
    setMyChat(prevMyChat => {
      // Проверяем, есть ли уже объект с таким _id в массиве
      const existingChatIndex = prevMyChat.findIndex(chat => chat._id === newChatObject._id);
  
      // Если объект найден, обновляем его, иначе добавляем в начало в зависимости от up
      if (up == true) {
        // Фильтруем массив, удаляя старый объект с тем же _id
        const filteredArray = prevMyChat.filter(chat => chat._id !== newChatObject._id);
        // Добавляем новый объект в начало массива
        filteredArray.unshift(newChatObject);
        // Возвращаем новый массив
        return filteredArray;
      } else {
        // Добавляем новый объект в начало или конец массива
        if (existingChatIndex !== -1) {
          // Обновляем объект
          return prevMyChat.map((chat, index) => {
            if (index === existingChatIndex) {
              return { ...chat, ...newChatObject };
            }
            return chat;
          });
        } else {
          return [...prevMyChat, newChatObject];
        }
      }
    });
  };

  

const socketRef = useRef(null);
const NowRoomId = useRef(null); // Id выбранного чата

const webchatsocket = () => {

  if (!socketRef.current) {

    const socketUrl = `${apiChatWebsoket}?token=${token}`;
    const newSocket = new WebSocket(socketUrl);
  
    newSocket.onopen = (event) => {
      setSocket(newSocket);
      socketRef.current = newSocket; // сохраняем ссылку на сокет в рефе
    };
  
    newSocket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    
    newSocket.onmessage = (event) => {
      if (event.data) {
        const message = JSON.parse(event.data);
    
        if (message.type === "get_rooms") {
          setMyChat(message.rooms);
        } else if (message.type === "new_tickets") {
          setChatSupport(message.tickets);
        } else if (message.type === "get_messages") {
          // const newMessages = message.messages;
          // Update the state with filtered messages
          if (message.room_id === NowRoomId.current) {
            // setMessages(newMessages);
            setmessagesTEST(message);
          };
          // обновить чат в текущем списке чатов
          let newChatObject = message.room
          updateMyChat(setMyChat, newChatObject, false)
          
        } else if (message.type === "new_message") {
          // обновить чат в текущем списке чатов
          let newChatObject = message.room
          updateMyChat(setMyChat, newChatObject, true)
          if (message.room_id === NowRoomId.current) {
            addMessage(message.message);
          };
              
              
        }
      }
    };
  }
};

// Используем useEffect для автоматической прокрутки вниз при изменении сообщений
useEffect(() => {
  scrollToBottom();
}, [messages]);

useEffect(() => {
  webchatsocket();
}, []);

useEffect(() => {
  scrollToBottom();
}, [myChat]);


// useEffect(() => {
//   if (!messages || messages.length === 0) return;
//   // Остальной код в этом useEffect оставляем без изменений
// }, [messages]);

useEffect(() => {
  if (!messagesTEST || messagesTEST.length === 0) return;

  // Обновление состояния messages с новыми сообщениями
  setMessages(messagesTEST.messages);
}, [messagesTEST]);

const handleClick = () => {
  // прочитать сообщения
  if (NowRoomId.current) {
    messageRead(NowRoomId.current)
  };
};


const [totalNewMessagesCount, setTotalNewMessagesCount] = useState(0); // Общее количество новых сообщений

  // Получаем сохранённое значение из localStorage при загрузке компонента
  useEffect(() => {
    const savedTotalNewMessagesCount = localStorage.getItem('totalNewMessagesCount');
    if (savedTotalNewMessagesCount) {
      setTotalNewMessagesCount(parseInt(savedTotalNewMessagesCount));
    }
  }, []);

// Функция для обновления общего количества новых сообщений
const updateTotalNewMessagesCount = (count) => {
  setTotalNewMessagesCount(prevCount => prevCount + count);
};

// Функция для обработки новых сообщений и их сохранения в localStorage
useEffect(() => {
  localStorage.setItem('totalNewMessagesCount', totalNewMessagesCount);
}, [totalNewMessagesCount]);

useEffect(() => {
  let totalCount = 0;
  myChat.forEach(info => {
    totalCount += info.count_new_messages;
  });
  setTotalNewMessagesCount(totalCount);
}, [myChat]);

console.log(totalNewMessagesCount);

  

    return (
        
        <section className={c.section__chat}>

            <div className="container">
                
                <div className={c.chat}>
                    
                    <div className={c.chat__users}>
                        
                        <p className={c.chat__users__text}>
                        Текущие заявки
                        </p>

                        <div className={c.hr}></div>

                        <div className={c.chat__users__chat} >

                        {myChat && myChat.length > 0 ? 
                
                            myChat.slice().map( (info , index) => {
                              // console.log(info)
                              return <ChatUser {...info} key={index} setSelectedChatId={setSelectedChatId} selectedChatId={selectedChatId}
                                
                              messages={messages} setMessages={setMessages} NameUser={NameUser} handleSelectMessage={handleSelectMessage}

                              totalNewMessagesCount={totalNewMessagesCount} // Передаём общее количество новых сообщений
                              updateTotalNewMessagesCount={updateTotalNewMessagesCount} // Передаём функцию для обновления общего количества новых сообщений

                              />

    
                        } )

                        :

                         <p className={c.chat__users__chat__item__title}>Пусто ... </p>

                        }

                        </div>

                        <div className={c.chat__users__mod}>

                        <p className={c.chat__users__text}>
                        Новые заявки
                        </p>

                        <div className={c.hr}></div>

                        <div className={c.chat__users__chatTwo}>

                        {ChatSupport && ChatSupport.length > 0 ? 
                
                          ChatSupport.map( (info , index) => {
    
                                return <ChatUserSupport {...info} key={index} setSelectedChatIdSupport={setSelectedChatIdSupport} selectedChatIdSupport={selectedChatIdSupport} takeTicketInWork={takeTicketInWork} />
  
                          } )

                        :

                         <p className={c.chat__users__chat__item__title}>Входящих заявок нет ... </p>

                        }

                        </div>                        

                        </div>


                    </div>

                    {Array.isArray(messages) && messages.length === 0 ? (


                    <div className={c.chat__ChatTab}>

                       <p className={c.chat__message__vhod}>Выберете вкладку</p>

                       <img src={ChatTab} alt="" />

                    </div>

                   ) : (

                    <ChatMessage

                     messages={messages} 

                     selectedChatId={selectedChatId}

                     ExitChat={ExitChat}

                     messagesRef={messagesRef}
                     
                     messageSend={messageSend}
                     
                     setMessageText={setMessageText}

                     messageText={messageText}

                     messagesTEST={messagesTEST}

                     // отправка файлов 
                     handleFileChange={handleFileChange}

                     setSelectedFile={setSelectedFile}

                     selectedFile={selectedFile}
                     
                     onClick={handleClick}
                     />

                    )

                    }


                </div>

            </div>

        </section>
        
    )
}