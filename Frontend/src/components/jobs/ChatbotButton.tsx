import React, { useState } from 'react';
import styles from './ChatbotButton.module.css';
import ChatBotModalPage from '@/pages/ChatBotModalPage/ChatBotModalPage';

const ChatbotButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
  };

  return (
    <>
      <button className={styles.button} onClick={handleClick}>
        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="28" viewBox="0 0 27 28" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M15.0469 14C15.0469 14.8802 14.3543 15.5938 13.5 15.5938C12.6457 15.5938 11.9531 14.8802 11.9531 14C11.9531 13.1198 12.6457 12.4062 13.5 12.4062C14.3543 12.4062 15.0469 13.1198 15.0469 14ZM7.82812 12.4062C6.97381 12.4062 6.28125 13.1198 6.28125 14C6.28125 14.8802 6.97381 15.5938 7.82812 15.5938C8.68244 15.5938 9.375 14.8802 9.375 14C9.375 13.1198 8.68244 12.4062 7.82812 12.4062ZM19.1719 12.4062C18.3176 12.4062 17.625 13.1198 17.625 14C17.625 14.8802 18.3176 15.5938 19.1719 15.5938C20.0262 15.5938 20.7188 14.8802 20.7188 14C20.7188 13.1198 20.0262 12.4062 19.1719 12.4062ZM26.9062 14C26.9073 18.8507 24.4386 23.3465 20.4025 25.844C16.3665 28.3415 11.3547 28.4747 7.19906 26.1948L2.8098 27.7023C2.06861 27.9569 1.25138 27.7582 0.698902 27.189C0.146424 26.6198 -0.0464377 25.7778 0.200742 25.0141L1.66383 20.4919C-0.955732 15.4175 -0.251729 9.2022 3.43151 4.8857C7.11476 0.569203 13.0074 -0.946281 18.2275 1.08046C23.4475 3.10719 26.904 8.25256 26.9062 14ZM24.8438 14C24.8424 9.08634 21.8582 4.69828 17.3761 3.01929C12.8941 1.3403 7.87134 2.72898 4.80726 6.49433C1.74318 10.2597 1.29217 15.5975 3.67863 19.8517C3.82646 20.1153 3.85744 20.4316 3.76371 20.7203L2.15625 25.6875L6.97734 24.0313C7.08235 23.9944 7.19253 23.9756 7.30348 23.9755C7.48459 23.9759 7.66243 24.0253 7.8191 24.119C11.329 26.2113 15.656 26.2141 19.1685 24.1264C22.681 22.0386 24.8447 18.1779 24.8438 14Z" fill="currentColor"/>
        </svg>
      </button>

      {isOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <ChatBotModalPage onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotButton; 