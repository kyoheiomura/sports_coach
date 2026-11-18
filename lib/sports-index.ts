/** 種目ごとの索引。種目ページ・トップと /sport/ の一覧で使う */
import { SPORT_GROUPS, SPORTS } from "@/data/vocab";
import { getAllCoaches } from "@/lib/content";

export function coachesOfSport(sportSlug: string) {
  return getAllCoaches().filter((s) => s.sports.includes(sportSlug));
}

/** すべての種目（data/vocab.ts の順）と、取材した人数。まだ0人の種目も含む */
export function getAllSports() {
  return SPORTS.map((sport) => ({ ...sport, count: coachesOfSport(sport.slug).length }));
}

/** 取材したコーチがいる種目だけ（サイトマップなど） */
export function getSportIndex() {
  return getAllSports().filter((s) => s.count > 0);
}

/** 分類ごとにまとめた一覧 */
export function getSportGroups() {
  const all = getAllSports();
  return SPORT_GROUPS.map((g) => ({ ...g, sports: all.filter((s) => s.group === g.key) }));
}
