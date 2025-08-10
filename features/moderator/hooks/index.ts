// Moderator hooks exports
export {
  useModeratorDashboard,
  useRecentUsers,
  useRecentRooms,
  useRecentSessions,
} from "./useModeratorDashboard";
export { useModeratorStats } from "./useModeratorStats";
// TODO: Implement report hooks when Report model is added to Prisma schema
// export {
//   useReports,
//   useReport,
//   useCreateReport,
//   useUpdateReport,
//   useDeleteReport,
// } from "./useReports";
export { useModeratorActivity } from "./useModeratorActivity";
