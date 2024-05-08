/**
 * DataHub BFF
 * Backend-for-frontend for DataHub
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec, HttpContext 
        }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

// @ts-ignore
import { Stream } from '../model/stream';
// @ts-ignore
import { WholesaleCalculationType } from '../model/wholesale-calculation-type';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'root'
})
export class WholesaleSettlementReportHttp {

    protected basePath = 'http://localhost';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string|string[], @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (Array.isArray(basePath) && basePath.length > 0) {
                basePath = basePath[0];
            }

            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }


    // @ts-ignore
    private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
        if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
        } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
        }
        return httpParams;
    }

    private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
        if (value == null) {
            return httpParams;
        }

        if (typeof value === "object") {
            if (Array.isArray(value)) {
                (value as any[]).forEach( elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
            } else if (value instanceof Date) {
                if (key != null) {
                    httpParams = httpParams.append(key, (value as Date).toISOString().substring(0, 10));
                } else {
                   throw Error("key may not be null if value is Date");
                }
            } else {
                Object.keys(value).forEach( k => httpParams = this.addToHttpParamsRecursive(
                    httpParams, value[k], key != null ? `${key}.${k}` : k));
            }
        } else if (key != null) {
            httpParams = httpParams.append(key, value);
        } else {
            throw Error("key may not be null if value is not object or array");
        }
        return httpParams;
    }

    /**
     * @param gridAreaCodes 
     * @param calculationType 
     * @param periodStart 
     * @param periodEnd 
     * @param energySupplier 
     * @param csvLanguage 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public v1WholesaleSettlementReportDownloadGet(gridAreaCodes?: Array<string>, calculationType?: WholesaleCalculationType, periodStart?: string, periodEnd?: string, energySupplier?: string, csvLanguage?: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/zip', context?: HttpContext, transferCache?: boolean}): Observable<Stream>;
    public v1WholesaleSettlementReportDownloadGet(gridAreaCodes?: Array<string>, calculationType?: WholesaleCalculationType, periodStart?: string, periodEnd?: string, energySupplier?: string, csvLanguage?: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/zip', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<Stream>>;
    public v1WholesaleSettlementReportDownloadGet(gridAreaCodes?: Array<string>, calculationType?: WholesaleCalculationType, periodStart?: string, periodEnd?: string, energySupplier?: string, csvLanguage?: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/zip', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<Stream>>;
    public v1WholesaleSettlementReportDownloadGet(gridAreaCodes?: Array<string>, calculationType?: WholesaleCalculationType, periodStart?: string, periodEnd?: string, energySupplier?: string, csvLanguage?: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/zip', context?: HttpContext, transferCache?: boolean}): Observable<any> {

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (gridAreaCodes) {
            gridAreaCodes.forEach((element) => {
                localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
                  <any>element, 'gridAreaCodes');
            })
        }
        if (calculationType !== undefined && calculationType !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>calculationType, 'calculationType');
        }
        if (periodStart !== undefined && periodStart !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>periodStart, 'periodStart');
        }
        if (periodEnd !== undefined && periodEnd !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>periodEnd, 'periodEnd');
        }
        if (energySupplier !== undefined && energySupplier !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>energySupplier, 'energySupplier');
        }
        if (csvLanguage !== undefined && csvLanguage !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>csvLanguage, 'csvLanguage');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarCredential: string | undefined;
        // authentication (Bearer) required
        localVarCredential = this.configuration.lookupCredential('Bearer');
        if (localVarCredential) {
            localVarHeaders = localVarHeaders.set('Authorization', 'Bearer ' + localVarCredential);
        }

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/zip'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }

        let localVarTransferCache: boolean | undefined = options && options.transferCache;
        if (localVarTransferCache === undefined) {
            localVarTransferCache = true;
        }


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/v1/WholesaleSettlementReport/Download`;
        return this.httpClient.request<Stream>('get', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                params: localVarQueryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                transferCache: localVarTransferCache,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param settlementReportId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public v1WholesaleSettlementReportDownloadReportGet(settlementReportId?: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/zip', context?: HttpContext, transferCache?: boolean}): Observable<Stream>;
    public v1WholesaleSettlementReportDownloadReportGet(settlementReportId?: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/zip', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<Stream>>;
    public v1WholesaleSettlementReportDownloadReportGet(settlementReportId?: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/zip', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<Stream>>;
    public v1WholesaleSettlementReportDownloadReportGet(settlementReportId?: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/zip', context?: HttpContext, transferCache?: boolean}): Observable<any> {

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (settlementReportId !== undefined && settlementReportId !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>settlementReportId, 'settlementReportId');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarCredential: string | undefined;
        // authentication (Bearer) required
        localVarCredential = this.configuration.lookupCredential('Bearer');
        if (localVarCredential) {
            localVarHeaders = localVarHeaders.set('Authorization', 'Bearer ' + localVarCredential);
        }

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/zip'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }

        let localVarTransferCache: boolean | undefined = options && options.transferCache;
        if (localVarTransferCache === undefined) {
            localVarTransferCache = true;
        }


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/v1/WholesaleSettlementReport/DownloadReport`;
        return this.httpClient.request<Stream>('get', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                params: localVarQueryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                transferCache: localVarTransferCache,
                reportProgress: reportProgress
            }
        );
    }

}
