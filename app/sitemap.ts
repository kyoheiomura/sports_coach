import type { MetadataRoute } from "next";
import { AREA_INDEX_MIN, SITE } from "@/data/site";
import { getAreaTree } from "@/lib/areas-index";
import { getSportIndex } from "@/lib/sports-index";
import { getAllVenues, getAllCoaches } from "@/lib/content";

// noindex のページ（少人数のエリア・種目）は入れない
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE.url}${path}`;
  const coach = getAllCoaches();
  const latest = coach[0]?.publishedAt;

  const fixed = ["/", "/coach/", "/sport/", "/area/", "/join/", "/privacy/"].map(
    (p) => ({ url: url(p), lastModified: ["/", "/coach/"].includes(p) ? latest : undefined }),
  );

  const areas = getAreaTree().flatMap((p) => [
    ...(p.count >= AREA_INDEX_MIN ? [{ url: url(`/area/${p.slug}/`) }] : []),
    ...p.cities.filter((c) => c.count >= AREA_INDEX_MIN).map((c) => ({ url: url(`/area/${p.slug}/${c.slug}/`) })),
  ]);

  const sports = getSportIndex()
    .filter((s) => s.count >= AREA_INDEX_MIN)
    .map((s) => ({ url: url(`/sport/${s.slug}/`) }));

  return [
    ...fixed,
    ...sports,
    ...coach.map((s) => ({ url: url(`/coach/${s.slug}/`), lastModified: s.updatedAt ?? s.publishedAt })),
    ...getAllVenues().map((c) => ({ url: url(`/venue/${c.slug}/`), lastModified: c.verifiedAt })),
    ...areas,
  ];
}
