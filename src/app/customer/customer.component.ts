import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerId: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.customerId = +this.route.firstChild.snapshot.params['id'];
  }

}
