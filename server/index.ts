import express from "express";
import http from "http";
import { Server } from "socket.io";
import { User, Channel, Message } from "./types";
import cors from "cors";
import { nanoid } from "nanoid";
import usersJson from "./users.json";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });
const users: Record<string, User> = {};
const channels: Record<string, Channel> = {};
const generalId = nanoid();

channels[generalId] = {
  id: generalId,
  name: "General",
  creatorId: "",
  members: [],
  messages: [],
};

const activeUsernames = new Set<string>();

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  socket.on("login", (username: string, callback) => {
    if (activeUsernames.has(username)) {
      callback({ error: "Username is already logged in" });
      return;
    }

    activeUsernames.add(username);

    const userFromJson = usersJson.find((u) => u.username === username);

    const user: User = userFromJson
      ? { ...userFromJson, id: socket.id }
      : {
          id: socket.id,
          username,
          name: username,
          email: "",
          address: {
            streetA: "",
            streetB: "",
            streetC: "",
            streetD: "",
            city: "",
            state: "",
            country: "",
            zipcode: "",
            geo: { lat: "", lng: "" },
          },
          phone: "",
          website: "",
          company: { name: "", catchPhrase: "", bs: "" },
          posts: [],
          accountHistory: [],
          favorite: false,
          avatar: "",
        };

    users[socket.id] = user;

    if (!channels[generalId].members.find((m) => m.id === socket.id)) {
      channels[generalId].members.push(user);
    }

    socket.join(generalId);

    callback({
      userId: socket.id,
      channels: Object.values(channels),
      currentChannelId: generalId,
    });

    io.to(generalId).emit("channel_update", channels[generalId]);
  });

  socket.on("create_channel", (name: string, callback) => {
    const channelId = nanoid();
    const user = users[socket.id];
    if (!user) return;
    console.log("ok");
    const newChannel: Channel = {
      id: channelId,
      name,
      creatorId: socket.id,
      members: [user],
      messages: [],
    };
    channels[channelId] = newChannel;
    socket.join(channelId);
    callback(newChannel);
    io.emit("new_channel", newChannel);
  });

  socket.on("join_channel", (channelId: string) => {
    const user = users[socket.id];
    const channel = channels[channelId];
    if (!user || !channel) return;
    if (!channel.members.find((m) => m.id === socket.id)) {
      channel.members.push(user);
    }
    socket.join(channelId);
    io.to(channelId).emit("channel_update", channel);
  });

  socket.on("add_user", (data: { channelId: string; userId: string }) => {
    const channel = channels[data.channelId];
    const user = users[data.userId];
    if (!channel || !user) return;
    if (!channel.members.find((m) => m.id === user.id)) {
      channel.members.push(user);
    }
    channel.members.forEach((member) => {
      io.to(member.id).emit("channel_update", channel);
    });
  });

  socket.on("send_message", (channelId: string, text: string) => {
    const user = users[socket.id];
    const channel = channels[channelId];
    if (!user || !channel) return;
    const message: Message = {
      id: nanoid(),
      user: user.username,
      userId: user.id,
      text,
      timestamp: Date.now(),
    };
    channel.messages.push(message);
    io.to(channelId).emit("new_message", { channelId, message });
  });

  socket.on("remove_user", (channelId: string, targetId: string) => {
    const channel = channels[channelId];
    if (!channel) return;
    if (channel.creatorId !== socket.id) return;
    channel.members = channel.members.filter((m) => m.id !== targetId);
    const targetSocket = io.sockets.sockets.get(targetId);
    targetSocket?.leave(channelId);
    targetSocket?.emit("removed_from_channel", channelId);
    io.to(channelId).emit("channel_update", channel);
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      console.log("User disconnected:", user.username);

      activeUsernames.delete(user.username);

      Object.values(channels).forEach((channel) => {
        channel.members = channel.members.filter((m) => m.id !== socket.id);
        io.to(channel.id).emit("channel_update", channel);
      });

      delete users[socket.id];
    }
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
