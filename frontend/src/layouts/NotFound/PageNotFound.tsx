import { Button, Container, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Container size="sm" style={{ textAlign: "center", marginTop: "10vh" }}>
      <Title order={1} size={50}>
        404
      </Title>

      <Text size="lg" c="dimmed" mt="sm">
        {"Không tìm thấy trang"}
      </Text>

      <Button component={Link} to="/" variant="filled" mt="lg">
        {"Quay về trang chủ"}
      </Button>
    </Container>
  );
}
