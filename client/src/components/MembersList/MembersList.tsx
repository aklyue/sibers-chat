import {
  Box,
  Typography,
  List,
  ListItem,
  Button,
  Popover,
  IconButton,
} from "@mui/material";
import { WorkspacePremium, PersonAdd } from "@mui/icons-material";
import { Channel } from "../../store/slices/chatSlice";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MembersModal from "../UI/MembersModal";

interface MembersListProps {
  currentChannel: Channel | undefined;
  currentUserId: string;
  removeUser: (channel: Channel, userId: string) => void;
  addUserToChannel: (channelId: string, userId: string) => void;
}

export default function MembersList({
  currentChannel,
  currentUserId,
  removeUser,
  addUserToChannel,
}: MembersListProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [addModal, setAddModal] = useState(false);

  const handleClickUser = (
    event: React.MouseEvent<HTMLElement>,
    userId: string
  ) => {
    if (selectedUserId === userId) {
      setSelectedUserId(null);
      setAnchorEl(null);
    } else {
      setSelectedUserId(userId);
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setSelectedUserId(null);
    setAnchorEl(null);
  };

  return (
    <Box width={200}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        height={40}
      >
        <Typography variant="h6">Members</Typography>
        {currentChannel && currentChannel.name !== "General" && (
          <IconButton onClick={() => setAddModal(true)}>
            <PersonAdd />
          </IconButton>
        )}
      </Box>

      <List
        sx={{
          maxHeight: "calc(100dvh - 150px)", // например, 400px, можно менять
          overflowY: "auto",
        }}
      >
        {currentChannel?.members.map((m) => (
          <ListItem
            key={m.id}
            onClick={(e) => {
              if (m.id !== currentChannel.creatorId) handleClickUser(e, m.id);
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              ":hover": {
                bgcolor: "#f1f1f1",
                cursor: "pointer",
                userSelect: "none",
                transition: "all 0.2s",
              },
            }}
          >
            <Typography>{m.username}</Typography>
            {m.id === currentChannel.creatorId && <WorkspacePremium />}
          </ListItem>
        ))}
      </List>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            p: 1,
            width: 200,
            border: "1px solid lightblue",
            boxShadow: "none",
          },
        }}
      >
        <AnimatePresence>
          {selectedUserId && (
            <motion.div
              key={selectedUserId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ width: "100%" }}
            >
              <Button
                fullWidth
                disabled={currentUserId !== currentChannel?.creatorId}
                onClick={() => {
                  if (currentChannel && selectedUserId)
                    removeUser(currentChannel, selectedUserId);
                  handleClose();
                }}
                sx={{ justifyContent: "start" }}
              >
                Kick
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Popover>

      <MembersModal
        addUserToChannel={addUserToChannel}
        addModal={addModal}
        setAddModal={setAddModal}
      />
    </Box>
  );
}
