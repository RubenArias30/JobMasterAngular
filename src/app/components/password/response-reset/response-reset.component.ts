import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-response-reset',
  templateUrl: './response-reset.component.html',
  styleUrls: ['./response-reset.component.css']
})
export class ResponseResetComponent implements OnInit{
   error = [];
   form = {
    email : '',
    password : '',
    password_confirmation : '',
    resetToken : ''
   }

   constructor(private route : ActivatedRoute, private apiService : ApiService, private router : Router){
    route.queryParams.subscribe(params =>{
      this.form.resetToken = params['token']
    });
   }

   ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/']);
    }

   }

   onSubmit(): void {
    this.apiService.changedPassword(this.form).subscribe(
      data => {
        console.log(data);
        this.router.navigate(['/login']);
      },
      error => console.error(error)
    );
   }
}
