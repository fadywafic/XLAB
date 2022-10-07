import { ServiceService } from 'src/app/service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  constructor(private service : ServiceService) { }

  ngOnInit(): void {
  }

  search = ''
  invoice :any = undefined

  invoiceSearch(){
    if(!this.validSearch()){
      this.service.showError( 'Invalid ID')
      return;
    }

    this.service.searchInvoiceById(this.search).subscribe({
      next: (data) => {
        this.invoice = data
      },
      error: (error) => {
        this.service.showError( 'This Customer ID don\'t exsist')
        console.log('error in search invoice', error)
      }
    })
  }

  validSearch(){
    const IdPattern = new RegExp('^[0-9]+$','i')
    return this.search && IdPattern.test(this.search) ? true : false
  }

}
