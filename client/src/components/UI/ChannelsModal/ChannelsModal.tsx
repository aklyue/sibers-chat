import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";

interface ChannelsModalProps {
  setModalOpen: (open: boolean) => void;
  modalOpen: boolean;
  onCreateChannel: (name: string) => void;
}

export function ChannelsModal({
  setModalOpen,
  modalOpen,
  onCreateChannel,
}: ChannelsModalProps) {
  const [newChannelName, setNewChannelName] = useState<string | null>("");
  const handleChannelCreate = () => {
    console.log(newChannelName);
    if (newChannelName && newChannelName.trim()) {
      onCreateChannel(newChannelName.trim());
      setNewChannelName("");
      setModalOpen(false);
    }
  };
  return (
    <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
      <DialogContent>
        <TextField
          size="small"
          label="Channel"
          value={newChannelName}
          onChange={(e) => setNewChannelName(e.target.value)}
          placeholder="Name"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleChannelCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
