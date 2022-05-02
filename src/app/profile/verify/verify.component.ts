import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientUser } from 'src/app';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit {
  @Input()
  user!: ClientUser;

  
  code!: string;
  result = "Loading";
  constructor(private route: ActivatedRoute, private auth: AuthService) {}

  ngOnInit(): void {
    this.code = this.route.snapshot.params['code'];
    this.auth.verifyAccount(this.code).subscribe({
      next: (res) => {this.result = "Верифицировано";
      this.user.STATUS = "CHECKED";
    },
      error: (err) => {this.result = "Верефикация не удалась";},
    });
  }
}
