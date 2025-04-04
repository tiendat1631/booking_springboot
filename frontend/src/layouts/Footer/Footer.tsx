import {
  Anchor,
  Box,
  Flex,
  Stack,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { IconBrandFacebook, IconMail } from "@tabler/icons-react";
import styles from "./Footer.module.css";

export default function Footer() {
  const { colorScheme } = useMantineColorScheme();
  const footerClassName =
    colorScheme === "dark" ? styles.footerDark : styles.footer;

  return (
    <Box component="footer" py="md" className={footerClassName}>
      <Flex justify="space-between" align="center" wrap="wrap">
        <Stack gap="0">
          <Text size="lg" fw={600}>
            VéXe24
          </Text>
          <Text size="sm" c="dimmed">
            {"Đặt vé mọi lúc, đi xe mọi nơi"}
          </Text>
        </Stack>

        <Flex gap="md">
          <Anchor href="mailto:admin@gmail.com" target="_blank">
            <IconMail size={20} />
          </Anchor>
          <Anchor href="https://facebook.com" target="_blank">
            <IconBrandFacebook size={20} />
          </Anchor>
        </Flex>

        <Text size="sm" c="dimmed">
          contact@vexe24.com
        </Text>
      </Flex>
    </Box>
  );
}
