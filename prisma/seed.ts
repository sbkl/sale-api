import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
// import { markets } from "./seeds/markets";
// import { offices } from "./seeds/offices";
// import { hubs } from "./seeds/hubs";
// import { suppliers } from "./seeds/suppliers";
// import { materials } from "./seeds/materials";
// import { routes } from "./seeds/routes";
// // import { users } from "../users";
// import { sources } from "./seeds/sources";

export const prisma = new PrismaClient();
async function main() {
  // const companyId = "7189dca9-4695-499f-b0b3-774b334fecb9";
  // const regionId = "SAP";
  // await prisma.company.upsert({
  //   where: { name: "Burberry" },
  //   update: {},
  //   create: {
  //     id: companyId,
  //     name: "Burberry",
  //     channels: {
  //       create: [{ id: "Mainline" }, { id: "Outlet" }],
  //     },
  //     collections: {
  //       create: [
  //         { id: "Oak" },
  //         { id: "White outlet" },
  //         { id: "Honey" },
  //         { id: "Festive 2021" },
  //         { id: "LNY 2021" },
  //       ],
  //     },
  //     categories: {
  //       create: [
  //         { id: "CARD" },
  //         { id: "DUST BAG" },
  //         { id: "ENVELOPE" },
  //         { id: "GARMENT COVER" },
  //         { id: "GIFT BOX" },
  //         { id: "RAIN COVER" },
  //         { id: "RETAIL BAG" },
  //         { id: "RIBBON" },
  //         { id: "STICKER" },
  //         { id: "TISSUE PAPER" },
  //         { id: "UMBRELLA CARRIER" },
  //         { id: "WRAPPING PAPER" },
  //       ],
  //     },
  //     materials: {
  //       create: [...materials()],
  //     },
  //     regions: {
  //       create: [
  //         {
  //           id: regionId,
  //           name: "SAPAC",
  //           markets: {
  //             create: [...markets({ companyId, regionId })],
  //           },
  //         },
  //         {
  //           id: "EMEIA",
  //           name: "EMEIA",
  //         },
  //       ],
  //     },
  //     hubs: {
  //       create: [...hubs({ regionId })],
  //     },
  //     suppliers: {
  //       create: [...suppliers({ companyId })],
  //     },
  //     offices: {
  //       create: [...offices({ regionId, companyId })],
  //     },
  //     sources: {
  //       create: [...sources()],
  //     },
  //     routes: {
  //       create: [...routes()],
  //     },
  //     users: {
  //       create: [
  //         ...(
  //           await users()
  //         ).map((u) => {
  //           return {
  //             ...u,
  //             email: u.email.toLowerCase(),
  //           };
  //         }),
  //       ],
  //     },
  //   },
  // });
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
