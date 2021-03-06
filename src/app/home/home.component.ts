import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  dishErrMess: string;
  promoErrMess: string;
  leadErrMess: string;

  constructor(private dishservice: DishService,
    private promotionservice: PromotionService,
    private promotedLeader: LeaderService,
    @Inject('baseURL') private baseURL) { }

  ngOnInit() {
    this.dishservice.getFeaturedDish()
      .subscribe(dishes => this.dish = dishes, derrmess => this.dishErrMess = <any>derrmess);
    this.promotionservice.getFeaturedPromotion()
      .subscribe(promotions => this.promotion = promotions, perrmess => this.promoErrMess = <any>perrmess);
    this.promotedLeader.getFeaturedLeader()
      .subscribe(leadership => this.leader = leadership, lerrmess => this.leadErrMess = <any>lerrmess);
  }

}
