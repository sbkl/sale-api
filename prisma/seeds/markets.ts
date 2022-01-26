import { stores } from "./stores";

export type MarketId = "AU" | "HK" | "MO" | "MY" | "SG" | "TH" | "TW" | "NZ";

const baseMarkets: { id: MarketId; name: string }[] = [
  { id: "AU", name: "Australia" },
  { id: "HK", name: "Hong Kong" },
  { id: "MO", name: "Macau" },
  { id: "MY", name: "Malaysia" },
  { id: "SG", name: "Singapore" },
  { id: "TH", name: "Thailand" },
  { id: "TW", name: "Taiwan" },
  { id: "NZ", name: "new Zealand" },
];

export function markets({
  companyId,
  regionId,
}: {
  companyId: string;
  regionId: string;
}) {
  return baseMarkets.map((market) => {
    return {
      ...market,
      companyId,
      stores: {
        create: [...stores({ regionId, marketId: market.id })],
      },
    };
  });
}
