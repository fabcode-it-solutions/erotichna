export const COMMON_DIMENSIONS = [{ name: "country" }, { name: "hostName" }];
export const SAMPLE_DATE_RANGE = { startDate: "today", endDate: "today" };

export const ANALYTICS_PAYLOAD_BATCH = [
  {
    metrics: [
      { name: "totalUsers" },
      { name: "activeUsers" },
      { name: "newUsers" },
      { name: "userEngagementDuration" },
      { name: "totalRevenue" },
    ],
    dimensions: COMMON_DIMENSIONS,
    dateRanges: SAMPLE_DATE_RANGE,
  },
  {
    metrics: [{ name: "sessions" }],
    dimensions: [...COMMON_DIMENSIONS, { name: "sessionDefaultChannelGroup" }],
    dateRanges: SAMPLE_DATE_RANGE,
  },
  {
    metrics: [{ name: "newUsers" }],
    dimensions: [...COMMON_DIMENSIONS, { name: "sessionDefaultChannelGroup" }],
    dateRanges: SAMPLE_DATE_RANGE,
  },
  {
    metrics: [
      { name: "screenPageViews" },
      { name: "activeUsers" },
      { name: "newUsers" },
      { name: "sessions" },
    ],
    dimensions: [
      { name: "pagePath" },
      { name: "pageTitle" },
      { name: "hostName" },
      { name: "country" },
    ],
    dateRanges: SAMPLE_DATE_RANGE,
  },
];
