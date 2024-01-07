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


  /**
   * Initializes the component and navigates to the '/log_in' route.
   *
   * @return {void} This function does not return a value.
   */
  ngOnInit(): void {
    this.router.navigateByUrl('/log_in')
  }
}
