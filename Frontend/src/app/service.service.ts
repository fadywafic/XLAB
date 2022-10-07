import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

  baseUrl = 'https://localhost:7060/'

  searchInvoiceById(id:string){
    return this.http.get(this.baseUrl + 'api/Invoices/'+ id)
  }

  deleteItem(itemName:string, invoiceId:string){
    return this.http.delete(this.baseUrl + 'api/Invoice_Detail?itemName='+ itemName +'&invoiceId=' + invoiceId)
  }

  showError(err:string){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: err,
    })
  }
}
