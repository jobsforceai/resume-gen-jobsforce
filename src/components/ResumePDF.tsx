"use client";

import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  PDFViewer,
  StyleSheet,
  Link,
  pdf,
} from "@react-pdf/renderer";
import type { ResumeData } from "@/lib/schema";

/** Ultra-compact tuning */
const BASE_FONT = 9;
const LINE_HEIGHT = 1.06; // tighter than before
const PAD_X = 18;
const PAD_Y = 12;

const COLOR = {
  text: "#0b1320",
  muted: "#3b4758",
  hair: "#d9dde3",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: PAD_Y,
    paddingBottom: PAD_Y,
    paddingHorizontal: PAD_X,
    fontSize: BASE_FONT,
    color: COLOR.text,
  },
  lh: { lineHeight: LINE_HEIGHT },

  // Header
  name: {
    fontSize: 13.2,
    fontWeight: 800,
    marginBottom: 0.5,
    textAlign: "center",
  },
  headline: {
    fontSize: 9.1,
    fontWeight: 700,
    marginBottom: 0.5,
    textAlign: "center",
  },
  contact: {
    fontSize: 8.5,
    color: COLOR.muted,
    marginBottom: 1,
    textAlign: "center",
  },
  linksRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 1,
    justifyContent: "center",
  },
  link: { marginRight: 4, fontSize: 8.4 },

  // Sections
  section: { marginTop: 3 }, // was 6
  sectionTitle: {
    fontSize: 9,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 0.8, // was 1.5
  },
  hairline: { height: 0.6, backgroundColor: COLOR.hair, marginVertical: 2 },

  // Rows
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  title: { fontSize: 9.1, fontWeight: 700 },
  meta: { color: COLOR.muted, fontSize: 8.3 },

  // Lists
  listBlock: {
    marginLeft: 4,
    marginTop: 0,
    marginBottom: 0,
    lineHeight: LINE_HEIGHT,
  },

  tag: { marginTop: 0.2, color: COLOR.muted, fontSize: 8.3 },
  tiny: { fontSize: 8, color: COLOR.muted },
});

const sanitize = (s: string) => s.replace(/\u2212|–|—/g, "-"); // normalize dashes
const join = (arr?: string[], sep = ", ") =>
  arr && arr.length ? arr.join(sep) : undefined;
const pipeJoin = (arr: (string | undefined)[]) =>
  arr.filter(Boolean).join(" | ");

const LinkRow: React.FC<{ links: { label: string; url: string }[] }> = ({
  links,
}) => (
  <View style={styles.linksRow}>
    {links.map((l, i) => (
      <Text key={i} style={[styles.link, styles.lh]}>
        <Link src={l.url}>{l.label}</Link>
        {i < links.length - 1 ? " |" : ""}
      </Text>
    ))}
  </View>
);

const BulletsTight: React.FC<{ items: string[] }> = ({ items }) => {
  // Render all bullets in one Text node to avoid extra inter-line spacing
  const text = items.map((b) => `• ${sanitize(b)}`).join("\n");
  return <Text style={[styles.listBlock]}>{text}</Text>;
};

const DateRange: React.FC<{ start: string; end: string }> = ({
  start,
  end,
}) => (
  <Text style={[styles.meta, styles.lh]}>
    {start} – {end}
  </Text>
);

export const ResumeDocument: React.FC<{ data: ResumeData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* HEADER */}
      <Text style={[styles.name, styles.lh]}>{data.header.fullName}</Text>
      <View style={styles.hairline} />
      {data.header.headline && (
        <Text style={[styles.headline, styles.lh]}>
          {sanitize(data.header.headline)}
        </Text>
      )}
      <Text style={[styles.contact, styles.lh]}>
        {pipeJoin([
          data.header.location,
          `Phone: ${data.header.phone}`,
          `Email: ${data.header.email}`,
        ])}
      </Text>
      <LinkRow links={data.header.links} />

      {/* SUMMARY (single Text block, tight) */}
      {data.summary && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.lh]}>Summary</Text>
          <Text style={[styles.lh]}>{sanitize(data.summary.paragraph)}</Text>
          {data.summary.highlights?.length ? (
            <Text style={[styles.tiny, styles.lh]}>
              {data.summary.highlights.map(sanitize).join(" • ")}
            </Text>
          ) : null}
        </View>
      )}

      {/* SKILLS (already tight) */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, styles.lh]}>Skills</Text>
        {join(data.technicalSkills.programmingLanguages) && (
          <Text style={[styles.meta, styles.lh]}>
            <Text style={{ fontWeight: 700 }}>Programming:</Text>{" "}
            {join(data.technicalSkills.programmingLanguages)}
          </Text>
        )}
        {join(data.technicalSkills.frameworks) && (
          <Text style={[styles.meta, styles.lh]}>
            <Text style={{ fontWeight: 700 }}>Frameworks/Libraries:</Text>{" "}
            {join(data.technicalSkills.frameworks)}
          </Text>
        )}
        {join(data.technicalSkills.cloudDevOps) && (
          <Text style={[styles.meta, styles.lh]}>
            <Text style={{ fontWeight: 700 }}>Cloud & DevOps:</Text>{" "}
            {join(data.technicalSkills.cloudDevOps)}
          </Text>
        )}
        {join(data.technicalSkills.databases) && (
          <Text style={[styles.meta, styles.lh]}>
            <Text style={{ fontWeight: 700 }}>Databases:</Text>{" "}
            {join(data.technicalSkills.databases)}
          </Text>
        )}
        {join(data.technicalSkills.dataPlatforms) && (
          <Text style={[styles.meta, styles.lh]}>
            <Text style={{ fontWeight: 700 }}>Data Platforms:</Text>{" "}
            {join(data.technicalSkills.dataPlatforms)}
          </Text>
        )}
        {join(data.technicalSkills.tools) && (
          <Text style={[styles.meta, styles.lh]}>
            <Text style={{ fontWeight: 700 }}>Tools:</Text>{" "}
            {join(data.technicalSkills.tools)}
          </Text>
        )}
        {join(data.technicalSkills.other) && (
          <Text style={[styles.meta, styles.lh]}>
            <Text style={{ fontWeight: 700 }}>Other:</Text>{" "}
            {join(data.technicalSkills.other)}
          </Text>
        )}
      </View>

      {/* EXPERIENCE */}
      {data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.lh]}>Experience</Text>
          {data.experience.map((x, i) => (
            <View key={i} style={{ marginBottom: 3 }}>
              <View style={styles.rowBetween}>
                <Text style={[styles.title, styles.lh]}>
                  {x.company} | {x.title}
                </Text>
                <DateRange start={x.start} end={x.end} />
              </View>
              {pipeJoin([x.location, x.employmentType]) ? (
                <Text style={[styles.meta, styles.lh]}>
                  {pipeJoin([x.location, x.employmentType])}
                </Text>
              ) : null}
              <BulletsTight items={x.bullets} />
              {x.tech?.length ? (
                <Text style={[styles.tag, styles.lh]}>
                  <Text style={{ fontWeight: 700 }}>Tech:</Text>{" "}
                  {x.tech.join(", ")}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      )}

      {/* PROJECTS */}
      {data.projects.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.lh]}>Projects</Text>
          {data.projects.map((p, i) => (
            <View key={i} style={{ marginBottom: 3 }}>
              <View style={styles.rowBetween}>
                <Text style={[styles.title, styles.lh]}>
                  {p.name}
                  {p.role ? ` — ${p.role}` : ""}
                </Text>
                <DateRange start={p.start} end={p.end} />
              </View>
              <BulletsTight items={p.bullets} />
              {p.tech?.length ? (
                <Text style={[styles.tag, styles.lh]}>
                  <Text style={{ fontWeight: 700 }}>Tech:</Text>{" "}
                  {p.tech.join(", ")}
                </Text>
              ) : null}
              {p.links?.length ? (
                <Text style={[styles.meta, styles.lh]}>
                  {p.links.map((l, idx) => (
                    <Text key={idx}>
                      <Link src={l.url}>{l.label}</Link>
                      {idx < (p.links?.length || 0) - 1 ? " | " : ""}
                    </Text>
                  ))}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      )}

      {/* EDUCATION */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, styles.lh]}>Education</Text>
        {data.education.map((ed, i) => (
          <View key={i} style={{ marginBottom: 2 }}>
            <View style={styles.rowBetween}>
              <Text style={[styles.title, styles.lh]}>
                {ed.institution} — {ed.location}
              </Text>
              <DateRange start={ed.start} end={ed.end} />
            </View>
            <Text style={[styles.meta, styles.lh]}>
              {ed.degree}
              {ed.gpa ? ` — ${ed.gpaLabel ?? "GPA"}: ${ed.gpa}` : ""}
            </Text>
            {ed.coursework?.length ? (
              <Text style={[styles.meta, styles.lh]}>
                <Text style={{ fontWeight: 700 }}>Coursework:</Text>{" "}
                {ed.coursework.join(", ")}
              </Text>
            ) : null}
            {ed.honors?.length ? (
              <Text style={[styles.meta, styles.lh]}>
                <Text style={{ fontWeight: 700 }}>Honors:</Text>{" "}
                {ed.honors.join(", ")}
              </Text>
            ) : null}
          </View>
        ))}
      </View>

      {/* ACHIEVEMENTS / CERTS / KEYWORDS */}
      {data.achievements.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.lh]}>Achievements</Text>
          <BulletsTight items={data.achievements} />
        </View>
      )}

      {data.certifications?.length ? (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.lh]}>Certifications</Text>
          <Text style={[styles.meta, styles.lh]}>
            {data.certifications.join(" • ")}
          </Text>
        </View>
      ) : null}

      {data.keywordBank?.length ? (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.lh]}>Keywords</Text>
          <Text style={[styles.tiny, styles.lh]}>
            {data.keywordBank.join(", ")}
          </Text>
        </View>
      ) : null}
    </Page>
  </Document>
);

export const ResumePreview: React.FC<{ data: ResumeData }> = ({ data }) => (
  <PDFViewer
    style={{ width: "100%", height: "100%", borderRadius: 12 }}
    showToolbar
  >
    <ResumeDocument data={data} />
  </PDFViewer>
);

// Smart default filename: Name_Role_Resume_YYYY-MM-DD.pdf
function defaultFilename(data: ResumeData) {
  const name = (data.header.fullName || "Candidate")
    .trim()
    .replace(/\s+/g, "-");
  const role = (data.header.headline || "Resume")
    .split(/[•|-]/)[0]
    .trim()
    .replace(/\s+/g, "-");
  const date = new Date().toISOString().slice(0, 10);
  return `${name}_${role}_Resume_${date}.pdf`;
}

export async function downloadPdf(data: ResumeData, filename?: string) {
  const blob = await pdf(<ResumeDocument data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || defaultFilename(data);
  a.click();
  URL.revokeObjectURL(url);
}
