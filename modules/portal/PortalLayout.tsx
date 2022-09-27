import PortalNavbar from "./PortalNavbar";

export default function PortalLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <PortalNavbar />
      {props.children}
    </>
  );
}
