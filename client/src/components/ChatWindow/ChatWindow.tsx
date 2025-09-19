import { Box, Typography, Divider, TextField, Button } from "@mui/material";
import { Message } from "../../store/slices/chatSlice";

interface ChatWindowProps {
  messages: Message[];
  currentChannelName: string;
  text: string;
  setText: (text: string) => void;
  onSend: () => void;
  currentUserId: string;
}

export function ChatWindow({
  messages,
  currentChannelName,
  text,
  setText,
  onSend,
  currentUserId,
}: ChatWindowProps) {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 80px)",
        p: 1,
        borderRight: "1px solid lightblue",
        borderLeft: "1px solid lightblue",
      }}
    >
      <Typography variant="h5" mb={1}>
        {currentChannelName || "Select a channel"}
      </Typography>
      <Divider />

      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          mt: 1,
          mb: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {messages.map((m) => {
          const isCurrentUser = m.userId === currentUserId;
          const time = new Date(m.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          return (
            <Box
              key={m.id}
              sx={{
                alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                backgroundColor: isCurrentUser ? "#b1d3ffff" : "#d4e2ffff",
                borderRadius: 2,
                p: 1,
                maxWidth: "70%",
                wordBreak: "break-word",
              }}
            >
              <b>{m.user}</b> <br /> {m.text}
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "right",
                  color: "gray",
                  mt: 0.5,
                }}
              >
                {time}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
        />
        <Button onClick={onSend}>Send</Button>
      </Box>
    </Box>
  );
}
