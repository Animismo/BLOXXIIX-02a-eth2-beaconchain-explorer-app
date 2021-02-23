/* 
 *  // Copyright (C) 2020 - 2021 Bitfly GmbH
 *  // Manuel Caspari (manuel@bitfly.at)
 *  // 
 *  // This file is part of Beaconchain Dashboard.
 *  // 
 *  // Beaconchain Dashboard is free software: you can redistribute it and/or modify
 *  // it under the terms of the GNU General Public License as published by
 *  // the Free Software Foundation, either version 3 of the License, or
 *  // (at your option) any later version.
 *  // 
 *  // Beaconchain Dashboard is distributed in the hope that it will be useful,
 *  // but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  // GNU General Public License for more details.
 *  // 
 *  // You should have received a copy of the GNU General Public License
 *  // along with Beaconchain Dashboard.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, OnInit, Input } from '@angular/core';
import { ValidatorUtils, Validator, getDisplayName, SAVED } from '../../utils/ValidatorUtils';
import { ModalController } from '@ionic/angular';
import OverviewController from '../../controllers/OverviewController';
import { fromEvent, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-validatordetail',
  templateUrl: './validatordetail.page.html',
  styleUrls: ['./validatordetail.page.scss'],
})
export class ValidatordetailPage implements OnInit {

  @Input() item: Validator;
  name: string

  data: any

  tagged: boolean = false

  currentY: number = 0

  private backbuttonSubscription: Subscription;

  constructor(
    private validatorUtils: ValidatorUtils,
    private modalCtrl: ModalController,
    private api: ApiService
  ) { }

  setInput(validator: Validator) {
    this.item = validator
  }

  ngOnInit() {
    const event = fromEvent(document, 'backbutton');
    this.backbuttonSubscription = event.subscribe(async () => {
      this.modalCtrl.dismiss();
    });
    this.updateDetails(this.item)
    this.tagged = this.item.storage == SAVED
  }

  ngOnChanges() {
    this.updateDetails(this.item)
  }

  onScroll($event) {
    this.currentY = $event.detail.currentY
  }

  ngOnDestroy() {
    this.backbuttonSubscription.unsubscribe();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async updateDetails(item: Validator) {
    this.name = getDisplayName(item)

    const performances = await this.validatorUtils.getRemoteValidatorPerformance(item.index)
    const epoch = await this.validatorUtils.getRemoteCurrentEpoch()
    const attestationPerformance = await this.validatorUtils.getRemoteValidatorAttestationPerformance(item.index).catch((error) => { return null })
    const overviewController = new OverviewController()
    this.data = overviewController.proccessDetail([item], performances, epoch, attestationPerformance)
  }

  tag(event) {
    this.validatorUtils.convertToValidatorModelAndSaveValidatorLocal(false, this.item.data)
    this.tagged = true
  }

  untag(event) {
    this.validatorUtils.deleteValidatorLocal(this.item.data)
    this.tagged = false
  }
}
