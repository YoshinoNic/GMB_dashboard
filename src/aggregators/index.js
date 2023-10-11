import { isInDateRange, parseDate, getLastDayOfMonth } from "../utils";

const METRIC_DISPLAY_COLORS = {
  BUSINESS_IMPRESSIONS_DESKTOP_MAPS: "#9600ff",
  BUSINESS_IMPRESSIONS_DESKTOP_SEARCH: "#4900ff",
  BUSINESS_IMPRESSIONS_MOBILE_MAPS: "#00b8ff",
  BUSINESS_IMPRESSIONS_MOBILE_SEARCH: "#00fff9",
  BUSINESS_CONVERSATIONS: "#ff00c1",
  BUSINESS_DIRECTION_REQUESTS: "#9600ff",
  CALL_CLICKS: "#4900ff",
  WEBSITE_CLICKS: "#00b8ff",
  BUSINESS_BOOKINGS: "#00fff9",
  BUSINESS_FOOD_ORDERS: "#ff00c1",
  BUSINESS_FOOD_MENU_CLICKS: "#9600ff",
};

function getColorForMetric(metric) {
  return METRIC_DISPLAY_COLORS[metric] || "#9600ff";
}

const logMissingMetric = (metricId, business) => {
  console.log(`No metric with ID '${metricId}' found in business:`, business);
};

const filterByStores = (data, stores) => {
  if (!Array.isArray(stores) || !stores.length) return [];
  const validStoresSet = new Set(stores);
  return data.filter((item) => validStoresSet.has(item.name));
};

const lineGraphAggregation = ({
  lineMetrics,
  stores,
  startDate,
  endDate,
  data,
  impact = false,
  marketingSource = [],
}) => {
  let aggregatedMetricsData = {};

  const filteredBusinesses = filterByStores(data, stores);

  filteredBusinesses.forEach((business) => {
    business.metrics.forEach((metric) => {
      const metricId = metric.id;

      if (lineMetrics.includes(metricId)) {
        // Only process metrics in lineMetrics
        if (!aggregatedMetricsData[metricId]) {
          aggregatedMetricsData[metricId] = {
            color: getColorForMetric(metricId),
            data: {},
          };
        }

        metric.data.forEach((dataPoint) => {
          const datePointDate = dataPoint.x;

          if (isInDateRange(datePointDate, startDate, endDate)) {
            if (impact) {
              const filteredDataPoints = dataPoint.y.filter((dp) =>
                marketingSource.includes(dp.channel)
              );
              const aggregatedValue = filteredDataPoints.reduce(
                (acc, curr) => acc + (curr.incrementalValue || 0),
                0
              );

              if (aggregatedMetricsData[metricId].data[dataPoint.x]) {
                aggregatedMetricsData[metricId].data[dataPoint.x] +=
                  aggregatedValue;
              } else {
                aggregatedMetricsData[metricId].data[dataPoint.x] =
                  aggregatedValue;
              }
            } else {
              if (aggregatedMetricsData[metricId].data[dataPoint.x]) {
                aggregatedMetricsData[metricId].data[dataPoint.x] +=
                  dataPoint.y;
              } else {
                aggregatedMetricsData[metricId].data[dataPoint.x] = dataPoint.y;
              }
            }
          }
        });
      }
    });
  });

  return Object.entries(aggregatedMetricsData).map(
    ([metricId, { color, data }]) => ({
      id: metricId,
      color: color,
      data: Object.entries(data).map(([x, y]) => ({ x, y })),
    })
  );
};

const getValueFromDataPoint = (dataPoint, impact, marketingSource) => {
  if (impact) {
    if (Array.isArray(dataPoint.y)) {
      // Flatten the dataPoint.y values and then filter by marketingSource
      const incrementalValues = dataPoint.y
        .flatMap((yValue) => (Array.isArray(yValue) ? yValue : [yValue]))
        .filter((dp) => marketingSource.includes(dp.channel))
        .map((entry) => entry.incrementalValue);

      return incrementalValues.reduce((acc, curr) => acc + curr, 0);
    }
    return 0;
  } else if (typeof dataPoint.y === "number") {
    return dataPoint.y;
  }
  return 0; // fallback value
};

const filterMetricsByDate = (metrics, startDate, endDate) => {
  return metrics
    .map((metric) => {
      const filteredData = metric.data.filter((dataPoint) =>
        isInDateRange(dataPoint.x, startDate, endDate)
      );
      return { ...metric, data: filteredData };
    })
    .filter((metric) => metric.data.length > 0);
};

const mapChartAggregation = ({
  data,
  metricIds,
  impact = false,
  marketingSource = [],
  stores,
  startDate,
  endDate,
}) => {
  return metricIds.flatMap((metricId) => {
    return data
      .map((business) => {
        // Process data by date and store
        const metrics = filterMetricsByDate(
          business.metrics,
          startDate,
          endDate
        );
        if (!metrics.length || !filterByStores([business], stores).length) {
          return null;
        }

        const metric = metrics.find((m) => m.id === metricId);
        if (!metric) return null;

        const { latitude, longitude } = business.coordinates;

        const values = metric.data.map((dataPoint) =>
          getValueFromDataPoint(dataPoint, impact, marketingSource)
        );
        const totalValue = values.length
          ? values.reduce((acc, curr) => acc + curr, 0)
          : 0;

        return {
          name: business.name,
          address: business.details.storefrontAddress.addressLines,
          requests: totalValue,
          coordinates: [longitude, latitude],
        };
      })
      .filter(Boolean);
  });
};

const streamChartAggregation = ({
  stores,
  marketingSource,
  startDate,
  endDate,
  data,
}) => {
  const dateWiseAggregation = {}; // To hold data aggregated by date

  // Filter data based on the selected stores
  const filteredData = filterByStores(data, stores);

  filteredData.forEach((item) => {
    if (item.campaigns) {
      item.campaigns.forEach((campaign) => {
        // Filter by marketingSource (i.e., campaign channels)
        if (!marketingSource.includes(campaign.channel)) {
          return;
        }

        campaign.data.forEach((dateData) => {
          const datePointDate = dateData.x;

          // Check if the date is in the desired range
          if (isInDateRange(datePointDate, startDate, endDate)) {
            if (!dateWiseAggregation[dateData.x]) {
              dateWiseAggregation[dateData.x] = {};
            }
            if (!dateWiseAggregation[dateData.x][campaign.channel]) {
              dateWiseAggregation[dateData.x][campaign.channel] = 0;
            }
            dateWiseAggregation[dateData.x][campaign.channel] += dateData.y;
          }
        });
      });
    }
  });

  // Convert our aggregation to desired format
  const result = Object.values(dateWiseAggregation);

  return result;
};

const channelAggregation = ({
  stores,
  marketingSource,
  startDate,
  endDate,
  data,
}) => {
  const channelSums = {};

  const colorRange = [
    [229, 134, 197, 127],
    [216, 110, 199, 170],
    [196, 106, 213, 191],
    [175, 101, 227, 212],
    [134, 93, 255, 255],
  ];

  // Filter data based on the selected stores
  const filteredData = filterByStores(data, stores);

  filteredData.forEach((item) => {
    if (item.campaigns) {
      item.campaigns.forEach((campaign) => {
        // Filter by marketingSource (i.e., campaign channels)
        if (!marketingSource.includes(campaign.channel)) {
          return;
        }

        if (!channelSums[campaign.channel]) {
          channelSums[campaign.channel] = 0;
        }

        campaign.data.forEach((point) => {
          const datePointDate = point.x;

          // Check if the date is in the desired range
          if (isInDateRange(datePointDate, startDate, endDate)) {
            channelSums[campaign.channel] += point.y;
          }
        });
      });
    }
  });

  // Convert the channelSums object into an array of the desired format
  return Object.keys(channelSums).map((channel, index) => {
    const [r, g, b, a] = colorRange[index % colorRange.length]; // Using modulo to ensure we don't exceed the array length
    return {
      id: channel,
      label: channel,
      value: Math.round(channelSums[channel]),
      color: `rgba(${r},${g},${b},${a / 255})`,
    };
  });
};

const campaignDataAggregation = ({
  stores,
  marketingSource,
  startDate,
  endDate,
  data,
}) => {
  let aggregatedData = [];

  const filteredBusinesses = filterByStores(data, stores);

  filteredBusinesses.forEach((business) => {
    business.campaigns.forEach((campaign) => {
      if (marketingSource.includes(campaign.channel)) {
        const channel = campaign.channel;
        const campaignName = campaign.name;

        const cost = Math.round(
          campaign.data
            .filter((dataPoint) =>
              isInDateRange(dataPoint.x, startDate, endDate)
            )
            .reduce((acc, curr) => acc + curr.y, 0)
        );

        const metricsData = business.metrics.map((metric) => {
          const aggregatedValue = Math.round(
            metric.data
              .filter((dataPoint) =>
                isInDateRange(dataPoint.x, startDate, endDate)
              )
              .reduce((acc, dataPoint) => {
                const metricData = Array.isArray(dataPoint.y)
                  ? dataPoint.y.find(
                      (item) =>
                        item.campaignName === campaignName &&
                        item.channel === channel
                    )
                  : null;

                return acc + (metricData ? metricData.incrementalValue : 0);
              }, 0)
          );

          return {
            id: metric.id,
            value: aggregatedValue,
          };
        });

        const existingEntry = aggregatedData.find(
          (entry) =>
            entry.channel === channel && entry.campaignName === campaignName
        );

        if (existingEntry) {
          existingEntry.cost += cost;
          existingEntry.metrics.forEach((metric, index) => {
            metric.value += metricsData[index].value;
          });
        } else {
          aggregatedData.push({
            channel,
            campaignName,
            cost,
            metrics: metricsData,
          });
        }
      }
    });
  });

  return aggregatedData;
};

const mapMetricIdToKey = (id) => {
  const mapping = {
    CALL_CLICKS: "Call Clicks",
    WEBSITE_CLICKS: "Website Clicks",
    BUSINESS_CONVERSATIONS: "Conversations",
    BUSINESS_DIRECTION_REQUESTS: "Direction Requests",
  };

  return mapping[id];
};

const barChartAggregation = ({
  stores,
  marketingSource,
  startDate,
  endDate,
  data,
}) => {
  let aggregatedData = [];

  const filteredBusinesses = filterByStores(data, stores);

  filteredBusinesses.forEach((business) => {
    business.campaigns.forEach((campaign) => {
      if (marketingSource.includes(campaign.channel)) {
        const channel = campaign.channel;

        const metricsData = {};
        business.metrics.forEach((metric) => {
          metric.data.forEach((dataPoint) => {
            if (isInDateRange(dataPoint.x, startDate, endDate)) {
              dataPoint.y.forEach((campaignMetric) => {
                if (campaignMetric.channel === channel) {
                  const key = mapMetricIdToKey(metric.id);
                  if (key) {
                    metricsData[key] =
                      (metricsData[key] || 0) +
                      Math.round(campaignMetric.incrementalValue);
                  }
                }
              });
            }
          });
        });

        const existingEntry = aggregatedData.find(
          (entry) => entry.channel === channel
        );

        if (existingEntry) {
          Object.keys(metricsData).forEach((key) => {
            existingEntry[key] += metricsData[key];
          });
        } else {
          aggregatedData.push({
            channel,
            ...metricsData,
          });
        }
      }
    });
  });

  return aggregatedData;
};

const channelBarChartAggregation = ({
  stores,
  startDate,
  endDate,
  data,
  marketingSource = [],
}) => {
  let aggregatedMetricsData = {};

  const filteredBusinesses = filterByStores(data, stores);

  filteredBusinesses.forEach((business) => {
    business.campaigns.forEach((campaign) => {
      // Filter campaigns by channel
      if (marketingSource.includes(campaign.channel)) {
        campaign.data.forEach((dataPoint) => {
          const datePointDate = dataPoint.x;

          // Filter data points by date range
          if (isInDateRange(datePointDate, startDate, endDate)) {
            if (!aggregatedMetricsData[datePointDate]) {
              aggregatedMetricsData[datePointDate] = 0;
            }
            aggregatedMetricsData[datePointDate] += dataPoint.y;
          }
        });
      }
    });
  });

  // Transforming data for output format
  return Object.entries(aggregatedMetricsData).map(([x, y]) => ({ x, y }));
};

const keywordsAggregation = ({ stores, month, data }) => {
  // Filter data based on the selected stores
  const filteredBusinesses = filterByStores(data, stores)
    .map((business) => {
      // Filter searchKeywords based on whether the business.month is within the selected month range
      const filteredKeywords = business.searchKeywords.filter(() => {
        const businessDate = parseDate(`${business.month} 01`);

        if (month.includes(" - ")) {
          const [startMonth, endMonth] = month.split(" - ");
          const startDate = parseDate(`${startMonth} 01`);
          const endDate = parseDate(
            `${endMonth} ${getLastDayOfMonth(endMonth)}`
          );

          return isInDateRange(businessDate, startDate, endDate);
        } else {
          return business.month === month;
        }
      });

      return {
        ...business,
        searchKeywords: filteredKeywords,
      };
    })
    .filter((business) => business.searchKeywords.length > 0); // Remove businesses with no matching keywords

  return filteredBusinesses;
};

const dataGridAggregation = ({ stores, startDate, endDate, data }) => {
  const filteredBusinesses = filterByStores(data, stores)
    .map((business) => {
      const filteredMetrics = business.metrics.map((metric) => {
        const filteredData = metric.data.filter((dataPoint) => {
          const datePointDate = dataPoint.x;
          return isInDateRange(datePointDate, startDate, endDate);
        });

        return {
          ...metric,
          data: filteredData,
        };
      });

      return {
        ...business,
        metrics: filteredMetrics,
      };
    })
    .filter((business) => business.metrics.length > 0);

  return filteredBusinesses;
};

const pieChartAggregation = (keywordsData) => {
  const colorRange = [
    [229, 134, 197, 127],
    [216, 110, 199, 170],
    [196, 106, 213, 191],
    [175, 101, 227, 212],
    [134, 93, 255, 255],
  ];

  const allKeywords = keywordsData.flatMap((store) => store.searchKeywords);

  const keywordSums = allKeywords.reduce((acc, keywordObj) => {
    const keyword = keywordObj.searchKeyword;
    const value = keywordObj.insightsValue.value;
    acc[keyword] = (acc[keyword] || 0) + value;
    return acc;
  }, {});

  const top5Keywords = Object.entries(keywordSums)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map((entry) => ({ keyword: entry[0], sum: entry[1] }));

  return top5Keywords.map((keywordObj, index) => {
    const [r, g, b, a] = colorRange[index];
    return {
      id: keywordObj.keyword,
      label: keywordObj.keyword,
      value: keywordObj.sum,
      color: `rgba(${r},${g},${b},${a / 255})`,
    };
  });
};

const kpiChartAggregation = ({
  metricId,
  stores,
  startDate,
  endDate,
  data,
  impact = false,
  marketingSource = [],
}) => {
  let totalValue = 0;

  // Filter businesses based on the selected stores using the helper function
  const filteredBusinesses = filterByStores(data, stores);

  filteredBusinesses.forEach((business) => {
    const metric = business.metrics.find((m) => m.id === metricId);

    if (metric) {
      metric.data.forEach((dataPoint) => {
        if (isInDateRange(dataPoint.x, startDate, endDate)) {
          if (impact) {
            // When impact is true, treat dataPoint.y as an array of objects with channels
            const filteredDataPoints = dataPoint.y.filter((point) =>
              marketingSource.includes(point.channel)
            );
            totalValue += filteredDataPoints.reduce(
              (acc, curr) => acc + curr.incrementalValue,
              0
            );
          } else {
            // When impact is false, treat dataPoint.y as a direct value
            totalValue += dataPoint.y;
          }
        }
      });
    } else {
      logMissingMetric(metricId, business);
    }
  });

  return totalValue;
};

export {
  lineGraphAggregation,
  mapChartAggregation,
  streamChartAggregation,
  channelAggregation,
  campaignDataAggregation,
  barChartAggregation,
  channelBarChartAggregation,
  keywordsAggregation,
  dataGridAggregation,
  pieChartAggregation,
  kpiChartAggregation,
};
