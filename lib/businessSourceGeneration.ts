export type GenerationPlan = "starter" | "pro" | "agency" | "scale";
export type SourceType = "google" | "url";
export type SourceBlock = "profile" | "services" | "hours";

export type GenerationEntitlement = {
  plan: GenerationPlan;
  monthlyLimit: number | null;
  usedThisMonth: number;
  remaining: number | null;
  isLimited: boolean;
};

export type SourceProfilePreview = {
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  website: string;
  googlePlaceId: string;
};

export type SourceServicePreview = {
  name: string;
  description: string;
};

export type SourceHourPreview = {
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
};

export type BusinessSourcePreview = {
  sourceType: SourceType;
  profile: SourceProfilePreview;
  services: SourceServicePreview[];
  hours: SourceHourPreview[];
  rawSource: Record<string, unknown>;
};

type BuildPreviewInput = {
  sourceType: SourceType;
  sourcePayload: unknown;
};

const IGNORE_TYPES = new Set([
  "point_of_interest",
  "establishment",
  "food",
  "store",
  "health",
  "locality",
  "political",
  "premise",
  "subpremise",
]);

function toObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function pickFirstString(...values: Array<unknown>): string {
  for (const value of values) {
    const nextValue = toStringValue(value);
    if (nextValue.length > 0) {
      return nextValue;
    }
  }

  return "";
}

function normalizeTypeLabel(rawType: string): string {
  return rawType
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function parseTime(rawValue: unknown): string | null {
  const value = toStringValue(rawValue);
  if (!value) return null;

  if (/^\d{2}:\d{2}$/.test(value)) {
    return value;
  }

  if (/^\d{4}$/.test(value)) {
    return `${value.slice(0, 2)}:${value.slice(2)}`;
  }

  return null;
}

function getServicesFromSource(source: Record<string, unknown>): SourceServicePreview[] {
  const fromServicesArray = Array.isArray(source.services)
    ? source.services
        .map((service) => toStringValue(service))
        .filter((service) => service.length > 0)
    : [];

  const fromTypesArray = Array.isArray(source.types)
    ? source.types
        .map((typeValue) => toStringValue(typeValue))
        .filter((typeValue) => typeValue.length > 0 && !IGNORE_TYPES.has(typeValue))
        .map(normalizeTypeLabel)
    : [];

  const uniqueServices = Array.from(new Set([...fromServicesArray, ...fromTypesArray]));

  return uniqueServices.slice(0, 10).map((service) => ({
    name: service,
    description: "",
  }));
}

function getHoursFromSource(source: Record<string, unknown>): SourceHourPreview[] {
  const openingHours = toObject(source.opening_hours);
  const periods = Array.isArray(openingHours.periods) ? openingHours.periods : [];
  const perDay: Record<number, { open_time: string | null; close_time: string | null }> = {};

  for (const period of periods) {
    const periodObject = toObject(period);
    const openObject = toObject(periodObject.open);
    const closeObject = toObject(periodObject.close);

    const dayOfWeek = typeof openObject.day === "number" ? openObject.day : null;
    const openTime = parseTime(openObject.time);
    const closeTime = parseTime(closeObject.time);

    if (dayOfWeek === null || dayOfWeek < 0 || dayOfWeek > 6 || !openTime) {
      continue;
    }

    const current = perDay[dayOfWeek];
    if (!current) {
      perDay[dayOfWeek] = { open_time: openTime, close_time: closeTime };
      continue;
    }

    const nextOpen = current.open_time && current.open_time < openTime ? current.open_time : openTime;
    const nextClose =
      current.close_time && closeTime
        ? current.close_time > closeTime
          ? current.close_time
          : closeTime
        : current.close_time ?? closeTime;

    perDay[dayOfWeek] = {
      open_time: nextOpen,
      close_time: nextClose,
    };
  }

  return Object.entries(perDay)
    .map(([dayOfWeek, values]) => ({
      day_of_week: Number(dayOfWeek),
      open_time: values.open_time,
      close_time: values.close_time,
      is_closed: false,
    }))
    .sort((a, b) => a.day_of_week - b.day_of_week);
}

export function mapStripePriceIdToGenerationPlan(priceId: string | null | undefined): GenerationPlan {
  if (!priceId) return "starter";

  const normalized = priceId.trim();
  if (!normalized) return "starter";

  const priceMap: Array<{ plan: GenerationPlan; values: Array<string | undefined> }> = [
    {
      plan: "pro",
      values: [
        process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY,
        process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY,
      ],
    },
    {
      plan: "agency",
      values: [
        process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY_MONTHLY,
        process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY_YEARLY,
      ],
    },
    {
      plan: "scale",
      values: [
        process.env.NEXT_PUBLIC_STRIPE_PRICE_SCALE_MONTHLY,
        process.env.NEXT_PUBLIC_STRIPE_PRICE_SCALE_YEARLY,
      ],
    },
    {
      plan: "starter",
      values: [
        process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY,
        process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY,
      ],
    },
  ];

  for (const entry of priceMap) {
    if (entry.values.filter(Boolean).includes(normalized)) {
      return entry.plan;
    }
  }

  const lower = normalized.toLowerCase();
  if (lower.includes("scale")) return "scale";
  if (lower.includes("agency")) return "agency";
  if (lower.includes("pro")) return "pro";
  return "starter";
}

export function getGenerationEntitlementFromPlan(
  plan: GenerationPlan,
  usedThisMonth: number
): GenerationEntitlement {
  const monthlyLimit = plan === "starter" ? 15 : null;
  const isLimited = monthlyLimit !== null;

  return {
    plan,
    monthlyLimit,
    usedThisMonth,
    remaining: isLimited ? Math.max(monthlyLimit - usedThisMonth, 0) : null,
    isLimited,
  };
}

export function buildBusinessSourcePreview({
  sourceType,
  sourcePayload,
}: BuildPreviewInput): BusinessSourcePreview {
  const source = toObject(sourcePayload);
  const editorialSummary = toObject(source.editorial_summary);
  const types = Array.isArray(source.types) ? source.types : [];
  const firstType = toStringValue(types[0]);

  const profile: SourceProfilePreview = {
    name: pickFirstString(source.name),
    category: firstType ? normalizeTypeLabel(firstType) : "",
    description: pickFirstString(
      editorialSummary.overview,
      source.description,
      source.about,
      source.summary
    ),
    address: pickFirstString(source.formatted_address, source.address),
    phone: pickFirstString(
      source.formatted_phone_number,
      source.international_phone_number,
      source.phone,
      source.phoneNumber
    ),
    website: pickFirstString(source.website),
    googlePlaceId: sourceType === "google" ? pickFirstString(source.place_id) : "",
  };

  return {
    sourceType,
    profile,
    services: getServicesFromSource(source),
    hours: getHoursFromSource(source),
    rawSource: source,
  };
}
