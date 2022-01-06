export interface Address {
  customerName: string;
  phoneNumber: string;
  provinceId: number;
  districtId: number;
  wardCode: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  isDefault: boolean;
  detail: string;
}

export interface AddressUpdateRequest {
  id: number;
  customerName: string;
  detail: string;
  provinceId: number;
  districtId: number;
  wardCode: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  phoneNumber: string;
  isDefault: boolean;
  isPickup: boolean;
  isReturn: boolean;
}

export interface AddressAddRequest {
  customerName: string;
  detail: string;
  provinceId: number;
  districtId: number;
  wardCode: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  phoneNumber: string;
  isDefault: boolean;
  isPickup: boolean;
  isReturn: boolean;
}

export interface AddressResponse {
  id: number;
  customerName: string;
  detail: string;
  provinceId: number;
  districtId: number;
  wardCode: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  phoneNumber: string;
  isDefault: boolean;
  isPickup: boolean;
  isReturn: boolean;
}
