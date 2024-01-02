import {Component, OnInit, ViewChild} from '@angular/core';
import {LogServiceService} from "../service/log-service.service";
import {LogResponse} from "../entity/model";
import {EChartsOption} from "echarts";

export type ChartOptions = {
  series: any;
  chart: any;
  dataLabels: any;
  title: any;
  plotOptions: any;
};

export  type EchartsOption={
  tooltip:any;
  legend:any;
  series:any;
}

@Component({
  selector: 'app-sort-by-date-and-time',
  templateUrl: './sort-by-date-and-time.component.html',
  styleUrls: ['./sort-by-date-and-time.component.css']
})
export class SortByDateAndTimeComponent implements OnInit {

  option!: EChartsOption;

  data!: any;

  @ViewChild("chart") chart: any;
  public chartOptions!: Partial<ChartOptions>;

  ngOnInit(): void {
    this.fetchData();
    this.option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
          ]
        }
      ]
    };

    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        type: "heatmap"
      },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          colorScale: {
            ranges: [
              {
                from: -30,
                to: 5,
                name: "low",
                color: "#00A100"
              },
              {
                from: 6,
                to: 20,
                name: "medium",
                color: "#128FD9"
              },
              {
                from: 21,
                to: 45,
                name: "high",
                color: "#FFB200"
              },
              {
                from: 46,
                to: 55,
                name: "extreme",
                color: "#FF0000"
              }
            ]
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      title: {
        text: "Users By time of day."
      }
    };
  }

  constructor(private logService: LogServiceService) {
  }

  fetchData(): void {
    let responseData: LogResponse;
    this.logService.getLogs().subscribe(
      (response: LogResponse) => {
        this.data = response;
        console.log(this.data);
        this.transformDataForChart();
        this.transformDataToDoughnoutChart();
      },
      (error) => {
        // Handle errors if needed
        console.error('Error fetching data:', error);
      }
    );
  }

  transformDataForChart(): void {
    const daysToInclude = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      .map(day => day.toLowerCase()); // Convert all days to lowercase for case insensitivity

    this.chartOptions.series = Object.keys(this.data.dayAndTime)
      .filter(day => daysToInclude.includes(day.toLowerCase())) // Filter only the desired days (case insensitive)
      .sort(this.sortDays)
      .map(day => {
        const timeData = Object.entries(this.data.dayAndTime[day])
          .sort(([timeA], [timeB]) => this.sortTime(timeA, timeB))
          .map(([time, value]) => ({x: time, y: value}));

        return {
          name: day.toUpperCase(),
          data: timeData,
        };
      });
  }

  private sortDays(dayA: string, dayB: string): number {
    const daysOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayAIndex = daysOrder.findIndex(day => day.toLowerCase() === dayA.toLowerCase());
    const dayBIndex = daysOrder.findIndex(day => day.toLowerCase() === dayB.toLowerCase());

    return dayAIndex - dayBIndex;
  }

  private sortTime(timeA: string, timeB: string): number {
    const isValidTime = (time: string): boolean => {
      // Implement a validation logic for the time format
      // For example, check if the time string contains both hour and period (AM/PM)
      return /^\d+\s*(AM|PM)$/i.test(time.trim());
    };

    if (isValidTime(timeA) && isValidTime(timeB)) {
      const parseTime = (time: string) => {
        const [hour, period] = time.split(/([^\d]+)/).filter(Boolean);
        return parseInt(hour, 10) + (period.toLowerCase() === 'pm' ? 12 : 0);
      };
      return parseTime(timeA) - parseTime(timeB);
    }
    return 0; // Default return value if timeA or timeB is not valid
  }

  transformDataToDoughnoutChart(): void {
    const browsers = Object.keys(this.data.browsers);
    const doughnutData = browsers.map(browser => {
      const browserData = this.data.browsers[browser]; // Assuming the browser data is a number

      return {
        name: browser.toUpperCase(),
        value: browserData,
      };
    });

    this.option.series = [{
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: doughnutData,
    }];
  }
}
