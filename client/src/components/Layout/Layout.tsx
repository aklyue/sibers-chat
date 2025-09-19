import { AppBar, Toolbar, Typography, Box, Container } from "@mui/material";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Realtime Chat</Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 2, maxWidth: "2000px !important" }}>{children}</Container>
    </Box>
  );
}
