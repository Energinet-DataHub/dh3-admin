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
import { TimeSeriesType } from './time-series-type';


export interface ProcessResultRequestDto { 
    batchId: string;
    gridAreaCode: string;
    timeSeriesType: TimeSeriesType;
    gln?: string | null;
}


