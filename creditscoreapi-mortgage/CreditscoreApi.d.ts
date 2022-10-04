
export declare class CreditscoreApi {
    settings:any;
    VendorOrderIdentifier:any;
    /**
     * Give initialization settings
     * @param {string} settings.url - service url
     * @param {username} settings.username
     * @param {password} settings.password
     * @param {interfaceIdentifierHeader} settings.interfaceIdentifierHeader
     * @param {response} [settings.response=Pdf] - Pdf|Html|Xml
     */
    constructor(settings: {
        url: string,
        username: string,
        password: string,
        interfaceIdentifierHeader: string,
        waitTime?: number,
        numberOfRuns?: number,
        response?: string
    });
    /**
     * It is helper mothod
     */
    renderOptions(xmlString:string):void;
    /**
     * It is helper mothod
     */
    request(file:string, userData:any):any;
    /**
     * It is helper mothod
     */
    getTagValue(tagName:string, string:string, all?:any):any
    /**
     * It is helper mothod
     */
    orderNew(userData:any):any; //stage 1
    /**
     * You have vendorOrderIdentifier value use this method
     */
    retrieveExisting(userData: {
        FirstName:string,
        LastName:string,
        MiddleName:string,
        SuffixName:string, //JR
        AddressLineText:string,
        CityName:string,
        CountryCode:string,
        PostalCode:number,
        StateCode:string, //CA
        TaxpayerIdentifierValue:any //SocialSecurityNumber
    }, vendorOrderIdentifier:any):any; //stage 2
     /**
     * You don't have vendorOrderIdentifier value use this method
     */
    process(userData: {
        FirstName:string,
        LastName:string,
        MiddleName:string,
        SuffixName:string, //JR
        AddressLineText:string,
        CityName:string,
        CountryCode:string,
        PostalCode:number,
        StateCode:string, //CA
        TaxpayerIdentifierValue:any //SocialSecurityNumber
    }):any;
}