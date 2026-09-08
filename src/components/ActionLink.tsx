import Link from "next/link";
import {ArrowIcon} from "./Icons";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "light" | "text";
  className?: string;
};

export function ActionLink({href, children, variant = "primary", className = ""}: Props) {
  return <Link href={href} className={`action-link action-${variant} ${className}`}><span>{children}</span><ArrowIcon /></Link>;
}
