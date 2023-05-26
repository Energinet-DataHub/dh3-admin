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
export const document = `
<?xml version="1.0" encoding="UTF-8"?>
<!--Sample XML file generated by XMLSpy v2021 (x64) (http://www.altova.com)-->
<cim:RequestChangeAccountingPointCharacteristics_MarketDocument xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:cim="urn:ebix:org:ChangeAccountingPointCharacteristics:0:1" xsi:schemaLocation="urn:ebix:org:ChangeAccountingPointCharacteristics:0:1 urn-ediel-org-RSM-021-ChangeOfAccountingPointCharacteristics-RequestChangeOfAccountingPointCharacteristics-0-1.xsd">
	<cim:mRID>String</cim:mRID>
	<cim:type>E58</cim:type>
	<cim:process.processType>E02</cim:process.processType>
	<cim:businessSector.type>E16</cim:businessSector.type>
	<cim:sender_MarketParticipant.mRID codingScheme="NMK">a</cim:sender_MarketParticipant.mRID>
	<cim:sender_MarketParticipant.marketRole.type>A08</cim:sender_MarketParticipant.marketRole.type>
	<cim:receiver_MarketParticipant.mRID codingScheme="NFI">a</cim:receiver_MarketParticipant.mRID>
	<cim:receiver_MarketParticipant.marketRole.type>A33</cim:receiver_MarketParticipant.marketRole.type>
	<cim:createdDateTime>2001-12-17T09:30:47Z</cim:createdDateTime>
	<cim:MktActivityRecord>
		<cim:mRID>whateverasdasd</cim:mRID>
		<cim:MarketEvaluationPoint>
			<cim:mRID codingScheme="NNL">571313180400012882</cim:mRID>
			<cim:type>E17</cim:type>
			<cim:description>String</cim:description>
			<cim:settlementMethod>D01</cim:settlementMethod>
			<cim:meteringMethod>D01</cim:meteringMethod>
			<cim:meteredDataCollectionMethod>D01</cim:meteredDataCollectionMethod>
			<cim:netSettlementGroup>0</cim:netSettlementGroup>
			<cim:productionObligation>false</cim:productionObligation>
			<cim:mPConnectionType>D01</cim:mPConnectionType>
			<cim:readCycle>PT1H</cim:readCycle>
			<cim:disconnectionMethod>D01</cim:disconnectionMethod>
			<cim:nextReadingDate></cim:nextReadingDate>
			<cim:ratedCurrent unit="AMP">1000</cim:ratedCurrent>
			<cim:connectionState>D03</cim:connectionState>
			<cim:physicalConnectionCapacity>
				<cim:value>1000</cim:value>
				<cim:unit>KWH</cim:unit>
			</cim:physicalConnectionCapacity>
			<cim:firstCustomer_MarketParticipant.mRID codingScheme="NLU">a</cim:firstCustomer_MarketParticipant.mRID>
			<cim:firstCustomer_MarketParticipant.name>String</cim:firstCustomer_MarketParticipant.name>
			<cim:secondCustomer_MarketParticipant.mRID codingScheme="NRU">a</cim:secondCustomer_MarketParticipant.mRID>
			<cim:secondCustomer_MarketParticipant.name>String</cim:secondCustomer_MarketParticipant.name>
			<cim:marketAgreement.contractedConnectionCapacity>
				<cim:value>500</cim:value>
				<cim:unit>KWH</cim:unit>
				<cim:multiplier>k</cim:multiplier>
			</cim:marketAgreement.contractedConnectionCapacity>
			<cim:meter.mRID>012345678912345</cim:meter.mRID>
			<cim:Series>
				<cim:estimatedAnnualVolume_Quantity.quantity>110</cim:estimatedAnnualVolume_Quantity.quantity>
				<cim:quantity_Measure_Unit.name>KWH</cim:quantity_Measure_Unit.name>
				<cim:product>8716867000030</cim:product>
			</cim:Series>
			<cim:register.rightDigitCount>100</cim:register.rightDigitCount>
			<cim:register.leftDigitCount>100</cim:register.leftDigitCount>
			<cim:register.channels.readingType.accumulation>D01</cim:register.channels.readingType.accumulation>
			<cim:register.channels.readingType.multiplier>0</cim:register.channels.readingType.multiplier>
			<cim:register.channels.readingType.unit>MTQ</cim:register.channels.readingType.unit>
			<cim:inMeteringGridArea_Domain.mRID codingScheme="NLV">870</cim:inMeteringGridArea_Domain.mRID>
			<cim:usagePointLocation.mainAddress>
				<cim:streetDetail>
					<cim:number>String</cim:number>
					<cim:name>String</cim:name>
					<cim:type>String</cim:type>
					<cim:code>String</cim:code>
					<cim:buildingName>String</cim:buildingName>
					<cim:suiteNumber>String</cim:suiteNumber>
					<cim:floorIdentification>String</cim:floorIdentification>
				</cim:streetDetail>
				<cim:townDetail>
					<cim:code>String</cim:code>
					<cim:section>String</cim:section>
					<cim:name>String</cim:name>
					<cim:stateOrProvince>String</cim:stateOrProvince>
					<cim:country>AA</cim:country>
				</cim:townDetail>
				<cim:status>
					<cim:value>String</cim:value>
					<cim:dateTime>2021-06-17T09:30:47Z</cim:dateTime>
					<cim:remark>String</cim:remark>
					<cim:reason>String</cim:reason>
				</cim:status>
				<cim:postalCode>String</cim:postalCode>
				<cim:poBox>String</cim:poBox>
				<cim:language>String</cim:language>
			</cim:usagePointLocation.mainAddress>
			<cim:usagePointLocation.officialAddressIndicator>true</cim:usagePointLocation.officialAddressIndicator>
			<cim:usagePointLocation.geoInfoReference>a</cim:usagePointLocation.geoInfoReference>
			<cim:meteringGridArea_Domain.mRID codingScheme="NKZ">870</cim:meteringGridArea_Domain.mRID>
			<cim:outMeteringGridArea_Domain.mRID codingScheme="NAT">871</cim:outMeteringGridArea_Domain.mRID>
			<cim:parent_MarketEvaluationPoint.mRID codingScheme="NSE">a</cim:parent_MarketEvaluationPoint.mRID>
			<cim:parent_MarketEvaluationPoint.description>E17</cim:parent_MarketEvaluationPoint.description>
			<cim:linked_MarketEvaluationPoint.mRID codingScheme="NNL">571234567891234636</cim:linked_MarketEvaluationPoint.mRID>
			<cim:mktPSRType.psrType>B14</cim:mktPSRType.psrType>
			<cim:accountingPointResponsible_MarketParticipant.mRID codingScheme="NNO">a</cim:accountingPointResponsible_MarketParticipant.mRID>
		</cim:MarketEvaluationPoint>
		<cim:businessProcessReference_MktActivityRecord.mRID>String</cim:businessProcessReference_MktActivityRecord.mRID>
		<cim:start_DateAndOrTime.dateTime>2021-07-01T22:00:00Z</cim:start_DateAndOrTime.dateTime>
	</cim:MktActivityRecord>
</cim:RequestChangeAccountingPointCharacteristics_MarketDocument>
    `;
