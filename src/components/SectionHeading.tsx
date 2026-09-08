export function SectionHeading({kicker, title, body, light = false}: {kicker: string; title: string; body?: string; light?: boolean}) {
  return <div className={`section-heading ${light ? "light" : ""}`}>
    <p className="kicker">{kicker}</p>
    <h2>{title}</h2>
    {body && <p className="section-lead">{body}</p>}
  </div>;
}
