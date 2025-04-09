import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatBotModalPage.module.css';
import nomyImage from '@/assets/nomy.png';
import { apiCall } from '@/utils/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

// ...

interface ChatBotModalPageProps {
  onClose: () => void;
}

interface Message {
  type: 'user' | 'bot';
  content: string;
}

const ChatBotModalPage: React.FC<ChatBotModalPageProps> = ({ onClose }) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: '안녕하세요? 저는 노미라고 해요. 일자리 만들기에 대해 질문해 주세요.'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage) return;

    const newMessage: Message = {
      type: 'user',
      content: trimmedMessage
    };
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    try {
      const response = await apiCall<{ reply: string }>('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ message: trimmedMessage })
      });

      const botMessage: Message = {
        type: 'bot',
        content: response.response
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('API 요청 중 에러 발생:', error);
      const errorMessage: Message = {
        type: 'bot',
        content: '오류가 발생했습니다. 다시 시도해 주세요.'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      <h1 className={styles.title}>
        키즈노미의 똑똑한 챗봇 '노미'를 소개합니다.
      </h1>

      <div className={styles.chatBox}>
        <div className={styles.profileImage}>
          <img src={nomyImage} alt="노미 프로필" />
        </div>
        <div className={styles.messageBox}>
          <div className={styles.name}>노미</div>
          <div className={styles.message}>
            안녕하세요? 저는 노미라고 해요.
            일자리 만들기에 대해 질문해 주세요.
            EX) 10세 아이에게 시키면 좋은 심부름 추천해줘
          </div>
        </div>
      </div>

      {messages.map((message, index) => (
        <div key={index} className={`${styles.chatBox} ${message.type === 'user' ? styles.userChat : ''}`}>
          {message.type === 'bot' && (
            <div className={styles.profileImage}>
              <img src={nomyImage} alt="노미 프로필" />
            </div>
          )}
          <div className={styles.messageBox}>
            {message.type === 'bot' && <div className={styles.name}>노미</div>}
            <div className={styles.message}>{message.content}</div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />

      <div className={styles.inputContainer}>
        <input
          type="text"
          className={styles.input}
          placeholder="질문해 보세요."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className={styles.sendButton}
          onClick={handleSendMessage}
          disabled={!inputMessage.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="..." fill="#8A5C5C" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatBotModalPage;
