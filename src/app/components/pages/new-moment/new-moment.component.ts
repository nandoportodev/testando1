import { Component, OnInit} from '@angular/core';
import { Moment } from '../../../Moment';
import { MomentService } from '../../../services/moment.service';




@Component({
  selector: 'app-new-moment',
  standalone: false,
  templateUrl: './new-moment.component.html',
  styleUrl: './new-moment.component.css',
})
export class NewMomentComponent implements OnInit {
  btnText = 'Compartilhar!';

  constructor(private momentService: MomentService) {}

  ngOnInit(): void {}

  async createHandler(moment: Moment) {
    const formData = new FormData()
    formData.append('title', moment.title)
    formData.append('description', moment.description)  
    
    if (moment.image) {
      formData.append('image', moment.image)
    }

    await this.momentService.createMoment(formData).subscribe()
  }
  }

