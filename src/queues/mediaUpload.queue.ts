// import Bull from "bull";
// import { mediaUploadJob } from "../jobs/mediaUpload.job";
// import { MediaType } from "../resolvers/media/media.input";
// import { MyPubSub } from "../";
// import { Topic } from "../resolvers/topics";

// const mediaUploadQueue = new Bull("mediaUploadQueue", process.env.REDIS_URL);

// mediaUploadQueue.process(mediaUploadJob);

// interface UploadMediaArgs {
//   companyId: string;
//   location: string;
//   mediaId: string;
//   mediaType: MediaType;
//   filename: string;
//   mimetype: string;
// }

// const uploadMedia = async ({
//   companyId,
//   location,
//   mediaId,
//   mediaType,
//   filename,
//   mimetype,
// }: UploadMediaArgs) => {
//   await mediaUploadQueue.add(
//     {
//       companyId,
//       location,
//       mediaId,
//       mediaType,
//       filename,
//       mimetype,
//     },
//     { removeOnComplete: true, removeOnFail: true }
//   );
// };

// const initJob = () => {
//   mediaUploadQueue.on("completed", async (job) => {
//     console.log(`Job completed with result ${job.id}`);
//     const jobCount = await mediaUploadQueue.getJobCounts();

//     // const jobs = await mediaUploadQueue.getJobs(["waiting", "active"]);

//     // console.log(jobs);
//     await MyPubSub.publish(Topic.MediaUploaded, {
//       companyId: job.data.companyId,
//       mediaId: job.data.mediaId,
//       mediaType: job.data.mediaType,
//       pendingFileUploadCount: jobCount.active + jobCount.waiting,
//     });

//     job.remove();
//   });
// };

// initJob();

// export { uploadMedia, mediaUploadQueue };
