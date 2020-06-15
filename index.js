import * as $ from 'jquery';
import Highcharts from 'highcharts';

function getChartOptions() {
    const options = {
        series: [],
        title: {text: 'Comparing 1000 getLatestBlock Requests'},
        subtitle: {
          text: 'Web3py used for inet and infura. etherscan for etherscan.io'
        },
        yAxis: {
            title: {
                text: 'Block number'
            },
            plotBands: [],

        },
        xAxis: {
            type: 'datetime'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        plotOptions: {
            series: {
              label: {connectorAllowed: false}
            }
        },
        responsive: {
            rules: [{
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
                }
              }
            }]
        }
    }
    return options
}

function nanoToMilli(nano) {
    return nano / 1000000;
}

function minMax(data) {
    const _min = nanoToMilli(data[0].ts); 
    const _max = nanoToMilli(data[data.length-1].ts);
    return [_min, _max];
}
function extractSeries(data) {
    return data.map(row => [nanoToMilli(row.ts), parseInt(row.blocknumber)]);
}

$(document).ready(function() {
    const options = getChartOptions();
    const files = new Array('etherscan', 'inet', 'infura');
    let chart = new Highcharts.chart("container", options);

    for (let f of files) {
        $.getJSON(`/dist/${f}.json`, function(data) {
            const [pointStart, pointEnd] = minMax(data);
            const series = extractSeries(data);
            chart.addSeries({
                name: f,
                pointStart: pointStart,
                data: series,
                type: 'spline'
            });

            // Add highlighted PlotBand on xAxis for the shortest series.
            if (f === "inet") {
                chart.xAxis[0].addPlotBand({
                    color: '#FCFFC5',
                    from: series[0][0],
                    to: series[series.length -1][0],
                    id: 'inet-plotline'
                })
            }

        });
    }
    chart.redraw();
});
