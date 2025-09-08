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
import { motion } from "framer-motion";

/** Ultra-compact tuning */
const BASE_FONT = 11;
const LINE_HEIGHT = 1.06; // tighter than before
const PAD_X = 36;
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
    fontFamily: "Times-Roman",
  },
  lh: { lineHeight: 1.2 },
  bold: { fontFamily: "Times-Bold" },

  // Header
  name: {
    fontSize: 16,
    fontFamily: "Times-Bold",
    marginBottom: 0.5,
    textAlign: "center",
  },
  headline: {
    fontSize: 11.5,
    fontFamily: "Times-Bold",
    marginBottom: 0.5,
    textAlign: "center",
  },
  contact: {
    fontSize: 11,
    color: COLOR.muted,
    marginBottom: 1,
    textAlign: "center",
  },
  contactContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: 1,
  },
  linksRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 0.5,
    justifyContent: "center",
  },
  link: {
    marginRight: 4,
    fontSize: 11,
    fontFamily: "Times-Bold",
    color: "#1054CC",
  },

  // Sections
  section: { marginTop: 3 }, // was 6
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Times-Bold",
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
  title: { fontSize: 11.5, fontFamily: "Times-Bold" },
  meta: { color: COLOR.muted, fontSize: 11 },

  // Lists
  bulletContainer: {
    flexDirection: "row",
    marginBottom: 1.5,
  },
  bulletPoint: {
    width: 10,
    fontSize: BASE_FONT,
  },
  bulletText: {
    flex: 1,
    fontSize: BASE_FONT,
  },

  p: { fontSize: BASE_FONT, lineHeight: 1.2 },
  tag: { marginTop: 0.2, color: COLOR.muted, fontSize: 11 },
  tiny: { fontSize: 11, color: COLOR.muted, lineHeight: 1.15 },
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

const BulletsTight: React.FC<{ items: string[] }> = ({ items }) => (
  <View>
    {items.map((item, i) => (
      <View key={i} style={styles.bulletContainer}>
        <Text style={styles.bulletPoint}>•</Text>
        <Text style={[styles.bulletText, styles.lh]}>{sanitize(item)}</Text>
      </View>
    ))}
  </View>
);

const DateRange: React.FC<{
  start?: string | null;
  end?: string | null;
}> = ({ start, end }) => {
  if (!start && !end) return null;
  const text = [start, end].filter(Boolean).join(" – ");
  return <Text style={[styles.meta, styles.lh]}>{text}</Text>;
};

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
      <View style={styles.contactContainer}>
        <Text style={[styles.contact, { marginBottom: 0 }]}>
          {pipeJoin([
            data.header.location,
            `Phone: ${data.header.phone}`,
            `Email: ${data.header.email}`,
          ])}
        </Text>
        {data.header.links.length > 0 && (
          <Text style={[styles.contact, { marginBottom: 0 }]}>&nbsp;|&nbsp;</Text>
        )}
        <Text style={[styles.contact, { marginBottom: 0 }]}>
          {data.header.links.map((l, i) => (
            <Text key={i}>
              <Link src={l.url} style={styles.link}>
                {l.label}
              </Link>
              {i < data.header.links.length - 1 ? " | " : ""}
            </Text>
          ))}
        </Text>
      </View>
      {/* SUMMARY (single Text block, tight) */}
      {data.summary && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.lh]}>Summary</Text>
          <View style={styles.hairline} />
          <Text style={styles.p}>
            {sanitize(data.summary.paragraph).replace(/\s*\n+\s*/g, " ")}
          </Text>
          {data.summary.highlights?.length ? (
            <Text style={styles.tiny}>
              {data.summary.highlights.map(sanitize).join(" • ")}
            </Text>
          ) : null}
        </View>
      )}
      {/* SKILLS (already tight) */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, styles.lh]}>Skills</Text>
        <View style={styles.hairline} />
        {join(data.technicalSkills.programmingLanguages) && (
          <Text style={[styles.meta, styles.lh]}>
            <Text style={styles.bold}>Programming:</Text>{" "}
            {join(data.technicalSkills.programmingLanguages)}
          </Text>
        )}
        {join(data.technicalSkills.frameworks) && (
          <Text style={[styles.meta, styles.lh]}>
            <Text style={styles.bold}>Frameworks/Libraries:</Text>{" "}
            {join(data.technicalSkills.frameworks)}
          </Text>
        )}
        {join(data.technicalSkills.cloudDevOps) && (
          <Text style={[styles.meta, styles.lh]}>
            <Text style={styles.bold}>Cloud & DevOps:</Text>{" "}
            {join(data.technicalSkills.cloudDevOps)}
          </Text>
        )}
        {join(data.technicalSkills.databases) && (
          <Text style={[styles.meta, styles.lh]}>
            <Text style={styles.bold}>Databases:</Text>{" "}
            {join(data.technicalSkills.databases)}
          </Text>
        )}
        {join(data.technicalSkills.dataPlatforms) && (
          <Text style={[styles.meta, styles.lh]}>
            <Text style={styles.bold}>Data Platforms:</Text>{" "}
            {join(data.technicalSkills.dataPlatforms)}
          </Text>
        )}
        {join(data.technicalSkills.tools) && (
          <Text style={[styles.meta, styles.lh]}>
            <Text style={styles.bold}>Tools:</Text>{" "}
            {join(data.technicalSkills.tools)}
          </Text>
        )}
        {join(data.technicalSkills.other) && (
          <Text style={[styles.meta, styles.lh]}>
            <Text style={styles.bold}>Other:</Text>{" "}
            {join(data.technicalSkills.other)}
          </Text>
        )}
      </View>
      {/* EXPERIENCE */}
      {data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.lh]}>Experience</Text>
          <View style={styles.hairline} />
          {data.experience.map((x, i) => (
            <View key={i} style={{ marginBottom: 3 }}>
              <View style={styles.rowBetween}>
                <Text style={[styles.title, styles.lh]}>
                  {x.company} | {x.title}
                </Text>
                <DateRange start={x.start} end={x.end} />
              </View>
              {/* {pipeJoin([x.location, x.employmentType]) ? (
                <Text style={[styles.meta, styles.lh]}>
                  {pipeJoin([x.location, x.employmentType])}
                </Text>
              ) : null} */}
              <BulletsTight items={x.bullets} />
              {x.tech?.length ? (
                <Text style={[styles.tag, styles.lh]}>
                  <Text style={styles.bold}>Tech:</Text>{" "}
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
          <View style={styles.hairline} />
          {data.projects.map((p, i) => (
            <View key={i} style={{ marginBottom: 3 }}>
              <View style={styles.rowBetween}>
                <Text style={[styles.title, styles.lh]}>
                  {p.name}
                  {p.role ? ` — ${p.role}` : ""}
                  {p.links?.length ? " | " : ""}
                  {p.links?.map((l, idx) => (
                    <Text key={idx}>
                      <Link src={l.url} style={styles.link}>
                        {l.label}
                      </Link>
                      {idx < (p.links?.length || 0) - 1 ? " | " : ""}
                    </Text>
                  ))}
                </Text>
                <DateRange start={p.start} end={p.end} />
              </View>
              <BulletsTight items={p.bullets} />
              {p.tech?.length ? (
                <Text style={[styles.tag, styles.lh]}>
                  <Text style={styles.bold}>Tech:</Text>{" "}
                  {p.tech.join(", ")}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      )}
      {/* EDUCATION */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, styles.lh]}>Education</Text>
        <View style={styles.hairline} />
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
                <Text style={styles.bold}>Coursework:</Text>{" "}
                {ed.coursework.join(", ")}
              </Text>
            ) : null}
            {ed.honors?.length ? (
              <Text style={[styles.meta, styles.lh]}>
                <Text style={styles.bold}>Honors:</Text>{" "}
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
          <View style={styles.hairline} />
          <BulletsTight items={data.achievements} />
        </View>
      )}
      {data.certifications?.length ? (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.lh]}>Certifications</Text>
          <View style={styles.hairline} />
          <Text style={[styles.meta, styles.lh]}>
            {data.certifications.join(" • ")}
          </Text>
        </View>
      ) : null}
      {data.keywordBank?.length ? (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.lh]}>Keywords</Text>
          <View style={styles.hairline} />
          <Text style={[styles.tiny, styles.lh]}>
            {data.keywordBank.join(", ")}
          </Text>
        </View>
      ) : null}
    </Page>
  </Document>
);

export const ResumePreview: React.FC<{ data: ResumeData; key?: number }> = ({
  data,
  key,
}) => {
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <motion.div
      key={key}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <PDFViewer
        style={{ width: "100%", height: "100%", borderRadius: 12 }}
        showToolbar
      >
        <ResumeDocument data={data} />
      </PDFViewer>
    </motion.div>
  );
};

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
