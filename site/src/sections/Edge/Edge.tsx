import clsx from "clsx";
import { Fragment } from "react";
import { Reveal } from "@/components/Reveal";
import { ANCHORS, PAIRS, PROJECTS, caseHref, splitStory } from "@/content";
import { EDGE_STORIES } from "@/content/sections/edge";
import t from "@/styles/type.module.css";
import type { SectionProps } from "../types";
import styles from "./Edge.module.css";
import type { StoryClauseView, StoryView, StoryVisual } from "./model";
import { Stories } from "./Stories";

/** Between two client names as the index arrives (01 §5.2: a list arrives row by row). */
const ROLL_CALL = 40;

/**
 * Chapter 2, `edge` (02-home.md §2): "I also speak client".
 * Stone field, two movements 128px apart.
 *   1. The clients: H2, statement, then the client index as display type
 *      (plain text, never logos or links), each group closed by its context.
 *   2. The stories: the invitation names the live thing (Stories), six
 *      verbatim user stories with what he did and what happened; the
 *      picked tab's S marker parts with its story's pair, as one gesture.
 * Every word is in the HTML; the live thing hydrates from <details>.
 */
export function Edge({ locale, dict }: SectionProps) {
  const copy = dict.home.edge;

  const groups = [
    { id: "retail", names: PROJECTS.havaianas.partners, context: copy.clientsContext.retail },
    {
      id: "partners",
      names: PROJECTS["appbazar-product"].partners,
      context: copy.clientsContext.partners,
    },
  ] as const;

  const stories: StoryView[] = EDGE_STORIES.map((s) => {
    const words = copy.stories[s.id];
    const project = dict.projects[s.case];
    const sentence = project.stories?.[s.story] ?? "";
    const split = splitStory(sentence, locale);
    const clauses: StoryClauseView[] = split
      ? split.map((c) => ({ label: c.label, text: c.text, join: /['’]$/.test(c.label) ? "" : " " }))
      : [{ label: "", text: sentence, join: "" }];
    let visual: StoryVisual = null;
    if (s.visual === "typeSet") visual = { kind: "typeSet", ...copy.typeSet };
    else if (s.visual) visual = { kind: "pair", data: PAIRS[s.visual], copy: dict.home.pairs[s.visual] };
    return {
      id: s.id,
      persona: words.persona,
      company: words.company,
      clauses,
      built: words.built,
      happened: words.happened,
      visual,
      caseHref: caseHref(locale, s.case),
      caseTitle: project.title,
    };
  });

  return (
    <Reveal
      as="section"
      id={ANCHORS.stories}
      data-field="stone"
      aria-labelledby="edge-title"
      className={styles.root}
    >
      <h2 id="edge-title" data-reveal className={clsx(t.display, styles.title)}>
        {copy.h2}
      </h2>
      <p data-reveal className={clsx(t.statement, styles.statement)}>
        {copy.statement}
      </p>

      {/* The index arrives as a roll call (one nested Reveal): group 1 name
          by name, 40ms apart, its context line, then group 2 and its line,
          two chapter staggers after the statement (Edge.module.css). */}
      <Reveal stagger={ROLL_CALL} className={styles.index}>
        {groups.map((group) => (
          <div key={group.id} className={styles.group}>
            <ul className={styles.names} aria-describedby={`edge-clients-${group.id}`}>
              {group.names.map((name, i) => {
                const last = i === group.names.length - 1;
                return (
                  <Fragment key={name}>
                    <li data-reveal="" className={styles.name}>
                      {last ? name : `${name},`}
                    </li>
                    {last ? null : " "}
                  </Fragment>
                );
              })}
            </ul>
            <p
              id={`edge-clients-${group.id}`}
              data-reveal="fade"
              className={clsx(t.small, styles.context)}
            >
              {group.context}
            </p>
          </div>
        ))}
      </Reveal>

      <div className={styles.storiesBlock}>
        <p id="stories-invite" data-reveal className={clsx(t.statement, styles.invite)}>
          {copy.invite}
        </p>
        <Stories
          stories={stories}
          labels={{
            whatIBuilt: copy.whatIBuilt,
            whatHappened: copy.whatHappened,
            readCase: copy.readCase,
          }}
          inviteId="stories-invite"
        />
      </div>
    </Reveal>
  );
}
