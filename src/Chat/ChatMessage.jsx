import Send from './img/Send.svg'
import File from './img/file.svg'
import Doc from './img/doc.svg'
import checkmark from './img/checkmark.png'
import check_mark from './img/check-mark.png'
import React, { useState } from 'react';
import c from './Chat.module.scss';
import axios from 'axios';

const ChatMessage = ({ messages, selectedChatId, messagesRef, messageSend, setMessageText, messageText, messagesTEST, handleFileChange, ExitChat, selectedFile, onClick}) => {

  const user_id = localStorage.getItem('userId');

  const room_id = messagesTEST.room_id;

  const token = localStorage.getItem('access_token');

  const reversedMessages = [...messages].reverse();

  const apiCHAT = process.env.REACT_APP_API_CHAT;

  const downloadFile = (fileId) => {
    axios.get(`${apiCHAT}/api/chat/get_file/${fileId}`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}` // если требуется аутентификация
      }
    })
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'filename.ext'; // замените 'filename.ext' на имя файла
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('Ошибка при загрузке файла:', error);
    });
  }
  

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    return formattedTime;
}




  
  return (

    <div className={c.chat__message} onClick={onClick}>
      <div style={{display: "flex", justifyContent: 'center', alignItems: 'center'}}>
        <button className={c.chat__message__btn} onClick={ExitChat}>
          <img src={Send} alt="" />
          <p>Выйти</p>
        </button>
        <p className={c.chat__message__text}>{messagesTEST.room.title}</p>
      </div>

      <div className={c.chat__message__center} ref={messagesRef}>
        {reversedMessages.map((message, index) => (
          <div key={message.sender_id} className={c.chat__message__center__flex}>
            {user_id === message.sender_id ? (
              <div className={c.chat__right}>
                {message.attachment && message.attachment.length > 0 && (
                  <button onClick={() => downloadFile(`${message.attachment[0]._id}`, 'File.jpg')} className={c.chat__doc}>
                    <img src={Doc} style={{ width: '30px' }} alt="" />
                    File
                  </button>
                )}
                <div className={c.chat__message__flex}>
                  <p className={c.chat__message__center__flex__he} key={message.sender_id}>{message.text}<span className={c.chat__message__center__flexTwo__he_span}>{formatTimestamp(message.timestamp)}</span></p>
                  {message.is_read ? <img src={check_mark} width={'25px'} alt="" /> : <img src={checkmark} width={'25px'} alt="" />}
                </div>
              </div>
            ) : (
              <div className={c.chat__left}>
                {message.attachment && message.attachment.length > 0 && (
                  <button onClick={() => downloadFile(`${message.attachment[0]._id}`, 'File.jpg')} className={c.chat__doc}>
                    <img src={Doc} style={{ width: '30px' }} alt="" />
                    File
                  </button>
                )}
                <div className={c.chat__message__flex}>
                  
                  <p className={c.chat__message__center__flexTwo__he}>
                    <div className={c.chat__message__center__flexTwo__flex}><span className={c.chat__message__center__flexTwo__he_span}>{message.sender_name}</span><span className={c.chat__message__center__flexTwo__he_span}>{message.sender_type === 'admin' || message.sender_type === 'user' ? 'пользователь' : message.sender_type === 'bot' ? 'бот' : message.sender_type}</span></div>
                    {message.text}<span className={c.chat__message__center__flexTwo__he_spanTwo}>{formatTimestamp(message.timestamp)}</span></p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={c.chat__message__flex}>

      <form className={c.chat__message__form} onSubmit={(e) => {
        e.preventDefault();
        messageSend(room_id);
      }}>


          <input
            type="text"
            className={c.chat__message__form__chat}
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
          />


          <div className={c.chat__message__form__file}>

            <input
              type="file"
              className={c.chat__message__form__file__none}
              onChange={handleFileChange}
              multiple
            />

            <img src={File} alt="" width={'30px'} />

            {selectedFile.length > 0   ?

            <p className={c.chat__message__form__file__text}>{selectedFile[0]?.name} : Выбрано</p>
            
            :

            ''

            }

            
          </div>

          <button type="submit" className={c.chat__message__form__btn}>
            <img src={Send} alt="" />
          </button>

        </form>

      </div>

    </div>
  );
};

export default ChatMessage;
