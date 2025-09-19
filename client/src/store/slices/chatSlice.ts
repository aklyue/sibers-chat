import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Address {
  streetA: string;
  streetB: string;
  streetC: string;
  streetD?: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  geo?: {
    lat: string;
    lng: string;
  };
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface Post {
  sentence: string;
  sentences: string;
  paragraph: string;
}

export interface AccountHistory {
  amount: string;
  date: string;
  business: string;
  name: string;
  type: string;
  account: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
  posts: Post[];
  accountHistory: AccountHistory[];
  favorite: boolean;
  avatar: string;
}

export interface Message {
  id: string;
  user: string;
  userId: string;
  text: string;
  timestamp: number;
}

export interface Channel {
  id: string;
  name: string;
  creatorId: string;
  members: User[];
  messages: Message[];
}

interface ChatState {
  channels: Channel[];
  currentChannelId: string | null;
  messages: Record<string, Message[]>;
}

const initialState: ChatState = {
  channels: [],
  currentChannelId: null,
  messages: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChannels: (state, action: PayloadAction<Channel[]>) => {
      state.channels = action.payload;
    },
    setCurrentChannel: (state, action: PayloadAction<string>) => {
      state.currentChannelId = action.payload;
    },
    updateChannel: (state, action: PayloadAction<Channel>) => {
      const index = state.channels.findIndex((c) => c.id === action.payload.id);
      if (index >= 0) {
        state.channels[index] = action.payload;
      } else {
        state.channels.push(action.payload);
      }
    },
    addChannel: (state, action: PayloadAction<Channel>) => {
      state.channels.push(action.payload);
    },
    removeFromChannel: (state, action: PayloadAction<string>) => {
      state.channels = state.channels.filter((c) => c.id !== action.payload);

      if (state.currentChannelId === action.payload) {
        state.currentChannelId = "";
      }
    },
    addMessage: (
      state,
      action: PayloadAction<{ channelId: string; message: Message }>
    ) => {
      const { channelId, message } = action.payload;
      if (!state.messages[channelId]) {
        state.messages[channelId] = [];
      }
      state.messages[channelId].push(message);
    },
  },
});

export const {
  setChannels,
  setCurrentChannel,
  addMessage,
  updateChannel,
  addChannel,
  removeFromChannel,
} = chatSlice.actions;
export default chatSlice.reducer;
