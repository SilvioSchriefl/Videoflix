import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.sass']
})
export class StartComponent implements OnInit {

  constructor(
    private router: Router,
  ) {}


  ngOnInit(): void {
    this.router.navigateByUrl('/log_in')
  }

}
