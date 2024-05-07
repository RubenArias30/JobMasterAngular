import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html',
  styleUrls: ['./request-reset.component.css']
})
export class RequestResetComponent implements OnInit{

  sentMessage = false;
    public form = {
      email : null
    };

    constructor(private apiService : ApiService, private router: Router){}

    ngOnInit(): void {
      if (localStorage.getItem('token')) {
        this.router.navigate(['/']);
      }

    }

    onSubmit(){
      this.apiService.sendPasswordLink(this.form).subscribe(
        data => {
          console.log(data);
          this.sentMessage = true;
        },
        error => console.error(error)
      );
    }

    goBack(): void {
      this.router.navigate(['/']);
    }
}
