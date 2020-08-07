import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {

  render() {
    return (
      <ion-app>
        <ion-router useHash={false}>
          <ion-route url="/" component="app-start" />
          <ion-route url="/profile/:name" component="app-profile" />
          <ion-route url="/start" component="app-start" />
          <ion-route url="/preferences" component="app-preferences" />
          <ion-route url="/route/:start/:destination" component="app-route" />
        </ion-router>
        <ion-nav swipeGesture={true} animated={false} />
      </ion-app>
    );
  }
}
