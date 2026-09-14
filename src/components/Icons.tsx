type IconProps = {className?: string};

export function ArrowIcon({className}: IconProps) {
  return <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true" width="16" height="16"><path d="M3 10h13M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5"/></svg>;
}

export function AnimatedHamburger({className, open}: {className?: string; open: boolean}) {
  const transition = "transform .3s var(--ease, cubic-bezier(.2,.72,.2,1))";
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
    <path d="M5 9h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{transform: open ? "translateY(3px) rotate(45deg)" : "none", transformOrigin: "12px 12px", transition}} />
    <path d="M5 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{transform: open ? "translateY(-3px) rotate(-45deg)" : "none", transformOrigin: "12px 12px", transition}} />
  </svg>;
}

export function MenuIcon({className}: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24"><path d="M5 9h14M5 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export function CloseIcon({className}: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24"><path d="m5 5 14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.5"/></svg>;
}

export function PlusIcon({className}: IconProps) {
  return <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true" width="20" height="20"><path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1.5"/></svg>;
}

export function MinusIcon({className}: IconProps) {
  return <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true" width="20" height="20"><path d="M3 10h14" stroke="currentColor" strokeWidth="1.5"/></svg>;
}

export function PhoneIcon({className}: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24"><path d="M8.3 3.7 10 7.8 7.8 9.5c1.3 3 3.7 5.4 6.7 6.7l1.7-2.2 4.1 1.7-.7 4c-.2.8-.9 1.3-1.7 1.3C9.7 21 3 14.3 3 6.1c0-.8.5-1.5 1.3-1.7l4-.7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
}

export function MailIcon({className}: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24"><rect x="3" y="5" width="18" height="14" stroke="currentColor" strokeWidth="1.5"/><path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.5"/></svg>;
}

export function LocationIcon({className}: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/></svg>;
}
