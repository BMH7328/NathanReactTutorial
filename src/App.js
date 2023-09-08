import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppShell, Navbar, Header } from "@mantine/core";

import Home from "./pages/home_mantine";
import Income from "./pages/income_mantine";
import Expenses from "./pages/expenses";

function App() {
  return (
    <AppShell
      padding="md"
      // navbar={
      //   <Navbar width={{ base: 300 }} p="xs">
      //     abc
      //   </Navbar>
      // }
      header={
        <Header height={60} p="xs">
          <img src="/logo512.png" style={{ width: "100%", maxWidth: "50px" }} />
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colors.dark[0],
        },
      })}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expenses" element={<Expenses />} />
        </Routes>
      </Router>
    </AppShell>
  );
}

export default App;
