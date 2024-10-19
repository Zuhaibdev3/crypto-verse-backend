import { Schema } from "mongoose";
// import { GeoJSONObjectTypes } from "../enums/enums";

export const LocationSchema = {

  type: {
    type: Schema.Types.String,
     enum: {
      values: [
        // GeoJSONObjectTypes.geometryCollection,
        // GeoJSONObjectTypes.lineString,
        // GeoJSONObjectTypes.multiLineString,
        // GeoJSONObjectTypes.multiPoint,
        // GeoJSONObjectTypes.multiPolygon,
        // GeoJSONObjectTypes.point,
        // GeoJSONObjectTypes.polygon
      ]
    }
  },
  coordinates: [
    // { type: Schema.Types.Number, min: -180, max: 180 },
    // { type: Schema.Types.Number, min: -90, max: 90 }],
    { type: Schema.Types.Number },
    { type: Schema.Types.Number }],
  formattedAddress: { type: Schema.Types.String, maxlength: 5000 },
  street: { type: Schema.Types.String, maxlength: 5000 },
  zipcode: { type: Schema.Types.Number, min: 0, max: 99999, },
  city: { type: Schema.Types.String, required: false },
  state: { type: Schema.Types.String, required: false },
  country: { type: Schema.Types.String, required: false },

}


export class LocationDTO {
  // type: GeoJSONObjectTypes | null = GeoJSONObjectTypes.point;
  coordinates: [Number | null, Number | null] = [null, null];
  formattedAddress: String | null = '';
  street: String | null = '';
  zipcode: String | null = '';
  city: string | null = '';
  state: string | null = '';
  country: string | null = '';
}

export interface ILocation {
  // type: GeoJSONObjectTypes | null;
  coordinates: [Number | null, Number | null];
  formattedAddress: String | null;
  street: String | null;
  zipcode: String | null;
  city: string | null,
  state: string | null,
  country: string | null,
}
