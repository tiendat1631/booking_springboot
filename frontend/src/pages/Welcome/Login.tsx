import {
  Anchor,
  Button,
  Flex,
  PasswordInput,
  Stack,
  TextInput,
  Title
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link } from "react-router-dom";
import styles from "./Welcome.module.css";

export default function Login() {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : "Email không hợp lệ."
    },
  });

  return (
    <Stack>
      <Title size="h2" className={styles.welcomeMessage}>
        Chào mừng trở lại 🎉
      </Title>

      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Stack>
          <TextInput
            label="Email"
            placeholder={"Nhập email"}
            {...form.getInputProps("email")}
            required
          />

          <PasswordInput
            label={"Mật khẩu"}
            placeholder={"Nhập mật khẩu"}
            {...form.getInputProps("password")}
            required
          />
          <Flex justify="flex-end">
            <Anchor component={Link} to="/password-reset" size="sm">
              Quên mật khẩu?
            </Anchor>
          </Flex>

          <Button fullWidth type="submit">
            Đăng nhập
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
