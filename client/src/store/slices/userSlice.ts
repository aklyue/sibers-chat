import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Address {
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

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

interface Post {
  sentence: string;
  sentences: string;
  paragraph: string;
}

interface AccountHistory {
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

interface UserState {
  user: User | null;
  socketId: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  socketId: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.socketId = null;
    },
    setSocketId: (state, action: PayloadAction<string>) => {
      state.socketId = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { login, logout, setSocketId, updateUser } = userSlice.actions;
export default userSlice.reducer;
