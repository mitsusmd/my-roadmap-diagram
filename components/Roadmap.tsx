"use client";

import { useEffect, useState } from "react";

type Topic = {
  id: string;
  title: string;
  description: string;
  links: { label: string; url: string }[];
};
type Section = { id: string; title: string; topics: Topic[] };
type RoadmapData = { title: string; subtitle: string; sections: Section[] };

const STORAGE_KEY = "frontend-roadmap-done";

export default function Roadmap({ data }: { data: RoadmapData }) {
  const [done, setDone] = useState<string[]>([]);
  const [selected, setSelected] = useState<Topic | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Хадгалсан явцыг ачаална
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setDone(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  // Явц өөрчлөгдөх бүрд хадгална
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
    } catch {}
  }, [done, loaded]);

  // Esc дарахад тайлбарыг хаана
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const allTopics = data.sections.flatMap((s) => s.topics);
  const percent = Math.round((done.length / allTopics.length) * 100);

  const toggle = (id: string) =>
    setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));

  const TopicBox = ({ topic }: { topic: Topic }) => {
    const isDone = done.includes(topic.id);
    return (
      <div
        className={`topic-box ${isDone ? "is-done" : ""} ${
          selected?.id === topic.id ? "is-selected" : ""
        }`}
      >
        <input
          type="checkbox"
          checked={isDone}
          onChange={() => toggle(topic.id)}
          aria-label={`${topic.title} дууссан`}
        />
        <button onClick={() => setSelected(topic)}>{topic.title}</button>
      </div>
    );
  };

  return (
    <main className="page">
      <header className="hero">
        <h1>{data.title}</h1>
        <p>{data.subtitle}</p>
        <div className="progress" aria-label={`Явц ${percent}%`}>
          <div className="progress-bar" style={{ width: `${percent}%` }} />
        </div>
        <p className="progress-text">
          {done.length} / {allTopics.length} сэдэв дууссан ({percent}%)
          {done.length > 0 && (
            <button className="link-btn" onClick={() => setDone([])}>
              Дахин эхлэх
            </button>
          )}
        </p>
      </header>

      <div className="diagram">
        {data.sections.map((section) => {
          const right = section.topics.filter((_, i) => i % 2 === 0);
          const left = section.topics.filter((_, i) => i % 2 === 1);
          const count = section.topics.filter((t) => done.includes(t.id)).length;
          return (
            <div key={section.id} className="row">
              <div className="side left">
                {left.map((t) => (
                  <TopicBox key={t.id} topic={t} />
                ))}
              </div>
              <div className="section-box">
                <strong>{section.title}</strong>
                <span>
                  {count}/{section.topics.length}
                </span>
              </div>
              <div className="side right">
                {right.map((t) => (
                  <TopicBox key={t.id} topic={t} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <aside className={`drawer ${selected ? "open" : ""}`} aria-live="polite">
        {selected && (
          <>
            <button className="close" onClick={() => setSelected(null)} aria-label="Хаах">
              ×
            </button>
            <h3>{selected.title}</h3>
            <p>{selected.description}</p>
            {selected.links.length > 0 && (
              <>
                <h4>Суралцах эх сурвалж</h4>
                <ul className="links">
                  {selected.links.map((l) => (
                    <li key={l.url}>
                      <a href={l.url} target="_blank" rel="noreferrer">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <button className="done-btn" onClick={() => toggle(selected.id)}>
              {done.includes(selected.id) ? "Дуусаагүй гэж тэмдэглэх" : "Дууссан гэж тэмдэглэх"}
            </button>
          </>
        )}
      </aside>
    </main>
  );
}
