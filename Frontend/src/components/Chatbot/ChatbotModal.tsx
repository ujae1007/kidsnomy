import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatbotModal.module.css';
import { useDispatch } from 'react-redux';
import { setChatbotOpen } from '../../store/slices/chatbotSlice';

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  type: 'user' | 'bot';
  content: string;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', content: '안녕하세요! 무엇을 도와드릴까요?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClose = () => {
    onClose();
    dispatch(setChatbotOpen(false));
  };

  const handleSendMessage = () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage) return;

    // 사용자 메시지를 즉시 화면에 추가
    const newMessage: Message = {
      type: 'user',
      content: trimmedMessage
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage(''); // 입력창 초기화

    // 임시 봇 응답
    setTimeout(() => {
      const botMessage: Message = {
        type: 'bot',
        content: '현재 개발 중인 기능입니다. 잠시 후 다시 시도해주세요.'
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>AI 챗봇</h2>
          <button className={styles.closeButton} onClick={handleClose}>×</button>
        </div>
        <div className={styles.chatContainer}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                message.type === 'user' ? styles.userMessage : styles.botMessage
              }`}
            >
              <div className={styles.messageContent}>
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className={styles.inputContainer}>
          <textarea
            className={styles.input}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            rows={1}
          />
          <button 
            className={styles.sendButton}
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotModal; 