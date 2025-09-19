import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import { Channel } from "../../store/slices/chatSlice";
import { useMemo, useState } from "react";
import ChannelsModal from "../UI/ChannelsModal";

interface ChannelsListProps {
  channels: Channel[];
  currentUserId: string;
  currentChannelId: string | null;
  onJoinChannel: (id: string) => void;
  onCreateChannel: (name: string) => void;
}

export function ChannelsList({
  channels,
  currentUserId,
  onJoinChannel,
  onCreateChannel,
}: ChannelsListProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  console.log(currentUserId, channels);

  const visibleChannels = useMemo(() => {
    if (!currentUserId) return [];
    return channels.filter((c) =>
      c.members.some((m) => String(m.id) === String(currentUserId))
    );
  }, [channels, currentUserId]);

  return (
    <Box width={200}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">Channels</Typography>
        <IconButton
          onClick={() => setModalOpen((prev) => !prev)}
          sx={{ fontSize: 20, fontWeight: "bold" }}
        >
          <AddCircleOutline />
        </IconButton>
      </Box>
      <List>
        {visibleChannels
          .filter((c) => c.members.some((m) => String(m.id) === currentUserId))
          .map((c) => (
            <ListItem key={c.id} disablePadding>
              <ListItemButton onClick={() => onJoinChannel(c.id)}>
                <ListItemText primary={c.name} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>

      <ChannelsModal
        setModalOpen={setModalOpen}
        modalOpen={modalOpen}
        onCreateChannel={onCreateChannel}
      />
    </Box>
  );
}
