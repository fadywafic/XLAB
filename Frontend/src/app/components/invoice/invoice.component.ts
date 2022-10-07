import { ServiceService } from 'src/app/service.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  constructor(private service: ServiceService) { }

  ngOnInit(): void {
  }

  search = ''
  invoice: any = undefined
  isLoadingResults = false

  invoiceSearch() {
    if (!this.validSearch()) {
      this.service.showError('Invalid ID')
      return;
    }

    this.isLoadingResults = true
    this.service.searchInvoiceById(this.search).subscribe({
      next: (data) => {
        this.invoice = data
        this.isLoadingResults = false
      },
      error: (error) => {
        this.invoice = undefined
        this.service.showError('This Customer ID don\'t exist')
        console.log('error in search invoice', error)
      }
    })
  }

  validSearch() {
    const IdPattern = new RegExp('^[0-9]+$', 'i')
    return this.search && IdPattern.test(this.search) ? true : false
  }

  deleteInvoice() {
    this.service.deleteInvoice(this.invoice.id).subscribe({
      next: () => {
        this.search = ''
        this.invoice = undefined
        this.service.showSuccess('Invoice deleted successfully')
      },
      error: (error) => {
        this.service.showError('can\'t delete this invoice, try again later')
        console.log('error in delete invoice', error)
      }
    })
  }

  clear() {
    this.invoice.customerName = ''
    this.invoice.date = new Date()
    this.invoice.invoice_Details = []
  }

  updateInvoiceDetails(details:any){
    this.invoice.invoice_details = details
    console.log('updating details in invoice', this.invoice.invoice_details)
  }

  isValidInvoice(createdData: any) {
    let state = true

    if (!createdData.customerName || !createdData.invoice_Details) {
      this.service.showError('Incomplete Invoice Data')
      return false;
    }

    if (createdData.customerName) {
      const name = new RegExp('^[a-zA-Z]{0,50}$', 'i')
      state = name.test(createdData.customerName)
      if (!state) {
        this.service.showError('Invalid Customer name \n')
        return false;
      }
    }
    return state
  }

  addInvoice() {
    if (!this.isValidInvoice(this.invoice)) return;

    let body = {
      customerName: this.invoice.customerName,
      date: new Date(),
      invoice_Details: this.invoice.invoice_Details
    }

    this.service.AddInvoice(body).subscribe({
      next: (data) => {
        this.service.showSuccess(`New invoice with id ${data.id} added successfully`)
        this.search = ''
        this.invoice = undefined
      },
      error: (err) => {
        console.log('error in add invoice', err)
        this.service.showError('can\'t add this invoice, try again later')
      }
    })
  }

  showOrHideInvoice = false
  btnText ='Show invoice'
  toggleInvoice(){
    this.btnText = this.showOrHideInvoice ? 'Hide invoice' : 'Show invoice'
    this.showOrHideInvoice = !this.showOrHideInvoice
  }

  updateInvoice() {
    if (!this.isValidInvoice(this.invoice)) return;

    let body = {
      id: this.invoice.id,
      customerName: this.invoice.customerName,
      date: new Date(),
      invoice_Details: this.invoice.invoice_Details
    }

    console.log('updaaaaaaaate', body)
    this.service.updateInvoice(body).subscribe({
      next: () => {
        this.service.showSuccess('Invoice has updated successfully')
      },
      error: (err) => {
        console.log('error in update invoice', err)
        this.service.showError('can\'t update this invoice, try again later')
      }
    })
  }

}
