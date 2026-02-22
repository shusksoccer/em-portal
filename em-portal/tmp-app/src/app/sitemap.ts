import type { MetadataRoute } from "next";
import { getCollection, getTagMap } from "@/lib/content";
import { getSiteUrlString } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrlString();
  const staticPaths = [
    "",
    "/intro",
    "/curriculum",
    "/worksheets",
    "/glossary",
    "/figures",
    "/library",
    "/people",
    "/faq",
    "/search",
    "/tags",
  ];
  const lessonPaths = getCollection("lessons").map((doc) => `/curriculum/${doc.slug}`);
  const worksheetPaths = getCollection("worksheets").map((doc) => `/worksheets/${doc.slug}`);
  const glossaryPaths = getCollection("glossary").map((doc) => `/glossary/${doc.slug}`);
  const figurePaths = getCollection("figures").map((doc) => `/figures/${doc.slug}`);
  const tagPaths = Object.keys(getTagMap()).map((tag) => `/tags/${encodeURIComponent(tag)}`);

  return [
    ...staticPaths,
    ...lessonPaths,
    ...worksheetPaths,
    ...glossaryPaths,
    ...figurePaths,
    ...tagPaths,
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
