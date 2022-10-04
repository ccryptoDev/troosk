"use strict";
const fs = require('fs');
const http = require('https');
const creditScoreAssets = {}
creditScoreAssets.ConsumerCredit_Individual_OrderNew = `<?xml version="1.0" encoding="utf-8"?>
<MESSAGE xmlns="http://www.mismo.org/residential/2009/schemas" xmlns:p2="http://www.w3.org/1999/xlink" xmlns:p3="inetapi/MISMO3_4_MCL_Extension.xsd" MessageType="Request">
	<ABOUT_VERSIONS>
		<ABOUT_VERSION>
			<DataVersionIdentifier>201703</DataVersionIdentifier>
		</ABOUT_VERSION>
	</ABOUT_VERSIONS>
	<DEAL_SETS>
		<DEAL_SET>
			<DEALS>
				<DEAL>
					<PARTIES>
						<PARTY p2:label="Party1">
							<INDIVIDUAL>
								<NAME>
									<FirstName>{{FirstName}}</FirstName>
									<LastName>{{LastName}}</LastName>
									<MiddleName>{{MiddleName}}</MiddleName>
                                    <SuffixName>{{SuffixName}}</SuffixName>
								</NAME>
							</INDIVIDUAL>
							<ROLES>
								<ROLE>
									<BORROWER>
										<RESIDENCES>
											<RESIDENCE>
												<ADDRESS>
													<AddressLineText>{{AddressLineText}}</AddressLineText>
													<CityName>{{CityName}}</CityName>
													<CountryCode>{{CountryCode}}</CountryCode>
													<PostalCode>{{PostalCode}}</PostalCode>
													<StateCode>{{StateCode}}</StateCode>
												</ADDRESS>
												<RESIDENCE_DETAIL>
													<BorrowerResidencyType>Current</BorrowerResidencyType>
												</RESIDENCE_DETAIL>
											</RESIDENCE>
										</RESIDENCES>
									</BORROWER>
									<ROLE_DETAIL>
										<PartyRoleType>Borrower</PartyRoleType>
									</ROLE_DETAIL>
								</ROLE>
							</ROLES>
							<TAXPAYER_IDENTIFIERS>
								<TAXPAYER_IDENTIFIER>
									<TaxpayerIdentifierType>SocialSecurityNumber</TaxpayerIdentifierType>
									<TaxpayerIdentifierValue>{{TaxpayerIdentifierValue}}</TaxpayerIdentifierValue>
								</TAXPAYER_IDENTIFIER>
							</TAXPAYER_IDENTIFIERS>
						</PARTY>
					</PARTIES>
					<RELATIONSHIPS>
						<!-- Link borrower to the service -->
						<RELATIONSHIP p2:arcrole="urn:fdc:Meridianlink.com:2017:mortgage/PARTY_IsVerifiedBy_SERVICE" p2:from="Party1" p2:to="Service1"/>
					</RELATIONSHIPS>
					<SERVICES>
						<SERVICE p2:label="Service1">
							<CREDIT>
								<CREDIT_REQUEST>
									<CREDIT_REQUEST_DATAS>
										<CREDIT_REQUEST_DATA>
											<CREDIT_REPOSITORY_INCLUDED>
												<CreditRepositoryIncludedEquifaxIndicator>true</CreditRepositoryIncludedEquifaxIndicator>
												<CreditRepositoryIncludedExperianIndicator>true</CreditRepositoryIncludedExperianIndicator>
												<CreditRepositoryIncludedTransUnionIndicator>true</CreditRepositoryIncludedTransUnionIndicator>
												<EXTENSION>
													<OTHER>
														<p3:RequestEquifaxScore>true</p3:RequestEquifaxScore>
														<p3:RequestExperianFraud>true</p3:RequestExperianFraud>
														<p3:RequestExperianScore>true</p3:RequestExperianScore>
														<p3:RequestTransUnionFraud>true</p3:RequestTransUnionFraud>
														<p3:RequestTransUnionScore>true</p3:RequestTransUnionScore>
													</OTHER>
												</EXTENSION>
											</CREDIT_REPOSITORY_INCLUDED>
											<CREDIT_REQUEST_DATA_DETAIL>
												<CreditReportRequestActionType>Submit</CreditReportRequestActionType>
											</CREDIT_REQUEST_DATA_DETAIL>
										</CREDIT_REQUEST_DATA>
									</CREDIT_REQUEST_DATAS>
								</CREDIT_REQUEST>
							</CREDIT>
							<SERVICE_PRODUCT>
								<SERVICE_PRODUCT_REQUEST>
									<SERVICE_PRODUCT_DETAIL>
										<ServiceProductDescription>CreditOrder</ServiceProductDescription>
										<EXTENSION>
											<OTHER>
												<!-- Recommend requesting only the formats you need, to minimize processing time -->
												<p3:SERVICE_PREFERRED_RESPONSE_FORMATS>
													<p3:SERVICE_PREFERRED_RESPONSE_FORMAT>
														<p3:SERVICE_PREFERRED_RESPONSE_FORMAT_DETAIL>
															<p3:PreferredResponseFormatType>{{response}}</p3:PreferredResponseFormatType>
														</p3:SERVICE_PREFERRED_RESPONSE_FORMAT_DETAIL>
													</p3:SERVICE_PREFERRED_RESPONSE_FORMAT>
												</p3:SERVICE_PREFERRED_RESPONSE_FORMATS>
											</OTHER>
										</EXTENSION>
									</SERVICE_PRODUCT_DETAIL>
								</SERVICE_PRODUCT_REQUEST>
							</SERVICE_PRODUCT>
						</SERVICE>
					</SERVICES>
				</DEAL>
			</DEALS>
		</DEAL_SET>
	</DEAL_SETS>
</MESSAGE>
`;
creditScoreAssets.ConsumerCredit_Individual_RetrieveExisting = `<?xml version="1.0" encoding="utf-8"?>
<MESSAGE MessageType="Request" xmlns="http://www.mismo.org/residential/2009/schemas" xmlns:p2="http://www.w3.org/1999/xlink" xmlns:p3="inetapi/MISMO3_4_MCL_Extension.xsd">
	<ABOUT_VERSIONS>
		<ABOUT_VERSION>
			<DataVersionIdentifier>201703</DataVersionIdentifier>
		</ABOUT_VERSION>
	</ABOUT_VERSIONS>
	<DEAL_SETS>
		<DEAL_SET>
			<DEALS>
				<DEAL>
					<PARTIES>
						<PARTY p2:label="Party1">
							<INDIVIDUAL>
								<NAME>
									<FirstName>{{FirstName}}</FirstName>
									<LastName>{{LastName}}</LastName>
									<MiddleName>{{MiddleName}}</MiddleName>
									<SuffixName>{{SuffixName}}</SuffixName>
								</NAME>
							</INDIVIDUAL>
							<ROLES>
								<ROLE>
									<ROLE_DETAIL>
										<PartyRoleType>Borrower</PartyRoleType>
									</ROLE_DETAIL>
								</ROLE>
							</ROLES>
							<TAXPAYER_IDENTIFIERS>
								<TAXPAYER_IDENTIFIER>
									<TaxpayerIdentifierType>SocialSecurityNumber</TaxpayerIdentifierType>
									<TaxpayerIdentifierValue>{{TaxpayerIdentifierValue}}</TaxpayerIdentifierValue>
								</TAXPAYER_IDENTIFIER>
							</TAXPAYER_IDENTIFIERS>
						</PARTY>
					</PARTIES>
					<RELATIONSHIPS>
						<!-- Link the Party (the borrower) to the Service (credit order) -->
						<RELATIONSHIP p2:arcrole="urn:fdc:Meridianlink.com:2017:mortgage/PARTY_IsVerifiedBy_SERVICE" p2:from="Party1" p2:to="Service1" />
					</RELATIONSHIPS>
					<SERVICES>
						<SERVICE p2:label="Service1">
							<CREDIT>
								<CREDIT_REQUEST>
									<CREDIT_REQUEST_DATAS>
										<CREDIT_REQUEST_DATA>
											<CREDIT_REPOSITORY_INCLUDED>
												<!-- These flags should be left as true to ensure all bureau data present on the file is returned. Can be toggled to filter bureau data -->
												<CreditRepositoryIncludedEquifaxIndicator>true</CreditRepositoryIncludedEquifaxIndicator>
												<CreditRepositoryIncludedExperianIndicator>true</CreditRepositoryIncludedExperianIndicator>
												<CreditRepositoryIncludedTransUnionIndicator>true</CreditRepositoryIncludedTransUnionIndicator>
											</CREDIT_REPOSITORY_INCLUDED>
											<CREDIT_REQUEST_DATA_DETAIL>
												<CreditReportRequestActionType>StatusQuery</CreditReportRequestActionType>
											</CREDIT_REQUEST_DATA_DETAIL>
										</CREDIT_REQUEST_DATA>
									</CREDIT_REQUEST_DATAS>
								</CREDIT_REQUEST>
							</CREDIT>
							<SERVICE_PRODUCT>
								<SERVICE_PRODUCT_REQUEST>
									<SERVICE_PRODUCT_DETAIL>
										<ServiceProductDescription>CreditOrder</ServiceProductDescription>
										<EXTENSION>
											<OTHER>
												<!-- Recommend requesting only the formats you need, to minimize processing time -->
												<p3:SERVICE_PREFERRED_RESPONSE_FORMATS>
													<p3:SERVICE_PREFERRED_RESPONSE_FORMAT>
														<p3:SERVICE_PREFERRED_RESPONSE_FORMAT_DETAIL>
															<p3:PreferredResponseFormatType>{{response}}</p3:PreferredResponseFormatType>
														</p3:SERVICE_PREFERRED_RESPONSE_FORMAT_DETAIL>
													</p3:SERVICE_PREFERRED_RESPONSE_FORMAT>
												</p3:SERVICE_PREFERRED_RESPONSE_FORMATS>
											</OTHER>
										</EXTENSION>
									</SERVICE_PRODUCT_DETAIL>
								</SERVICE_PRODUCT_REQUEST>
							</SERVICE_PRODUCT>        
							<SERVICE_PRODUCT_FULFILLMENT>
								<SERVICE_PRODUCT_FULFILLMENT_DETAIL>                  
									<VendorOrderIdentifier>{{VendorOrderIdentifier}}</VendorOrderIdentifier>
								</SERVICE_PRODUCT_FULFILLMENT_DETAIL>
							</SERVICE_PRODUCT_FULFILLMENT>							
						</SERVICE>
					</SERVICES>
				</DEAL>
			</DEALS>
		</DEAL_SET>
	</DEAL_SETS>
</MESSAGE>`;
//class start
class CreditscoreApi {
    constructor(settings) {
        this.creditScoreAssets = creditScoreAssets;
        this.settings = settings;
        this.settings.waitTime = (this.settings.waitTime) ? this.settings.waitTime : 500;
        this.settings.numberOfRuns = (this.settings.numberOfRuns) ? this.settings.numberOfRuns : 10;
        this.settings.response = (this.settings.response) ? this.settings.response : "Pdf";
    }
    renderOptions(xmlString) {
        var authHeader = "Basic " + Buffer.from(this.settings.username + ":" + this.settings.password).toString('base64');
        var u = new URL(this.settings.url);
        this.options = {
            hostname: u.hostname,
            path: u.pathname,
            method: 'POST',
            headers: {
            'Content-Type': 'application/xml',
            'Content-Length': Buffer.byteLength(xmlString),
            "Authorization": authHeader, 
            "MCL-Interface": this.settings.interfaceIdentifierHeader
            }
        };
    }
    request(file, userData) {
        var result = new Promise((resolve, reject) => {
            var xmlString = this.creditScoreAssets[file];
            //fs.readFileSync(file, { encoding:'utf8', flag:'r' });
            xmlString = xmlString.replace(/{{FirstName}}/g, userData.FirstName);
            xmlString = xmlString.replace(/{{LastName}}/g, userData.LastName);
            xmlString = xmlString.replace(/{{MiddleName}}/g, userData.MiddleName);
            xmlString = xmlString.replace(/{{SuffixName}}/g, userData.SuffixName);
            xmlString = xmlString.replace(/{{AddressLineText}}/g, userData.AddressLineText);
            xmlString = xmlString.replace(/{{CityName}}/g, userData.CityName);
            xmlString = xmlString.replace(/{{CountryCode}}/g, userData.CountryCode);
            xmlString = xmlString.replace(/{{PostalCode}}/g, userData.PostalCode);
            xmlString = xmlString.replace(/{{StateCode}}/g, userData.StateCode);
            xmlString = xmlString.replace(/{{TaxpayerIdentifierValue}}/g, userData.TaxpayerIdentifierValue);
            xmlString = xmlString.replace(/{{response}}/g, this.settings.response);
            //stage 2
            if (this.VendorOrderIdentifier) {
                xmlString = xmlString.replace(/{{VendorOrderIdentifier}}/g, this.VendorOrderIdentifier);
            } 
            this.renderOptions(xmlString);
            var req = http.request(this.options, (res) => {
                //console.log(`STATUS: ${res.statusCode}`);
                //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                var resData = "";
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                   resData += chunk;
                });
                res.on('end', () => {
                    resolve(resData);
                });
            });
            
            req.on('error', (e) => {
                console.error(`problem with request: ${e.message}`);
                reject(e);
            });
            
            // Write data to request body
            req.write(xmlString);
            req.end();
        });
        return result;
    }
    getTagValue(tagName, string, all = false) {
        var frx, rsrx, rerx, values, d;
        frx = new RegExp(`<${tagName}[^>]*>((.|[\n\r])*?)\<\/${tagName}[^>]*>`,"g");
        rsrx = new RegExp(`<${tagName}[^>]*>`,"g");
        rerx = new RegExp(`\<\/${tagName}[^>]*>`,"g");
        values = string.match(frx);
        //console.log("values", values);
        if (!all) {
            if (values) {
                d = values[0];
                d = d.replace(rsrx, "");
                d = d.replace(rerx, "");
            } else {
                d = "";
            }
        } else {
            if (values) {
                for (let i = 0; i < values.length; i++) {
                    values[i] = values.replace(rsrx, "");
                    values[i] = values.replace(rerx, "");
                }
                d = values;
            } else {
                d = [];
            }
        }
        return d;
    }
    delay(ms) {
        new Promise(resolve => setTimeout(resolve, ms));
    }
    async orderNew(userData) { //stage 1
       var data = await this.request("ConsumerCredit_Individual_OrderNew", userData);
       var returns = {};
       let statusCode = this.getTagValue("StatusCode", data);
       //find error
       if (statusCode == "Error") {
            this.status = false;
            this.error = "Something problem, check the last lastResponse";
            let error = this.getTagValue("StatusDescription", data); 
            if (error) {
                this.error = error;
            }
            returns.error = this.error;
       } else {
           this.status = true;
           this.VendorOrderIdentifier = this.getTagValue("VendorOrderIdentifier", data);
           //console.log(this.VendorOrderIdentifier, "VendorOrderIdentifier");
       }
       this.statusCode = statusCode;
       this.lastResponse = data;
       //return data
       returns.status = this.statusCode;
       returns.statusCode = statusCode;
       returns.lastResponse = this.lastResponse;
       returns.vendorOrderIdentifier = this.VendorOrderIdentifier;
       return returns;
    }
    async retrieveExisting(userData, vendorOrderIdentifier) { //stage 2
        this.VendorOrderIdentifier = vendorOrderIdentifier;
        var returns = {};
        var data = await this.request("ConsumerCredit_Individual_RetrieveExisting", userData);
        let statusCode = this.getTagValue("StatusCode", data);
        //find error
        if (statusCode == "Error") {
            this.status = false;
            this.error = "Something problem, check the last lastResponse";
            let error = this.getTagValue("StatusDescription", data); 
            if (error) {
                this.error = error;
            }
            returns.error = this.error;
        } else {
            this.status = true;
        }
        this.statusCode = statusCode;
        this.lastResponse = data;
        //done
        //console.log(this.statusCode);
        if (this.statusCode == "Completed") {
            this.response = this.getTagValue("EmbeddedContentXML", this.lastResponse);
        }
        returns.status = this.status;
        returns.statusCode = this.statusCode;
        returns.lastResponse = this.lastResponse;
        returns.vendorOrderIdentifier = this.VendorOrderIdentifier;
        returns.response = this.response;
        return returns;
    }
    async process(userData) {
        await this.orderNew(userData);
        if (this.status == false) {
            return { status: this.status, statusCode:this.statusCode, error: this.error, lastResponse:this.lastResponse };
        }
        while (this.settings.numberOfRuns > 0) {
            await this.delay(this.settings.waitTime);
            this.settings.numberOfRuns--;
            await this.retrieveExisting(userData, this.VendorOrderIdentifier);
            if (this.status == false) {
                return { status: this.status, statusCode:this.statusCode, error: this.error, lastResponse:this.lastResponse, vendorOrderIdentifier: this.VendorOrderIdentifier };
            } else {
                if (this.statusCode == "Completed") {
                    break;
                } else {
                    continue;
                }
            }
        }
        this.response = this.getTagValue("EmbeddedContentXML", this.lastResponse);
        return { status: this.status, statusCode:this.statusCode, lastResponse:this.lastResponse, vendorOrderIdentifier: this.VendorOrderIdentifier, response: this.response };
    }
    /**
     * not used methods
     */
    async upgradeOrder(userData, vendorOrderIdentifier) {
        this.VendorOrderIdentifier = vendorOrderIdentifier;
        var data = await this.request("./assets/RequestXML/ConsumerCredit_UpgradeOrder.xml", userData);
        let statusCode = this.getTagValue("StatusCode", data);
        console.log(statusCode, data);
    }
    async jointOrderNew(userData) { //need to work for joint credit card
    }
    async RefreshReportOrder(userData) { //need to work for joint credit card
    }
}
module.exports = { CreditscoreApi };