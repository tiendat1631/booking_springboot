import { logo } from "@/assets/images";
import {
  Box,
  Button,
  Flex,
  Image,
  Text
} from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import ThemeSwitcher from "./ThemeSwitcher";

export default function NavBar() {
  const location = useLocation();

  const hideLogins = ["/welcome"].includes(location.pathname);

  return (
    <>
      <div className={styles.navbar}>
        {/* Home button */}
        <Box>
          <Link to="/" className={styles.homeButton}>
            <Image hidden src={logo} h={32} w={32} />
            <Text visibleFrom="sm" size="xl" fw="bold">
              VéXe24
            </Text>
          </Link>
        </Box>

        <Flex align="center" justify="end" gap="sm">
          <ThemeSwitcher />
          {/* Login and Signup */}
          {!hideLogins && (
            <>
              <Button
                component={Link}
                to="/welcome?tab=login"
                variant="default">
                {"Đăng nhập"}
              </Button>
              <Button component={Link} to="/welcome?tab=signup">
                {"Đăng ký"}
              </Button>
            </>
          )}
        </Flex>
      </div>
    </>
  );
}
