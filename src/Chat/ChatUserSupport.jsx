import avatar from './img/Avatar.svg';
import c from './Chat.module.scss';

export default function ChatUserSupport ({ setSelectedChatIdSupport, selectedChatIdSupport ,takeTicketInWork , ...info }) {

  const ChatID = info && info._id;

  const isChatActive = ChatID === selectedChatIdSupport

  // const timestamp = info.timestamp;
  // const formattedTime = timestamp.split(' ')[1]; 
  // const timeWithoutSeconds = formattedTime.split(':').slice(0, 2).join(':');

  return (

    <div
      className={`${c.chat__users__chat__itemTwo} ${isChatActive ? c.activeChat : ''}`}
    >

      <img src={avatar} width={'60px'} alt="" />

      <div className={c.chat__users__chat__item__info}>

        <p className={c.chat__users__chat__item__title}>
          
        {
            info.title.length > 26
              ? info.title.split(' ').slice(0, 5).join(' ').substring(0, 26) + '...'
              : info.title.split(' ').slice(0, 5).join(' ').substring(0, 26)
          }
          
          </p>



       <button 
          id={ChatID}
          onClick={() => takeTicketInWork(ChatID)} 
          className={c.chat__users__chat__item__btn}>Принять заявку</button>
      </div>

    </div>

  );
}
