
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { HttpErrorResponse} from '@angular/common/http';




export class HandlerError {
  // Ref: 1. https://blog.angular-university.io/rxjs-error-handling/
  //      2. https://angular.io/guide/http#error-handling
  /**
   * Handle Http operation that failed.
   * @param error - the error object
   */
  public static handleError(error: HttpErrorResponse) {

    console.log(error);

    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      return observableThrowError({ title: 'The server is unreachable.', detail: null });
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      return observableThrowError({ title: error.error.title, detail: error.error.detail });
    }
  }
}
