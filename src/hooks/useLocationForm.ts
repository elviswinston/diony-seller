import { useEffect, useState } from "react";
import AddressService from "../services/address.services";

interface ProvinceResponse {
  ProvinceID: number;
  ProvinceName: string;
  Status: number;
}

interface DistrictResponse {
  DistrictID: number;
  DistrictName: string;
  Status: number;
}

interface WardResponse {
  WardCode: string;
  WardName: string;
  Status: number;
}

interface LocationForm {
  ProvinceOptions: Option[];
  DistrictOptions: Option[];
  WardOptions: Option[];
  SelectedProvince?: Option;
  SelectedDistrict?: Option;
  SelectedWard?: Option;
}

interface Option {
  value: number;
  label: string;
}

const useLocationForm = () => {
  const [state, setState] = useState<LocationForm>({
    ProvinceOptions: [],
    DistrictOptions: [],
    WardOptions: [],
  });

  useEffect(() => {
    AddressService.getProvice().then((response) => {
      const data: Option[] = response.data.data.map(
        (item: ProvinceResponse) => ({
          value: item.ProvinceID,
          label: item.ProvinceName,
        })
      );
      setState((state) => ({ ...state, ProvinceOptions: data }));
    });
  }, []);

  const onSelectProvince = (value: number) => {
    setState((state) => ({
      ...state,
      SelectedProvince: state.ProvinceOptions.find(
        (option) => option.value === value
      ),
    }));
  };

  const onSelectDistrict = (value: number) => {
    setState((state) => ({
      ...state,
      SelectedDistrict: state.DistrictOptions.find(
        (option) => option.value === value
      ),
    }));
  };

  const onSelectWard = (value: number) => {
    setState((state) => ({
      ...state,
      SelectedWard: state.WardOptions.find((option) => option.value === value),
    }));
  };

  const fetchDistrict = (provinceId: number) => {
    AddressService.getDistrict(provinceId).then((response) => {
      const data: Option[] = response.data.data
        .filter((item: DistrictResponse) => item.Status === 1)
        .map((item: DistrictResponse) => ({
          value: item.DistrictID,
          label: item.DistrictName,
        }));

      setState((state) => ({
        ...state,
        DistrictOptions: data,
        WardOptions: [],
        SelectedDistrict: undefined,
        SelectedWard: undefined,
      }));
    });
  };

  const fetchWard = (districtId: number) => {
    AddressService.getWard(districtId).then((response) => {
      const data: Option[] = response.data.data
        .filter((item: WardResponse) => item.Status === 1)
        .map((item: WardResponse) => ({
          value: item.WardCode,
          label: item.WardName,
        }));

      setState((state) => ({
        ...state,
        WardOptions: data,
        SelectedWard: undefined,
      }));
    });
  };

  const updateAddress = (
    provinceId: number,
    districtId: number,
    wardCode: string
  ) => {
    AddressService.getDistrict(provinceId).then((districtResponse) => {
      const districts: Option[] = districtResponse.data.data
        .filter((item: DistrictResponse) => item.Status === 1)
        .map((item: DistrictResponse) => ({
          value: item.DistrictID,
          label: item.DistrictName,
        }));

      AddressService.getWard(districtId).then((wardResponse) => {
        const wards: Option[] = wardResponse.data.data
          .filter((item: WardResponse) => item.Status === 1)
          .map((item: WardResponse) => ({
            value: item.WardCode,
            label: item.WardName,
          }));
        setState((state) => ({
          ...state,
          DistrictOptions: districts,
          WardOptions: wards,
          SelectedProvince: state.ProvinceOptions.find(
            (province) => province.value === provinceId
          ),
          SelectedDistrict: districts.find(
            (district) => district.value === districtId
          ),
          SelectedWard: wards.find(
            (ward) => ward.value.toString() === wardCode
          ),
        }));
      });
    });
  };

  return {
    state,
    fetchDistrict,
    fetchWard,
    onSelectProvince,
    onSelectDistrict,
    onSelectWard,
    updateAddress,
  };
};

export default useLocationForm;
