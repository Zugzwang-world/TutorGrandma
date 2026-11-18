// The band across the top of the stage's right half, kept at a fixed height so the layout never moves.
// R4 (Wave 2) fills it: Nani's five files as a strip, and the jobs board with its countdowns.
import "./stage.css";

export function StageTopBand() {
  return (
    <section className="stg-band" aria-label="Nani's files and jobs">
      <span className="stg-band-label">Nani&apos;s files · jobs</span>
    </section>
  );
}
