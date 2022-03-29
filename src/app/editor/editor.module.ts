import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EditorComponent } from './editor.component';
import { EditableArticleResolver } from './editable-article-resolver.service';
import { AuthGuard } from '../core';
import { SharedModule } from '../shared';
import { EditorRoutingModule } from './editor-routing.module';
import {ArticleModule} from '../article/article.module';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
    imports: [SharedModule, EditorRoutingModule, ArticleModule, MatButtonModule],
  declarations: [EditorComponent],
  providers: [EditableArticleResolver]
})
export class EditorModule {}
