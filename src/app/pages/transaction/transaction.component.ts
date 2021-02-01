import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Stock} from '../../core/model/stock';
import {CoreService} from '../../core/service/core.service';
import {format} from 'date-fns';
import {TransactionService} from './transaction.service';
import {Transaction} from '../../core/model/transaction';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',

  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  selectedStock: Stock;
  listOfStock: Array<Stock> = [];
  validateForm: FormGroup;
  selectedDate: Date[];
  selectedDateRangeArray: string[];
  threshold: number = 0;
  isLoading: boolean = false;
  private gridApi;
  private gridColumnApi;
  tableData: Array<Transaction> = [];
  columnDefs: any[] = [

    {
      headerName: 'Participant',
      headerClass: 'participant',
      children: [
        {field: 'RecordDate', sortable: true, filter: true , resizable: true },
        {field: 'ParticipantCode', sortable: true, filter: true , resizable: true},
        {field: 'ParticipantName', sortable: true, filter: true , resizable: true},
        {field: 'Percentage', sortable: true, filter: true, valueFormatter: params => params.value + '%' , resizable: true},
        {
          field: 'Shareholding',
          sortable: true,
          filter: true,
          valueFormatter: params => {
            return params.value.toLocaleString('en-US');
          } , resizable: true
        },

        {
          headerName: 'ΔPercentage',
          field: 'DiffPercentage',
          sortable: true,
          filter: true,
          valueFormatter: params => params.value.toFixed(2) + '%',
          cellStyle: params => params.value >= 0 ? {color: 'green'} : {color: 'red'} , resizable: true
        }, {
          headerName: 'ΔShareholding',
          field: 'DiffShs',
          sortable: true,
          filter: true,
          valueFormatter: params => {
            return params.value.toLocaleString('en-US');
          },
          cellStyle: params => params.value >= 0 ? {color: 'green'} : {color: 'red'}
          , resizable: true },
      ]
    },
    {
      headerName: 'Potential Counterparty',
      headerClass: 'counterparty',
      children: [
        {
          headerName: 'ΔCpty_Shareholding',
          field: 'cpty_DiffShs',
          sortable: true,
          filter: true,
          valueFormatter:  params => {
            return params.value.toLocaleString('en-US');
          },
          cellStyle: params => params.value >= 0 ? {color: 'green'} : {color: 'red'}
          , resizable: true},
        {
          headerName: 'ΔCpty_Percentage',
          field: 'cpty_DiffPercentage',
          sortable: true,
          filter: true,
          valueFormatter: params => params.value.toFixed(2) + '%',
          cellStyle: params => params.value >= 0 ? {color: 'green'} : {color: 'red'}
          , resizable: true},

        {field: 'cpty_ParticipantCode', sortable: true, filter: true , resizable: true},
        {field: 'cpty_ParticipantName', sortable: true, filter: true , resizable: true},
        {field: 'cpty_Percentage', sortable: true, filter: true, valueFormatter: params => params.value + '%' , resizable: true},
        {
          field: 'cpty_Shareholding',
          sortable: true,
          filter: true,
          valueFormatter: params => {
            return params.value.toLocaleString('en-US');
          }, resizable: true
        },

      ]
    },


  ];

  constructor(private fb: FormBuilder, private service: TransactionService, private coreservice: CoreService) {
  }

  resetForm(): void {
    this.validateForm.reset();
    this.gridApi.setRowData([]);
  }

  ngOnInit(): void {
    this.coreservice.getStocks().subscribe(stocks => {
        this.listOfStock = stocks;
      }
    );
    this.validateForm = this.fb.group({
      stock: [null, [Validators.required]],
      date: [null, [Validators.required]],
      threshold: [null, [Validators.required]],
    });
  }

  formatterPercent = (value: number) => `${value} %`;
  parserPercent = (value: string) => value.replace(' %', '');

  search(): void {
    this.gridApi.showLoadingOverlay();
    this.service.getTranscation({
      'stock_code': this.selectedStock.stock_code,
      'start_date': format(this.selectedDate[0], 'yyyyMMdd'),
      'end_date': format(this.selectedDate[1], 'yyyyMMdd'),
      'threshold': this.threshold,
    }).subscribe(
      data => {
        this.isLoading = false;
        this.tableData = data;
      }
    );
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  onRowChanged(params) {
    params.api.sizeColumnsToFit();
  }

}
