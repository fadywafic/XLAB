import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
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

  @Input('invoiceDetails') data :any
  @ViewChild(MatTable) table :any;
  @ViewChild(MatSort) sort: any;

  constructor(private service : ServiceService) { }

  invoice :any
  dataSource :any
  selection = new SelectionModel<InvoiceDetails>(true, []);

  ngOnInit(): void {
    this.createTable()
  }

  ngOnChanges(){
    this.invoice = this.data
    console.log('data', this.invoice)
  }
  displayedColumns: string[] = ['select','itemName', 'itemQty', 'itemPrice', 'itemTotalPrice'];

  createTable() {
    let tableArr: InvoiceDetails[] = this.invoice.invoice_Details
    this.dataSource = new MatTableDataSource(tableArr);
    this.dataSource.sort = this.sort;
  }


  addData() {
    const randomElementIndex = Math.floor(Math.random() * this.invoice.invoice_Details.length);
    this.dataSource.push(this.invoice.invoice_Details[randomElementIndex]);
    this.table.renderRows();
  }

  removeData() {
    let promiseArray = []
    this.selection.selected.map(item => {
      promiseArray.push(this.service.deleteItem(item.itemName, this.invoice.id).subscribe({
        next: ()=>{
          this.table.renderRows();
        },
        error: (err) => {
          console.log('error in delete item',err)
          this.service.showError('can\'t delete these items try again later')
        }
      })) 
    })
  }

  getTotalCost() {
    return this.invoice.invoice_Details.map( (item:any) => item.itemTotalPrice).reduce((acc:any, value:any) => acc + value, 0);
  }

  getTotalQty() {
    return this.invoice.invoice_Details.map( (item:any) => item.itemQty).reduce((acc:any, value:any) => acc + value, 0);
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
