import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AIService from '../services/AIService';

const ChatMessage = ({ message, isCurrentUser }) => (
  <View style={[
    styles.messageContainer,
    isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
  ]}>
    <View style={styles.messageContent}>
      <Text style={styles.userName}>{message.userName}</Text>
      <Text style={styles.messageText}>{message.text}</Text>
      <Text style={styles.messageTime}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
    {message.aiSuggested && (
      <View style={styles.aiTag}>
        <Ionicons name="flash" size={12} color="#007AFF" />
        <Text style={styles.aiTagText}>IA</Text>
      </View>
    )}
  </View>
);

const ReportChat = ({ visible, onClose, report, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (visible && report) {
      // Cargar mensajes existentes del reporte
      loadMessages();
    }
  }, [visible, report]);

  const loadMessages = () => {
    // Aquí cargarías los mensajes del backend
    // Por ahora usamos datos de ejemplo
    const sampleMessages = [
      {
        id: '1',
        userName: 'Sistema',
        text: `Reporte creado: ${report.type}`,
        timestamp: report.timestamp,
        isSystem: true,
      },
    ];
    setMessages(sampleMessages);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      userName: currentUser.name,
      text: inputText.trim(),
      timestamp: Date.now(),
      userId: currentUser.id,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Obtener sugerencia de la IA
    setIsLoading(true);
    try {
      const aiSuggestion = await AIService.suggestChatResponse(
        inputText,
        messages.map(m => ({
          role: m.userId === currentUser.id ? 'user' : 'assistant',
          content: m.text
        }))
      );

      if (aiSuggestion) {
        const aiMessage = {
          id: Date.now().toString() + '-ai',
          userName: 'Asistente IA',
          text: aiSuggestion,
          timestamp: Date.now(),
          aiSuggested: true,
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error al obtener sugerencia de IA:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.chatContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Chat del Reporte</Text>
            <View style={styles.headerRight} />
          </View>

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => (
              <ChatMessage
                message={item}
                isCurrentUser={item.userId === currentUser.id}
              />
            )}
            keyExtractor={item => item.id}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            style={styles.messagesList}
          />

          {/* Input */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Escribe un mensaje..."
                multiline
                maxLength={500}
              />
              {isLoading ? (
                <ActivityIndicator color="#007AFF" style={styles.sendButton} />
              ) : (
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSend}
                  disabled={!inputText.trim()}
                >
                  <Ionicons
                    name="send"
                    size={24}
                    color={inputText.trim() ? "#007AFF" : "#999"}
                  />
                </TouchableOpacity>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 8,
  },
  headerRight: {
    width: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  messagesList: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
  },
  messageContent: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
  },
  userName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  aiTagText: {
    fontSize: 10,
    color: '#007AFF',
    marginLeft: 4,
  },
});

export default ReportChat;
