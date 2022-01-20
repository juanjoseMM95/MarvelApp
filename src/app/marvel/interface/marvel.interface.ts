// // To parse this data:
// //
// //   import { Convert, SearchMarvelResponse } from "./file";
// //
// //   const searchMarvelResponse = Convert.toSearchMarvelResponse(json);
// //
// // These functions will throw an error if the JSON doesn't
// // match the expected interface, even if the JSON is valid.

// export interface SearchMarvelResponse {
//     code:            number;
//     status:          string;
//     copyright:       string;
//     attributionText: string;
//     attributionHTML: string;
//     etag:            string;
//     data:            Data;
// }

// export interface Data {
//     offset:  number;
//     limit:   number;
//     total:   number;
//     count:   number;
//     results: Result[];
// }

// export interface Result {
//     id:                 number;
//     digitalId:          number;
//     title:              string;
//     issueNumber:        number;
//     variantDescription: string;
//     description:        null | string;
//     modified:           string;
//     isbn:               string;
//     upc:                string;
//     diamondCode:        DiamondCode;
//     ean:                string;
//     issn:               string;
//     format:             Format;
//     pageCount:          number;
//     textObjects:        TextObject[];
//     resourceURI:        string;
//     urls:               URL[];
//     series:             Series;
//     variants:           Series[];
//     collections:        any[];
//     collectedIssues:    Series[];
//     dates:              DateElement[];
//     prices:             Price[];
//     thumbnail:          Thumbnail;
//     images:             Thumbnail[];
//     creators:           Creators;
//     characters:         Characters;
//     stories:            Stories;
//     events:             Characters;
// }

// export interface Characters {
//     available:     number;
//     collectionURI: string;
//     items:         Series[];
//     returned:      number;
// }

// export interface Series {
//     resourceURI: string;
//     name:        string;
// }

// export interface Creators {
//     available:     number;
//     collectionURI: string;
//     items:         CreatorsItem[];
//     returned:      number;
// }

// export interface CreatorsItem {
//     resourceURI: string;
//     name:        string;
//     role:        Role;
// }

// export enum Role {
//     Colorist = "colorist",
//     Editor = "editor",
//     Inker = "inker",
//     Letterer = "letterer",
//     Penciler = "penciler",
//     Penciller = "penciller",
//     PencillerCover = "penciller (cover)",
//     Writer = "writer",
// }

// export interface DateElement {
//     type: DateType;
//     date: string;
// }

// export enum DateType {
//     FocDate = "focDate",
//     OnsaleDate = "onsaleDate",
// }

// export enum DiamondCode {
//     Empty = "",
//     Jul190068 = "JUL190068",
// }

// export enum Format {
//     Comic = "Comic",
//     Digest = "Digest",
//     Empty = "",
//     TradePaperback = "Trade Paperback",
// }

// export interface Thumbnail {
//     path:      string;
//     extension: Extension;
// }

// export enum Extension {
//     Jpg = "jpg",
// }

// export interface Price {
//     type:  PriceType;
//     price: number;
// }

// export enum PriceType {
//     PrintPrice = "printPrice",
// }

// export interface Stories {
//     available:     number;
//     collectionURI: string;
//     items:         StoriesItem[];
//     returned:      number;
// }

// export interface StoriesItem {
//     resourceURI: string;
//     name:        string;
//     type:        ItemType;
// }

// export enum ItemType {
//     Cover = "cover",
//     InteriorStory = "interiorStory",
//     Promo = "promo",
// }

// export interface TextObject {
//     type:     TextObjectType;
//     language: Language;
//     text:     string;
// }

// export enum Language {
//     EnUs = "en-us",
// }

// export enum TextObjectType {
//     IssueSolicitText = "issue_solicit_text",
// }

// export interface URL {
//     type: URLType;
//     url:  string;
// }

// export enum URLType {
//     Detail = "detail",
//     Purchase = "purchase",
// }

// // Converts JSON strings to/from your types
// // and asserts the results of JSON.parse at runtime
// export class Convert {
//     public static toSearchMarvelResponse(json: string): SearchMarvelResponse {
//         return cast(JSON.parse(json), r("SearchMarvelResponse"));
//     }

//     public static searchMarvelResponseToJson(value: SearchMarvelResponse): string {
//         return JSON.stringify(uncast(value, r("SearchMarvelResponse")), null, 2);
//     }
// }

// function invalidValue(typ: any, val: any, key: any = ''): never {
//     if (key) {
//         throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
//     }
//     throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
// }

// function jsonToJSProps(typ: any): any {
//     if (typ.jsonToJS === undefined) {
//         const map: any = {};
//         typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
//         typ.jsonToJS = map;
//     }
//     return typ.jsonToJS;
// }

// function jsToJSONProps(typ: any): any {
//     if (typ.jsToJSON === undefined) {
//         const map: any = {};
//         typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
//         typ.jsToJSON = map;
//     }
//     return typ.jsToJSON;
// }

// function transform(val: any, typ: any, getProps: any, key: any = ''): any {
//     function transformPrimitive(typ: string, val: any): any {
//         if (typeof typ === typeof val) return val;
//         return invalidValue(typ, val, key);
//     }

//     function transformUnion(typs: any[], val: any): any {
//         // val must validate against one typ in typs
//         const l = typs.length;
//         for (let i = 0; i < l; i++) {
//             const typ = typs[i];
//             try {
//                 return transform(val, typ, getProps);
//             } catch (_) {}
//         }
//         return invalidValue(typs, val);
//     }

//     function transformEnum(cases: string[], val: any): any {
//         if (cases.indexOf(val) !== -1) return val;
//         return invalidValue(cases, val);
//     }

//     function transformArray(typ: any, val: any): any {
//         // val must be an array with no invalid elements
//         if (!Array.isArray(val)) return invalidValue("array", val);
//         return val.map(el => transform(el, typ, getProps));
//     }

//     function transformDate(val: any): any {
//         if (val === null) {
//             return null;
//         }
//         const d = new Date(val);
//         if (isNaN(d.valueOf())) {
//             return invalidValue("Date", val);
//         }
//         return d;
//     }

//     function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
//         if (val === null || typeof val !== "object" || Array.isArray(val)) {
//             return invalidValue("object", val);
//         }
//         const result: any = {};
//         Object.getOwnPropertyNames(props).forEach(key => {
//             const prop = props[key];
//             const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
//             result[prop.key] = transform(v, prop.typ, getProps, prop.key);
//         });
//         Object.getOwnPropertyNames(val).forEach(key => {
//             if (!Object.prototype.hasOwnProperty.call(props, key)) {
//                 result[key] = transform(val[key], additional, getProps, key);
//             }
//         });
//         return result;
//     }

//     if (typ === "any") return val;
//     if (typ === null) {
//         if (val === null) return val;
//         return invalidValue(typ, val);
//     }
//     if (typ === false) return invalidValue(typ, val);
//     while (typeof typ === "object" && typ.ref !== undefined) {
//         typ = typeMap[typ.ref];
//     }
//     if (Array.isArray(typ)) return transformEnum(typ, val);
//     if (typeof typ === "object") {
//         return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
//             : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
//             : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
//             : invalidValue(typ, val);
//     }
//     // Numbers can be parsed by Date but shouldn't be.
//     if (typ === Date && typeof val !== "number") return transformDate(val);
//     return transformPrimitive(typ, val);
// }

// function cast<T>(val: any, typ: any): T {
//     return transform(val, typ, jsonToJSProps);
// }

// function uncast<T>(val: T, typ: any): any {
//     return transform(val, typ, jsToJSONProps);
// }

// function a(typ: any) {
//     return { arrayItems: typ };
// }

// function u(...typs: any[]) {
//     return { unionMembers: typs };
// }

// function o(props: any[], additional: any) {
//     return { props, additional };
// }

// function m(additional: any) {
//     return { props: [], additional };
// }

// function r(name: string) {
//     return { ref: name };
// }

// const typeMap: any = {
//     "SearchMarvelResponse": o([
//         { json: "code", js: "code", typ: 0 },
//         { json: "status", js: "status", typ: "" },
//         { json: "copyright", js: "copyright", typ: "" },
//         { json: "attributionText", js: "attributionText", typ: "" },
//         { json: "attributionHTML", js: "attributionHTML", typ: "" },
//         { json: "etag", js: "etag", typ: "" },
//         { json: "data", js: "data", typ: r("Data") },
//     ], false),
//     "Data": o([
//         { json: "offset", js: "offset", typ: 0 },
//         { json: "limit", js: "limit", typ: 0 },
//         { json: "total", js: "total", typ: 0 },
//         { json: "count", js: "count", typ: 0 },
//         { json: "results", js: "results", typ: a(r("Result")) },
//     ], false),
//     "Result": o([
//         { json: "id", js: "id", typ: 0 },
//         { json: "digitalId", js: "digitalId", typ: 0 },
//         { json: "title", js: "title", typ: "" },
//         { json: "issueNumber", js: "issueNumber", typ: 0 },
//         { json: "variantDescription", js: "variantDescription", typ: "" },
//         { json: "description", js: "description", typ: u(null, "") },
//         { json: "modified", js: "modified", typ: "" },
//         { json: "isbn", js: "isbn", typ: "" },
//         { json: "upc", js: "upc", typ: "" },
//         { json: "diamondCode", js: "diamondCode", typ: r("DiamondCode") },
//         { json: "ean", js: "ean", typ: "" },
//         { json: "issn", js: "issn", typ: "" },
//         { json: "format", js: "format", typ: r("Format") },
//         { json: "pageCount", js: "pageCount", typ: 0 },
//         { json: "textObjects", js: "textObjects", typ: a(r("TextObject")) },
//         { json: "resourceURI", js: "resourceURI", typ: "" },
//         { json: "urls", js: "urls", typ: a(r("URL")) },
//         { json: "series", js: "series", typ: r("Series") },
//         { json: "variants", js: "variants", typ: a(r("Series")) },
//         { json: "collections", js: "collections", typ: a("any") },
//         { json: "collectedIssues", js: "collectedIssues", typ: a(r("Series")) },
//         { json: "dates", js: "dates", typ: a(r("DateElement")) },
//         { json: "prices", js: "prices", typ: a(r("Price")) },
//         { json: "thumbnail", js: "thumbnail", typ: r("Thumbnail") },
//         { json: "images", js: "images", typ: a(r("Thumbnail")) },
//         { json: "creators", js: "creators", typ: r("Creators") },
//         { json: "characters", js: "characters", typ: r("Characters") },
//         { json: "stories", js: "stories", typ: r("Stories") },
//         { json: "events", js: "events", typ: r("Characters") },
//     ], false),
//     "Characters": o([
//         { json: "available", js: "available", typ: 0 },
//         { json: "collectionURI", js: "collectionURI", typ: "" },
//         { json: "items", js: "items", typ: a(r("Series")) },
//         { json: "returned", js: "returned", typ: 0 },
//     ], false),
//     "Series": o([
//         { json: "resourceURI", js: "resourceURI", typ: "" },
//         { json: "name", js: "name", typ: "" },
//     ], false),
//     "Creators": o([
//         { json: "available", js: "available", typ: 0 },
//         { json: "collectionURI", js: "collectionURI", typ: "" },
//         { json: "items", js: "items", typ: a(r("CreatorsItem")) },
//         { json: "returned", js: "returned", typ: 0 },
//     ], false),
//     "CreatorsItem": o([
//         { json: "resourceURI", js: "resourceURI", typ: "" },
//         { json: "name", js: "name", typ: "" },
//         { json: "role", js: "role", typ: r("Role") },
//     ], false),
//     "DateElement": o([
//         { json: "type", js: "type", typ: r("DateType") },
//         { json: "date", js: "date", typ: "" },
//     ], false),
//     "Thumbnail": o([
//         { json: "path", js: "path", typ: "" },
//         { json: "extension", js: "extension", typ: r("Extension") },
//     ], false),
//     "Price": o([
//         { json: "type", js: "type", typ: r("PriceType") },
//         { json: "price", js: "price", typ: 3.14 },
//     ], false),
//     "Stories": o([
//         { json: "available", js: "available", typ: 0 },
//         { json: "collectionURI", js: "collectionURI", typ: "" },
//         { json: "items", js: "items", typ: a(r("StoriesItem")) },
//         { json: "returned", js: "returned", typ: 0 },
//     ], false),
//     "StoriesItem": o([
//         { json: "resourceURI", js: "resourceURI", typ: "" },
//         { json: "name", js: "name", typ: "" },
//         { json: "type", js: "type", typ: r("ItemType") },
//     ], false),
//     "TextObject": o([
//         { json: "type", js: "type", typ: r("TextObjectType") },
//         { json: "language", js: "language", typ: r("Language") },
//         { json: "text", js: "text", typ: "" },
//     ], false),
//     "URL": o([
//         { json: "type", js: "type", typ: r("URLType") },
//         { json: "url", js: "url", typ: "" },
//     ], false),
//     "Role": [
//         "colorist",
//         "editor",
//         "inker",
//         "letterer",
//         "penciler",
//         "penciller",
//         "penciller (cover)",
//         "writer",
//     ],
//     "DateType": [
//         "focDate",
//         "onsaleDate",
//     ],
//     "DiamondCode": [
//         "",
//         "JUL190068",
//     ],
//     "Format": [
//         "Comic",
//         "Digest",
//         "",
//         "Trade Paperback",
//     ],
//     "Extension": [
//         "jpg",
//     ],
//     "PriceType": [
//         "printPrice",
//     ],
//     "ItemType": [
//         "cover",
//         "interiorStory",
//         "promo",
//     ],
//     "Language": [
//         "en-us",
//     ],
//     "TextObjectType": [
//         "issue_solicit_text",
//     ],
//     "URLType": [
//         "detail",
//         "purchase",
//     ],
// };

//------------------------------------------------------------------

// To parse this data:
//
//   import { Convert, SearchMarvelResponse } from "./file";
//
//   const searchMarvelResponse = Convert.toSearchMarvelResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface SearchMarvelResponse {
    code:            number;
    status:          string;
    copyright:       string;
    attributionText: string;
    attributionHTML: string;
    etag:            string;
    data:            Data;
}

export interface Data {
    offset:  number;
    limit:   number;
    total:   number;
    count:   number;
    results: Result[];
}

export interface Result {
    id:          number;
    name:        string;
    description: string;
    modified:    string;
    thumbnail:   Thumbnail;
    resourceURI: string;
    comics:      Comics;
    series:      Comics;
    stories:     Stories;
    events:      Comics;
    urls:        URL[];
}

export interface Comics {
    available:     number;
    collectionURI: string;
    items:         ComicsItem[];
    returned:      number;
}

export interface ComicsItem {
    resourceURI: string;
    name:        string;
}

export interface Stories {
    available:     number;
    collectionURI: string;
    items:         StoriesItem[];
    returned:      number;
}

export interface StoriesItem {
    resourceURI: string;
    name:        string;
    type:        ItemType;
}

export enum ItemType {
    Cover = "cover",
    Empty = "",
    InteriorStory = "interiorStory",
}

export interface Thumbnail {
    path:      string;
    extension: Extension;
}

export enum Extension {
    GIF = "gif",
    Jpg = "jpg",
}

export interface URL {
    type: URLType;
    url:  string;
}

export enum URLType {
    Comiclink = "comiclink",
    Detail = "detail",
    Wiki = "wiki",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toSearchMarvelResponse(json: string): SearchMarvelResponse {
        return cast(JSON.parse(json), r("SearchMarvelResponse"));
    }

    public static searchMarvelResponseToJson(value: SearchMarvelResponse): string {
        return JSON.stringify(uncast(value, r("SearchMarvelResponse")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "SearchMarvelResponse": o([
        { json: "code", js: "code", typ: 0 },
        { json: "status", js: "status", typ: "" },
        { json: "copyright", js: "copyright", typ: "" },
        { json: "attributionText", js: "attributionText", typ: "" },
        { json: "attributionHTML", js: "attributionHTML", typ: "" },
        { json: "etag", js: "etag", typ: "" },
        { json: "data", js: "data", typ: r("Data") },
    ], false),
    "Data": o([
        { json: "offset", js: "offset", typ: 0 },
        { json: "limit", js: "limit", typ: 0 },
        { json: "total", js: "total", typ: 0 },
        { json: "count", js: "count", typ: 0 },
        { json: "results", js: "results", typ: a(r("Result")) },
    ], false),
    "Result": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "modified", js: "modified", typ: "" },
        { json: "thumbnail", js: "thumbnail", typ: r("Thumbnail") },
        { json: "resourceURI", js: "resourceURI", typ: "" },
        { json: "comics", js: "comics", typ: r("Comics") },
        { json: "series", js: "series", typ: r("Comics") },
        { json: "stories", js: "stories", typ: r("Stories") },
        { json: "events", js: "events", typ: r("Comics") },
        { json: "urls", js: "urls", typ: a(r("URL")) },
    ], false),
    "Comics": o([
        { json: "available", js: "available", typ: 0 },
        { json: "collectionURI", js: "collectionURI", typ: "" },
        { json: "items", js: "items", typ: a(r("ComicsItem")) },
        { json: "returned", js: "returned", typ: 0 },
    ], false),
    "ComicsItem": o([
        { json: "resourceURI", js: "resourceURI", typ: "" },
        { json: "name", js: "name", typ: "" },
    ], false),
    "Stories": o([
        { json: "available", js: "available", typ: 0 },
        { json: "collectionURI", js: "collectionURI", typ: "" },
        { json: "items", js: "items", typ: a(r("StoriesItem")) },
        { json: "returned", js: "returned", typ: 0 },
    ], false),
    "StoriesItem": o([
        { json: "resourceURI", js: "resourceURI", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "type", js: "type", typ: r("ItemType") },
    ], false),
    "Thumbnail": o([
        { json: "path", js: "path", typ: "" },
        { json: "extension", js: "extension", typ: r("Extension") },
    ], false),
    "URL": o([
        { json: "type", js: "type", typ: r("URLType") },
        { json: "url", js: "url", typ: "" },
    ], false),
    "ItemType": [
        "cover",
        "",
        "interiorStory",
    ],
    "Extension": [
        "gif",
        "jpg",
    ],
    "URLType": [
        "comiclink",
        "detail",
        "wiki",
    ],
};
