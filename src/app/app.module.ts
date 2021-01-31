import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {NZ_I18N} from 'ng-zorro-antd/i18n';
import {en_US} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {IconsProviderModule} from './icons-provider.module';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {TrendComponent} from './pages/trend/trend.component';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NgZorroAntdModule} from './ng-zorror-antd/ng-zorror-antd.module';
import {TransactionComponent} from './pages/transaction/transaction.component';
import {NZ_ICONS} from 'ng-zorro-antd/icon';
import {IconDefinition} from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import {NgxEchartsModule} from 'ngx-echarts';
// import {NsAutoHeightTableDirective} from 'zorro-sharper';


registerLocaleData(en);
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);

@NgModule({
  declarations: [
    AppComponent,
    TrendComponent,
    TransactionComponent,
    // NsAutoHeightTableDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NgxEchartsModule.forRoot({
      echarts: () => {
        return import('echarts');
      },
    }),
  ],
  providers: [{provide: NZ_I18N, useValue: en_US}, {provide: NZ_ICONS, useValue: icons}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
