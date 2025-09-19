import { useCallback, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import useAppDispatch from "../useAppDispatch";
import {
  addChannel,
  addMessage,
  Channel,
  removeFromChannel,
  setChannels,
  setCurrentChannel,
  updateChannel,
} from "../../store/slices/chatSlice";
import { setSocketId, User } from "../../store/slices/userSlice";
import useAppSelector from "../useAppSelector";
import { useNavigate } from "react-router-dom";

interface UseSocketProps {
  username: string;
}

interface ApiSocketResponse {
  channels: Channel[];
  currentChannelId: string;
  socket: Socket;
  error?: string;
}

export const useSocket = ({ username }: UseSocketProps) => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentChannelId = useAppSelector(
    (state) => state.chat.currentChannelId
  );

  useEffect(() => {
    if (!username || socketRef.current) return;

    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("login", username, (data: ApiSocketResponse) => {
        if (data.error) {
          navigate("/");
          alert(data.error);
          return;
        }
        dispatch(setChannels(data.channels));
        dispatch(setCurrentChannel(data.currentChannelId));
        dispatch(setSocketId(socket.id!));
      });
    });

    socket.on("new_message", ({ channelId, message }) => {
      dispatch(addMessage({ channelId, message }));
    });

    socket.on("channel_update", (channel: Channel) => {
      dispatch(updateChannel(channel));
    });

    socket.on("new_channel", (channel) => {
      if (channel.creatorId !== socket.id) {
        dispatch(addChannel(channel));
      }
    });

    socket.on("removed_from_channel", (channelId: string) => {
      dispatch(removeFromChannel(channelId));

      if (currentChannelId === channelId) {
        dispatch(setCurrentChannel(""));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [username, dispatch]);

  const sendMessage = (channelId: string, text: string) => {
    socketRef.current?.emit("send_message", channelId, text);
  };

  const createChannel = (name: string): Promise<Channel> => {
    return new Promise((resolve) => {
      socketRef.current?.emit("create_channel", name, (channel: Channel) => {
        dispatch(addChannel(channel));
        resolve(channel);
      });
    });
  };

  const joinChannel = (channelId: string) => {
    socketRef.current?.emit("join_channel", channelId);
  };

  const addUserToChannel = useCallback((channelId: string, userId: string) => {
    socketRef.current?.emit("add_user", { channelId, userId });
  }, []);

  const removeUser = (channel: Channel, targetId: string) => {
    socketRef.current?.emit("remove_user", channel.id, targetId);

    if (socketRef.current?.id === channel.creatorId) {
      dispatch(
        updateChannel({
          ...channel,
          members: channel.members.filter((m) => m.id !== targetId),
        })
      );
    }
  };

  return {
    sendMessage,
    createChannel,
    joinChannel,
    removeUser,
    addUserToChannel,
    socket: socketRef.current,
  };
};
