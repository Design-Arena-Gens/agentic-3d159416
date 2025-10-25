"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import styles from "./page.module.css";

const prompts = [
  "Take a deep breath and notice what already feels good.",
  "Send someone a quick message just to say hi.",
  "Move your body for five minutes, even if it's just a stretch.",
  "Pick one thing you can finish in under ten minutes and do it first.",
  "Drink a glass of water before you dive back in.",
  "Step outside for a moment and let the light reset your focus.",
  "Celebrate a tiny win you had this week.",
];

const quickLinks = [
  {
    href: "https://keep.google.com/",
    title: "Capture a note",
    description: "Jot down the next idea before it slips away.",
  },
  {
    href: "https://calendar.google.com/",
    title: "Check your calendar",
    description: "See what's on deck and block a little breathing room.",
  },
  {
    href: "https://www.loom.com/",
    title: "Record a hello",
    description: "Face-to-face beats text when you want to connect fast.",
  },
];

function getTimeOfDay(date: Date) {
  const hour = date.getHours();
  if (hour < 6) return "a gentle early start";
  if (hour < 12) return "a bright morning";
  if (hour < 18) return "a grounded afternoon";
  return "a soft evening";
}

function formatClockTime(date: Date) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function Home() {
  const [nameDraft, setNameDraft] = useState("");
  const [focusDraft, setFocusDraft] = useState("");
  const [savedName, setSavedName] = useState("");
  const [intention, setIntention] = useState("");

  const now = useMemo(() => new Date(), []);
  const dayName = useMemo(
    () =>
      new Intl.DateTimeFormat("en", {
        weekday: "long",
      }).format(now),
    [now],
  );
  const timeOfDay = useMemo(() => getTimeOfDay(now), [now]);
  const clockTime = useMemo(() => formatClockTime(now), [now]);
  const suggestion = useMemo(
    () => prompts[now.getDay() % prompts.length],
    [now],
  );

  const greeting = useMemo(() => {
    const candidate = (savedName || nameDraft).trim();
    if (!candidate) {
      return `Hi, happy ${dayName}!`;
    }
    return `Hi ${candidate}, happy ${dayName}!`;
  }, [dayName, nameDraft, savedName]);

  const intentionLine = intention
    ? `Let's make a little progress on "${intention}".`
    : "Set a tiny intention for today so you know what matters next.";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavedName(nameDraft.trim());
    setIntention(focusDraft.trim());
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Friendly check-in</span>
          <h1 className={styles.heading}>{greeting}</h1>
          <p className={styles.subheading}>
            It&apos;s {dayName} and the time is {clockTime}. Here&apos;s to{" "}
            {timeOfDay}.{" "}
            {intention
              ? `You chose "${intention}" as your focus.`
              : "What do you want to show up for?"}
          </p>
        </section>

        <section className={styles.grid}>
          <article className={styles.card}>
            <header className={styles.cardHeader}>
              <h2>Set your intention</h2>
              <p>{intentionLine}</p>
            </header>
            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.label}>
                <span>Your name</span>
                <input
                  value={nameDraft}
                  onChange={(event) => setNameDraft(event.target.value)}
                  placeholder="Type a nickname or leave it blank"
                />
              </label>
              <label className={styles.label}>
                <span>Today I want to...</span>
                <input
                  value={focusDraft}
                  onChange={(event) => setFocusDraft(event.target.value)}
                  placeholder="Call a friend, finish a draft, stretch..."
                />
              </label>
              <button type="submit">Save this moment</button>
            </form>
          </article>

          <article className={styles.card}>
            <header className={styles.cardHeader}>
              <h2>Gentle nudge</h2>
              <p>A tiny idea to nurture the day.</p>
            </header>
            <p className={styles.suggestion}>{suggestion}</p>
          </article>

          <article className={styles.card}>
            <header className={styles.cardHeader}>
              <h2>Quick jump</h2>
              <p>Keep connections easy and warm.</p>
            </header>
            <ul className={styles.linkList}>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    <span className={styles.linkTitle}>{link.title}</span>
                    <span className={styles.linkDescription}>
                      {link.description}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
}
