// store/slices/chatbotSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatbotState {
  isOpen: boolean;
}

const initialState: ChatbotState = {
  isOpen: false,
};

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    setChatbotOpen(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
  },
});

export const { setChatbotOpen } = chatbotSlice.actions;
export default chatbotSlice.reducer;
