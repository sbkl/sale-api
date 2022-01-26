import { MarketId } from "./markets";

const baseStores: Record<
  MarketId,
  {
    id: string;
    name: string;
  }[]
> = {
  AU: [
    { id: "6310", name: "George St Sydney" },
    {
      id: "6315",
      name: "Sydney International Airport 2",
    },
    { id: "6316", name: "257 Collins Street" },
    { id: "6317", name: "Chadstone 2 Melbourne" },
    { id: "6318", name: "Melbourne Airport" },
    { id: "6319", name: "Queens Plaza" },
  ],
  HK: [
    { id: "6004", name: "Ocean Centre" },
    { id: "6153", name: "Lee Gardens Two CHW" },
    { id: "6158", name: "Canton Road" },
    { id: "6161", name: "Pacific Place" },
    { id: "6162", name: "Russel Street" },
    { id: "6172", name: "Ocean Terminal CHW" },
    { id: "6181", name: "Elements" },
    { id: "6190", name: "Sogo CWB CHW" },
    { id: "6191", name: "Alexandra House" },
    { id: "6192", name: "Sogo CWB" },
    { id: "6194", name: "HKIA" },
    { id: "6208", name: "K11 Musea" },
  ],
  MO: [
    { id: "6200", name: "One Central" },
    { id: "6203", name: "Galaxy" },
    { id: "6204", name: "Wynn Palace Cotai" },
  ],
  MY: [
    { id: "6138", name: "Kuala Lumpur Pavilion" },
    {
      id: "6183",
      name: "Kuala Lumpur The Gardens",
    },
  ],
  SG: [
    { id: "6014", name: "Singapore Paragon" },
    { id: "6171", name: "ION Orchard Road" },
    {
      id: "6173",
      name: "Singapore Marina Bay Sands",
    },
  ],
  TW: [
    { id: "6405", name: "Taichung SKM" },
    { id: "6409", name: "Tainan SKM" },
    {
      id: "6410",
      name: "Taipei Fuxing Pacific Sogo BR4",
    },
    {
      id: "6414",
      name: "Kaohsiung Hanshin Arena",
    },
    { id: "6420", name: "Taipei Breeze Center" },
    { id: "6426", name: "Taipei 101" },
    { id: "6429", name: "Han Shin 2F WW" },
    {
      id: "6431",
      name: "Shin Kong Mitsukoshi A9",
    },
  ],
  TH: [
    { id: "6505", name: "Siam Paragon Bangkok" },
    { id: "6511", name: "Central Embassy" },
  ],
  NZ: [{ id: "6324", name: "West Field New Market" }],
};

export function stores({
  regionId,
  marketId,
}: {
  regionId: string;
  marketId: MarketId;
}) {
  return baseStores[marketId].map((store) => {
    return {
      ...store,
      regionId,
    };
  });
}
