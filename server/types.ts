export interface Geo {
  lat: string;
  lng: string;
}

export interface Address {
  streetA: string;
  streetB: string;
  streetC: string;
  streetD: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  geo: Geo;
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
  words?: (string | null)[];
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
  creatorId: string | null;
  members: User[];
  messages: Message[];
}
