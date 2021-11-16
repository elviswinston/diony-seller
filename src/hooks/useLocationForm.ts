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
        SelectedWard: undefined
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

  return { state, fetchDistrict, fetchWard, onSelectDistrict, onSelectWard };
};

export default useLocationForm;
