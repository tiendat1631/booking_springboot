import { Container, Paper, Tabs } from "@mantine/core";
import { IconLogin, IconUserPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import styles from "./Welcome.module.css";

export default function Welcome() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "login";
  const [activeTab, setActiveTab] = useState<string | null>(initialTab);

  return (
    <Container size="xs" my={40}>
      <Tabs value={activeTab} onChange={setActiveTab} variant="outline">
        <Tabs.List grow>
          <Tabs.Tab p="sm" value="login" leftSection={<IconLogin size={16} />}>
            {"Đăng nhập"}
          </Tabs.Tab>
          <Tabs.Tab value="signup" leftSection={<IconUserPlus size={16} />}>
            {"Đăng ký"}
          </Tabs.Tab>
        </Tabs.List>

        <Paper withBorder shadow="sm" p="xl" className={styles.paper}>
          <Tabs.Panel value="login">
            <Login />
          </Tabs.Panel>

          <Tabs.Panel value="signup">
            <Signup />
          </Tabs.Panel>
        </Paper>
      </Tabs>
    </Container>
  );
}
