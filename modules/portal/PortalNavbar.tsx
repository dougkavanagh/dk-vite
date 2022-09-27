import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";

export default function PortalNavbar() {
  const router = useRouter();
  console.log(router);
  return (
    <Navbar
      activeMenuOption={router.asPath}
      menuOptions={[
        {
          title: "Dashboard",
          href: "/",
        },
        {
          title: "Patients",
          href: "/patients",
        },
        {
          title: "Schedule",
          href: "/schedule",
        },
      ]}
    ></Navbar>
  );
}
