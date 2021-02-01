import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Stock} from '../../core/model/stock';
import {TrendService} from './trend.service';
import {format} from 'date-fns';
import {EChartsOption} from 'echarts';
import {Trend} from '../../core/model/trend';
import {ColumnItem} from '../../core/model/columnitem';
import * as _ from 'lodash';
import {CoreService} from '../../core/service/core.service';

@Component({
  selector: 'app-trend',
  templateUrl: './trend.component.html',

  styleUrls: ['./trend.component.css']
})


export class TrendComponent implements OnInit {
  private gridApi;
  private gridColumnApi;
  private echartsInstance;

  isLoading: boolean = false;
  controlArray: Array<{ index: number; show: boolean }> = [];
  selectedStock: Stock;
  listOfStock: Array<Stock> = [];

  validateForm: FormGroup;
  selectedDate: Date[];
  selectedDateRangeArray: string[];
  mergeOption: EChartsOption = {};

  chartOption: EChartsOption = {};

  tableData: Array<Trend> = [];
  listOfColumns: ColumnItem[];

  columnDefs: any[] = [
    {field: 'ParticipantCode', sortable: true, filter: true , resizable: true},
    {field: 'ParticipantName', sortable: true, filter: true , resizable: true},
    {field: 'RecordDate', sortable: true, filter: true , resizable: true},
    {field: 'Percentage', sortable: true, filter: true, valueFormatter: params => params.value + '%' , resizable: true},
    {
      field: 'Shareholding',
      sortable: true,
      filter: true,
      valueFormatter: params => params.value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',') , resizable: true
    }
  ];

  search(): void {
    this.isLoading = true;
    this.selectedDateRangeArray = TrendComponent.getDatesBetweenDates(this.selectedDate[0], this.selectedDate[1]);
    this.gridApi.showLoadingOverlay();
    this.service.getTrend({
      'stock_code': this.selectedStock.stock_code,
      'start_date': format(this.selectedDate[0], 'yyyyMMdd'),
      'end_date': format(this.selectedDate[1], 'yyyyMMdd')
    }).subscribe(
      data => {
        this.isLoading = false;
        this.refreshChart(data);
        this.tableData = data;
      }
    );


  }

  resetForm(): void {
    this.validateForm.reset();
    this.gridApi.setRowData([]);
    this.echartsInstance.clear();
  }

  constructor(private fb: FormBuilder, private service: TrendService, private coreservice: CoreService) {
  }

  ngOnInit(): void {
    this.coreservice.getStocks().subscribe(stocks => {
        this.listOfStock = stocks;
      }
    );
    this.validateForm = this.fb.group({
      stock: [null, [Validators.required]],
      date: [null, [Validators.required]],
    });
  }

  refreshChart(data: Trend[]): void {
    this.echartsInstance.clear();
    const grouped = _.groupBy(data, row => row.ParticipantCode + ':' + row.ParticipantName);
    let new_series = [];
    let legend_names = [];
    for (let participant in grouped) {
      let participant_data = grouped[participant];
      legend_names.push(participant);
      let date_series = participant_data.map(a => [a.RecordDate, a.Shareholding]);
      let series_obj =
        {
          name: participant,
          type: 'line',
          data: date_series
        };
      new_series.push(series_obj);
    }

    this.mergeOption = {

      tooltip: {
        trigger: 'axis'
      },

      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '100',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {},
          dataView: {
            title: 'DATA VIEW',
            show: true
          }
        }
      },

      yAxis: {
        type: 'value',
        name: 'Shareholding'
      },
      dataZoom: [
        {
          id: 'dataZoomX',
          type: 'slider',
          xAxisIndex: [0],
          filterMode: 'filter'
        }
      ],
      title: {
        text: this.selectedStock.stock_label,
        left: 'center',
        top: 0,
      },
      legend: {
        type: 'scroll',
        top: 20,
        orient: 'horizontal',
        data: legend_names
      },
      xAxis: {
        type: 'category',
        data: this.selectedDateRangeArray
      },
      series: new_series
    };
  }


  private static getDatesBetweenDates(startDate, endDate) {
    let dates = [];
    const theDate = new Date(startDate);
    while (theDate < endDate) {
      dates = [...dates, format(theDate, 'yyyy-MM-dd')];
      theDate.setDate(theDate.getDate() + 1);
    }
    dates = [...dates, format(endDate, 'yyyy-MM-dd')];
    return dates;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  onRowChanged(params) {
    params.api.sizeColumnsToFit();
  }

  onChartInit(ec) {
    this.echartsInstance = ec;
  }

}
