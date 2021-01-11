import { Component, OnInit, Inject } from '@angular/core';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      expand()
    ]
})
export class AboutComponent implements OnInit {

  our_leaders: Leader[];
  our_leaders_Errmsg: string;

  constructor(private ls: LeaderService,
    @Inject('baseURL') private baseURL) { }

  ngOnInit() {
    this.ls.getLeaders()
      .subscribe(leadership => this.our_leaders = leadership, lerrmess => this.our_leaders_Errmsg = <any>lerrmess);
  }

}
