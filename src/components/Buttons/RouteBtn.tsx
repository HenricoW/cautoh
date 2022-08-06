import { useRouter } from "next/router";
import React from "react";

import BaseBtn from "./Button";

interface RouteBtnProps {
  text: string;
  route: string;
}

const RouteBtn = ({ text, route }: RouteBtnProps) => {
  const router = useRouter();
  return <BaseBtn onClick={() => router.push(route)}>{text}</BaseBtn>;
};

export default RouteBtn;
