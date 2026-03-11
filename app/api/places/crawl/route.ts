import Firecrawl, { type CrawlJob, type Document } from "@mendable/firecrawl-js";
import { NextResponse } from "next/server";

const MAX_CRAWL_PAGES = 10;
const MAX_GET_PAGES = 25;

type ExtractionPayload = {
  name?: string;
  description?: string;
  about?: string;
  address?: string;
  phone?: string;
  categories?: string[];
  services?: string[];
  rating?: number;
  reviewCount?: number;
};

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function toObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function pickFirstString(...values: Array<unknown>): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

function pickFirstNumber(...values: Array<unknown>): number | undefined {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return undefined;
}

function normalizeTypeLabel(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]+/gu, "")
    .replace(/\s+/g, "_");
}

function extractPlainText(markdown: string | undefined): string | undefined {
  if (typeof markdown !== "string" || markdown.trim().length === 0) {
    return undefined;
  }
  const text = markdown
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[[^\]]*]\(([^)]+)\)/g, "$1")
    .replace(/[#>*_`~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 0 ? text : undefined;
}

function extractPhoneFromText(text: string | undefined): string | undefined {
  if (!text) {
    return undefined;
  }
  const match = text.match(/(?:\+?\d[\d\s().-]{6,}\d)/);
  return match ? match[0].trim() : undefined;
}

function getPageUrl(page: Document): string | undefined {
  if (!page.metadata) {
    return undefined;
  }
  return pickFirstString(page.metadata.url, page.metadata.sourceURL, page.metadata.ogUrl);
}

function getExtractionPayload(pages: Document[]): ExtractionPayload {
  for (const page of pages) {
    const fromJson = toObject(page.json);
    if (fromJson) {
      return {
        name: pickFirstString(fromJson.name, fromJson.businessName, fromJson.companyName),
        description: pickFirstString(fromJson.description, fromJson.summary, fromJson.about),
        about: pickFirstString(fromJson.about, fromJson.description),
        address: pickFirstString(fromJson.address, fromJson.location),
        phone: pickFirstString(fromJson.phone, fromJson.phoneNumber, fromJson.telephone),
        categories: Array.isArray(fromJson.categories)
          ? fromJson.categories.filter((item): item is string => typeof item === "string")
          : undefined,
        services: Array.isArray(fromJson.services)
          ? fromJson.services.filter((item): item is string => typeof item === "string")
          : undefined,
        rating: pickFirstNumber(fromJson.rating),
        reviewCount: pickFirstNumber(fromJson.reviewCount, fromJson.user_ratings_total),
      };
    }
  }

  return {};
}

function buildPlaceLikeResult(inputUrl: string, pages: Document[]) {
  const extraction = getExtractionPayload(pages);
  const bestPage =
    pages.find((page) => {
      const pageUrl = getPageUrl(page);
      return pageUrl === inputUrl;
    }) ?? pages[0];
  const metadata = toObject(bestPage?.metadata) ?? {};
  const markdownText = extractPlainText(bestPage?.markdown);
  const hostname = new URL(inputUrl).hostname.replace(/^www\./, "");
  const pageUrl = bestPage ? getPageUrl(bestPage) : null;

  const name =
    pickFirstString(
      extraction.name,
      metadata.ogTitle,
      metadata.title,
      hostname.split(".")[0]?.replace(/[-_]/g, " ")
    ) ?? "Negocio";

  const description =
    pickFirstString(extraction.description, extraction.about, metadata.description, markdownText) ??
    `Sitio web de ${name}`;

  const address = pickFirstString(extraction.address);
  const phone = pickFirstString(extraction.phone, extractPhoneFromText(markdownText));
  const categories = [...(extraction.categories ?? []), ...(extraction.services ?? [])]
    .map(normalizeTypeLabel)
    .filter((value) => value.length > 0);
  const uniqueTypes = Array.from(new Set(categories));

  return {
    place_id: inputUrl,
    name,
    formatted_address: address,
    formatted_phone_number: phone,
    website: pickFirstString(pageUrl, inputUrl),
    types: uniqueTypes,
    rating: extraction.rating ?? null,
    user_ratings_total: extraction.reviewCount ?? null,
    price_level: null,
    opening_hours: null,
    reviews: [],
    editorial_summary: {
      overview: description.slice(0, 560),
    },
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Unknown Firecrawl error";
}

async function getCrawlStatus(client: Firecrawl, crawlId: string): Promise<CrawlJob | null> {
  return client.getCrawlStatus(crawlId, {
    autoPaginate: true,
    maxResults: MAX_GET_PAGES,
  });
}

function getFirecrawlClient(): Firecrawl | null {
  const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;
  if (!firecrawlApiKey) {
    return null;
  }
  return new Firecrawl({ apiKey: firecrawlApiKey });
}

export async function POST(request: Request) {
  let url: string | null = null;
  try {
    const body = (await request.json()) as { url?: string; lang?: string };
    url = typeof body.url === "string" ? body.url.trim() : null;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!url || !isValidHttpUrl(url)) {
    return NextResponse.json({ error: "A valid http/https URL is required" }, { status: 400 });
  }

  const client = getFirecrawlClient();
  if (!client) {
    return NextResponse.json({ error: "Firecrawl API key is missing" }, { status: 500 });
  }

  try {
    const start = await client.startCrawl(url, {
      limit: MAX_CRAWL_PAGES,
      scrapeOptions: {
        onlyMainContent: true,
        formats: [
          "markdown",
          {
            type: "json",
            prompt:
              "Extract business profile data: name, description/about, address, phone, categories, services, rating and reviewCount. Keep null if unknown.",
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                about: { type: "string" },
                address: { type: "string" },
                phone: { type: "string" },
                categories: { type: "array", items: { type: "string" } },
                services: { type: "array", items: { type: "string" } },
                rating: { type: "number" },
                reviewCount: { type: "number" },
              },
              additionalProperties: false,
            },
          },
        ],
      },
    });

    return NextResponse.json(
      {
        jobId: start.id,
        status: "scraping",
      },
      { status: 202 }
    );
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 502 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");
  const sourceUrl = searchParams.get("url");

  if (!jobId) {
    return NextResponse.json({ error: "jobId is required" }, { status: 400 });
  }

  const client = getFirecrawlClient();
  if (!client) {
    return NextResponse.json({ error: "Firecrawl API key is missing" }, { status: 500 });
  }

  try {
    const crawlStatus = await getCrawlStatus(client, jobId);
    if (!crawlStatus) {
      return NextResponse.json({ error: "Unable to read Firecrawl status" }, { status: 502 });
    }

    if (crawlStatus.status === "failed" || crawlStatus.status === "cancelled") {
      return NextResponse.json(
        { status: crawlStatus.status, error: `Firecrawl crawl failed with status: ${crawlStatus.status}` },
        { status: 502 }
      );
    }

    if (crawlStatus.status !== "completed") {
      return NextResponse.json({
        status: crawlStatus.status,
        completed: crawlStatus.completed,
        total: crawlStatus.total,
      });
    }

    const pages = crawlStatus.data ?? [];
    if (pages.length === 0) {
      return NextResponse.json(
        { status: "completed", error: "Firecrawl returned no pages for this URL" },
        { status: 502 }
      );
    }

    const fallbackUrl =
      pages.map((page) => getPageUrl(page)).find((value) => typeof value === "string") ?? "";
    const effectiveUrl = sourceUrl && isValidHttpUrl(sourceUrl) ? sourceUrl : fallbackUrl;

    if (!effectiveUrl) {
      return NextResponse.json(
        { status: "completed", error: "Could not resolve source URL from crawl result" },
        { status: 502 }
      );
    }

    const result = buildPlaceLikeResult(effectiveUrl, pages);
    return NextResponse.json({
      status: "completed",
      completed: crawlStatus.completed,
      total: crawlStatus.total,
      result,
    });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 502 });
  }
}
