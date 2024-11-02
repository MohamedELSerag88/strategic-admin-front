import { useSelector } from "@/store/hooks";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import { AppState } from "@/store/store";
import Image from "next/image";

const Logo = () => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? "40px" : "180px",
    overflow: "hidden",
    display: "block",
  }));

  if (customizer.activeDir === "ltr") {
    return (
      <LinkStyled
        href="/"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {customizer.activeMode === "dark" ? (
          <Image
            src="/images/logos/light-logo.svg"
            alt="logo"
            height={customizer.TopbarHeight}
            priority
            width={120}
            style={{ height: "auto" }}
          />
        ) : (
          <Image
            src={"/images/logos/mina-logo.png"}
            alt="logo"
            height={customizer.TopbarHeight}
            priority
            width={120}
            style={{ height: "auto" }}
          />
        )}
      </LinkStyled>
    );
  }

  return (
    <LinkStyled href="/">
      {customizer.activeMode === "dark" ? (
        <Image
          src="/images/logos/dark-rtl-logo.svg"
          alt="logo"
          height={customizer.TopbarHeight}
          priority
          width={120}
          style={{ height: "auto" }}
        />
      ) : (
        <Image
          src="/images/logos/light-logo-rtl.svg"
          alt="logo"
          height={customizer.TopbarHeight}
          priority
          width={120}
          style={{ height: "auto" }}
        />
      )}
    </LinkStyled>
  );
};

export default Logo;
