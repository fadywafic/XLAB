import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnChanges, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ServiceService } from 'src/app/service.service';

export interface InvoiceDetails {
  itemName: string,
  itemQty: number,
  itemPrice: number,
  itemTotalPrice: number
}
@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.css']
})
export class InvoiceDetailsComponent implements OnInit, OnChanges {

  @Input('invoiceDetails') details: any

  @ViewChild(MatTable) table: any;
  @ViewChild(MatSort) sort: any;

  @Output() updatingInvoiceDetails = new EventEmitter<InvoiceDetails>();
  constructor(private service: ServiceService) { }

  invoice: any
  invoiceId:any
  dataSource: any
  selection = new SelectionModel<InvoiceDetails>(true, []);

  newItem = {
    itemName: '',
    itemQty: '',
    itemPrice: '',
    itemTotalPrice: undefined,
    invoiceId: undefined
  }

  ngOnInit(): void {
    this.createTable()
  }

  ngOnChanges() {
    this.invoice = this.details
    if(this.dataSource && this.dataSource.data) this.dataSource.data = this.invoice;
    console.log('data', this.invoice)
  }
  displayedColumns: string[] = ['itemName', 'itemQty', 'itemPrice', 'itemTotalPrice','options'];

  createTable() {
    let tableArr: InvoiceDetails[] = this.invoice
    this.dataSource = new MatTableDataSource(tableArr);
    this.dataSource.sort = this.sort;
  }

  isValidItem(createdData:any){
    let validationArray =[]
    let state = true

    if(!createdData.itemName || !createdData.itemQty || !createdData.itemPrice){
      this.service.showError('Incomplete Data')
      return false;
    }

    if(createdData.itemName){
      const name = new RegExp('^[a-zA-Z]{0,50}$','i')
      state = name.test(createdData.itemName)
      if(!state)  validationArray.push('Invalid item name \n')
      if(this.dataSource.data.find((item:any) => { return item.itemName == createdData.itemName } )){
        this.service.showError('This item already exists')
      return false;
      }
    }

    if(createdData.itemPrice){
      const price = new RegExp('^[0-9]+$','i')
      state = price.test(createdData.itemPrice)
      if(!state)  validationArray.push('Invalid item price \n')
    }

    if(createdData.itemQty){
      const qty = new RegExp('^[0-9]+$','i')
      state = qty.test(createdData.itemQty)
      if(!state)  validationArray.push('Invalid item quantity \n')
      // var result = (createdData.itemQty - Math. floor(createdData.itemQty)) !== 0; 
      // if (result){
      //   state = false
      //   validationArray.push('Invalid item quantity \n')
      // }
    }

    if(!state){
      this.service.showError(validationArray.join(' - '))
    }

    return state
  }

  addItem() {
    if(!this.isValidItem(this.newItem)) return;

    let body = {
      itemName: this.newItem.itemName,
      itemQty: +this.newItem.itemQty,
      itemPrice: +this.newItem.itemPrice,
      itemTotalPrice: +this.newItem.itemPrice * +this.newItem.itemQty,
    }

    // this.service.AddItem(body).subscribe({
    //   next: () => {
      this.dataSource.data.push(body)
      this.updatingInvoiceDetails.emit(this.dataSource.data)
      this.table.renderRows();
      this.newItem.itemName = this.newItem.itemQty = this.newItem.itemPrice = ''
    //   },
    //   error: (err) => {
    //     console.log('error in add item', err)
    //     this.service.showError('can\'t add this item, try again later')
    //   }
    // })
  }

  removeItem(item:any) {
    // this.service.deleteItem(item.itemName, this.invoice.invoiceId).subscribe({
    //   next: () => {
      let index = this.dataSource.data.findIndex((i:any) => i == item)
      this.dataSource.data.splice( index ,1)
      this.updatingInvoiceDetails.emit(this.dataSource.data)
      this.table.renderRows();
      // },
      // error: (err) => {
      //   console.log('error in delete item', err)
      //   this.service.showError('can\'t delete this item, try again later')
      // }
    // })
  }

  getTotalCost() {
    return this.invoice.map((item: any) => +item.itemTotalPrice).reduce((acc: any, value: any) => acc + value, 0);
  }

  getTotalQty() {
    return this.invoice.map((item: any) => +item.itemQty).reduce((acc: any, value: any) => acc + value, 0);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: InvoiceDetails): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.itemName}`;
  }

}
