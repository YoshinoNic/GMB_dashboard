/* eslint-disable no-restricted-globals */
import {
  lineGraphAggregation,
  mapChartAggregation,
  streamChartAggregation,
  channelAggregation,
  campaignDataAggregation,
  barChartAggregation,
  channelBarChartAggregation,
  keywordsAggregation,
  dataGridAggregation,
} from "../aggregators";

const aggregators = {
  lineGraphAggregation,
  mapChartAggregation,
  streamChartAggregation,
  channelAggregation,
  campaignDataAggregation,
  barChartAggregation,
  channelBarChartAggregation,
  keywordsAggregation,
  dataGridAggregation,
};

self.onmessage = function (event) {
  const { data } = event;
  const { method, params } = data;

  try {
    const aggregator = aggregators[method];

    if (!aggregator) {
      self.postMessage({ method, params, error: "Unknown method" });
      return;
    }

    const result = aggregator(params);
    self.postMessage({ method, params, result });
  } catch (error) {
    self.postMessage({ method, params, error: error.message });
  }
};
