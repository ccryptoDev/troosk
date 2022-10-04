import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../_service/http.service';
import { CommonDataInatance } from '../../_service/comman.service';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpStatusCode } from '../../_service/http-status-code.enum';

@Component({
  selector: 'app-loan-stages',
  templateUrl: './loan-stages.component.html',
  styleUrls: ['./loan-stages.component.scss']
})
export class LoanStagesComponent implements OnInit {
  public stage;
  public pageTitle;
  data: any = [];
  public loanStage = CommonDataInatance.stageList;
  constructor(
    private route: ActivatedRoute,
    private service: HttpService,
    public router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  ngOnInit(): void {
    this.stage = this.route.snapshot.paramMap.get('stage');
    this.pageTitle = this.loanStage[this.stage] + ' Applications Details';
    this.get();
  }

  get() {
    this.service
      .authget('loanstage/' + this.stage, 'admin')
      .pipe(first())
      .subscribe(
        res => {
          if (res['statusCode'] === HttpStatusCode.Ok) {
            this.data = res['data'];
          } else {
            this.service.showError('Invaild page');
          }
        },
        err => {
          console.log(err);
          this.service.showError('Invaild page');
        }
      );
  }
}
