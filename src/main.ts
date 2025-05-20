import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

//see that you bootstrap a Module
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
