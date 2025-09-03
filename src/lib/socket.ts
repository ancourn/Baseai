import { Server } from 'socket.io';

interface ChatMessage {
  content: string;
  model: string;
  timestamp: Date;
}

interface MessageResponse {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  model?: string;
}

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Handle chat messages
    socket.on('message', async (msg: ChatMessage) => {
      try {
        // Emit typing indicator
        socket.emit('typing');

        // Generate AI response using Z-AI SDK
        const ZAI = await import('z-ai-web-dev-sdk');
        const zai = await ZAI.create();
        
        const completion = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant. Be concise but helpful in your responses.'
            },
            {
              role: 'user',
              content: msg.content
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        });

        const responseContent = completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.';

        // Create response message
        const response: MessageResponse = {
          id: Date.now().toString(),
          role: 'assistant',
          content: responseContent,
          timestamp: new Date(),
          model: msg.model
        };

        // Send response back to client
        socket.emit('message', response);
        
        // Stop typing indicator
        socket.emit('typing_stop');

      } catch (error) {
        console.error('Chat message error:', error);
        
        // Send error response
        const errorResponse: MessageResponse = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'I apologize, but I encountered an error while processing your message. Please try again.',
          timestamp: new Date(),
          model: msg.model
        };

        socket.emit('message', errorResponse);
        socket.emit('typing_stop');
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Send welcome message
    const welcomeMessage: MessageResponse = {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date(),
      model: 'gpt-4'
    };

    socket.emit('message', welcomeMessage);
  });
};