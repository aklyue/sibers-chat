import { Box } from "@mui/material";
import { useState } from "react";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import useSocket from "../../hooks/useSocket";
import ChannelsList from "../../components/ChannelsList";
import ChatWindow from "../../components/ChatWindow";
import MembersList from "../../components/MembersList";
import { setCurrentChannel } from "../../store/slices/chatSlice";

export default function Chat() {
  const user = useAppSelector((state) => state.user.user)!;
  const currentUserId = useAppSelector((state) => state.user.socketId);
  const channels = useAppSelector((state) => state.chat.channels);
  const currentChannelId = useAppSelector(
    (state) => state.chat.currentChannelId
  );
  const messages = useAppSelector(
    (state) => state.chat.messages[currentChannelId || ""] || []
  );
  const dispatch = useAppDispatch();

  const {
    sendMessage,
    createChannel,
    joinChannel,
    removeUser,
    addUserToChannel,
  } = useSocket({ username: user.username });

  const [text, setText] = useState("");
  const currentChannel = channels.find((c) => c.id === currentChannelId);

  return (
    <Box display="flex" gap={2}>
      <ChannelsList
        channels={channels}
        currentUserId={currentUserId!}
        currentChannelId={currentChannelId}
        onJoinChannel={(id) => {
          joinChannel(id);
          dispatch(setCurrentChannel(id));
        }}
        onCreateChannel={createChannel}
      />

      <ChatWindow
        messages={messages}
        currentChannelName={currentChannel?.name || ""}
        text={text}
        setText={setText}
        onSend={() => {
          if (text.trim() && currentChannelId) {
            sendMessage(currentChannelId, text);
            setText("");
          }
        }}
        currentUserId={currentUserId!}
      />

      <MembersList
        currentChannel={currentChannel}
        currentUserId={currentUserId!}
        removeUser={removeUser}
        addUserToChannel={addUserToChannel}
      />
    </Box>
  );
}
