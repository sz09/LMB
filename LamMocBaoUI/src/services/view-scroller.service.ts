import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ViewScrollerService {
  mapRoutesNeedView: { route: string, viewElement: string }[] = [
    { route: 've-chung-toi', viewElement: 've-chung-toi'}
  ]
  constructor(private _router: Router) {
  }

  public doScrollIfNeed(): void {
    var url = this._router.url;
    this.mapRoutesNeedView.forEach(d => {
      if (url.endsWith(d.route)) {
        setTimeout(() => { document.getElementById(d.viewElement)?.scrollIntoView(); }, 300)
      }
    })
  }
}
