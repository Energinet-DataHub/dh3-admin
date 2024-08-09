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
import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Observable, switchMap, exhaustMap, tap, finalize, withLatestFrom, of } from 'rxjs';

import { MarketParticipantActorHttp } from '@energinet-datahub/dh/shared/domain';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorCollection } from '@energinet-datahub/dh/market-participant/data-access-api';
import { GetActorCredentialsDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import type { ResultOf } from '@graphql-typed-document-node/core';

type ActorCredentials = ResultOf<typeof GetActorCredentialsDocument>['actorById']['credentials'];

interface DhB2BAccessState {
  credentials: ActorCredentials | null | undefined;
  clientSecret: string | undefined;
  loadingCredentials: boolean;
  generateSecretInProgress: boolean;
  uploadInProgress: boolean;
  removeInProgress: boolean;
}

const initialState: DhB2BAccessState = {
  credentials: null,
  clientSecret: undefined,
  loadingCredentials: true,
  generateSecretInProgress: false,
  uploadInProgress: false,
  removeInProgress: false,
};

@Injectable()
export class DhMarketPartyB2BAccessStore extends ComponentStore<DhB2BAccessState> {
  private readonly httpClient = inject(MarketParticipantActorHttp);

  readonly actorCredentialQuery = lazyQuery(GetActorCredentialsDocument);

  readonly doCredentialsExist$ = this.select((state) => !!state.credentials);

  readonly certificateMetadata$ = this.select((state) => state.credentials?.certificateCredentials);
  readonly doesCertificateExist$ = this.select(this.certificateMetadata$, (metadata) => !!metadata);

  readonly clientSecretMetadata$ = this.select(
    (state) => state.credentials?.clientSecretCredentials
  );
  readonly doesClientSecretMetadataExist$ = this.select(
    this.clientSecretMetadata$,
    (metadata) => !!metadata
  );
  readonly clientSecret$ = this.select((state) => state.clientSecret);
  readonly clientSecretExists$ = this.select(this.clientSecret$, (value) => !!value);

  readonly uploadInProgress$ = this.select((state) => state.uploadInProgress);
  readonly generateSecretInProgress$ = this.select((state) => state.generateSecretInProgress);
  readonly showSpinner$ = this.select(
    (state) => state.loadingCredentials || state.removeInProgress
  );

  readonly getCredentials = this.effect((actorId$: Observable<string>) =>
    actorId$.pipe(
      tap(() => this.patchState({ credentials: null, loadingCredentials: true })),
      switchMap((actorId) =>
        this.actorCredentialQuery.query({
          variables: { actorId },
          onCompleted: (data) => {
            this.patchState({ loadingCredentials: false, credentials: data.actorById.credentials });
          },
          onError: () => {
            this.patchState({ loadingCredentials: false, credentials: null });
          },
        })
      )
    )
  );

  readonly uploadCertificate = this.effect(
    (
      trigger$: Observable<{
        actorId: string;
        file: File;
        onSuccess: () => void;
        onError: (apiErrorCollection: ApiErrorCollection) => void;
      }>
    ) =>
      trigger$.pipe(
        tap(() => this.patchState({ uploadInProgress: true })),
        exhaustMap(({ actorId, file, onSuccess, onError }) =>
          this.httpClient
            .v1MarketParticipantActorAssignCertificateCredentialsPost(actorId, file)
            .pipe(
              tapResponse(
                () => onSuccess(),
                (errorResponse: HttpErrorResponse) =>
                  onError(this.createApiErrorCollection(errorResponse))
              ),
              finalize(() => this.patchState({ uploadInProgress: false }))
            )
        )
      )
  );

  readonly replaceCertificate = this.effect(
    (
      trigger$: Observable<{
        actorId: string;
        file: File;
        onSuccess: () => void;
        onError: (apiErrorCollection: ApiErrorCollection) => void;
      }>
    ) =>
      trigger$.pipe(
        tap(() => this.patchState({ uploadInProgress: true })),
        exhaustMap(({ actorId, file, onSuccess, onError }) =>
          this.httpClient.v1MarketParticipantActorRemoveActorCredentialsDelete(actorId).pipe(
            switchMap(() =>
              this.httpClient.v1MarketParticipantActorAssignCertificateCredentialsPost(
                actorId,
                file
              )
            ),
            tapResponse(
              () => onSuccess(),
              (errorResponse: HttpErrorResponse) =>
                onError(this.createApiErrorCollection(errorResponse))
            ),
            finalize(() => this.patchState({ uploadInProgress: false }))
          )
        )
      )
  );

  readonly generateClientSecret = this.effect(
    (
      trigger$: Observable<{
        actorId: string;
        onSuccess: () => void;
        onError: () => void;
      }>
    ) =>
      trigger$.pipe(
        withLatestFrom(this.doesClientSecretMetadataExist$, this.doesCertificateExist$),
        tap(() => this.patchState({ generateSecretInProgress: true })),
        exhaustMap(
          ([
            { actorId, onSuccess, onError },
            doesClientSecretMetadataExist,
            doesCertificateExist,
          ]) => {
            let kickOff$ = of('noop');

            if (doesClientSecretMetadataExist || doesCertificateExist) {
              kickOff$ =
                this.httpClient.v1MarketParticipantActorRemoveActorCredentialsDelete(actorId);
            }

            return kickOff$.pipe(
              switchMap(() =>
                this.httpClient.v1MarketParticipantActorRequestClientSecretCredentialsPost(actorId)
              ),
              tapResponse(
                (clientSecret) => {
                  this.patchState({ clientSecret: clientSecret.secretText });

                  onSuccess();
                },
                () => onError()
              ),
              finalize(() => this.patchState({ generateSecretInProgress: false }))
            );
          }
        )
      )
  );

  readonly resetClientSecret = this.updater(
    (state): DhB2BAccessState => ({
      ...state,
      clientSecret: undefined,
    })
  );

  readonly removeActorCredentials = this.effect(
    (
      trigger$: Observable<{
        actorId: string;
        onSuccess: () => void;
        onError: () => void;
      }>
    ) =>
      trigger$.pipe(
        tap(() => this.patchState({ removeInProgress: true })),
        exhaustMap(({ actorId, onSuccess, onError }) =>
          this.httpClient.v1MarketParticipantActorRemoveActorCredentialsDelete(actorId).pipe(
            tapResponse(
              () => {
                this.patchState({ credentials: null, clientSecret: undefined });

                onSuccess();
              },
              () => onError()
            ),
            finalize(() => this.patchState({ removeInProgress: false }))
          )
        )
      )
  );

  constructor() {
    super(initialState);
  }

  createApiErrorCollection = (errorResponse: HttpErrorResponse): ApiErrorCollection => {
    return { apiErrors: errorResponse.error?.errors ?? [] };
  };
}
