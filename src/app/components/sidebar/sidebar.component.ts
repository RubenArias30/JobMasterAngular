import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  sidebarHidden: boolean = false;

  // Function to toggle sidebar visibility
  toggleSidebar() {
    this.sidebarHidden = !this.sidebarHidden;
  }
  userRole: string | null = null;

  constructor(private authService: AuthService) {
    this.userRole = this.authService.getUserRole();
  }

  // isAdmin(): boolean {
  //   return this.authService.getUserRole() === 'admin';
  // }

  // isEmployee(): boolean {
  //   return this.authService.getUserRole() === 'empleado';
  // }


  logout(){
    this.authService.logout();
    window.location.reload()
  }
}
