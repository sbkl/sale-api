import { PlantType } from "../../src/resolvers/shared.input";

export function offices({
  regionId,
  companyId,
}: {
  regionId: string;
  companyId: string;
}) {
  return [
    {
      id: "AU01",
      regionId,
      name: "Australia office",
      officeables: {
        create: [
          {
            companyId,
            officeableType: PlantType.Market,
            officeableId: "AU",
          },
          {
            companyId,
            officeableType: PlantType.Market,
            officeableId: "NZ",
          },
        ],
      },
    },
    {
      id: "HK01",
      regionId,
      name: "Hong Kong office",
      officeables: {
        create: [
          { companyId, officeableType: PlantType.Market, officeableId: "HK" },
          { companyId, officeableType: PlantType.Market, officeableId: "MO" },
        ],
      },
    },
    {
      id: "MY01",
      regionId,
      name: "Malaysia office",
      officeables: {
        create: [
          { companyId, officeableType: PlantType.Market, officeableId: "MY" },
        ],
      },
    },
    {
      id: "RHK01",
      regionId,
      name: "SAPAC regional office",
      officeables: {
        create: [
          { companyId, officeableType: PlantType.Market, officeableId: "NZ" },
          { companyId, officeableType: PlantType.Market, officeableId: "HK" },
          { companyId, officeableType: PlantType.Market, officeableId: "MO" },
          { companyId, officeableType: PlantType.Market, officeableId: "TW" },
          { companyId, officeableType: PlantType.Market, officeableId: "MY" },
          { companyId, officeableType: PlantType.Market, officeableId: "SG" },
          { companyId, officeableType: PlantType.Market, officeableId: "TH" },
          { companyId, officeableType: PlantType.Market, officeableId: "AU" },
        ],
      },
    },
    {
      id: "SG01",
      regionId,
      name: "Singapore office",
      officeables: {
        create: [
          { companyId, officeableType: PlantType.Market, officeableId: "SG" },
          { companyId, officeableType: PlantType.Market, officeableId: "MY" },
          { companyId, officeableType: PlantType.Market, officeableId: "TH" },
        ],
      },
    },
    {
      id: "TH01",
      regionId,
      name: "Thailand office",
      officeables: {
        create: [
          { companyId, officeableType: PlantType.Market, officeableId: "TH" },
        ],
      },
    },
    {
      id: "TW01",
      regionId,
      name: "Taiwan office",
      officeables: {
        create: [
          { companyId, officeableType: PlantType.Market, officeableId: "TW" },
        ],
      },
    },
  ];
}
