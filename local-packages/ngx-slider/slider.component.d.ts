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
import { OnInit, AfterViewInit, OnChanges, OnDestroy, ElementRef, Renderer2, EventEmitter, TemplateRef, ChangeDetectorRef, SimpleChanges, NgZone } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Options } from './options';
import { ChangeContext } from './change-context';
export declare class Tick {
    selected: boolean;
    style: any;
    tooltip: string;
    tooltipPlacement: string;
    value: string;
    valueTooltip: string;
    valueTooltipPlacement: string;
    legend: string;
}
export declare class SliderComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy, ControlValueAccessor {
    private renderer;
    private elementRef;
    private changeDetectionRef;
    private zone;
    value: number;
    valueChange: EventEmitter<number>;
    highValue: number;
    highValueChange: EventEmitter<number>;
    options: Options;
    userChangeStart: EventEmitter<ChangeContext>;
    userChange: EventEmitter<ChangeContext>;
    userChangeEnd: EventEmitter<ChangeContext>;
    private manualRefreshSubscription;
    manualRefresh: EventEmitter<void>;
    private triggerFocusSubscription;
    triggerFocus: EventEmitter<void>;
    readonly range: boolean;
    private initHasRun;
    private inputModelChangeSubject;
    private inputModelChangeSubscription;
    private outputModelChangeSubject;
    private outputModelChangeSubscription;
    private viewLowValue;
    private viewHighValue;
    private viewOptions;
    private handleHalfDimension;
    private maxHandlePosition;
    private currentTrackingPointer;
    private currentFocusPointer;
    private firstKeyDown;
    private touchId;
    private dragging;
    private leftOuterSelectionBarElement;
    private rightOuterSelectionBarElement;
    private fullBarElement;
    private selectionBarElement;
    private minHandleElement;
    private maxHandleElement;
    private floorLabelElement;
    private ceilLabelElement;
    private minHandleLabelElement;
    private maxHandleLabelElement;
    private combinedLabelElement;
    private ticksElement;
    tooltipTemplate: TemplateRef<any>;
    sliderElementVerticalClass: boolean;
    sliderElementAnimateClass: boolean;
    sliderElementWithLegendClass: boolean;
    sliderElementDisabledAttr: string;
    sliderElementAriaLabel: string;
    barStyle: any;
    minPointerStyle: any;
    maxPointerStyle: any;
    fullBarTransparentClass: boolean;
    selectionBarDraggableClass: boolean;
    ticksUnderValuesClass: boolean;
    readonly showTicks: boolean;
    private intermediateTicks;
    ticks: Tick[];
    private eventListenerHelper;
    private onMoveEventListener;
    private onEndEventListener;
    private moving;
    private resizeObserver;
    private onTouchedCallback;
    private onChangeCallback;
    constructor(renderer: Renderer2, elementRef: ElementRef, changeDetectionRef: ChangeDetectorRef, zone: NgZone);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    writeValue(obj: any): void;
    registerOnChange(onChangeCallback: any): void;
    registerOnTouched(onTouchedCallback: any): void;
    setDisabledState(isDisabled: boolean): void;
    setAriaLabel(ariaLabel: string): void;
    onResize(event: any): void;
    private subscribeInputModelChangeSubject();
    private subscribeOutputModelChangeSubject();
    private subscribeResizeObserver();
    private unsubscribeResizeObserver();
    private unsubscribeOnMove();
    private unsubscribeOnEnd();
    private unsubscribeInputModelChangeSubject();
    private unsubscribeOutputModelChangeSubject();
    private unsubscribeManualRefresh();
    private unsubscribeTriggerFocus();
    private getPointerElement(pointerType);
    private getCurrentTrackingValue();
    private modelValueToViewValue(modelValue);
    private viewValueToModelValue(viewValue);
    private getStepValue(sliderValue);
    private applyViewChange();
    private applyInputModelChange(modelChange);
    private publishOutputModelChange(modelChange);
    private normaliseModelValues(input);
    private renormaliseModelValues();
    private onChangeOptions();
    private applyOptions();
    private applyStepsArrayOptions();
    private applyFloorCeilOptions();
    private resetSlider(rebindEvents?);
    private focusPointer(pointerType);
    private refocusPointerIfNeeded();
    private manageElementsStyle();
    private manageEventsBindings();
    private updateDisabledState();
    private updateAriaLabel();
    private updateVerticalState();
    private updateScale();
    private updateRotate();
    private getAllSliderElements();
    private initHandles();
    private addAccessibility();
    private updateAriaAttributes();
    private calculateViewDimensions();
    private calculateViewDimensionsAndDetectChanges();
    /**
     * If the slider reference is already destroyed
     * @returns boolean - true if ref is destroyed
     */
    private isRefDestroyed();
    private updateTicksScale();
    private getTicksArray();
    private isTickSelected(value);
    private updateFloorLabel();
    private updateCeilLabel();
    private updateHandles(which, newPos);
    private getHandleLabelPos(labelType, newPos);
    private updateLowHandle(newPos);
    private updateHighHandle(newPos);
    private updateFloorAndCeilLabelsVisibility();
    private isLabelBelowFloorLabel(label);
    private isLabelAboveCeilLabel(label);
    private updateSelectionBar();
    private getSelectionBarColor();
    private getPointerColor(pointerType);
    private getTickColor(value);
    private updateCombinedLabel();
    private getDisplayValue(value, which);
    private roundStep(value, customStep?);
    private valueToPosition(val);
    private positionToValue(position);
    private getEventXY(event, targetTouchId?);
    private getEventPosition(event, targetTouchId?);
    private getNearestHandle(event);
    private bindEvents();
    private getOptionsInfluencingEventBindings(options);
    private unbindEvents();
    private onBarStart(pointerType, draggableRange, event, bindMove, bindEnd, simulateImmediateMove?, simulateImmediateEnd?);
    private onStart(pointerType, event, bindMove, bindEnd, simulateImmediateMove?, simulateImmediateEnd?);
    private onMove(event, fromTick?);
    private onEnd(event);
    private onPointerFocus(pointerType);
    private onKeyUp();
    private onPointerBlur(pointer);
    private getKeyActions(currentValue);
    private onKeyboardEvent(event);
    private onDragStart(pointerType, event, bindMove, bindEnd);
    /** Get min value depending on whether the newPos is outOfBounds above or below the bar and rightToLeft */
    private getMinValue(newPos, outOfBounds, isAbove);
    /** Get max value depending on whether the newPos is outOfBounds above or below the bar and rightToLeft */
    private getMaxValue(newPos, outOfBounds, isAbove);
    private onDragMove(event?);
    private positionTrackingBar(newMinValue, newMaxValue);
    private positionTrackingHandle(newValue);
    private applyMinMaxLimit(newValue);
    private applyMinMaxRange(newValue);
    private applyPushRange(newValue);
    private getChangeContext();
}
