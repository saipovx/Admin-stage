import avatar from './img/Avatar.svg';
import c from './Chat.module.scss';
import checkmark from './img/checkmark.png'
import check_mark from './img/check-mark.png'
import { useEffect, useState } from 'react';

export default function ChatUser({ setSelectedChatId, selectedChatId , messages , NameUser, handleSelectMessage, setMessages ,...info }) {

  const ChatID = info && info._id;

  const isChatActive = ChatID === selectedChatId;

  const sumLenght = info.count_new_messages

  // const isMessageByYou = messages.map((item) => item.sender_name ) === NameUser

  // const is_read = messages.map((is_read) => is_read.is_read );

  const [roundedDateTime, setRoundedDateTime] = useState(null);

  

  useEffect(() => {
    const DateTime =
      info &&
      info.last_message &&
      info.last_message.timestamp ;

    if (DateTime) {
      const originalDate = new Date(DateTime);
      const roundedDate = new Date(Math.round(originalDate.getTime() / 1000) * 1000);
      
      // Format the date as "YYYY-MM-DD, HH:mm"
      // const formattedDateTime = roundedDate.toISOString().slice(0, 16).replace("T", ", ");

      // setRoundedDateTime(roundedDate);
    }
  }, [info]);  

  const handleClick = () => {
    // Очищаем сообщения при переключении на другой чат
    setMessages([]);
    // Затем вызываем функцию, которая обрабатывает выбор сообщения
    handleSelectMessage(ChatID);
  };

  return (

    <div
      className={`${c.chat__users__chat__item} ${isChatActive ? c.activeChat : ''}`}
      id={ChatID}
      onClick={handleClick}
    >

      <img src={avatar} width={'60px'} alt="" />

      <div className={c.chat__users__chat__item__info}>

        <p className={c.chat__users__chat__item__title}>{info.title.split(' ').slice(0, 5).join(' ')}</p>

        <div className={c.chat__users__chat__item__subtitle}>

          {
            info.last_message.text.length > 26
              ? info.last_message.text.split(' ').slice(0, 5).join(' ').substring(0, 26) + '...'
              : info.last_message.text.split(' ').slice(0, 5).join(' ').substring(0, 26)
          }

         {/* {isMessageByYou && is_read ? (

            <img src={check_mark} width={'25px'} alt="" />

          ) : isMessageByYou && !is_read ? (

            <img src={checkmark} width={'25px'} alt="" />

          ) : null} */}

        </div>

       <p className={c.chat__users__chat__item__data}>{roundedDateTime}</p> 

       {sumLenght > 0 ?

       <p className={c.chat__users__chat__item__sum}>{sumLenght}</p>

       :

       null
       
       }


      </div>

    </div>

  );
}
