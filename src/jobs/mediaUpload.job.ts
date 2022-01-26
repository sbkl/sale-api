// import { PrismaClient } from ".prisma/client";
// import { Job, DoneCallback } from "bull";
// import { uploadStream } from "../lib/cloudinary";
// import { MediaType } from "../resolvers/media/media.input";
// import fs, { ReadStream } from "fs";
// import { vimeoClient } from "../lib/vimeo";
// import path from "path";
// import { __prod__ } from "../constants";

// const prisma = new PrismaClient();

// export const mediaUploadJob = async (job: Job, done: DoneCallback) => {
//   const { location, mediaId, mediaType, filename, mimetype } = job.data;

//   const createReadStream = () => fs.createReadStream(location);

//   if (mediaType === MediaType.Image) {
//     let {
//       secure_url,
//       height,
//       width,
//       public_id: providerId,
//     } = await uploadStream(createReadStream);

//     await prisma.image.update({
//       where: { id: mediaId },
//       data: { path: secure_url, height, width, providerId },
//     });

//     fs.unlink(location, (err) => {
//       if (err) {
//         console.error(err);
//         return;
//       }
//       prisma.$disconnect();
//       done();
//       //file removed
//     });
//   }

//   if (mediaType === MediaType.Video) {
//     vimeoClient.upload(
//       location,
//       {
//         name: filename,
//         mimetype,
//         privacy: { view: "unlisted" },
//       },
//       async (uri) => {
//         const providerId = uri.replace("/videos/", "");
//         await prisma.video.update({
//           where: { id: mediaId },
//           data: {
//             providerName: "Vimeo",
//             providerId,
//           },
//         });
//         fs.unlink(location, (err) => {
//           if (err) {
//             console.error(err);
//             return;
//           }
//           prisma.$disconnect();
//           done();
//           //file removed
//         });
//         console.log("File upload completed. Your Vimeo URI is:", uri);
//       },
//       function (bytesUploaded, bytesTotal) {
//         var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
//         console.log(bytesUploaded, bytesTotal, percentage + "%");
//       },
//       function (error) {
//         console.log("Failed because: " + error);
//       }
//     );
//   }
// };

// export const storeFS = ({
//   folder = "",
//   stream,
//   filename,
// }: {
//   folder?: string;
//   stream: ReadStream;
//   filename: string;
// }): Promise<{ location: string }> => {
//   if (!fs.existsSync("./storage/" + folder)) {
//     fs.mkdirSync("./storage/" + folder);
//   }

//   const location = __prod__
//     ? path.join(process.env.STORAGE_DIR, folder, filename)
//     : "./storage/" + folder + "/" + filename;
//   return new Promise((resolve, reject) =>
//     stream
//       .pipe(fs.createWriteStream(location))
//       .on("error", (error) => {
//         console.log(error);
//         reject(error);
//       })
//       .on("finish", () => resolve({ location }))
//   );
// };
