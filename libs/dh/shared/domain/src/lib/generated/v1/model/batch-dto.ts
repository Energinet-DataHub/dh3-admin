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
import { BatchState } from './batch-state';
import { GridAreaDto } from './grid-area-dto';


export interface BatchDto { 
    batchId: string;
    periodStart: string;
    periodEnd: string;
    executionTimeStart?: string | null;
    executionTimeEnd?: string | null;
    executionState: BatchState;
    isBasisDataDownloadAvailable: boolean;
    gridAreas: Array<GridAreaDto>;
}
export namespace BatchDto {
}



