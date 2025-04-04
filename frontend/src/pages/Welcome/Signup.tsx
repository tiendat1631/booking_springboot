import {
  Box,
  Button,
  PasswordInput,
  Popover,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconCheck,
  IconX
} from "@tabler/icons-react";
import { Fragment, useState } from "react";
import styles from "./Welcome.module.css";

const passwordChecks = [
  { label: "Chữ cái thường", re: "[a-z]" },
  { label: "Chữ cái in hoa", re: "[A-Z]" },
  { label: "Ký tự / số", re: "[0-9]|[$&+,:;=?@#|'<>.^*()%!-]" },
  { label: "Độ dài > 8 ký tự", re: ".{8,}" },
];

function PasswordRequirement({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) {
  return (
    <Text
      c={meets ? "teal" : "red"}
      style={{ display: "flex", alignItems: "center" }}
      size="sm">
      {meets ? <IconCheck size={14} /> : <IconX size={14} />}
      <Box ml="xs">{label}</Box>
    </Text>
  );
}

function getStrength(password: string) {
  let multiplier = 0;
  passwordChecks.forEach((rule) => {
    if (!new RegExp(rule.re).test(password)) multiplier += 1;
  });
  return Math.max(100 - (100 / (passwordChecks.length + 1)) * multiplier, 10);
}

export default function Signup() {
  const [password, setPassword] = useState("");
  const [popoverOpened, setPopoverOpened] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : "Email không hợp lệ",
      password: (value) =>
        passwordChecks.every((rule) => new RegExp(rule.re).test(value))
          ? null
          : "Mật khẩu chưa đủ mạnh",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Mật khẩu không khớp",
    },
  });

  const strength = getStrength(password);
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";

  return (
    <Stack>
      <Title size="h2" className={styles.welcomeMessage}>
        {"Tạo tài khoản"}
      </Title>

      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Stack>
          <TextInput
            label="Email"
            placeholder={"Nhập email"}
            {...form.getInputProps("email")}
            required
          />

          <Popover opened={popoverOpened} position="bottom" width="target">
            <Popover.Target>
              <div
                onFocusCapture={() => setPopoverOpened(true)}
                onBlurCapture={() => setPopoverOpened(false)}>
                <PasswordInput
                  label={"Mật khẩu"}
                  placeholder={"Nhập mật khẩu"}
                  {...form.getInputProps("password")}
                  required
                  value={password}
                  onChange={(event) => {
                    setPassword(event.currentTarget.value);
                  }}
                />
              </div>
            </Popover.Target>
            <Popover.Dropdown>
              <Progress color={color} value={strength} size={5} mb="xs" />
              <SimpleGrid cols={2} verticalSpacing="xs">
                {passwordChecks.map((check) => (
                  <PasswordRequirement
                    key={check.label}
                    label={check.label}
                    meets={new RegExp(check.re).test(password)}
                  />
                ))}
              </SimpleGrid>
            </Popover.Dropdown>
          </Popover>

          <PasswordInput
            label={"Xác nhận mật khẩu"}
            placeholder={"Nhập xác nhận mật khẩu"}
            {...form.getInputProps("confirmPassword")}
            required
          />

          <Button fullWidth type="submit" mt="sm">
            {"Đăng ký"}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
