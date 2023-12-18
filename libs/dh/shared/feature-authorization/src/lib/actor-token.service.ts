/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, Observable, ReplaySubject, switchMap, tap } from 'rxjs';

import { MarketParticipantUserHttp, TokenHttp } from '@energinet-datahub/dh/shared/domain';

import { ActorStorage, actorStorageToken } from './actor-storage';

type CachedEntry = { token: string; value: Observable<string> } | undefined;

@Injectable({
  providedIn: 'root',
})
export class ActorTokenService {
  private _internalActors: CachedEntry;
  private _internalToken: CachedEntry;

  constructor(
    private marketParticipantUserHttp: MarketParticipantUserHttp,
    private tokenHttp: TokenHttp,
    @Inject(actorStorageToken) private actorStorage: ActorStorage
  ) {}

  public isPartOfAuthFlow(request: HttpRequest<unknown>) {
    return this.isUserActorsRequest(request) || this.isTokenRequest(request);
  }

  public handleAuthFlow(
    request: HttpRequest<unknown>,
    nextHandler: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.isUserActorsRequest(request)) {
      return this.updateCache(
        request,
        nextHandler,
        () => this._internalActors,
        (value) => (this._internalActors = value)
      );
    }

    if (this.isTokenRequest(request)) {
      return this.updateCache(
        request,
        nextHandler,
        () => this._internalToken,
        (value) => (this._internalToken = value)
      );
    }

    return nextHandler.handle(request);
  }

  public acquireToken = (): Observable<string> => {
    return this.marketParticipantUserHttp.v1MarketParticipantUserGetUserActorsGet().pipe(
      tap(({ actorIds }) => this.actorStorage.setUserAssociatedActors(actorIds)),
      switchMap(() =>
        this.tokenHttp
          .v1TokenPost(this.actorStorage.getSelectedActor())
          .pipe(map(({ token }) => token))
      )
    );
  };

  private updateCache(
    request: HttpRequest<unknown>,
    nextHandler: HttpHandler,
    readCache: () => CachedEntry,
    writeCache: (value: CachedEntry) => void
  ): Observable<HttpEvent<unknown>> {
    const externalToken = request.headers.get('Authorization');

    if (!externalToken) throw new Error('handleAuthFlow failed, no token in Authorization header.');

    const cachedEntry = readCache();
    if (cachedEntry && cachedEntry.token === externalToken) {
      return this.createCachedResponse(cachedEntry.value);
    }

    const subject = new ReplaySubject<string>();
    writeCache({ token: externalToken, value: subject });

    return nextHandler.handle(request).pipe(
      tap({
        next: (event) => {
          const response = event as HttpResponse<string>;
          if (response.status === 200 && response.body) {
            subject.next(response.body);
            subject.complete();
          }
        },
        error: (error) => {
          subject.error(error);
        },
      })
    );
  }

  private createCachedResponse(cache: Observable<string>): Observable<HttpResponse<string>> {
    return cache.pipe(map((value) => new HttpResponse<string>({ body: value, status: 200 })));
  }

  private isUserActorsRequest(request: HttpRequest<unknown>): boolean {
    return request.url.endsWith('/v1/MarketParticipantUser/GetUserActors');
  }

  private isTokenRequest(request: HttpRequest<unknown>): boolean {
    return request.url.endsWith('/v1/Token');
  }
}
