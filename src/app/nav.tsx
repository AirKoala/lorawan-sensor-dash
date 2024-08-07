"use client";

import Link from "next/link";
import Navbar from "react-bootstrap/Navbar";
import BootstrapNav from "react-bootstrap/Nav";
// import {
//   NavigationMenu,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   navigationMenuTriggerStyle,
// } from "@/components/ui/navigation-menu"


export default function Nav() {
  return (
    <Navbar sticky="top" expand="sm" className="bg-body-secondary px-5">
      <Navbar.Brand href="#">Lorawan Sensor Dashboard</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse>
        <BootstrapNav className="me-auto">
          <BootstrapNav.Link href="/dashboard/sensor/list">Sensor List</BootstrapNav.Link>
          <BootstrapNav.Link href="/dashboard/sensor/add">Add Sensor</BootstrapNav.Link>
        </BootstrapNav>
      </Navbar.Collapse>
    </Navbar>
  );
}
