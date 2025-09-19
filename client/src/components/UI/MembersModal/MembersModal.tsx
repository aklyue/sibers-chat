import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import useAppSelector from "../../../hooks/useAppSelector";

interface MembersModalProps {
  addModal: boolean;
  setAddModal: (bool: boolean) => void;
  addUserToChannel: (channelId: string, userId: string) => void;
}

function MembersModal({
  addModal,
  setAddModal,
  addUserToChannel,
}: MembersModalProps) {
  const channels = useAppSelector((state) => state.chat.channels);
  const currentChannelId = useAppSelector(
    (state) => state.chat.currentChannelId
  );
  const [addUserName, setAddUserName] = useState("");
  const generalChannel = channels.find((c) => c.name === "General");
  const currentChannel = channels.find((c) => c.id === currentChannelId);
  const allUsers = generalChannel?.members || [];
  const filteredUsers = allUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(addUserName.toLowerCase()) &&
      !currentChannel?.members.some((m) => m.id === u.id)
  );
  return (
    <Dialog
      open={addModal && !!currentChannel && currentChannel.name !== "General"}
      onClose={() => setAddModal(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Add user to {currentChannel?.name}</DialogTitle>
      <DialogContent
        sx={{ minHeight: 300, display: "flex", flexDirection: "column" }}
      >
        <TextField
          fullWidth
          label="Username"
          value={addUserName}
          onChange={(e) => setAddUserName(e.target.value)}
          sx={{ mb: 2 }}
        />
        {addUserName && (
          <List>
            {filteredUsers.map((u) => (
              <ListItem
                key={u.id}
                secondaryAction={
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => {
                      if (currentChannel) {
                        addUserToChannel(currentChannel.id, u.id);
                        setAddUserName("");
                      }
                    }}
                  >
                    Add
                  </Button>
                }
              >
                <ListItemText primary={u.username} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setAddModal(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default MembersModal;
